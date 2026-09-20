// DictionaryPage.jsx — Legal Dictionary with proper multilingual support
import { useState } from 'react';
import { BookMarked, Search, Volume2, VolumeX, Loader2, Globe } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useVoice } from '../hooks/useVoice';
import toast from 'react-hot-toast';

const G = '#c9a84c', GL = '#f0d080', MUTED = '#6b6880', TEXT = '#e8e4d8';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const LANGUAGES = [
  { code: 'en', label: 'English',    flag: '🇬🇧', native: 'English' },
  { code: 'hi', label: 'हिंदी',      flag: '🇮🇳', native: 'Hindi' },
  { code: 'ta', label: 'தமிழ்',      flag: '🇮🇳', native: 'Tamil' },
  { code: 'te', label: 'తెలుగు',     flag: '🇮🇳', native: 'Telugu' },
  { code: 'kn', label: 'ಕನ್ನಡ',      flag: '🇮🇳', native: 'Kannada' },
  { code: 'ml', label: 'മലയാളം',     flag: '🇮🇳', native: 'Malayalam' },
  { code: 'mr', label: 'मराठी',      flag: '🇮🇳', native: 'Marathi' },
  { code: 'bn', label: 'বাংলা',      flag: '🇮🇳', native: 'Bengali' },
  { code: 'gu', label: 'ગુજરાતી',    flag: '🇮🇳', native: 'Gujarati' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ',     flag: '🇮🇳', native: 'Punjabi' },
  { code: 'ur', label: 'اردو',       flag: '🇮🇳', native: 'Urdu' },
];

const LANG_NAMES = {
  en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu',
  kn: 'Kannada', ml: 'Malayalam', mr: 'Marathi', bn: 'Bengali',
  gu: 'Gujarati', pa: 'Punjabi', ur: 'Urdu',
};

const COMMON_TERMS = [
  'Bail', 'FIR', 'Chargesheet', 'Cognizance', 'Remand', 'Anticipatory Bail',
  'Habeas Corpus', 'Writ Petition', 'Summons', 'Warrant', 'Acquittal', 'Conviction',
  'Affidavit', 'Injunction', 'Stay Order', 'Lok Adalat', 'PIL', 'CrPC',
  'BNS', 'Vakalatnama', 'Deposition', 'Chargesheet', 'Arbitration', 'Contempt of Court',
];

const LOCAL_DEFINITIONS = {
  bail: 'Bail is the temporary release of an accused person while the case continues, usually subject to conditions set by the court.',
  fir: 'An FIR, or First Information Report, is recorded by police when they receive information about a cognizable offence. It starts the investigation.',
  chargesheet: 'A chargesheet is the police report filed after investigation. It describes the alleged offence, evidence, and accused persons.',
  cognizance: 'Cognizance means that a court has formally taken notice of an alleged offence and may begin considering the case.',
  remand: 'Remand is a court order allowing an accused person to remain in police or judicial custody during investigation or proceedings.',
  'anticipatory bail': 'Anticipatory bail is protection granted by a court to a person who expects arrest. It allows release on bail if arrested, subject to conditions.',
  'habeas corpus': 'Habeas corpus is a court remedy used to require authorities to produce a detained person and justify the detention.',
  summons: 'A summons is an official notice directing a person to appear before a court or provide information on a specified date.',
  warrant: 'A warrant is a written court order authorising an arrest, search, or another specified legal action.',
  acquittal: 'Acquittal is a court finding that the prosecution did not prove the charge to the required legal standard.',
  conviction: 'Conviction is a court finding that an accused person is guilty after the evidence and law are considered.',
  affidavit: 'An affidavit is a written statement of facts confirmed by oath or affirmation and signed before an authorised person.',
  injunction: 'An injunction is a court order requiring someone to do something or stop doing something while a dispute is decided.',
  'stay order': 'A stay order temporarily pauses a court case, order, action, or proceeding until the court gives further directions.',
  'lok adalat': 'Lok Adalat is a settlement forum where disputes can be resolved through compromise. Its settlement award is generally final and binding.',
  pil: 'A Public Interest Litigation allows a person or group to ask a court to protect a public interest or the rights of people unable to approach the court themselves.',
  crpc: 'The Code of Criminal Procedure, or CrPC, was the main law governing criminal procedure in India before the BNSS came into force.',
  bns: 'The Bharatiya Nyaya Sanhita, or BNS, is India\'s current principal criminal law replacing the Indian Penal Code for offences covered by it.',
  vakalatnama: 'A vakalatnama is the document by which a client authorises an advocate to represent them in a legal matter.',
  deposition: 'A deposition is testimony given by a witness, usually recorded formally for use in legal proceedings.',
  arbitration: 'Arbitration is a private dispute-resolution process where an appointed arbitrator hears both sides and gives a decision.',
  'contempt of court': 'Contempt of court is conduct that disobeys a court order or interferes with the authority or administration of justice.',
};

const LOCAL_TRANSLATIONS = {
  fir: {
    en: 'An FIR, or First Information Report, is recorded by police when they receive information about a cognizable offence. It starts the investigation.',
    hi: 'एफआईआर या प्रथम सूचना रिपोर्ट तब पुलिस द्वारा दर्ज की जाती है जब उसे किसी संज्ञेय अपराध की जानकारी मिलती है। इससे जांच शुरू होती है।',
    ta: 'FIR அல்லது முதல் தகவல் அறிக்கை என்பது ஒரு அறியக்கூடிய குற்றம் குறித்து காவல்துறைக்கு தகவல் கிடைக்கும்போது பதிவு செய்யப்படும் அறிக்கையாகும். இதன் மூலம் விசாரணை தொடங்குகிறது.',
    te: 'FIR లేదా మొదటి సమాచార నివేదిక అనేది గుర్తించదగిన నేరం గురించి పోలీసులకు సమాచారం అందినప్పుడు నమోదు చేయబడుతుంది. దీనితో దర్యాప్తు ప్రారంభమవుతుంది.',
    bn: 'এফআইআর বা প্রথম তথ্য প্রতিবেদন হলো কোনো আমলযোগ্য অপরাধের খবর পেলে পুলিশের নথিভুক্ত করা প্রতিবেদন। এর মাধ্যমে তদন্ত শুরু হয়।',
    mr: 'एफआयआर किंवा प्रथम माहिती अहवाल हा पोलिसांना दखलपात्र गुन्ह्याची माहिती मिळाल्यावर नोंदवला जातो. यामुळे तपास सुरू होतो.',
    gu: 'FIR અથવા પ્રથમ માહિતી અહેવાલ પોલીસને કોગ્નિઝેબલ ગુનાની માહિતી મળ્યા પછી નોંધવામાં આવે છે. તેનાથી તપાસ શરૂ થાય છે.',
    kn: 'FIR ಅಥವಾ ಪ್ರಥಮ ಮಾಹಿತಿ ವರದಿಯನ್ನು ಪೊಲೀಸರು ಗಮನಾರ್ಹ ಅಪರಾಧದ ಮಾಹಿತಿ ಪಡೆದಾಗ ದಾಖಲಿಸುತ್ತಾರೆ. ಇದರಿಂದ ತನಿಖೆ ಆರಂಭವಾಗುತ್ತದೆ.',
    ml: 'FIR അഥവാ ആദ്യ വിവര റിപ്പോർട്ട്, തിരിച്ചറിയാവുന്ന കുറ്റകൃത്യത്തെക്കുറിച്ച് പോലീസിന് വിവരം ലഭിക്കുമ്പോൾ രേഖപ്പെടുത്തുന്നതാണ്. ഇതിലൂടെ അന്വേഷണം ആരംഭിക്കുന്നു.',
  },
  bail: {
    ta: 'ஜாமீன் என்பது வழக்கு தொடரும் காலத்தில் குற்றம் சாட்டப்பட்ட நபரை நீதிமன்றம் விதிக்கும் நிபந்தனைகளுக்கு உட்பட்டு தற்காலிகமாக விடுதலை செய்வதாகும்.',
    hi: 'जमानत का अर्थ है कि मामला चलने के दौरान अदालत द्वारा लगाई गई शर्तों के अधीन आरोपी व्यक्ति को अस्थायी रूप से रिहा करना।',
  },
};

function localDefinition(term, lang) {
  return LOCAL_TRANSLATIONS[term.toLowerCase()]?.[lang]
    || LOCAL_DEFINITIONS[term.toLowerCase()]
    || `This term relates to Indian legal procedure. For a precise explanation, consult a qualified lawyer or try again when the legal service is available.`;
}

async function lookupTerm(term, lang) {
  try {
    const res = await fetch(`${API_URL}/api/legal/explain-term`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ term, language: lang }),
    });
    if (!res.ok) throw new Error('API error');
    const d = await res.json();
    if (!d.explanation) throw new Error('No explanation');
    return d.explanation;
  } catch {
    return localDefinition(term, lang);
  }
}

export default function DictionaryPage() {
  const [searchTerm, setSearchTerm]   = useState('');
  const [targetLang, setTargetLang]   = useState('hi');
  const [results, setResults]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [speakingId, setSpeakingId]   = useState(null);
  const { speak, stopSpeaking }       = useVoice(targetLang);

  const currentLang = LANGUAGES.find(l => l.code === targetLang);

  const handleLookup = async (term, language = targetLang) => {
    const t = (term || searchTerm).trim();
    if (!t) { toast.error('Enter a legal term'); return; }
    setLoading(true);
    try {
      const explanation = await lookupTerm(t, language);
      setResults(prev => [
        { term: t, explanation, lang: language, id: Date.now() },
        ...prev.filter(r => !(r.term.toLowerCase() === t.toLowerCase() && r.lang === language)).slice(0, 9),
      ]);
      setSearchTerm('');
    } catch {
      toast.error('Could not look up term.');
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (result) => {
    if (speakingId === result.id) {
      stopSpeaking();
      setSpeakingId(null);
    } else {
      stopSpeaking();
      setSpeakingId(result.id);
      speak(result.explanation, result.lang);
    }
  };

  const handleLangChange = (code) => {
    const currentTerm = results[0]?.term;
    setTargetLang(code);
    stopSpeaking();
    setSpeakingId(null);
    if (currentTerm) {
      handleLookup(currentTerm, code);
    } else {
      setResults([]);
    }
    toast(`Language changed to ${LANG_NAMES[code]}`, { icon: '🌐', duration: 1800 });
  };

  return (
    <div>
      <PageHeader icon="📖" title="Legal Dictionary" subtitle="Legal jargon explained in your language — AI-powered" />

      {/* Language Selector — PROMINENT at top */}
      <div style={{ background: 'linear-gradient(135deg,rgba(201,168,76,0.08),rgba(201,168,76,0.03))', border: `1px solid rgba(201,168,76,0.25)`, borderRadius: 16, padding: 20, marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Globe size={18} color={G} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>Choose Your Language</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>
              Explanation will appear in <strong style={{ color: G }}>{currentLang?.label} ({currentLang?.native})</strong>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLangChange(lang.code)}
              style={{
                padding: '9px 16px',
                borderRadius: 11,
                fontSize: 14,
                fontWeight: targetLang === lang.code ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: targetLang === lang.code
                  ? `linear-gradient(135deg,${G},${GL})`
                  : '#16162a',
                border: `1.5px solid ${targetLang === lang.code ? G : 'rgba(255,255,255,0.08)'}`,
                color: targetLang === lang.code ? '#0a0808' : TEXT,
                boxShadow: targetLang === lang.code ? `0 4px 14px rgba(201,168,76,0.3)` : 'none',
                transform: targetLang === lang.code ? 'scale(1.05)' : 'scale(1)',
              }}
              onMouseEnter={e => { if (targetLang !== lang.code) { e.currentTarget.style.borderColor = `${G}60`; e.currentTarget.style.color = G; }}}
              onMouseLeave={e => { if (targetLang !== lang.code) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = TEXT; }}}
            >
              {lang.flag} {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Box */}
      <div style={{ background: '#111120', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 18, marginBottom: 18 }}>
        <div style={{ fontSize: 11, color: G, fontFamily: 'JetBrains Mono,monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10, fontWeight: 700 }}>
          Search Legal Term → Get explanation in {currentLang?.label}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLookup()}
            placeholder={`Type any legal term... e.g. Bail, FIR, Habeas Corpus`}
            style={{
              flex: 1,
              background: '#0a0a12',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              color: TEXT,
              fontFamily: 'DM Sans,sans-serif',
              fontSize: 14,
              padding: '12px 14px',
              outline: 'none',
            }}
          />
          <button
            onClick={() => handleLookup()}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '12px 22px', borderRadius: 10,
              background: `linear-gradient(135deg,${G},${GL})`,
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              color: '#0a0808', fontWeight: 700, fontSize: 14,
              opacity: loading ? 0.6 : 1, whiteSpace: 'nowrap',
            }}
          >
            {loading
              ? <Loader2 size={15} style={{ animation: 'dictSpin 0.8s linear infinite' }} />
              : <Search size={15} />}
            {loading ? `Translating...` : `Look Up in ${currentLang?.label}`}
          </button>
        </div>
      </div>

      {/* Common Terms */}
      <div style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 11, color: MUTED, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Tap any term — explained instantly in <span style={{ color: G }}>{currentLang?.label}</span>:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {COMMON_TERMS.map(term => (
            <button
              key={term}
              onClick={() => handleLookup(term)}
              style={{
                fontSize: 12, padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
                transition: 'all 0.15s', background: '#16162a',
                border: '1px solid rgba(42,42,62,1)', color: MUTED,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${G}50`; e.currentTarget.style.color = G; e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(42,42,62,1)'; e.currentTarget.style.color = MUTED; e.currentTarget.style.background = '#16162a'; }}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes dictSpin { to { transform: rotate(360deg); } }
        @keyframes dictSlideUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '30px 20px', color: MUTED }}>
          <div style={{ width: 30, height: 30, border: `2px solid rgba(201,168,76,0.2)`, borderTopColor: G, borderRadius: '50%', animation: 'dictSpin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ fontSize: 13 }}>Getting explanation in <strong style={{ color: G }}>{currentLang?.label}</strong>...</p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {results.map(result => {
            const resLang = LANGUAGES.find(l => l.code === result.lang);
            const isThisSpeaking = speakingId === result.id;
            return (
              <div
                key={result.id}
                style={{
                  background: '#111120',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14, padding: 20,
                  animation: 'dictSlideUp 0.25s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, gap: 10 }}>
                  <div>
                    <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 20, fontWeight: 700, color: G, marginBottom: 4 }}>
                      {result.term}
                    </h3>
                    <span style={{
                      fontSize: 11, padding: '3px 10px', borderRadius: 20,
                      background: 'rgba(201,168,76,0.12)', color: G,
                      border: `1px solid rgba(201,168,76,0.3)`,
                      fontFamily: 'JetBrains Mono,monospace',
                    }}>
                      {resLang?.flag} {resLang?.label}
                    </span>
                  </div>
                  <button
                    onClick={() => handleSpeak(result)}
                    title={isThisSpeaking ? 'Stop speaking' : `Listen in ${resLang?.label}`}
                    style={{
                      padding: '8px 14px', borderRadius: 9, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 6, fontSize: 12,
                      background: isThisSpeaking ? 'rgba(232,92,92,0.12)' : 'rgba(201,168,76,0.08)',
                      border: `1px solid ${isThisSpeaking ? 'rgba(232,92,92,0.4)' : 'rgba(201,168,76,0.25)'}`,
                      color: isThisSpeaking ? '#e85c5c' : G,
                      flexShrink: 0,
                    }}
                  >
                    {isThisSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    {isThisSpeaking ? 'Stop' : 'Listen'}
                  </button>
                </div>
                <p style={{ fontSize: 14, color: 'rgba(232,228,216,0.88)', lineHeight: 1.8 }}>
                  {result.explanation}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {results.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: MUTED }}>
          <BookMarked size={44} style={{ margin: '0 auto 14px', opacity: 0.2, display: 'block' }} />
          <p style={{ fontSize: 14, marginBottom: 6 }}>
            Select a language above, then search any legal term
          </p>
          <p style={{ fontSize: 12, opacity: 0.6 }}>
            Currently set to: <strong style={{ color: G }}>{currentLang?.flag} {currentLang?.label}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
