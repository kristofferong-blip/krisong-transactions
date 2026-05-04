'use client';
import { useCallback, useRef, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
interface Props { userId: string; initialData: unknown; }
export default function TrackerPageClient({ userId, initialData }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [syncStatus, setSyncStatus] = useState(initialData ? 'Loaded from cloud' : 'Ready');
  const [syncColor, setSyncColor] = useState('#666');
  const [loaded, setLoaded] = useState(false);

  const saveToCloud = useCallback(async (data: unknown) => {
    try {
      const res = await fetch('/api/tracker', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({data}) });
      if (res.ok) { const t=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); setSyncStatus('Synced '+t); setSyncColor('#4ade80'); }
    } catch { setSyncStatus('Save failed'); setSyncColor('#ef4444'); }
  }, []);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'TRACKER_READY') {
        const win = iframeRef.current?.contentWindow;
        if (win && initialData) win.postMessage({ type:'TRACKER_LOAD', payload:initialData },'*');
      }
      if (e.data?.type === 'TRACKER_SAVE') {
        setSyncStatus('Saving…'); setSyncColor('#888');
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => saveToCloud(e.data.payload), 800);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [initialData, saveToCloud]);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <div style={{ position:'relative', height:'100vh', overflow:'hidden' }}>
      <div style={{ position:'fixed',top:8,right:12,zIndex:9999,display:'flex',gap:10,alignItems:'center',fontSize:12,background:'rgba(0,0,0,0.7)',padding:'4px 10px',borderRadius:6 }}>
        <span style={{ color:syncColor }}>{syncStatus}</span>
        <button onClick={signOut} style={{ background:'#1a1a1a',border:'1px solid #333',color:'#999',padding:'3px 8px',borderRadius:4,cursor:'pointer',fontSize:11 }}>
          Sign out
        </button>
      </div>
      <iframe ref={iframeRef} src="/tracker.html" style={{ width:'100%',height:'100vh',border:'none',display:'block' }} title="Transaction Tracker" />
    </div>
  );
}