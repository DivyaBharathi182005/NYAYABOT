// LawyerPage.jsx — AI-matched lawyers with real fee/phone/email + browse-all
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import { matchLawyer, getAllLawyers } from '../utils/api';

const CATS = ['all', 'criminal', 'family', 'civil', 'cyber', 'labour'];
const CAT_EMOJI = { criminal: '🧑‍⚖️', family: '👩‍⚖️', civil: '👨‍⚖️', cyber: '👩‍⚖️', labour: '🧑‍⚖️' };

const S = {
  input: { width: '100%', background: '#111120', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, color: '#e8e4d8', fontFamily: 'DM Sans,sans-serif', fontSize: 14, padding: '12px 14px', outline: 'none', marginBottom: 14 },
  label: { display: 'block', fontSize: 11, color: '#6b6880', fontFamily: 'JetBrains Mono,monospace', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 5 },
};

const G = '#c9a84c';

function LawyerCard({ l }) {
  return (
    <div style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 20, marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '2px solid rgba(201,168,76,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
          {CAT_EMOJI[l.category] || '⚖️'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#e8e4d8', display: 'flex', alignItems: 'center', gap: 8 }}>
            {l.name}
            {l.freeConsult && <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 4, background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)', fontFamily: 'JetBrains Mono,monospace' }}>FREE AID</span>}
          </div>
          <div style={{ fontSize: 12, color: G, marginBottom: 2 }}>{l.specialty}</div>
          <div style={{ fontSize: 11, color: '#6b6880' }}>📍 {l.location} · {l.experience} experience</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {l.tags.map(t => <span key={t} style={{ fontSize: 10, padding: '2px 9px', borderRadius: 6, background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.25)', color: '#818cf8' }}>{t}</span>)}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 12, color: '#a8a4b8', marginBottom: 12 }}>
        <span>💰 {l.feeRange}</span>
        <span>📱 {l.phone}</span>
        <span>✉️ {l.email}</span>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <a href={`tel:${l.phone}`} style={{ padding: '7px 16px', borderRadius: 9, fontSize: 12, cursor: 'pointer', background: 'rgba(201,168,76,0.15)', border: `1px solid ${G}`, color: G, textDecoration: 'none' }}>📞 Call</a>
        <a href={`mailto:${l.email}`} style={{ padding: '7px 16px', borderRadius: 9, fontSize: 12, cursor: 'pointer', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', textDecoration: 'none' }}>✉️ Email</a>
      </div>
    </div>
  );
}

export default function LawyerPage() {
  const [cat, setCat] = useState('all');
  const [allLawyers, setAllLawyers] = useState([]);
  const [issue, setIssue] = useState('');
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResult, setMatchResult] = useState(null); // { category, lawyers }

  useEffect(() => {
    getAllLawyers().then(setAllLawyers).catch(() => toast.error('Could not load lawyer list — check backend.'));
  }, []);

  const filtered = cat === 'all' ? allLawyers : allLawyers.filter(l => l.category === cat);

  const runMatch = async () => {
    if (!issue.trim()) { toast.error('Please describe your legal issue'); return; }
    setMatchLoading(true); setMatchResult(null);
    try {
      const result = await matchLawyer(issue);
      setMatchResult(result);
      toast.success(`Matched to ${result.category} law specialists`);
    } catch (e) {
      toast.error('Error matching lawyer: ' + e.message);
    } finally {
      setMatchLoading(false);
    }
  };

  return (
    <div>
      <PageHeader icon="⚖️" title="Find a Lawyer" subtitle="Get matched to the right advocate — or browse by specialisation" />

      <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 26, fontWeight: 700, marginBottom: 6, color: '#e8e4d8' }}>👨‍⚖️ Lawyer Consultation</h1>
      <p style={{ fontSize: 13, color: '#6b6880', marginBottom: 22 }}>Describe your issue for a matched lawyer, or browse advocates by specialisation below.</p>

      <div style={{ background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.2)', borderRadius: 10, padding: '14px 16px', marginBottom: 24, fontSize: 13, lineHeight: 1.65, color: '#e8e4d8' }}>
        💡 Free Legal Aid is available for economically weaker sections under Legal Services Authorities Act 1987. Call <strong style={{ color: G }}>15100</strong> for National Legal Aid Helpline.
      </div>

      {/* Lawyer matching */}
      <div style={{ background: '#16162a', border: '1px solid rgba(201,168,76,0.18)', borderRadius: 14, padding: 22, marginBottom: 24 }}>
        <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 17, color: G, marginBottom: 8 }}>🎯 Get Matched to a Lawyer</h3>
        <p style={{ fontSize: 13, color: '#6b6880', marginBottom: 14 }}>Describe your issue — NyayaBot detects the case category and shows you matched advocates with fees, phone, and email.</p>
        <label style={S.label}>Briefly describe your legal issue</label>
        <textarea value={issue} onChange={e => setIssue(e.target.value)}
          placeholder="E.g. My landlord locked me out and kept my belongings..."
          style={{ ...S.input, minHeight: 100, resize: 'none', marginBottom: 12 }} />
        <button onClick={runMatch} disabled={matchLoading}
          style={{ background: `linear-gradient(135deg,${G},#f0d080)`, color: '#0a0808', border: 'none', cursor: 'pointer', padding: '11px 24px', borderRadius: 10, fontWeight: 700, fontSize: 14, opacity: matchLoading ? 0.7 : 1 }}>
          {matchLoading ? '⏳ Matching...' : '⚡ Find My Lawyer'}
        </button>

        {matchResult && (
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 12, color: '#6b6880', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Matched category: <span style={{ color: G, fontWeight: 700 }}>{matchResult.category}</span>
            </div>
            {matchResult.lawyers.map(l => <LawyerCard key={l.id} l={l} />)}
          </div>
        )}
      </div>

      {/* Browse all */}
      <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, marginBottom: 10, color: '#e8e4d8' }}>Browse Advocates by Specialisation</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            style={{ padding: '5px 14px', borderRadius: 8, border: `1px solid ${cat === c ? G : 'rgba(255,255,255,0.06)'}`, background: cat === c ? 'rgba(201,168,76,0.15)' : '#111120', color: cat === c ? G : '#6b6880', cursor: 'pointer', fontSize: 13, textTransform: 'capitalize' }}>
            {c}
          </button>
        ))}
      </div>

      {filtered.map(l => <LawyerCard key={l.id} l={l} />)}
    </div>
  );
}