export const ID = "portrait-login";
export const MODULE_URL = new URL('../', import.meta.url);
export const SERVER_URL = new URL('../../', MODULE_URL);
export const CHARACTER_ITEMS = ['name','tag','hero','description','detail'];
export const GLOBAL_ITEMS = ['eyebrow','login','roster'];
export const DEFAULT_UI_STYLE = 'classic';
export const UI_STYLES = [{id:DEFAULT_UI_STYLE,label:'经典（默认）'},{id:'frontline',label:'前线档案'}];
export const DEFAULT_LAYOUT = {
  name:{x:5,y:28,scale:1},tag:{x:5,y:40,scale:1},hero:{x:38,y:12,scale:1},
  description:{x:5,y:47,scale:1},detail:{x:5,y:63,scale:1},
  eyebrow:{x:5,y:21,scale:1},login:{x:74,y:30,scale:1},roster:{x:5,y:70,scale:1}
};
export const STYLE_LAYOUTS = {
  classic:DEFAULT_LAYOUT,
  frontline:{
    name:{x:13.4,y:28.8,scale:1},tag:{x:13.4,y:42.8,scale:1},hero:{x:37.5,y:6,scale:1},
    description:{x:13.4,y:50,scale:1},detail:{x:13.4,y:56.5,scale:1},
    eyebrow:{x:13.4,y:26.6,scale:1},login:{x:74.6,y:42.5,scale:1},roster:{x:1.35,y:14.3,scale:1}
  }
};
function normalizeLayout(source,keys,preset=DEFAULT_LAYOUT){
  const number=(value,fallback,min,max)=>typeof value==='number'&&Number.isFinite(value)?Math.min(max,Math.max(min,value)):fallback;
  return Object.fromEntries(keys.map(key=>{
    const v=source?.[key],d=preset[key],layout={x:number(v?.x,d.x,-100,100),y:number(v?.y,d.y,-100,100),scale:number(v?.scale,d.scale,.25,3)};
    for(const dimension of ['width','height'])if(typeof v?.[dimension]==='number'&&Number.isFinite(v[dimension])&&v[dimension]>0)layout[dimension]=number(v[dimension],null,1,10000);
    return [key,layout];
  }));
}
function normalizeStyleLayouts(source,keys){
  const layouts={};
  for(const {id} of UI_STYLES){
    if(id===DEFAULT_UI_STYLE)continue;
    const saved=source?.styleLayouts?.[id];
    const present=keys.filter(key=>saved?.[key]&&typeof saved[key]==='object'&&!Array.isArray(saved[key]));
    if(present.length)layouts[id]=normalizeLayout(saved,present,STYLE_LAYOUTS[id]);
  }
  return Object.keys(layouts).length?{styleLayouts:layouts}:{};
}
export function getSceneLayout(config,character,key,{editable=false}={}){
  const style=character?.uiStyle??DEFAULT_UI_STYLE,owner=CHARACTER_ITEMS.includes(key)?character:config;
  const fallback=(STYLE_LAYOUTS[style]??DEFAULT_LAYOUT)[key];
  if(!owner)return fallback;
  if(style===DEFAULT_UI_STYLE||!STYLE_LAYOUTS[style])return owner.layout?.[key]??fallback;
  // Each style keeps its own positions; simply switching styles does not write layout data.
  if(editable){
    owner.styleLayouts??={};owner.styleLayouts[style]??={};owner.styleLayouts[style][key]??={...fallback};
  }
  return owner.styleLayouts?.[style]?.[key]??fallback;
}
export function setSceneLayout(config,character,key,layout){
  const target=getSceneLayout(config,character,key,{editable:true});
  delete target.width;delete target.height;Object.assign(target,layout);
}
export const text = (v, max=1000) => String(v??'').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').slice(0,max);
export const escape = v => text(v,10000).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function assetURL(value) {
  const s=text(value).trim();if(!s)return '';
  if(/^(?:[a-z]:[\\/]|javascript:|data:|vbscript:|file:|blob:)/i.test(s))return '';
  try {
    const url=s.startsWith('@/') ? new URL(s.slice(2),MODULE_URL) : new URL(s.replace(/^\//,''),SERVER_URL);
    if(!['http:','https:'].includes(url.protocol))return '';
    return url.href;
  } catch{return '';}
}
export const defaults = {
  title:'冒险者之门',subtitle:'每一次相逢，都是传奇的序章。',eyebrow:'THE NEXT CHAPTER',background:'',accent:'#c8aa71',cardHeight:158,layout:normalizeLayout(null,GLOBAL_ITEMS),
  characters:[
    {id:'ranger',name:'瑟琳 · 风语',tag:'月林游侠',description:'循着星光与林间的低语，踏上尚无人抵达的旅途。',detail:'长弓 · 自然 · 守望',color:'#90ad92'},
    {id:'knight',name:'亚瑟 · 灰烬',tag:'誓约骑士',description:'旧日的荣光已化作灰烬，而守护的誓言从未熄灭。',detail:'长剑 · 坚守 · 荣誉',color:'#c88477'},
    {id:'mage',name:'伊芙 · 星潮',tag:'秘法学者',description:'群星在指尖流转，未解的奥秘正等待一个答案。',detail:'秘法 · 星辰 · 求知',color:'#87a7d9'},
    {id:'rogue',name:'诺克斯',tag:'暮影行者',description:'在灯火照不到的地方，总有另一条通往明日的路。',detail:'双刃 · 潜行 · 自由',color:'#c6aa69'},
    {id:'bard',name:'莉拉 · 绯歌',tag:'远游诗人',description:'将每一段冒险写成歌，让故事比旅途走得更远。',detail:'琴弦 · 灵感 · 奇遇',color:'#ba89ac'}
  ].map((c,i)=>({...c,userId:'',portrait:'@/assets/party.png',hero:'',background:'',uiStyle:DEFAULT_UI_STYLE,strip:i,position:50,enabled:true,layout:normalizeLayout(null,CHARACTER_ITEMS)}))
};
export function normalize(source={}) {
  const hex=(v,fallback)=>/^#[\da-f]{6}$/i.test(v)?v:fallback;
  const c={title:text(source.title??defaults.title,80),subtitle:text(source.subtitle??defaults.subtitle,250),eyebrow:text(source.eyebrow??defaults.eyebrow,80),background:text(source.background,1000),accent:hex(source.accent,defaults.accent),cardHeight:Math.min(260,Math.max(100,Number(source.cardHeight)||158)),layout:normalizeLayout(source.layout,GLOBAL_ITEMS),...normalizeStyleLayouts(source,GLOBAL_ITEMS),characters:[]};
  const rows=Array.isArray(source.characters)?source.characters:defaults.characters;
  c.characters=rows.slice(0,60).map((x,i)=>({id:text(x.id||`character-${i+1}`,80),name:text(x.name||'未命名角色',80),tag:text(x.tag,80),description:text(x.description,1500),detail:text(x.detail,160),userId:text(x.userId,80),portrait:text(x.portrait,1000),hero:text(x.hero,1000),background:text(x.background,1000),uiStyle:UI_STYLES.some(style=>style.id===x.uiStyle)?x.uiStyle:DEFAULT_UI_STYLE,color:hex(x.color,c.accent),strip:Number.isInteger(x.strip)&&x.strip>=0&&x.strip<=4?x.strip:null,position:Math.min(100,Math.max(0,Number.isFinite(Number(x.position)) ? Number(x.position) : 50)),enabled:x.enabled!==false,layout:normalizeLayout(x.layout,CHARACTER_ITEMS),...normalizeStyleLayouts(x,CHARACTER_ITEMS)}));
  return c;
}
export function paintArt(el,c,{hero=false,style=DEFAULT_UI_STYLE}={}) {
  const value=hero?(c.hero||c.portrait):c.portrait;
  // Only the bundled sample gets a matching high-resolution Frontline illustration.
  const sample=style==='frontline'&&value==='@/assets/party.png'&&c.strip===0;
  const url=assetURL(sample?'@/assets/frontline-ranger.png':value);el.style.backgroundImage=url?`url(${JSON.stringify(url)})`:'none';
  const strip=!sample&&c.strip!==null && !(hero&&c.hero);
  const closePortrait=strip&&!hero&&style==='frontline';
  el.toggleAttribute('data-pl-strip',strip);
  el.style.backgroundSize=closePortrait?'800% auto':strip?'500% auto':(sample&&!hero?'180% auto':hero&&style!=='frontline'?'contain':'cover');
  el.style.backgroundPosition=closePortrait?`${(c.strip*160+30)/7}% 3%`:strip?`${c.strip*25}% ${hero?0:5}%`:sample?`${hero?50:52}% ${c.position-50}%`:`50% ${c.position}%`;
  el.classList.toggle('pl-no-art',!url);
}
