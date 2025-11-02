document.addEventListener('DOMContentLoaded',()=>{updateNavbar();
  const btn=document.getElementById('scanBtn');
  if(btn){btn.addEventListener('click',startScan);} 

  const toggleHeaders=document.getElementById('toggleHeaders');
  const toggleRobots=document.getElementById('toggleRobots');
  const headersPre=document.getElementById('headers');
  const robotsPre=document.getElementById('robots');
  if(toggleHeaders&&headersPre){
    toggleHeaders.addEventListener('click',()=>{
      const expanded=headersPre.classList.toggle('collapsed')===false;
      toggleHeaders.setAttribute('aria-expanded',expanded?'true':'false');
      toggleHeaders.textContent=expanded?'Daha Az Göster':'Detayları Göster';
    });
  }
  if(toggleRobots&&robotsPre){
    toggleRobots.addEventListener('click',()=>{
      const expanded=robotsPre.classList.toggle('collapsed')===false;
      toggleRobots.setAttribute('aria-expanded',expanded?'true':'false');
      toggleRobots.textContent=expanded?'Daha Az Göster':'Detayları Göster';
    });
  }
});

async function startScan(){
  const url=document.getElementById('targetUrl').value.trim();
  const deep=document.getElementById('deepScan').checked;
  const statusEl=document.getElementById('scanStatus');
  if(!url){alert('Lütfen bir URL girin');return}
  statusEl.textContent='Taranıyor...';
  toggleLoading(true);
  try{
    const res=await fetch('http://localhost:5000/api/webscan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url,deep})});
    const data=await res.json();
    if(!res.ok||data.error){throw new Error(data.error||'Tarama hatası')}
    renderResults(data);
    statusEl.textContent='Tamamlandı';
  }catch(e){
    statusEl.textContent='Hata';
    document.getElementById('summary').textContent=e.message;
  } finally {
    toggleLoading(false);
  }
}

function renderResults(d){
  document.getElementById('summary').innerHTML=`
    <div><strong>Hedef:</strong> ${escapeHtml(d.target||'')}</div>
    <div><strong>Durum:</strong> ${d.status||'-'}</div>
    <div><strong>Yanıt Kodu:</strong> ${d.http_code||'-'}</div>
    <div><strong>SSL:</strong> ${d.ssl?'Evet':'Hayır'}</div>`;
  const headersStr=JSON.stringify(d.headers||{},null,2);
  document.getElementById('headers').textContent=headersStr;
  setSizeBadge('headersSize', headersStr);
  const list=document.getElementById('adminCandidates');
  list.innerHTML='';
  (d.admin_panels||[]).forEach(it=>{
    const li=document.createElement('li');
    li.textContent=`${it.path} ${it.found?'(bulundu)':''}`;
    list.appendChild(li);
  });
  const robotsStr=d.robots||'';
  document.getElementById('robots').textContent=robotsStr;
  setSizeBadge('robotsSize', robotsStr);
  const sec=document.getElementById('securityChecks');
  sec.innerHTML='';
  (d.security||[]).forEach(it=>{
    const li=document.createElement('li');
    li.textContent=`${it.name}: ${it.pass?'Güvenli':'Riskli'}${it.detail?(' - '+it.detail):''}`;
    sec.appendChild(li);
  });
  // Ek teknoloji özeti
  if (Array.isArray(d.tech) && d.tech.length){
    const li=document.createElement('li');
    li.textContent=`Teknoloji: ${d.tech.join(', ')}`;
    sec.appendChild(li);
  }

  // Sunucu özeti tablosu
  const summaryTable=document.getElementById('serverSummary');
  summaryTable.innerHTML='';
  const summaryData=d.summary||{};
  Object.keys(summaryData).forEach(k=>{
    const tr=document.createElement('tr');
    const th=document.createElement('th');
    th.textContent=k;
    const td=document.createElement('td');
    td.textContent=summaryData[k]||'-';
    tr.appendChild(th);tr.appendChild(td);
    summaryTable.appendChild(tr);
  });
}

function escapeHtml(s){return s.replace(/[&<>"]+/g,c=>({"&":"&amp;","<":"&lt;",
  ">":"&gt;","\"":"&quot;"}[c]))}

function toggleLoading(on){
  const btn=document.getElementById('scanBtn');
  if(!btn) return;
  btn.disabled=on;
  btn.textContent=on?'Taranıyor...':'Taramayı Başlat';
}

function setSizeBadge(elId, text){
  try{
    const bytes=(new Blob([text])).size;
    const kb=(bytes/1024).toFixed(bytes<1024?0:1);
    const lines=(text.match(/\n/g)||[]).length+ (text?1:0);
    const el=document.getElementById(elId);
    if(el){el.textContent=`(${kb} KB, ${lines} satır)`}
  }catch(e){/* ignore */}
}
