import { PrismaClient } from '@prisma/client';
import { giveaways } from '../lib/giveaways';
const db = new PrismaClient();
async function main(){
  for(const item of giveaways){
    await db.adminListing.upsert({where:{slug:item.slug},update:{},create:{
      slug:item.slug,title:item.title,category:item.category,description:item.description,caption:item.caption,price:item.price,value:item.value,capacity:item.capacity,max:item.max,status:'PUBLISHED',
      imageUrl:item.category==='Houses'?'/images/residence.jpg':'/images/grand-tourer.jpg',imageAlt:item.category==='Houses'?'Contemporary residence with landscaped gardens':'Dark performance grand tourer on an open road',
    }});
  }
  console.log('Demo listings seeded without overwriting existing edits.');
}
main().finally(()=>db.$disconnect());