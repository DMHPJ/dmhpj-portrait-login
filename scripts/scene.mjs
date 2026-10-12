import {assetURL,paintArt,getSceneLayout,DEFAULT_UI_STYLE} from './model.mjs';

export const ITEM_LABELS={eyebrow:'上方标语',name:'角色姓名',tag:'称号 / 职业',hero:'角色立绘',description:'角色介绍',detail:'底部特征文字',login:'登录卡片',roster:'角色选择器'};
export const TEXT_LIMITS={eyebrow:80,name:80,tag:80,description:1500,detail:160};
export function element(tag,cls,content){
  const node=document.createElement(tag);if(cls)node.className=cls;if(content)node.textContent=content;return node;
}
export function revealCard(button){
  if(!button)return;
  const cards=button.parentElement,frame=cards.getBoundingClientRect(),rect=button.getBoundingClientRect();
  // Scroll only the roster, never the fixed scene or its editor ancestors.
  cards.scrollBy({left:rect.left<frame.left?rect.left-frame.left:rect.right>frame.right?rect.right-frame.right:0,top:rect.top<frame.top?rect.top-frame.top:rect.bottom>frame.bottom?rect.bottom-frame.bottom:0});
}
export function applyLayout(node,layout){
  node.style.left=`${layout.x}%`;node.style.top=`${layout.y}%`;node.style.transform=`scale(${layout.scale})`;
  for(const dimension of ['width','height']){
    if(layout[dimension])node.style.setProperty(dimension,`${layout[dimension]}px`,'important');
    else node.style.removeProperty(dimension);
  }
  node.toggleAttribute('data-pl-height',Boolean(layout.height));
}
export function createScene(root,config,{onSelect,editing=false}={}){
  root.classList.add('pl-stage');
  const backdrop=element('div','pl-backdrop');
  const decoration=element('div','pl-frontline-decor');decoration.setAttribute('aria-hidden','true');
  decoration.innerHTML='<div class="pl-frontline-landscape"></div><svg class="pl-frontline-compass" viewBox="0 0 140 140" fill="none"><circle cx="70" cy="70" r="55"/><circle cx="70" cy="70" r="44"/><path d="M0 70h140M70 0v140"/><path class="pl-compass-needle" d="m70 48 4 18 18 4-18 4-4 18-4-18-18-4 18-4Z"/></svg><div class="pl-frontline-rail"></div><div class="pl-frontline-segments"></div><div class="pl-frontline-mark"><strong>前线档案</strong><span>FRONTLINE<br>ARCHIVES</span><i></i></div><span class="pl-frontline-cross"></span><span class="pl-frontline-motto">FOR A BRIGHTER TOMORROW</span><span class="pl-frontline-signoff">A GREATER TOMORROW<br>LIES AHEAD.</span>';
  const head=element('header','pl-header');
  const brand=element('div','pl-brand');brand.append(element('span','pl-sigil','✧'),element('span','pl-title',config.title));head.append(brand);
  const eyebrow=element('p','pl-eyebrow',config.eyebrow);
  const name=element('h1','pl-name'),tag=element('p','pl-tag'),description=element('p','pl-description'),detail=element('p','pl-detail');
  const hero=element('div','pl-hero');hero.setAttribute('aria-hidden','true');
  const roster=element('section','pl-roster');roster.setAttribute('aria-label','选择角色');
  const heading=element('div','pl-roster-heading');heading.append(element('span','','选择你的冒险者'),element('span','pl-subtitle',config.subtitle));
  const cards=element('div','pl-cards');roster.append(heading,cards);
  const foot=element('p','pl-footer','同赴未知 · 共写传奇');
  for(const [key,node] of Object.entries({eyebrow,name,tag,hero,description,detail,roster}))node.dataset.plItem=key;
  for(const node of [backdrop,decoration,head,eyebrow,name,tag,hero,description,detail,roster,foot]){node.dataset.plOwned='';root.append(node);}
  for(const c of config.characters.filter(c=>editing||c.enabled)){
    const button=element('button','pl-card');button.type='button';button.dataset.character=c.id;button.setAttribute('aria-label',`选择${c.name}`);
    const art=element('span','pl-card-art');paintArt(art,c);const label=element('span','pl-card-label');label.append(element('strong','',c.name),element('small','',c.tag));
    button.classList.toggle('pl-hidden-character',!c.enabled);
    button.append(art,label);button.addEventListener('click',()=>onSelect?.(c.id));cards.append(button);
  }
  if(!cards.children.length)cards.append(element('p','pl-empty',editing?'添加角色，开始编辑登录页。':'还没有配置角色，请使用账户列表登录。'));
  cards.addEventListener('keydown',event=>{
    const buttons=[...cards.querySelectorAll('button')];const i=buttons.indexOf(document.activeElement);if(i<0)return;
    const vertical=root.dataset.plStyle==='frontline';
    let next=null;if(event.key==='ArrowRight'||(vertical&&event.key==='ArrowDown'))next=(i+1)%buttons.length;if(event.key==='ArrowLeft'||(vertical&&event.key==='ArrowUp'))next=(i-1+buttons.length)%buttons.length;
    if(next!==null){event.preventDefault();buttons[next].focus({preventScroll:true});buttons[next].click();revealCard(buttons[next]);}
  });
}
export function updateScene(root,config,character){
  const previousStyle=root.dataset.plStyle,previousId=root.querySelector('.pl-card[aria-pressed="true"]')?.dataset.character;
  root.dataset.plStyle=character?.uiStyle??DEFAULT_UI_STYLE;
  const style=root.dataset.plStyle,form=root.querySelector('#join-game-form,.pl-native-form');
  if(form&&!form.querySelector('.pl-form-footer')){
    const footer=element('p','pl-form-footer','同赴未知 · 共写传奇');footer.dataset.plOwned='';form.append(footer);
    const button=form.querySelector('button[type="submit"],button');
    if(button){
      const arrow=element('span','pl-submit-arrow');arrow.dataset.plOwned='';arrow.setAttribute('aria-hidden','true');
      arrow.innerHTML='<svg viewBox="0 0 28 28" fill="none"><path d="M3 14h21M16 6l8 8-8 8" stroke="currentColor" stroke-width="1.5"/></svg>';button.append(arrow);
    }
  }
  root.style.setProperty('--pl-accent',config.accent);root.style.setProperty('--pl-character',character?.color||config.accent);root.style.setProperty('--pl-card-height',`${config.cardHeight}px`);
  root.querySelector('.pl-title').textContent=config.title;root.querySelector('.pl-subtitle').textContent=config.subtitle;
  const values={...(character??{name:config.title,tag:'冒险即将开始',description:config.subtitle,detail:''}),eyebrow:config.eyebrow};
  for(const key of Object.keys(TEXT_LIMITS))root.querySelector(`[data-pl-item="${key}"]`).textContent=values[key];
  paintArt(root.querySelector('.pl-hero'),character??{portrait:'',strip:null,position:50},{hero:true,style});
  const background=assetURL(character?.background||config.background);root.querySelector('.pl-backdrop').style.backgroundImage=background?`url(${JSON.stringify(background)})`:'none';
  for(const node of root.querySelectorAll('[data-pl-item]')){
    const key=node.dataset.plItem;applyLayout(node,getSceneLayout(config,character,key));
  }
  for(const button of root.querySelectorAll('.pl-card')){
    const c=config.characters.find(c=>c.id===button.dataset.character);if(!c)continue;
    button.setAttribute('aria-pressed',String(c.id===character?.id));button.setAttribute('aria-label',`选择${c.name}`);
    button.querySelector('strong').textContent=c.name;button.querySelector('small').textContent=c.tag;
    button.classList.toggle('pl-hidden-character',!c.enabled);paintArt(button.querySelector('.pl-card-art'),c,{style});
  }
  if(previousStyle!==root.dataset.plStyle)root.querySelector('.pl-cards').scrollTo(0,0);
  if(previousStyle!==root.dataset.plStyle||previousId!==character?.id)revealCard(root.querySelector('.pl-card[aria-pressed="true"]'));
}
