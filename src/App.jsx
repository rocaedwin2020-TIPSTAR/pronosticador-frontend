import React, { useState, useEffect } from "react";

const BACKEND = "https://pronosticador-backend.vercel.app";

// ─── PLAYER DATABASE ───────────────────────────────────────────────────────
const ATP = [
  { name: "Jannik Sinner", ranking: 1, flag: "🇮🇹", hand: "Derecho" },
  { name: "Carlos Alcaraz", ranking: 2, flag: "🇪🇸", hand: "Derecho" },
  { name: "Alexander Zverev", ranking: 3, flag: "🇩🇪", hand: "Derecho" },
  { name: "Novak Djokovic", ranking: 4, flag: "🇷🇸", hand: "Derecho" },
  { name: "Casper Ruud", ranking: 5, flag: "🇳🇴", hand: "Derecho" },
  { name: "Taylor Fritz", ranking: 6, flag: "🇺🇸", hand: "Derecho" },
  { name: "Daniil Medvedev", ranking: 7, flag: "🇷🇺", hand: "Derecho" },
  { name: "Andrey Rublev", ranking: 8, flag: "🇷🇺", hand: "Derecho" },
  { name: "Hubert Hurkacz", ranking: 9, flag: "🇵🇱", hand: "Derecho" },
  { name: "Alex de Minaur", ranking: 10, flag: "🇦🇺", hand: "Derecho" },
  { name: "Tommy Paul", ranking: 11, flag: "🇺🇸", hand: "Derecho" },
  { name: "Holger Rune", ranking: 12, flag: "🇩🇰", hand: "Derecho" },
  { name: "Stefanos Tsitsipas", ranking: 13, flag: "🇬🇷", hand: "Derecho" },
  { name: "Grigor Dimitrov", ranking: 14, flag: "🇧🇬", hand: "Derecho" },
  { name: "Ben Shelton", ranking: 15, flag: "🇺🇸", hand: "Zurdo" },
  { name: "Frances Tiafoe", ranking: 16, flag: "🇺🇸", hand: "Derecho" },
  { name: "Ugo Humbert", ranking: 17, flag: "🇫🇷", hand: "Zurdo" },
  { name: "Arthur Fils", ranking: 18, flag: "🇫🇷", hand: "Derecho" },
  { name: "Felix Auger-Aliassime", ranking: 19, flag: "🇨🇦", hand: "Derecho" },
  { name: "Lorenzo Musetti", ranking: 20, flag: "🇮🇹", hand: "Derecho" },
  { name: "Otro / Manual", ranking: 0, flag: "🎾", hand: "" },
];

const WTA = [
  { name: "Aryna Sabalenka", ranking: 1, flag: "🇧🇾", hand: "Derecho" },
  { name: "Iga Swiatek", ranking: 2, flag: "🇵🇱", hand: "Derecho" },
  { name: "Coco Gauff", ranking: 3, flag: "🇺🇸", hand: "Derecho" },
  { name: "Jessica Pegula", ranking: 4, flag: "🇺🇸", hand: "Derecho" },
  { name: "Qinwen Zheng", ranking: 5, flag: "🇨🇳", hand: "Derecho" },
  { name: "Elena Rybakina", ranking: 6, flag: "🇰🇿", hand: "Derecho" },
  { name: "Emma Navarro", ranking: 7, flag: "🇺🇸", hand: "Derecho" },
  { name: "Daria Kasatkina", ranking: 8, flag: "🇷🇺", hand: "Derecho" },
  { name: "Mirra Andreeva", ranking: 9, flag: "🇷🇺", hand: "Derecho" },
  { name: "Paula Badosa", ranking: 10, flag: "🇪🇸", hand: "Derecho" },
  { name: "Jasmine Paolini", ranking: 12, flag: "🇮🇹", hand: "Derecho" },
  { name: "Madison Keys", ranking: 15, flag: "🇺🇸", hand: "Derecho" },
  { name: "Otro / Manual", ranking: 0, flag: "🎾", hand: "" },
];

const STRENGTHS = ["Primer saque potente","Segundo saque sólido","Gran retorno","Derecha poderosa","Revés con topspin","Juego de red","Fondo de cancha sólido","Velocidad en pista","Resistencia física","Fortaleza mental","Gran tiebreak","Domina arcilla","Domina pista dura","Domina hierba"];
const WEAKNESSES = ["Segundo saque débil","Dobles faltas frecuentes","Revés inconsistente","Bajo % break points","Inicio lento","Presión en puntos clave","Baja forma física","Lesión reciente","Débil en arcilla","Débil en pista rápida"];
const FORM_OPTS = ["🔥 Excelente (4-1/5-0)","✅ Buena (3-2)","⚠️ Regular (2-3)","❌ Mala (0-5/1-4)"];
const SURF_OPTS = ["👑 Dominante","✅ Bueno","⚠️ Regular","❌ Débil"];
const ROUNDS = ["1R","2R","3R","4R","Cuartos","Semis","Final"];
const PICK_TYPES = ["⭐ Mejor del Día","🔗 Combinada","🐴 Underdog","🧠 Análisis Propio"];

const emptyP = () => ({ name:"", ranking:"", hand:"", form:"", surfacePerf:"", strengths:[], weaknesses:[], injury:"", momentum:"" });
const emptyMLB = () => ({ team:"", record:"", pitcher:"", pitcherEra:"", bullpenRating:"", recentForm:"" });

const G = "#16a34a", GD = "#15803d";

// ─── AI CALL VIA BACKEND ───────────────────────────────────────────────────
const callAI = async (prompt) => {
  const res = await fetch(`${BACKEND}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  return data.text || data.texto || data.error || "Sin respuesta";
};

export default function App() {
  useEffect(() => { fetch(`${BACKEND}/`).catch(() => {}); }, []);

  const [tab, setTab] = useState("hoy");
  const [sport, setSport] = useState("mlb");

  // Tennis state
  const [tour, setTour] = useState("ATP");
  const [tournament, setTournament] = useState("");
  const [surface, setSurface] = useState("");
  const [round, setRound] = useState("");
  const [p1, setP1] = useState(emptyP());
  const [p2, setP2] = useState(emptyP());
  const [h2h, setH2H] = useState({ total:"", p1Wins:"", recentFavor:"" });
  const [p1Manual, setP1Manual] = useState(false);
  const [p2Manual, setP2Manual] = useState(false);
  const [oddsP1, setOddsP1] = useState("");
  const [oddsP2, setOddsP2] = useState("");
  const [totalGames, setTotalGames] = useState("");
  const [loadingH2H, setLoadingH2H] = useState(false);
  const [h2hData, setH2HData] = useState(null);

  // MLB state
  const [mlbGames, setMlbGames] = useState([]);
  const [loadingMLB, setLoadingMLB] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [homeTeam, setHomeTeam] = useState(emptyMLB());
  const [awayTeam, setAwayTeam] = useState(emptyMLB());
  const [mlbOddsHome, setMlbOddsHome] = useState("");
  const [mlbOddsAway, setMlbOddsAway] = useState("");
  const [mlbTotal, setMlbTotal] = useState("");
  const [mlbOverOdds, setMlbOverOdds] = useState("");
  const [mlbUnderOdds, setMlbUnderOdds] = useState("");

  // AI results
  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [sectionResult, setSectionResult] = useState({});
  const [loadingSection, setLoadingSection] = useState({});

  // Bankroll
  const [banca, setBanca] = useState("");
  const [bancaSet, setBancaSet] = useState(false);
  const [bets, setBets] = useState([]);
  const [newBet, setNewBet] = useState({ partido:"", pick:"", momio:"", monto:"", tipo:"", sport:"", resultado:"" });

  // ─── AUTO-LOAD MLB WHEN ENTERING HOY TAB WITH MLB SELECTED ───────────────
  useEffect(() => {
    if (sport === "mlb" && mlbGames.length === 0 && !loadingMLB) {
      fetchMLBGames();
    }
  }, [sport, tab]);

  const selectPlayer = (which, name) => {
    const db = tour === "ATP" ? ATP : WTA;
    const found = db.find(p => p.name === name);
    const isManual = name === "Otro / Manual";
    if (which === 1) {
      setP1Manual(isManual);
      setP1(p => ({ ...p, name: isManual ? "" : name, ranking: found?.ranking ? String(found.ranking) : "", hand: found?.hand || "" }));
    } else {
      setP2Manual(isManual);
      setP2(p => ({ ...p, name: isManual ? "" : name, ranking: found?.ranking ? String(found.ranking) : "", hand: found?.hand || "" }));
    }
  };

  const toggle = (setter, field, val) =>
    setter(p => ({ ...p, [field]: p[field].includes(val) ? p[field].filter(x => x !== val) : [...p[field], val] }));

  const fetchH2H = async () => {
    if (!p1.name || !p2.name) return;
    setLoadingH2H(true); setH2HData(null);
    try {
      const res = await fetch(`${BACKEND}/api/h2h?player1=${encodeURIComponent(p1.name)}&player2=${encodeURIComponent(p2.name)}`);
      const data = await res.json();
      if (data?.success && data.h2h) {
        const h = data.h2h;
        setH2HData(h);
        setH2H({ total: h.total || h.matches_played || "", p1Wins: h.player1_wins || h.p1_wins || "", recentFavor: h.recent_winner || "" });
      }
    } catch {}
    setLoadingH2H(false);
  };

  const fetchMLBGames = async () => {
    setLoadingMLB(true);
    try {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const res = await fetch(`https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${dateStr}&hydrate=probablePitcher(note),linescore,team,weather,venue`);
      const data = await res.json();
      const games = [];
      (data.dates || []).forEach(date => {
        (date.games || []).forEach(game => {
          const home = game.teams?.home;
          const away = game.teams?.away;
          const weather = game.weather || {};
          const gameTime = game.gameDate;
          let timeMex = "";
          let madrugada = false;
          if (gameTime) {
            const d = new Date(gameTime);
            timeMex = d.toLocaleTimeString("es-MX", { timeZone: "America/Mexico_City", hour: "2-digit", minute: "2-digit", hour12: false });
            const h = parseInt(d.toLocaleString("es-MX", { timeZone: "America/Mexico_City", hour: "numeric", hour12: false }));
            madrugada = h >= 0 && h < 7;
          }
          const windStr = weather.wind || "";
          const windMph = parseInt(windStr.match(/(\d+)/)?.[1] || "0");
          const windOut = windStr.toLowerCase().includes("out");
          const windIn = windStr.toLowerCase().includes("in");
          let windBetting = "🟢 Viento neutro";
          if (windMph >= 15 && windOut) windBetting = "🔴 Viento AFUERA — favorece ALTAS";
          else if (windMph >= 15 && windIn) windBetting = "🔵 Viento ADENTRO — favorece BAJAS";
          else if (windMph >= 10 && windOut) windBetting = "🟡 Viento afuera moderado";
          games.push({
            id: game.gamePk,
            home_team: home?.team?.name || "",
            away_team: away?.team?.name || "",
            home_record: `${home?.leagueRecord?.wins||0}-${home?.leagueRecord?.losses||0}`,
            away_record: `${away?.leagueRecord?.wins||0}-${away?.leagueRecord?.losses||0}`,
            home_pitcher: home?.probablePitcher?.fullName || "Por confirmar",
            home_pitcher_note: home?.probablePitcher?.note || "",
            away_pitcher: away?.probablePitcher?.fullName || "Por confirmar",
            away_pitcher_note: away?.probablePitcher?.note || "",
            venue: game.venue?.name || "",
            time_mexico: timeMex,
            madrugada,
            weather: { condition: weather.condition||"", temp: weather.temp||"", wind: windStr, wind_mph: windMph, wind_betting: windBetting },
          });
        });
      });
      setMlbGames(games);
    } catch(e) { setMlbGames([]); }
    setLoadingMLB(false);
  };

  const selectMLBGame = (game) => {
    setSelectedGame(game);
    setHomeTeam(p => ({ ...p, team: game.home_team, record: game.home_record, pitcher: game.home_pitcher, pitcherEra: game.home_pitcher_note }));
    setAwayTeam(p => ({ ...p, team: game.away_team, record: game.away_record, pitcher: game.away_pitcher, pitcherEra: game.away_pitcher_note }));
  };

  // ─── PROMPTS ──────────────────────────────────────────────────────────────
  const buildTennisPrompt = () => `Eres analista experto en apuestas de tenis temporada 2026.
PARTIDO: ${p1.name} (#${p1.ranking}) vs ${p2.name} (#${p2.ranking})
TORNEO: ${tournament} | SUPERFICIE: ${surface} | RONDA: ${round}
JUGADOR 1: Forma: ${p1.form} | Superficie: ${p1.surfacePerf} | Lesión: ${p1.injury||"Ninguna"} | Fortalezas: ${p1.strengths.join(", ")||"N/A"} | Debilidades: ${p1.weaknesses.join(", ")||"N/A"}
JUGADOR 2: Forma: ${p2.form} | Superficie: ${p2.surfacePerf} | Lesión: ${p2.injury||"Ninguna"} | Fortalezas: ${p2.strengths.join(", ")||"N/A"} | Debilidades: ${p2.weaknesses.join(", ")||"N/A"}
H2H: ${h2h.total||"?"} partidos | ${p1.name} ganó ${h2h.p1Wins||"?"} | Recientes: ${h2h.recentFavor||"N/A"}
CUOTAS: ${p1.name}@${oddsP1||"N/A"} | ${p2.name}@${oddsP2||"N/A"} | Total juegos: ${totalGames||"N/A"}

Da análisis completo: duelo táctico, ventaja en superficie, forma actual, lectura de cuotas, y pronóstico con mercado exacto y justificación.`;

  const buildMLBPrompt = () => {
    const game = selectedGame;
    return `Eres analista MLB temporada 2026.
PARTIDO: ${awayTeam.team} (${awayTeam.record}) @ ${homeTeam.team} (${homeTeam.record})
ESTADIO: ${game?.venue||"N/A"} | HORA MX: ${game?.time_mexico||"N/A"}
VIENTO: ${game?.weather?.wind||"N/A"} — ${game?.weather?.wind_betting||""}
PITCHER LOCAL: ${homeTeam.pitcher} | ERA: ${homeTeam.pitcherEra||"N/A"} | Forma: ${homeTeam.recentForm||"N/A"} | Bullpen: ${homeTeam.bullpenRating||"N/A"}
PITCHER VISITANTE: ${awayTeam.pitcher} | ERA: ${awayTeam.pitcherEra||"N/A"} | Forma: ${awayTeam.recentForm||"N/A"} | Bullpen: ${awayTeam.bullpenRating||"N/A"}
CUOTAS: Local ${mlbOddsHome||"N/A"} | Visitante ${mlbOddsAway||"N/A"} | Total ${mlbTotal||"N/A"} (Over@${mlbOverOdds||"N/A"} / Under@${mlbUnderOdds||"N/A"})

Da análisis: duelo pitchers, viento, bullpen, lectura cuotas. Pronóstico: ganador, total carreras, run line, underdog con valor, mejor apuesta del partido.`;
  };

  const buildSectionPrompt = (type, sportType) => {
    const typeLabels = {
      mejordia: "LA MEJOR APUESTA INDIVIDUAL DEL DÍA — prioriza cuotas de 1.60 o superior con alta confianza",
      combinada: "UNA COMBINADA DEL DÍA de 2-3 picks — cuota combinada mínima 2.0, prioriza picks con cuota individual 1.60+",
      underdog: "2-3 UNDERDOGS DEL DÍA — solo underdogs con cuota 2.0 o superior donde el favorito está sobrevalorado",
    };

    if (sportType === "mlb" && mlbGames.length > 0) {
      const gameList = mlbGames.slice(0, 10).map((g, i) =>
        `${i+1}. ${g.away_team} (${g.away_record}) @ ${g.home_team} (${g.home_record}) | Pitchers: ${g.away_pitcher} vs ${g.home_pitcher} | ${g.time_mexico} MX | Viento: ${g.weather?.wind_betting||"neutro"} | Estadio: ${g.venue}`
      ).join("\n");

      return `Eres analista experto en apuestas MLB temporada 2026. Con estos juegos de hoy, da ${typeLabels[type]}.

JUEGOS DE HOY:
${gameList}

REGLAS DE CUOTAS:
- Mejor apuesta del día: cuota mínima 1.60
- Combinada: cada pick mínimo 1.60, cuota total mínima 2.0
- Underdogs: cuota mínima 2.0 por pick

Da picks DIRECTAMENTE. Para cada pick: partido, mercado exacto (moneyline/total/run line), selección, cuota estimada, justificación 1-2 líneas basada en pitchers, viento y datos 2026. Al final: cuota total y nivel de confianza.`;
    }

    if (sportType === "tennis") {
      return `Eres analista experto en apuestas de tenis ATP/WTA temporada 2026. Da ${typeLabels[type]}.

Analiza los partidos más importantes de hoy. Considera: ranking y forma 2026, superficie, lesiones conocidas, cuotas de mercado.

REGLAS DE CUOTAS:
- Mejor apuesta del día: cuota mínima 1.60
- Combinada: cada pick mínimo 1.60, cuota total mínima 2.0
- Underdogs: cuota mínima 2.0 por pick

Da picks DIRECTAMENTE sin disclaimers. Para cada pick: partido, mercado, selección, cuota estimada, justificación 1-2 líneas. Al final: cuota total y nivel de confianza.`;
    }

    return `Eres analista de apuestas deportivas 2026. Da ${typeLabels[type]} mezclando tenis y MLB.

REGLAS: Mejor apuesta 1.60+, Combinada picks 1.60+ y total 2.0+, Underdogs 2.0+ cada uno.

Da picks directamente con deporte, partido, mercado, selección, cuota estimada y justificación breve.`;
  };

  const runAnalysis = async () => {
    const prompt = sport === "tennis" ? buildTennisPrompt() : buildMLBPrompt();
    setLoadingAnalysis(true); setAnalysis(null);
    try {
      const text = await callAI(prompt);
      setAnalysis(text);
    } catch { setAnalysis("❌ Error de conexión."); }
    setLoadingAnalysis(false);
  };

  const runSection = async (type, sportType) => {
    const key = `${type}_${sportType}`;
    setLoadingSection(l => ({ ...l, [key]: true }));
    setSectionResult(r => ({ ...r, [key]: null }));
    try {
      const text = await callAI(buildSectionPrompt(type, sportType));
      setSectionResult(r => ({ ...r, [key]: text }));
    } catch { setSectionResult(r => ({ ...r, [key]: "❌ Error de conexión." })); }
    setLoadingSection(l => ({ ...l, [key]: false }));
  };

  const addBet = () => {
    if (!newBet.partido || !newBet.pick || !newBet.momio || !newBet.monto) return;
    setBets(b => [...b, { ...newBet, id: Date.now() }]);
    setNewBet({ partido:"", pick:"", momio:"", monto:"", tipo:"", sport:"", resultado:"" });
  };
  const markResult = (id, resultado) => setBets(b => b.map(x => x.id === id ? { ...x, resultado } : x));

  const calcStats = () => {
    const finished = bets.filter(b => b.resultado);
    const won = bets.filter(b => b.resultado === "ganada");
    const lost = bets.filter(b => b.resultado === "perdida");
    const ganado = won.reduce((s, b) => s + (parseFloat(b.monto) * parseFloat(b.momio) - parseFloat(b.monto)), 0);
    const perdido = lost.reduce((s, b) => s + parseFloat(b.monto), 0);
    const profit = ganado - perdido;
    const bancaActual = (parseFloat(banca) || 0) + profit;
    const totalApostado = finished.reduce((s, b) => s + parseFloat(b.monto), 0);
    const roi = totalApostado > 0 ? ((profit / totalApostado) * 100).toFixed(1) : "0";
    const pct = finished.length > 0 ? ((won.length / finished.length) * 100).toFixed(0) : "0";
    return { won: won.length, lost: lost.length, profit, bancaActual, roi, pct };
  };

  const renderMd = (text) => text.split("\n").map((line, i) => {
    if (line.startsWith("## ")) return <h2 key={i} style={{ fontFamily:"'Oswald',sans-serif", fontSize:17, fontWeight:600, color:GD, marginTop:18, marginBottom:8, letterSpacing:1 }}>{line.slice(3)}</h2>;
    if (line.startsWith("### ")) return <h3 key={i} style={{ fontSize:14, fontWeight:700, color:"#111", marginTop:12, marginBottom:5 }}>{line.slice(4)}</h3>;
    if (line === "---") return <hr key={i} style={{ border:"none", borderTop:"1px solid #eee", margin:"12px 0" }} />;
    if (!line.trim()) return <div key={i} style={{ height:5 }} />;
    const parts = line.split(/\*\*(.*?)\*\*/g);
    if (parts.length > 1) return <p key={i} style={{ fontSize:14, lineHeight:1.65, color:"#333", marginBottom:3 }}>{parts.map((p,j) => j%2===1 ? <strong key={j} style={{ color:GD }}>{p}</strong> : p)}</p>;
    return <p key={i} style={{ fontSize:14, lineHeight:1.65, color:"#333", marginBottom:3 }}>{line}</p>;
  });

  // ─── COMPONENTS ───────────────────────────────────────────────────────────
  const Chip = ({ label, active, onClick, sm }) => (
    <button onClick={onClick} style={{ padding: sm ? "4px 8px" : "6px 12px", borderRadius:16, border:`1px solid ${active ? G : "#ddd"}`, background: active ? G : "#fff", color: active ? "#fff" : "#555", cursor:"pointer", fontSize: sm ? 11 : 12, fontWeight:500, marginBottom:4 }}>{label}</button>
  );

  const Card = ({ children, style }) => (
    <div style={{ background:"#fff", borderRadius:10, padding:"18px 20px", marginBottom:16, boxShadow:"0 1px 4px rgba(0,0,0,.07)", ...style }}>{children}</div>
  );

  const SectionHead = ({ children }) => (
    <div style={{ fontFamily:"'Oswald',sans-serif", fontSize:16, fontWeight:600, letterSpacing:1.5, color:GD, marginBottom:14, paddingBottom:10, borderBottom:`2px solid #dcfce7` }}>{children}</div>
  );

  const GreenBtn = ({ children, onClick, disabled, style }) => (
    <button onClick={onClick} disabled={disabled} style={{ background:G, color:"#fff", border:"none", padding:"12px 28px", borderRadius:7, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"'Oswald',sans-serif", letterSpacing:1, opacity: disabled ? 0.6 : 1, ...style }}>{children}</button>
  );

  const LoadBox = ({ text }) => (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:14, padding:36, background:"#fff", borderRadius:10, marginBottom:16 }}>
      <div style={{ width:26, height:26, border:"3px solid #eee", borderTop:`3px solid ${G}`, borderRadius:"50%", animation:"spin .8s linear infinite" }} />
      <span style={{ color:"#888", fontSize:13 }}>{text}</span>
    </div>
  );

  const ResultBox = ({ result, title }) => result ? (
    <Card style={{ marginTop:16 }}>
      <SectionHead>📋 {title}</SectionHead>
      {renderMd(result)}
    </Card>
  ) : null;

  const TABS = [
    { id:"hoy", label:"🏠 Inicio" },
    { id:"analisis", label:"🔍 Análisis" },
    { id:"bankroll", label:"💰 Capital" },
  ];

  const stats = calcStats();

  return (
    <div style={{ minHeight:"100vh", background:"#f1f5f1", fontFamily:"'Source Sans 3',sans-serif", color:"#111" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        select,input,button,textarea { font-family:'Source Sans 3',sans-serif; }
        ::-webkit-scrollbar { width:5px; } ::-webkit-scrollbar-thumb { background:${G}; border-radius:3px; }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color:#aaa; }
        input:focus,select:focus { outline:2px solid ${G}; outline-offset:1px; }
        button:hover { opacity:0.88; }
      `}</style>

      {/* HEADER */}
      <div style={{ background:"#14532d" }}>
        <div style={{ maxWidth:1040, margin:"0 auto", padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ fontSize:28, background:G, borderRadius:"50%", width:46, height:46, display:"flex", alignItems:"center", justifyContent:"center" }}>🏆</div>
            <div>
              <div style={{ fontFamily:"'Oswald',sans-serif", fontSize:22, fontWeight:700, color:"#fff", letterSpacing:2 }}>PRONOSTICADOR AI</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.6)", letterSpacing:.5 }}>Tenis · MLB · Análisis con Inteligencia Artificial</div>
            </div>
          </div>
          <div style={{ background:"rgba(255,255,255,.1)", color:"#86efac", fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:20, letterSpacing:1 }}>● TEMPORADA 2026</div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background:"#166534", display:"flex", overflowX:"auto", borderBottom:"3px solid #14532d" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex:"0 0 auto", padding:"11px 18px", border:"none", background:"transparent", cursor:"pointer", fontSize:14, fontWeight:600, color: tab === t.id ? "#fff" : "rgba(255,255,255,.5)", fontFamily:"'Oswald',sans-serif", letterSpacing:1, borderBottom: tab === t.id ? "3px solid #4ade80" : "3px solid transparent", marginBottom:-3 }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth:1040, margin:"0 auto", padding:"20px 16px" }}>

        {/* ══ INICIO ══ */}
        {tab === "hoy" && (
          <div style={{ animation:"fadeUp .3s ease" }}>

            {/* Sport selector */}
            <Card>
              <SectionHead>🎯 SELECCIONA EL DEPORTE</SectionHead>
              <div style={{ display:"flex", gap:12 }}>
                {[["tennis","🎾 Tenis"],["mlb","⚾ MLB"]].map(([id,label]) => (
                  <button key={id} onClick={() => setSport(id)}
                    style={{ flex:1, padding:16, border:`2px solid ${sport===id ? G : "#ddd"}`, borderRadius:10, background: sport===id ? "#dcfce7" : "#fff", cursor:"pointer", fontFamily:"'Oswald',sans-serif", fontSize:20, fontWeight:700, color: sport===id ? G : "#888", letterSpacing:2 }}>
                    {label}
                  </button>
                ))}
              </div>
            </Card>

            {/* ── MLB HOY ── */}
            {sport === "mlb" && (
              <Card>
                <SectionHead>⚾ JUEGOS MLB DE HOY</SectionHead>
                <GreenBtn onClick={fetchMLBGames} disabled={loadingMLB} style={{ marginBottom:16 }}>
                  {loadingMLB ? "⏳ Cargando..." : "🔄 ACTUALIZAR JUEGOS"}
                </GreenBtn>
                {mlbGames.length === 0 && !loadingMLB && (
                  <div style={{ color:"#888", fontSize:13, padding:"12px 0" }}>Cargando juegos de hoy...</div>
                )}
                {mlbGames.map((g, i) => (
                  <div key={i}
                    style={{ border:`1px solid ${selectedGame?.id === g.id ? G : "#e8e8e8"}`, background: selectedGame?.id === g.id ? "#f0fdf4" : "#fafafa", borderRadius:8, padding:"12px 14px", marginBottom:8, cursor:"pointer" }}
                    onClick={() => selectMLBGame(g)}>
                    <div style={{ fontSize:11, fontWeight:700, color:"#888", letterSpacing:.5, textTransform:"uppercase", marginBottom:6 }}>
                      {g.venue} · {g.time_mexico} MX {g.madrugada ? "⚠️" : ""}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:6 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:15 }}>{g.away_team} <span style={{ fontSize:12, color:"#888" }}>({g.away_record})</span></div>
                        <div style={{ fontSize:12, color:"#666" }}>P: {g.away_pitcher}</div>
                      </div>
                      <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:800, color:G }}>@</div>
                      <div style={{ flex:1, textAlign:"right" }}>
                        <div style={{ fontWeight:700, fontSize:15 }}>{g.home_team} <span style={{ fontSize:12, color:"#888" }}>({g.home_record})</span></div>
                        <div style={{ fontSize:12, color:"#666" }}>P: {g.home_pitcher}</div>
                      </div>
                    </div>
                    {g.weather?.wind_betting && g.weather.wind_betting !== "🟢 Viento neutro" && (
                      <div style={{ fontSize:12, fontWeight:600, marginTop:4 }}>{g.weather.wind_betting}</div>
                    )}
                    {selectedGame?.id === g.id && (
                      <div style={{ marginTop:8, paddingTop:8, borderTop:"1px solid #dcfce7" }}>
                        <span style={{ background:G, color:"#fff", fontSize:11, fontWeight:700, padding:"3px 8px", borderRadius:4 }}>✓ SELECCIONADO — Ve a Análisis para pronóstico detallado</span>
                      </div>
                    )}
                  </div>
                ))}
              </Card>
            )}

            {/* ── PICKS DEL DÍA (MLB) ── integrado en Inicio ── */}
            {sport === "mlb" && (
              <div>
                {[
                  { key:"mejordia", icon:"⭐", title:"MEJOR APUESTA DEL DÍA", desc:"La apuesta individual con mayor valor. Cuota mínima 1.60." },
                  { key:"combinada", icon:"🔗", title:"COMBINADA DEL DÍA", desc:"2-3 picks seguros. Cada pick 1.60+, cuota total 2.0+." },
                  { key:"underdog", icon:"🐴", title:"UNDERDOGS DEL DÍA", desc:"Underdogs con valor real. Cuota mínima 2.0 cada uno." },
                ].map(({ key, icon, title, desc }) => {
                  const resultKey = `${key}_mlb`;
                  return (
                    <Card key={key}>
                      <SectionHead>{icon} {title}</SectionHead>
                      <p style={{ color:"#666", fontSize:13, marginBottom:14 }}>{desc}</p>
                      {mlbGames.length === 0 && !loadingMLB && (
                        <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:6, padding:"8px 12px", fontSize:13, color:"#92400e", marginBottom:12 }}>
                          ⏳ Esperando juegos MLB...
                        </div>
                      )}
                      <GreenBtn
                        onClick={() => runSection(key, "mlb")}
                        disabled={loadingSection[resultKey] || mlbGames.length === 0}>
                        {loadingSection[resultKey] ? "⚡ Analizando..." : `${icon} GENERAR ${title}`}
                      </GreenBtn>
                      {loadingSection[resultKey] && <LoadBox text="Analizando juegos MLB con IA..." />}
                      <ResultBox result={sectionResult[resultKey]} title={title} />
                    </Card>
                  );
                })}
              </div>
            )}

            {/* ── PICKS DEL DÍA (TENIS) ── integrado en Inicio ── */}
            {sport === "tennis" && (
              <div>
                {[
                  { key:"mejordia", icon:"⭐", title:"MEJOR APUESTA DEL DÍA", desc:"La apuesta individual con mayor valor. Cuota mínima 1.60." },
                  { key:"combinada", icon:"🔗", title:"COMBINADA DEL DÍA", desc:"2-3 picks seguros. Cada pick 1.60+, cuota total 2.0+." },
                  { key:"underdog", icon:"🐴", title:"UNDERDOGS DEL DÍA", desc:"Underdogs con valor real. Cuota mínima 2.0 cada uno." },
                ].map(({ key, icon, title, desc }) => {
                  const resultKey = `${key}_tennis`;
                  return (
                    <Card key={key}>
                      <SectionHead>{icon} {title} — TENIS</SectionHead>
                      <p style={{ color:"#666", fontSize:13, marginBottom:14 }}>{desc}</p>
                      <GreenBtn onClick={() => runSection(key, "tennis")} disabled={loadingSection[resultKey]}>
                        {loadingSection[resultKey] ? "⚡ Analizando..." : `${icon} GENERAR ${title}`}
                      </GreenBtn>
                      {loadingSection[resultKey] && <LoadBox text="Analizando tenis con IA..." />}
                      <ResultBox result={sectionResult[resultKey]} title={title} />
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Stats rápidas */}
            {bets.length > 0 && (
              <Card>
                <SectionHead>📊 MI RENDIMIENTO</SectionHead>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                  {[["✅ Ganadas", stats.won, "#4ade80"],["❌ Perdidas", stats.lost, "#f87171"],["🎯 Acierto", `${stats.pct}%`, "#facc15"],["📈 ROI", `${stats.roi}%`, parseFloat(stats.roi)>=0?"#4ade80":"#f87171"],["💰 Banca", `$${stats.bancaActual.toFixed(0)}`, "#fff"],["📊 Profit", `${stats.profit>=0?"+":""}$${stats.profit.toFixed(0)}`, stats.profit>=0?"#4ade80":"#f87171"]].map(([l,v,c]) => (
                    <div key={l} style={{ background:"#14532d", borderRadius:8, padding:"12px 14px" }}>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,.6)", marginBottom:4 }}>{l}</div>
                      <div style={{ fontFamily:"'Oswald',sans-serif", fontSize:20, fontWeight:700, color:c }}>{v}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ══ ANÁLISIS PARTIDO ══ */}
        {tab === "analisis" && (
          <div style={{ animation:"fadeUp .3s ease" }}>
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              {[["tennis","🎾 Tenis"],["mlb","⚾ MLB"]].map(([id,label]) => (
                <button key={id} onClick={() => setSport(id)}
                  style={{ padding:"8px 18px", border:`2px solid ${sport===id ? G : "#ddd"}`, borderRadius:20, background: sport===id ? "#dcfce7" : "#fff", cursor:"pointer", fontSize:13, fontWeight:700, color: sport===id ? G : "#888" }}>
                  {label}
                </button>
              ))}
            </div>

            {/* ── TENIS ── */}
            {sport === "tennis" && (
              <>
                <Card>
                  <SectionHead>🎾 CONFIGURAR PARTIDO</SectionHead>
                  <div style={{ display:"flex", gap:10, marginBottom:16 }}>
                    {["ATP","WTA"].map(t => (
                      <button key={t} onClick={() => { setTour(t); setP1(emptyP()); setP2(emptyP()); setP1Manual(false); setP2Manual(false); }}
                        style={{ flex:1, padding:11, border:`2px solid ${tour===t ? G : "#ddd"}`, borderRadius:8, background: tour===t ? "#dcfce7" : "#fff", cursor:"pointer", fontFamily:"'Oswald',sans-serif", fontSize:18, fontWeight:700, color: tour===t ? G : "#888" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:14 }}>
                    <div>
                      <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Torneo</label>
                      <input style={{ width:"100%", padding:"9px 12px", border:"1px solid #ddd", borderRadius:6, fontSize:13 }} value={tournament} onChange={e => setTournament(e.target.value)} placeholder="Ej: Roma ATP" />
                    </div>
                    <div>
                      <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Superficie</label>
                      <select style={{ width:"100%", padding:"9px 12px", border:"1px solid #ddd", borderRadius:6, fontSize:13, background:"#fff" }} value={surface} onChange={e => setSurface(e.target.value)}>
                        <option value="">— Seleccionar —</option>
                        <option>Arcilla</option><option>Pista Dura</option><option>Hierba</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Ronda</label>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                        {ROUNDS.map(r => <Chip key={r} label={r} active={round===r} onClick={() => setRound(r)} sm />)}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <SectionHead>👤 JUGADORES</SectionHead>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                    {[[p1,setP1,1,p1Manual,setP1Manual],[p2,setP2,2,p2Manual,setP2Manual]].map(([pl,setPl,num,isManual,setManual]) => (
                      <div key={num} style={{ background:"#f9fafb", border:"1px solid #e8e8e8", borderRadius:8, padding:14 }}>
                        <div style={{ fontFamily:"'Oswald',sans-serif", fontSize:14, fontWeight:700, color:GD, marginBottom:10, paddingBottom:8, borderBottom:"1px solid #eee" }}>JUGADOR {num}</div>
                        <select style={{ width:"100%", padding:"9px 12px", border:"1px solid #ddd", borderRadius:6, fontSize:13, background:"#fff", marginBottom:8 }}
                          value={isManual ? "Otro / Manual" : pl.name} onChange={e => selectPlayer(num, e.target.value)}>
                          <option value="">— Seleccionar —</option>
                          {(tour === "ATP" ? ATP : WTA).map(p => <option key={p.name} value={p.name}>{p.flag} {p.name}{p.ranking ? ` (#${p.ranking})` : ""}</option>)}
                        </select>
                        {isManual && (
                          <input style={{ width:"100%", padding:"9px 12px", border:"1px solid #ddd", borderRadius:6, fontSize:13, marginBottom:8 }}
                            placeholder="Nombre del jugador" value={pl.name} onChange={e => setPl(p => ({ ...p, name: e.target.value }))} />
                        )}
                        {pl.ranking && <div style={{ background:"#dcfce7", color:GD, fontSize:12, fontWeight:700, padding:"5px 10px", borderRadius:6, marginBottom:10 }}>#{pl.ranking} · {pl.hand}</div>}
                        <div style={{ marginBottom:10 }}>
                          <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Lesión</label>
                          <input style={{ width:"100%", padding:"8px 12px", border:"1px solid #ddd", borderRadius:6, fontSize:12 }} placeholder="Ej: Sin lesiones" value={pl.injury} onChange={e => setPl(p => ({ ...p, injury: e.target.value }))} />
                        </div>
                        <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Forma reciente</label>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:10 }}>
                          {FORM_OPTS.map(o => <Chip key={o} label={o} active={pl.form===o} onClick={() => setPl(p => ({ ...p, form:o }))} sm />)}
                        </div>
                        <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>En {surface||"superficie"}</label>
                        <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:10 }}>
                          {SURF_OPTS.map(o => <Chip key={o} label={o} active={pl.surfacePerf===o} onClick={() => setPl(p => ({ ...p, surfacePerf:o }))} sm />)}
                        </div>
                        <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>✅ Fortalezas</label>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:10 }}>
                          {STRENGTHS.map(o => <Chip key={o} label={o} active={pl.strengths.includes(o)} onClick={() => toggle(setPl,"strengths",o)} sm />)}
                        </div>
                        <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>❌ Debilidades</label>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                          {WEAKNESSES.map(o => <Chip key={o} label={o} active={pl.weaknesses.includes(o)} onClick={() => toggle(setPl,"weaknesses",o)} sm />)}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <SectionHead>⚔️ HEAD TO HEAD</SectionHead>
                  <GreenBtn onClick={fetchH2H} disabled={loadingH2H || !p1.name || !p2.name} style={{ marginBottom:12 }}>
                    {loadingH2H ? "⚡ Buscando H2H..." : "🔄 JALAR H2H AUTOMÁTICO"}
                  </GreenBtn>
                  {h2hData && <div style={{ background:"#dcfce7", borderRadius:6, padding:"8px 12px", fontSize:13, color:GD, marginBottom:12 }}>✅ H2H obtenido</div>}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 2fr", gap:12 }}>
                    {[["Partidos totales","total"],["Victorias de "+( p1.name.split(" ")[0]||"J1"),"p1Wins"]].map(([lbl,key]) => (
                      <div key={key}>
                        <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>{lbl}</label>
                        <input style={{ width:"100%", padding:"9px 12px", border:"1px solid #ddd", borderRadius:6, fontSize:13 }} type="number" placeholder="0" value={h2h[key]} onChange={e => setH2H(p => ({ ...p, [key]:e.target.value }))} />
                      </div>
                    ))}
                    <div>
                      <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Últimos</label>
                      <div style={{ display:"flex", gap:6 }}>
                        {[p1.name.split(" ")[0]||"J1", p2.name.split(" ")[0]||"J2", "Parejo"].map(o => (
                          <Chip key={o} label={o} active={h2h.recentFavor===o} onClick={() => setH2H(p => ({ ...p, recentFavor:o }))} sm />
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <SectionHead>💰 CUOTAS</SectionHead>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                    {[[`Cuota ${p1.name.split(" ")[0]||"J1"}`,oddsP1,setOddsP1,"1.75"],[`Cuota ${p2.name.split(" ")[0]||"J2"}`,oddsP2,setOddsP2,"2.10"],["Total Juegos",totalGames,setTotalGames,"22.5"]].map(([lbl,val,set,ph]) => (
                      <div key={lbl}>
                        <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>{lbl}</label>
                        <input style={{ width:"100%", padding:"9px 12px", border:"1px solid #ddd", borderRadius:6, fontSize:13 }} type="number" step="0.01" placeholder={ph} value={val} onChange={e => set(e.target.value)} />
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {/* ── MLB ANÁLISIS ── */}
            {sport === "mlb" && (
              <>
                {!selectedGame ? (
                  <Card>
                    <SectionHead>⚾ SELECCIONAR PARTIDO MLB</SectionHead>
                    <p style={{ color:"#666", fontSize:13, marginBottom:12 }}>Ve a Inicio, carga los juegos y selecciona uno.</p>
                    <GreenBtn onClick={() => setTab("hoy")}>← IR A CARGAR JUEGOS</GreenBtn>
                  </Card>
                ) : (
                  <Card>
                    <SectionHead>⚾ PARTIDO SELECCIONADO</SectionHead>
                    <div style={{ background:"#f0fdf4", border:`1px solid ${G}`, borderRadius:8, padding:"12px 16px", marginBottom:8 }}>
                      <div style={{ fontFamily:"'Oswald',sans-serif", fontSize:18, fontWeight:700, textAlign:"center" }}>
                        {selectedGame.away_team} @ {selectedGame.home_team}
                      </div>
                      <div style={{ textAlign:"center", fontSize:13, color:"#666", marginTop:4 }}>
                        {selectedGame.venue} · {selectedGame.time_mexico} MX · {selectedGame.weather?.wind_betting}
                      </div>
                    </div>
                    <button onClick={() => { setSelectedGame(null); setTab("hoy"); }} style={{ background:"none", border:"none", color:G, cursor:"pointer", fontSize:13, fontWeight:600 }}>← Cambiar partido</button>
                  </Card>
                )}

                <Card>
                  <SectionHead>⚾ DATOS DE LOS EQUIPOS</SectionHead>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                    {[[homeTeam,setHomeTeam,"🏠 LOCAL"],[awayTeam,setAwayTeam,"✈️ VISITANTE"]].map(([team,setTeam,label]) => (
                      <div key={label} style={{ background:"#f9fafb", border:"1px solid #eee", borderRadius:8, padding:14 }}>
                        <div style={{ fontFamily:"'Oswald',sans-serif", fontSize:14, fontWeight:700, color:GD, marginBottom:10, paddingBottom:8, borderBottom:"1px solid #eee" }}>{label}</div>
                        {[["Equipo","team","Ej: Los Angeles Dodgers"],["Récord","record","28-14"],["Pitcher","pitcher","Nombre del pitcher"],["ERA / Stats","pitcherEra","ERA 2.45"],["Bullpen","bullpenRating","Bueno / Regular / Débil"],["Forma bateadores","recentForm","Ej: .285 AVG últimos 10 días"]].map(([lbl,key,ph]) => (
                          <div key={key} style={{ marginBottom:10 }}>
                            <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:5 }}>{lbl}</label>
                            <input style={{ width:"100%", padding:"8px 12px", border:"1px solid #ddd", borderRadius:6, fontSize:12 }}
                              placeholder={ph} value={team[key]} onChange={e => setTeam(p => ({ ...p, [key]:e.target.value }))} />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <SectionHead>💰 LÍNEAS Y CUOTAS MLB</SectionHead>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10 }}>
                    {[["Cuota Local",mlbOddsHome,setMlbOddsHome,"-150"],["Cuota Visit.",mlbOddsAway,setMlbOddsAway,"+130"],["Total Carr.",mlbTotal,setMlbTotal,"8.5"],["Over @",mlbOverOdds,setMlbOverOdds,"-110"],["Under @",mlbUnderOdds,setMlbUnderOdds,"-110"]].map(([lbl,val,set,ph]) => (
                      <div key={lbl}>
                        <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>{lbl}</label>
                        <input style={{ width:"100%", padding:"9px 12px", border:"1px solid #ddd", borderRadius:6, fontSize:13 }} type="text" placeholder={ph} value={val} onChange={e => set(e.target.value)} />
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {/* ANALYZE BUTTON */}
            <div style={{ textAlign:"center", marginBottom:20 }}>
              {sport === "tennis" && p1.name && p2.name && (
                <div style={{ marginBottom:12 }}>
                  <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:20, fontWeight:700 }}>{p1.name}</span>
                  <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:18, fontWeight:800, color:G, margin:"0 10px" }}>VS</span>
                  <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:20, fontWeight:700 }}>{p2.name}</span>
                </div>
              )}
              <GreenBtn onClick={runAnalysis} disabled={loadingAnalysis}>
                {loadingAnalysis ? "⚡ Analizando..." : "🔍 GENERAR PRONÓSTICO CON IA"}
              </GreenBtn>
            </div>

            {loadingAnalysis && <LoadBox text="Analizando partido con IA..." />}
            <ResultBox result={analysis} title={sport === "tennis" ? "PRONÓSTICO DE TENIS" : "PRONÓSTICO MLB"} />
          </div>
        )}

        {/* ══ BANKROLL ══ */}
        {tab === "bankroll" && (
          <div style={{ animation:"fadeUp .3s ease" }}>
            {!bancaSet ? (
              <Card>
                <SectionHead>💰 CONFIGURAR BANCA INICIAL</SectionHead>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Monto inicial (MXN)</label>
                <input style={{ width:"100%", padding:14, border:"1px solid #ddd", borderRadius:8, fontSize:22, fontWeight:700, marginBottom:12 }}
                  type="number" placeholder="Ej: 2000" defaultValue={banca} onBlur={e => setBanca(e.target.value)} inputMode="numeric" />
                <GreenBtn onClick={() => banca && setBancaSet(true)}>CONFIGURAR BANCA</GreenBtn>
              </Card>
            ) : (
              <>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
                  {[["💰 Banca Inicial",`$${parseFloat(banca).toLocaleString()} MXN`,"#fff"],["📈 Banca Actual",`$${stats.bancaActual.toFixed(0)} MXN`,stats.profit>=0?"#4ade80":"#f87171"],["✅ Ganadas",stats.won,"#4ade80"],["❌ Perdidas",stats.lost,"#f87171"],["🎯 % Acierto",`${stats.pct}%`,"#facc15"],["📊 ROI",`${stats.roi}%`,parseFloat(stats.roi)>=0?"#4ade80":"#f87171"]].map(([lbl,val,col]) => (
                    <div key={lbl} style={{ background:"#14532d", borderRadius:10, padding:"14px 16px" }}>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,.6)", fontWeight:700, letterSpacing:.5, marginBottom:6 }}>{lbl}</div>
                      <div style={{ fontFamily:"'Oswald',sans-serif", fontSize:20, fontWeight:700, color:col }}>{val}</div>
                    </div>
                  ))}
                </div>

                <Card>
                  <SectionHead>➕ REGISTRAR APUESTA</SectionHead>
                  <div style={{ display:"grid", gridTemplateColumns:"2fr 2fr 1fr 1fr", gap:10, marginBottom:10 }}>
                    {[["Partido","partido","Sinner vs Alcaraz"],["Pick / Mercado","pick","Sinner ganador"],["Momio","momio","1.75"],["Monto $","monto","100"]].map(([lbl,key,ph]) => (
                      <div key={key}>
                        <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:5 }}>{lbl}</label>
                        <input style={{ width:"100%", padding:"9px 12px", border:"1px solid #ddd", borderRadius:6, fontSize:13 }}
                          type={key==="momio"||key==="monto"?"number":"text"} placeholder={ph}
                          defaultValue={newBet[key]} onBlur={e => setNewBet(b => ({ ...b, [key]:e.target.value }))} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom:10 }}>
                    <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Deporte</label>
                    <div style={{ display:"flex", gap:6, marginBottom:10 }}>
                      {["🎾 Tenis","⚾ MLB","🌎 Mixto"].map(s => <Chip key={s} label={s} active={newBet.sport===s} onClick={() => setNewBet(b => ({ ...b, sport:s }))} sm />)}
                    </div>
                    <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Origen del pick</label>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                      {PICK_TYPES.map(t => <Chip key={t} label={t} active={newBet.tipo===t} onClick={() => setNewBet(b => ({ ...b, tipo:t }))} sm />)}
                    </div>
                  </div>
                  <GreenBtn onClick={addBet}>➕ REGISTRAR APUESTA</GreenBtn>
                </Card>

                {bets.length > 0 && (
                  <Card>
                    <SectionHead>📋 HISTORIAL DE APUESTAS</SectionHead>
                    <div style={{ overflowX:"auto" }}>
                      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                        <thead>
                          <tr>{["Partido","Pick","Momio","Monto","Deporte","Resultado"].map(h => (
                            <th key={h} style={{ background:"#f9fafb", padding:"8px 10px", textAlign:"left", fontWeight:700, fontSize:11, color:"#666", letterSpacing:.5, borderBottom:"2px solid #eee" }}>{h}</th>
                          ))}</tr>
                        </thead>
                        <tbody>
                          {bets.map(b => {
                            const gan = b.resultado === "ganada" ? `+$${(parseFloat(b.monto)*parseFloat(b.momio)-parseFloat(b.monto)).toFixed(0)}` : b.resultado === "perdida" ? `-$${b.monto}` : "—";
                            return (
                              <tr key={b.id} style={{ background: b.resultado==="ganada" ? "#f0fdf4" : b.resultado==="perdida" ? "#fef2f2" : "#fff" }}>
                                <td style={{ padding:"8px 10px", borderBottom:"1px solid #f0f0f0" }}>{b.partido}</td>
                                <td style={{ padding:"8px 10px", borderBottom:"1px solid #f0f0f0" }}>{b.pick}</td>
                                <td style={{ padding:"8px 10px", borderBottom:"1px solid #f0f0f0" }}>{b.momio}</td>
                                <td style={{ padding:"8px 10px", borderBottom:"1px solid #f0f0f0" }}>${b.monto}</td>
                                <td style={{ padding:"8px 10px", borderBottom:"1px solid #f0f0f0", fontSize:11 }}>{b.sport}</td>
                                <td style={{ padding:"8px 10px", borderBottom:"1px solid #f0f0f0" }}>
                                  {!b.resultado ? (
                                    <div style={{ display:"flex", gap:4 }}>
                                      <button onClick={() => markResult(b.id,"ganada")} style={{ background:"#dcfce7", border:"none", borderRadius:4, padding:"4px 8px", cursor:"pointer", fontSize:13 }}>✅</button>
                                      <button onClick={() => markResult(b.id,"perdida")} style={{ background:"#fee2e2", border:"none", borderRadius:4, padding:"4px 8px", cursor:"pointer", fontSize:13 }}>❌</button>
                                    </div>
                                  ) : <span style={{ fontWeight:700, fontSize:13, color: b.resultado==="ganada"?G:"#e53e3e" }}>{b.resultado==="ganada"?"✅ Ganada":"❌ Perdida"} {gan}</span>}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
