import { giveaways } from './giveaways';
export const BASKET_KEY = 'extraordinary-basket-v1';
export type BasketItem = {slug:string;quantity:number};
export function parseBasket(raw:string|null): BasketItem[] {
 try {
  const data:unknown=JSON.parse(raw??'[]');
  if(!Array.isArray(data)) return [];
  const quantities=new Map<string,number>();
  for(const item of data) {
   if(!item || typeof item!=='object' || !('slug' in item) || !('quantity' in item)) continue;
   const prize=giveaways.find(g=>g.slug===item.slug);
   if(!prize || typeof item.quantity!=='number' || !Number.isSafeInteger(item.quantity) || item.quantity<1) continue;
   quantities.set(prize.slug,Math.min(prize.max,(quantities.get(prize.slug)??0)+item.quantity));
  }
  return Array.from(quantities,([slug,quantity])=>({slug,quantity}));
 } catch {return [];}
}