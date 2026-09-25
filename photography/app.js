const sections = [
{title:'into the quiet',label:'THE HIGH COUNTRY',story:'Above the noise, a different rhythm. Following the light through places that make us feel small.'},
{title:'between tides',label:'ALONG THE COAST',story:'The shoreline never holds its shape. A few moments borrowed from its endless motion.'},
{title:'passing through',label:'THE HUMAN LANDSCAPE',story:'Lines, shadows, and the spaces we leave behind. Finding stillness in a world that keeps moving.'}
];
const root=document.getElementById('collections');
sections.forEach((s,k)=>{const el=document.createElement('section');el.className='collection';el.setAttribute('aria-labelledby','chapter-'+k);el.innerHTML=`<div class="collection-heading"><h2 id="chapter-${k}">${s.title}</h2><p class="story">${s.story}</p></div><div class="grid"></div>`;s.images=photos[k];photos[k].slice(0,4).forEach((p,i)=>{const figure=document.createElement('figure');figure.className='photo';const button=document.createElement('button');button.className='photo-button';button.setAttribute('aria-label',`Open ${p.title}, photograph ${i+1} of ${photos[k].length}`);const img=document.createElement('img');img.src=p.thumb||p.url;img.alt=p.alt;img.loading=k===0?'eager':'lazy';img.decoding='async';button.append(img);button.onclick=()=>openViewer(k,i);figure.append(button);el.querySelector('.grid').append(figure)});root.append(el)});
const dialog=document.getElementById('viewer');const full=document.getElementById('full-image');let chapter=0,index=0,opener=null;
function render(){const s=sections[chapter],p=s.images[index];full.src=p.url;full.alt=p.alt;document.getElementById('viewer-title').textContent=s.title;const caption=document.getElementById('image-caption');caption.replaceChildren(document.createTextNode(p.title+' · '));const credit=document.createElement('a');credit.href=p.source;credit.target='_blank';credit.rel='noreferrer';credit.textContent=p.photographer;caption.append(credit);document.getElementById('counter').textContent=`${String(index+1).padStart(2,'0')} / ${String(s.images.length).padStart(2,'0')}`;const dots=document.getElementById('dots');dots.replaceChildren();s.images.forEach((_,i)=>{const b=document.createElement('button');b.setAttribute('aria-label',`Show photograph ${i+1}`);b.setAttribute('aria-current',i===index?'true':'false');b.onclick=()=>{index=i;render()};dots.append(b)});const preload=new Image();preload.src=s.images[(index+1)%s.images.length].url}
function openViewer(c,i){chapter=c;index=i;opener=document.activeElement;render();dialog.showModal();document.body.style.overflow='hidden';document.getElementById('close').focus()}
function step(d){index=(index+d+sections[chapter].images.length)%sections[chapter].images.length;render()}
document.getElementById('close').onclick=()=>dialog.close();document.getElementById('previous').onclick=()=>step(-1);document.getElementById('next').onclick=()=>step(1);dialog.addEventListener('close',()=>{document.body.style.overflow='';opener?.focus()});dialog.addEventListener('click',e=>{if(e.target===dialog||e.target.classList.contains('stage'))dialog.close()});dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();step(1)}if(e.key==='ArrowLeft'){e.preventDefault();step(-1)}});let touchX=0,touchY=0;full.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;touchY=e.changedTouches[0].clientY},{passive:true});full.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX,dy=e.changedTouches[0].clientY-touchY;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))step(dx<0?1:-1)},{passive:true});
// Fit each desktop collection beneath the header, including its story and spacing.
function fitDesktopCollections(){
 if(!window.matchMedia('(min-width:761px)').matches){root.style.removeProperty('--desktop-section-width');return;}
 const collections=[...root.querySelectorAll('.collection')];
 const available=window.innerHeight-document.querySelector('header').getBoundingClientRect().height-72-12;
 const maxWidth=root.clientWidth;
 let width=Math.min(maxWidth,Math.max(120,available));
 for(let pass=0;pass<5;pass++){
  root.style.setProperty('--desktop-section-width',width+'px');
  const headingHeight=Math.max(...collections.map(el=>el.querySelector('.collection-heading').getBoundingClientRect().height+24));
  const next=Math.min(width,Math.max(120,available-headingHeight));
  if(Math.abs(next-width)<1)break;
  width=next;
 }
 root.style.setProperty('--desktop-section-width',width+'px');
}
fitDesktopCollections();
let resizeFrame;
window.addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(fitDesktopCollections)});
document.fonts.ready.then(fitDesktopCollections);
