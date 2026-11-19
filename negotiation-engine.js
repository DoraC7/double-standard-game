(function(root){
function assess(c,offer){
 if(!Array.isArray(offer)||offer.length!==c.axes.length||offer.some((v,i)=>!Number.isInteger(v)||!c.axes[i].options[v]))throw new Error('請完成所有條件');
 const options=offer.map((v,i)=>c.axes[i].options[v]);
 const cost=options.reduce((n,o)=>n+o.cost,0), within=cost<=c.budget, fit=options.every(o=>o.fit);
 return {cost,within,fit,viable:within&&fit,terms:options.map(o=>o.label)};
}
function hasZone(c){return c.axes[0].options.some((_,a)=>c.axes[1].options.some((_,b)=>assess(c,[a,b]).viable));}
root.NegotiationEngine={assess,hasZone};
if(typeof module!=='undefined') module.exports=root.NegotiationEngine;
})(typeof window!=='undefined'?window:globalThis);
