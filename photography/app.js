const sections = [
{title:'wandering around porto',label:'porto',story:'<strong>september 2023</strong>. I have just walked the camino the santiago and spent 4 weeks on a farm with travellers. On the last 2 days - I am alone. I spend the time conscious of what I have left behind, filling the space in my heart with observation and photography.'},
{title:'rome in black and white',label:'rome',story:'<strong>march 2019</strong>. Gymnasium, everyone in the class is handed an old analog camera. Mine doesnt have any automatic mode, I handle shutterspeed and aperature first time solo.'},
{title:'makro',label:'makro',story:'<strong>2017</strong>. I used to be an introverted kid. Id spend hours in the garden, the grass as high as myself. Observing. I was 15-16 taking these pictures. I used a bunch of tricks to make my camera able to focus so closely - and ofc - I had to spend hours and hours outside, patiently observing. The feeling that the next shot could be the perfect one always kept me going.'},
{title:'nepal - views',label:'nepal_views',story:'<strong>august 2024</strong>. I arrive my nepal and lose my whole pbackpack and meet a friend for life on the same day. 4rth image, a child who attends monastery school watches over kathmandu. 100 years ago, the city was far far away from the monastery. Now they touch. The city noise and dirty air reach up to the monastery. At some point the boy will have to go down there again. At some point, the monastery will be swallowed by the city. But not yet. Not yet.'},
{title:'nepal - streets',label:'nepal_streets',story:'<strong>august 2024</strong>. Around poverty, the naked desire to survive strikes me deeply. Sell 10 hours bananas a day. At 8 years old, skip school to run after tourists with a bucket. Humanity is there, plenty, but buried underneath hunger'},
{title:'europe',label:'europe',story:'<strong>2022</strong>. Ages 19-20 in my gap year, I travel europe with a cheap one-way camera. I wanted to live stories and not hunt pretty surfaces. Each of these have a story, a long and interesting one. but maybe, try to invent your own.'},
{title:'morocco',label:'morocco',story:'<strong>october 2018</strong>. I am 16 and probably on the peak of photographic obsession. I had spent the past year trying to find beauty in the mundane grey life of zurich - and then my parents visited morocco with me. What an aesthetic paradise.'},
{title:'deserts',label:'deserts',story:'<strong>october 2018</strong>. At 16, I dont really engage with the culture or the people at all. But my compositions dare to be more simplistic, dare to leave space.'},
{title:'in the forrest',label:'forrest',story:'<strong>july 2023</strong>. Friends invite me to a "Waldbesetzung" in germany. People have unexpected genders, names that resemble bugs and cookies. Constructions are nowhere near safe, people smoke weed while drilling screws. Food rots on plates because nobody cleans it. But somehow - a refuge. Somehow -  a remarkable, admirable, pure heart'},
{title:'israel',label:'isreal',story:'<strong>march 2022</strong>. The first destiny of that gap year is israel. I to couchsurf in palestine and tel aviv to get to know both sides of the conflict. I find the diversity fascinating in jerusalem.'},
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
