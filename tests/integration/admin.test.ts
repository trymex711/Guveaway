import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { hashPassword } from 'better-auth/crypto';
import { db } from '../../lib/db';
import { getAuth, createAuth } from '../../lib/auth';

const base = process.env.BETTER_AUTH_URL ?? '';
test('admin access, bootstrap, listing lifecycle, audit, role checks and logout', async () => {
  assert.equal(process.env.ADMIN_TEST_DATABASE, 'true', 'Use an explicitly designated test database.');
  assert.equal(new URL(base).hostname, '127.0.0.1', 'Integration tests must target the local development server.');
  const token = readFileSync('.admin-setup-dev.txt', 'utf8').trim().split('#')[1];
  const password = randomBytes(24).toString('hex');
  const email = process.env.ADMIN_EMAIL!;
  async function send(path: string, body: unknown, options: { cookie?: string; method?: string; origin?: string } = {}) {
    return fetch(base + path, { method: options.method ?? 'POST', headers: { 'Content-Type': 'application/json', origin: options.origin ?? base, ...(options.cookie ? { cookie: options.cookie } : {}) }, body: JSON.stringify(body), redirect: 'manual' });
  }
  const anonymous = await fetch(base + '/admin', { redirect: 'manual' });
  assert.equal(anonymous.status, 307);
  assert.equal(anonymous.headers.get('location'), '/admin/login');
  assert.equal((await send('/api/admin/listings', {})).status, 401);
  assert.equal((await send('/api/auth/sign-up/email', {email,password,name:'Uninvited'})).status, 404);
  assert.equal((await send('/api/auth/admin/create-user', {email,password,name:'Uninvited',role:'admin'})).status, 404);
  assert.equal((await send('/api/admin/setup', {token:'x'.repeat(64),name:'Development Owner',password})).status, 403);
  // Re-running tests uses a fresh credential on the isolated development branch.
  const existing = await db.adminIdentity.findUnique({where:{email}});
  if (!existing) {
    const setup = await send('/api/admin/setup', {token,name:'Development Owner',password});
    assert.equal(setup.status, 200, await setup.text());
  } else {
    await db.adminAccount.updateMany({where:{userId:existing.id,providerId:'credential'},data:{password:await hashPassword(password)}});
  }
  assert.equal((await send('/api/admin/setup', {token,name:'Another Owner',password})).status, 409);
  const login = await send('/api/auth/sign-in/email', {email,password});
  assert.equal(login.status, 200, await login.clone().text());
  const cookie = login.headers.getSetCookie().map(value=>value.split(';')[0]).join('; ');
  assert.ok(cookie.includes('session_token'));
  assert.equal((await fetch(base+'/admin',{headers:{cookie}})).status, 200);
  assert.equal((await send('/api/admin/listings',{}, {cookie,origin:'https://untrusted.example'})).status,403);
  assert.equal((await send('/api/admin/listings',{max:0}, {cookie})).status,400);
  const suffix=randomBytes(4).toString('hex');
  const draft={slug:'integration-prize-'+suffix,title:'Integration Residence '+suffix,category:'Houses',description:'An isolated integration test listing, never published in production.',caption:'A development preview.',price:1000,value:100000000,capacity:50000,max:20,imageUrl:'/images/residence.jpg',imageAlt:'A contemporary residence for integration testing',status:'DRAFT'};
  const create=await send('/api/admin/listings',draft,{cookie});
  assert.equal(create.status,200,await create.clone().text());
  const saved=await create.json();
  const homeBefore=await (await fetch(base)).text();
  assert.equal(homeBefore.includes(draft.title),false);
  assert.equal((await fetch(base+'/giveaways/'+draft.slug)).status,404);
  const published=await send('/api/admin/listings',{...draft,id:saved.id,revision:saved.revision,status:'PUBLISHED'},{cookie,method:'PATCH'});
  assert.equal(published.status,200,await published.clone().text());
  const revision=(await published.json()).revision;
  assert.equal((await (await fetch(base)).text()).includes(draft.title),true);
  assert.equal((await fetch(base+'/giveaways/'+draft.slug)).status,200);
  const conflict=await send('/api/admin/listings',{...draft,id:saved.id,revision:saved.revision},{cookie,method:'PATCH'});
  assert.equal(conflict.status,409);
  assert.equal((await send('/api/admin/listings',{...draft,id:saved.id,revision,status:'ARCHIVED'},{cookie,method:'PATCH'})).status,200);
  assert.equal((await fetch(base+'/giveaways/'+draft.slug)).status,404);
  assert.equal((await (await fetch(base)).text()).includes(draft.title),false);
  assert.equal(await db.auditLog.count({where:{entityId:saved.id}}),3);
  const rolledBackEmail='rollback-'+suffix+'@example.test';
  await assert.rejects(db.$transaction(async tx=>{
    await createAuth(tx).api.createUser({body:{email:rolledBackEmail,password,name:'Rollback Check',role:'user'}});
    throw new Error('EXPECTED_ROLLBACK');
  }),/EXPECTED_ROLLBACK/);
  assert.equal(await db.adminIdentity.count({where:{email:rolledBackEmail}}),0);
  const memberEmail='test-'+suffix+'@example.test';
  await getAuth().api.createUser({body:{email:memberEmail,password,name:'Development Non-Admin',role:'user'}});
  const memberLogin=await send('/api/auth/sign-in/email',{email:memberEmail,password});
  assert.equal(memberLogin.status,200,await memberLogin.clone().text());
  const memberCookie=memberLogin.headers.getSetCookie().map(value=>value.split(';')[0]).join('; ');
  assert.equal((await send('/api/admin/listings',draft,{cookie:memberCookie})).status,401);
  const memberPage=await fetch(base+'/admin',{headers:{cookie:memberCookie},redirect:'manual'});
  assert.equal(memberPage.status,307);
  const logout=await send('/api/auth/sign-out',{}, {cookie});
  assert.equal(logout.status,200);
  assert.equal((await send('/api/admin/listings',draft,{cookie})).status,401);
  assert.ok(await db.adminAuthRateLimit.count() > 0, 'Rate limits must be persisted in the database.');
  const attempts = [];
  for(let i=0;i<6;i++) attempts.push((await send('/api/auth/sign-in/email',{email:'no-account@example.test',password})).status);
  assert.ok(attempts.includes(429), 'Repeated sign-in attempts must be rate limited.');
  await db.$disconnect();
});