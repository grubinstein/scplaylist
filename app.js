import React, {useState} from 'https://cdn.skypack.dev/react@18.2.0';

const PROXY_BASE = '' // set your deployed function URL here

export function App(){
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);

  async function findPlaylists(trackUrl){
    setError(null); setStatus('Resolving...');
    try{
      let setsUrl;
      try{
        const u = new URL(trackUrl);
        setsUrl = `${u.origin}${u.pathname.replace(/\/+$/, '')}/sets`;
      }catch(e){ throw new Error('Invalid URL'); }

      setStatus('Fetching...');
      let resText;
      if (PROXY_BASE){
        const resp = await fetch(`${PROXY_BASE}?url=${encodeURIComponent(setsUrl)}`);
        const json = await resp.json();
        if (json.error) throw new Error(json.error);
        resText = json.html;
      } else {
        const resp = await fetch(setsUrl, {headers:{'Accept':'text/html'}});
        resText = await resp.text();
      }

      setStatus('Parsing...');
      const parser = new DOMParser();
      const doc = parser.parseFromString(resText, 'text/html');
      const anchors = Array.from(doc.querySelectorAll('a'));
      const found = new Map();
      anchors.forEach(a=>{
        const href = a.getAttribute('href')||'';
        if (/\/(sets|playlists)\//.test(href)){
          const full = href.startsWith('http')? href : `https://soundcloud.com${href}`;
          const title = (a.textContent||a.getAttribute('title')||full).trim();
          if (!found.has(full)) found.set(full, {url:full,title});
        }
      });
      setPlaylists(Array.from(found.values()));
      setStatus(`Found ${found.size} playlists`);
    }catch(err){
      setError(err.message);
      setStatus('Failed');
    }
  }

  return (
    React.createElement('div',{className:'card'},
      React.createElement('h1',null,'SoundCloud Playlist Finder'),
      React.createElement('div',{className:'row'},
        React.createElement('input',{value:url,onChange:e=>setUrl(e.target.value),placeholder:'https://soundcloud.com/artist/track',style:{flex:1,padding:10,borderRadius:8}}),
        React.createElement('button',{onClick:()=>findPlaylists(url)},'Find')
      ),
      React.createElement('div',null,status),
      error && React.createElement('div',{style:{color:'red'}}, error),
      playlists.length>0 && playlists.map((p)=>(
        React.createElement('div',{key:p.url,className:'playlist'},
          React.createElement('a',{href:p.url,target:'_blank'},p.title)
        )
      ))
    )
  );
}