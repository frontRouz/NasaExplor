const API_BASE='https://api.nasa.gov/planetary/apod';
    const KEYS=['v8nOLdRz0YgG2VGWcRLkyRJnhN4ZgfEV8S8lo11M','xMUnoHfaBiP0U1GVTTxCwilmWbThgFoeFZGgj2ic','Lj64S7AgZhPzONIscHHdRSfLShBZ96vscqfT7X9c'];
    function randomKey(){return KEYS[Math.floor(Math.random()*KEYS.length)];}

    const grid=document.getElementById('grid');
    const loader=document.getElementById('loader');
    const modalBack=document.getElementById('modalBack');
    const modalMedia=document.getElementById('modalMedia');
    const mTitle=document.getElementById('mTitle' );
    const mDate=document.getElementById('mDate');
    const mType=document.getElementById('mType');
    const mDesc=document.getElementById('mDesc');
    
    const mOpen=document.getElementById('mOpen');
    const mClose=document.getElementById('mClose');
    const toTop=document.getElementById('toTop');

    let currentEndDate=new Date();
    let loading=false;
    const BATCH=6;

    function formatDate(d){return d.toISOString().slice(0,10);}
    function daysBefore(d,n){const nd=new Date(d);nd.setDate(nd.getDate()-n);return nd;}

    function makeCard(item,isHot=false){
      if(item.media_type!=='image') return null;
      const card=document.createElement('article');card.className='card';
      if(isHot) card.classList.add('hot');
      const media=document.createElement('div');media.className='media';
      const img=document.createElement('img');img.dataset.src=item.url;img.alt=item.title;img.loading='lazy';media.appendChild(img);
      const content=document.createElement('div');content.className='content';
      const title=document.createElement('h3');title.className='title';title.textContent=item.title;
      const desc=document.createElement('div');desc.className='desc';desc.textContent=item.explanation;
      const row=document.createElement('div');row.className='row';
      const bd=document.createElement('div');bd.className='badge';bd.textContent=item.date;
      const tp=document.createElement('div');tp.className='badge';tp.textContent=item.media_type;
      row.append(bd,tp);
      content.append(title,desc,row);
      card.append(media,content);
      card.onclick=()=>openModal(item);
      return card;
    }

    function openModal(item){
  mTitle.textContent=item.title;
  mDate.textContent=item.date;
  mType.textContent=item.media_type;
  mDesc.textContent=item.explanation;
  modalMedia.innerHTML='';

  
  const img=document.createElement('img');
  img.src=item.hdurl||item.url;
  modalMedia.appendChild(img);

  

  mOpen.onclick=()=>window.open(item.hdurl||item.url,'_blank');
  modalBack.style.display='flex';
  document.body.style.overflow='hidden';
}

    mClose.onclick=()=>{modalBack.style.display='none';document.body.style.overflow='';};
    modalBack.onclick=e=>{if(e.target===modalBack) mClose.click();};

    

    async function fetchBatch(){
      if(loading) return;loading=true;loader.style.display='grid';
      try{
        const end=new Date(currentEndDate);
        const start=daysBefore(end,BATCH-1);
        const s=formatDate(start),e=formatDate(end);
        const res=await fetch(`${API_BASE}?api_key=${randomKey()}&start_date=${s}&end_date=${e}`);
        const items=await res.json();
        items.sort((a,b)=>a.date<b.date?1:-1);
        items.forEach((it,idx)=>{const card=makeCard(it,e===formatDate(new Date())&&idx===0);if(card)grid.appendChild(card);});
        currentEndDate=daysBefore(start,1);
        setupLazy();
      }catch(err){console.error(err);}
      loader.style.display='none';loading=false;
    }

    function setupLazy(){const imgs=document.querySelectorAll('img[data-src]');const io=new IntersectionObserver(entries=>{entries.forEach(en=>{if(en.isIntersecting){en.target.src=en.target.dataset.src;io.unobserve(en.target);}})},{rootMargin:'200px'});imgs.forEach(img=>io.observe(img));}

    window.addEventListener('scroll',()=>{
      if(window.scrollY+window.innerHeight>=document.body.scrollHeight-50) fetchBatch();
      toTop.style.display=window.scrollY>400?'block':'none';
    });

    toTop.onclick=()=>window.scrollTo({top:0,behavior:'smooth'});

    fetchBatch();