(function(){
  document.addEventListener('DOMContentLoaded',function(){
    // Inject FAB
    const fab=document.createElement('div');
    fab.className='ai-fab';
    fab.innerHTML='<img src="/Gemini.png" alt="AI" class="ai-fab-img"/>';
    document.body.appendChild(fab);

    // Panel
    const panel=document.createElement('div');
    panel.className='ai-panel';
    panel.innerHTML=`
      <div class="ai-header">
        <div class="ai-title" style="display:flex;align-items:center;gap:8px">
          <img src="/Gemini.png" alt="Gemini" width="18" height="18"/>
          <span id="aiTitle">Gemini 2.5 Flash</span>
        </div>
        <div class="ai-header-actions">
          <button class="ai-gear" title="Ayarlar">⚙</button>
          <button class="ai-close" title="Kapat">×</button>
        </div>
      </div>
      <div class="ai-messages" id="aiMessages"></div>
      <div class="ai-settings" id="aiSettings" style="display:none">
        <div class="ai-row">
          <label>Sağlayıcı</label>
          <select id="aiProvider">
            <option value="gemini">Gemini</option>
            <option value="openai">ChatGPT</option>
            <option value="xai">Grok</option>
          </select>
        </div>
        <div class="ai-row">
          <label>Model</label>
          <input id="aiModel" type="text" placeholder="model"/>
        </div>
        <div class="ai-subtitle">API Anahtarları (cihazda gizli olarak saklanır)</div>
        <div class="ai-row">
          <label>Gemini</label>
          <input id="keyGemini" type="password" placeholder="Gemini API key"/>
        </div>
        <div class="ai-row">
          <label>OpenAI</label>
          <input id="keyOpenAI" type="password" placeholder="OpenAI API key"/>
        </div>
        <div class="ai-row">
          <label>xAI</label>
          <input id="keyXAI" type="password" placeholder="xAI API key"/>
        </div>
        <div class="ai-row ai-actions">
          <button id="aiSave" class="ai-small">Kaydet</button>
          <button id="aiClearCurrent" class="ai-small ai-ghost">Seçili sağlayıcı anahtarını sil</button>
        </div>
      </div>
      <div class="ai-input">
        <input id="aiPrompt" type="text" placeholder="Sorunuzu yazın ve Enter'a basın...">
        <button id="aiSend">Gönder</button>
      </div>`;
    document.body.appendChild(panel);

    const messagesEl=panel.querySelector('#aiMessages');
    const promptEl=panel.querySelector('#aiPrompt');
    const sendBtn=panel.querySelector('#aiSend');
    const apiKeyEl=null; // deprecated single-key field
    const providerEl=panel.querySelector('#aiProvider');
    const modelEl=panel.querySelector('#aiModel');
    const settingsEl=panel.querySelector('#aiSettings');
    const saveBtn=panel.querySelector('#aiSave');
    const titleEl=panel.querySelector('#aiTitle');
    const gearBtn=panel.querySelector('.ai-gear');
    const keyGemini=panel.querySelector('#keyGemini');
    const keyOpenAI=panel.querySelector('#keyOpenAI');
    const keyXAI=panel.querySelector('#keyXAI');
    const clearBtn=panel.querySelector('#aiClearCurrent');

    // Storage helpers
    const LS={
      getProvider:()=>localStorage.getItem('ai_provider')||'gemini',
      setProvider:(v)=>localStorage.setItem('ai_provider',v),
      getKey:(p)=>localStorage.getItem('ai_key_'+p)||'',
      setKey:(p,k)=>localStorage.setItem('ai_key_'+p,k||''),
      getModel:(p)=>localStorage.getItem('ai_model_'+p)||defaultModel(p),
      setModel:(p,m)=>localStorage.setItem('ai_model_'+p,m||defaultModel(p)),
    };

    function defaultModel(p){
      if(p==='openai') return 'gpt-4o-mini';
      if(p==='xai') return 'grok-2-latest';
      return 'gemini-2.5-flash';
    }

    function syncUIFromStorage(){
      const p=LS.getProvider();
      providerEl.value=p;
      modelEl.value=LS.getModel(p);
      updateTitle(p);
      // fill multi-key inputs with masked empty (do not expose); placeholders reflect status
      refreshKeyPlaceholders();
    }

    function refreshKeyPlaceholders(){
      keyGemini.value='';
      keyOpenAI.value='';
      keyXAI.value='';
      keyGemini.placeholder = LS.getKey('gemini') ? 'Anahtar ayarlı (değiştirmek için yazın)' : 'Gemini API key';
      keyOpenAI.placeholder = LS.getKey('openai') ? 'Anahtar ayarlı (değiştirmek için yazın)' : 'OpenAI API key';
      keyXAI.placeholder = LS.getKey('xai') ? 'Anahtar ayarlı (değiştirmek için yazın)' : 'xAI API key';
    }

    function updateTitle(p){
      if(p==='openai') titleEl.textContent='ChatGPT (OpenAI)';
      else if(p==='xai') titleEl.textContent='Grok (xAI)';
      else titleEl.textContent='Gemini 2.5 Flash';
    }

    function togglePanel(){ panel.style.display = (panel.style.display==='flex')?'none':'flex'; }
    fab.addEventListener('click', ()=>{ panel.style.display='flex'; promptEl.focus(); });
    panel.querySelector('.ai-close').addEventListener('click', togglePanel);
    gearBtn.addEventListener('click', ()=>{
      settingsEl.style.display = settingsEl.style.display==='none'? 'block':'none';
    });

    providerEl.addEventListener('change', ()=>{
      LS.setProvider(providerEl.value);
      modelEl.value=LS.getModel(providerEl.value);
      updateTitle(providerEl.value);
      refreshKeyPlaceholders();
    });

    saveBtn.addEventListener('click', ()=>{
      const p=providerEl.value;
      // save model for selected provider
      if(modelEl.value.trim()) LS.setModel(p, modelEl.value.trim());
      // save any provided keys (empty leaves unchanged)
      if(keyGemini.value.trim()) LS.setKey('gemini', keyGemini.value.trim());
      if(keyOpenAI.value.trim()) LS.setKey('openai', keyOpenAI.value.trim());
      if(keyXAI.value.trim()) LS.setKey('xai', keyXAI.value.trim());
      refreshKeyPlaceholders();
      settingsEl.style.display='none';
    });

    clearBtn.addEventListener('click', ()=>{
      const p=providerEl.value;
      LS.setKey(p,'');
      refreshKeyPlaceholders();
    });

    function appendMsg(text,role){
      const wrap=document.createElement('div');
      wrap.className='ai-msg '+(role||'assistant');
      const bubble=document.createElement('div');
      bubble.className='ai-bubble '+(role||'assistant');
      bubble.textContent=text;
      wrap.appendChild(bubble);
      messagesEl.appendChild(wrap);
      messagesEl.scrollTop=messagesEl.scrollHeight;
    }

    async function send(){
      const provider=providerEl.value;
      const key=(LS.getKey(provider) || '').trim();
      const model=(LS.getModel(provider) || defaultModel(provider)).trim();
      const q=(promptEl.value||'').trim();
      if(!q) return;
      appendMsg(q,'user');
      promptEl.value='';
      if(!key){ appendMsg('Lütfen seçili sağlayıcı için API anahtarını ayarlayın (⚙).','assistant'); return; }
      try{
        let text='';
        if(provider==='gemini'){
          const resp=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`,{
            method:'POST',headers:{'Content-Type':'application/json'},
            body:JSON.stringify({ contents:[{role:'user',parts:[{text:q}]}] })
          });
          const data=await resp.json();
          try{ text=data.candidates?.[0]?.content?.parts?.map(p=>p.text).join('\n')||''; }catch(e){}
        } else if(provider==='openai'){
          const resp=await fetch('https://api.openai.com/v1/chat/completions',{
            method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},
            body:JSON.stringify({ model, messages:[{role:'user',content:q}] })
          });
          const data=await resp.json();
          text = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
        } else if(provider==='xai'){
          const resp=await fetch('https://api.x.ai/v1/chat/completions',{
            method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},
            body:JSON.stringify({ model, messages:[{role:'user',content:q}] })
          });
          const data=await resp.json();
          text = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
        }
        appendMsg(text || 'Yanıt boş');
      }catch(e){ appendMsg('İstek hatası: '+e.message); }
    }

    sendBtn.addEventListener('click', send);
    promptEl.addEventListener('keydown', (e)=>{ if(e.key==='Enter') send(); });

    // init
    syncUIFromStorage();
  });
})();
