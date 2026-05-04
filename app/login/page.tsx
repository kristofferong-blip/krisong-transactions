'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
export default function LoginPage() {
  const [email, setEmail] = useState('kristofferong@gmail.com');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin + '/auth/callback' } });
    if (!error) setSent(true); setLoading(false);
  }
  return (
    <div style={{ minHeight:'100vh',background:'#0a0a0a',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace' }}>
      <div style={{ background:'#111',border:'1px solid #222',borderRadius:12,padding:40,width:340 }}>
        <div style={{ color:'#4ade80',fontSize:24,fontWeight:700,marginBottom:8 }}>KO Transactions</div>
        <div style={{ color:'#666',fontSize:13,marginBottom:28 }}>Sign in to access your tracker</div>
        {sent ? (
          <div style={{ color:'#4ade80',textAlign:'center',padding:'20px 0' }}>
            ✓ Magic link sent!<br/><span style={{ color:'#666',fontSize:12 }}>Check your inbox and click the link</span>
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
              style={{ width:'100%',background:'#0a0a0a',border:'1px solid #333',color:'#fff',padding:'10px 12px',borderRadius:6,marginBottom:12,boxSizing:'border-box',fontSize:14 }} required />
            <button type="submit" disabled={loading}
              style={{ width:'100%',background:'#4ade80',color:'#000',border:'none',padding:11,borderRadius:6,fontWeight:700,cursor:'pointer',fontSize:14 }}>
              {loading ? 'Sending…' : 'Send Magic Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}