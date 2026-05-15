import { useState, useEffect } from "react";

const BACKEND = "https://pronosticador-backend.vercel.app";

// ─── PLAYER DATABASE ──────────────────────────────────────────────────────────
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
  { name: "Jakub Mensik", ranking: 21, flag: "🇨🇿", hand: "Derecho" },
  { name: "Tomas Machac", ranking: 22, flag: "🇨🇿", hand: "Derecho" },
  { name: "Sebastian Baez", ranking: 23, flag: "🇦🇷", hand: "Derecho" },
  { name: "Jiri Lehecka", ranking: 24, flag: "🇨🇿", hand: "Derecho" },
  { name: "Karen Khachanov", ranking: 25, flag: "🇷🇺", hand: "Derecho" },
  { name: "Francisco Cerundolo", ranking: 26, flag: "🇦🇷", hand: "Derecho" },
  { name: "Nicolas Jarry", ranking: 27, flag: "🇨🇱", hand: "Derecho" },
  { name: "Rafael Jodar", ranking: 35, flag: "🇪🇸", hand: "Derecho" },
  { name: "Matteo Berrettini", ranking: 42, flag: "🇮🇹", hand: "Derecho" },
  { name: "Denis Shapovalov", ranking: 45, flag: "🇨🇦", hand: "Zurdo" },
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
  { name: "Diana Shnaider", ranking: 13, flag: "🇷🇺", hand: "Zurdo" },
  { name: "Madison Keys", ranking: 15, flag: "🇺🇸", hand: "Derecho" },
  { name: "Anna Kalinskaya", ranking: 16, flag: "🇷🇺", hand: "Zurdo" },
  { name: "Beatriz Haddad Maia", ranking: 19, flag: "🇧🇷", hand: "Zurdo" },
  { name: "Otro / Manual", ranking: 0, flag: "🎾", hand: "" },
];

const STRENGTHS = [
  "Primer saque potente","Segundo saque sólido","Gran retorno",
  "Derecha poderosa","Revés con topspin","Revés slice",
  "Juego de red","Fondo de cancha sólido","Velocidad en pista",
  "Resistencia física","Fortaleza mental","Gran tiebreak",
  "Juego agresivo","Contraataque/defensa",
  "Domina arcilla","Domina pista dura","Domina hierba",
];
const WEAKNESSES = [
  "Segundo saque débil","Dobles faltas frecuentes","Revés inconsistente",
  "Derecha inconsistente","Bajo % break points","Inicio lento",
  "Presión en puntos clave","Baja forma física","Lesión reciente",
  "Débil en arcilla","Débil en pista rápida","Débil en hierba",
  "Débil vs zurdos","Poca experiencia en torneos grandes",
];
const FORM_OPTS = ["🔥 Excelente (4-1/5-0)","✅ Buena (3-2)","⚠️ Regular (2-3)","❌ Mala (0-5/1-4)"];
const SURF_OPTS = ["👑 Dominante","✅ Bueno","⚠️ Regular","❌ Débil"];
const ROUNDS = ["1R","2R","3R","4R","Cuartos","Semis","Final"];
const PICK_TYPES = ["⭐ Mejor del Día","🔗 Combinada","🚀 Soñador","🐴 Underdog","🧠 Análisis Propio"];

const MLB_TEAMS = [
  {name:"Arizona Diamondbacks",short:"ARI"},{name:"Atlanta Braves",short:"ATL"},
  {name:"Baltimore Orioles",short:"BAL"},{name:"Boston Red Sox",short:"BOS"},
  {name:"Chicago Cubs",short:"CHC"},{name:"Chicago White Sox",short:"CWS"},
  {name:"Cincinnati Reds",short:"CIN"},{name:"Cleveland Guardians",short:"CLE"},
  {name:"Colorado Rockies",short:"COL"},{name:"Detroit Tigers",short:"DET"},
  {name:"Houston Astros",short:"HOU"},{name:"Kansas City Royals",short:"KC"},
  {name:"Los Angeles Angels",short:"LAA"},{name:"Los Angeles Dodgers",short:"LAD"},
  {name:"Miami Marlins",short:"MIA"},{name:"Milwaukee Brewers",short:"MIL"},
  {name:"Minnesota Twins",short:"MIN"},{name:"New York Mets",short:"NYM"},
  {name:"New York Yankees",short:"NYY"},{name:"Oakland Athletics",short:"ATH"},
  {name:"Philadelphia Phillies",short:"PHI"},{name:"Pittsburgh Pirates",short:"PIT"},
  {name:"San Diego Padres",short:"SD"},{name:"San Francisco Giants",short:"SF"},
  {name:"Seattle Mariners",short:"SEA"},{name:"St. Louis Cardinals",short:"STL"},
  {name:"Tampa Bay Rays",short:"TB"},{name:"Texas Rangers",short:"TEX"},
  {name:"Toronto Blue Jays",short:"TOR"},{name:"Washington Nationals",short:"WSH"},
];

const emptyP = () => ({ name:"", ranking:"", hand:"", form:"", surfacePerf:"", strengths:[], weaknesses:[], injury:"", injuryGames:"", momentum:"" });
const emptyMLB = () => ({ team:"", record:"", pitcher:"", pitcherEra:"", bullpenRating:"", recentForm:"", vsLHB:"", vsRHB:"" });

const G = "#16a34a", GD = "#15803d";

export default function App() {
  // Wake up Render on load
  useEffect(() => {
    fetch(`${BACKEND}/`).catch(() => {});
  }, []);

  const [tab, setTab] = useState("hoy");
  const [sport, setSport] = useState("tennis"); // tennis | mlb

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
      // Call MLB official API directly - no backend needed, no CORS issues
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
            home_team_short: home?.team?.abbreviation || "",
            away_team: away?.team?.name || "",
            away_team_short: away?.team?.abbreviation || "",
            home_record: `${home?.leagueRecord?.wins||0}-${home?.leagueRecord?.losses||0}`,
            away_record: `${away?.leagueRecord?.wins||0}-${away?.leagueRecord?.losses||0}`,
            home_pitcher: home?.probablePitcher?.fullName || "Por confirmar",
            home_pitcher_note: home?.probablePitcher?.note || "",
            away_pitcher: away?.probablePitcher?.fullName || "Por confirmar",
            away_pitcher_note: away?.probablePitcher?.note || "",
            venue: game.venue?.name || "",
            status: game.status?.detailedState || "",
            time_mexico: timeMex,
            madrugada,
            weather: { condition: weather.condition||"", temp: weather.temp||"", wind: windStr, wind_mph: windMph, wind_betting: windBetting },
            home_score: game.linescore?.teams?.home?.runs,
            away_score: game.linescore?.teams?.away?.runs,
          });
        });
      });
      
      setMlbGames(games);
    } catch(e) {
      console.log("MLB error:", e.message);
      setMlbGames([]);
    }
    setLoadingMLB(false);
  };

  const selectMLBGame = (game) => {
    setSelectedGame(game);
    setHomeTeam(p => ({ ...p, team: game.home_team, record: game.home_record, pitcher: game.home_pitcher, pitcherEra: game.home_pitcher_note }));
    setAwayTeam(p => ({ ...p, team: game.away_team, record: game.away_record, pitcher: game.away_pitcher, pitcherEra: game.away_pitcher_note }));
    setMlbTotal(game.total_line || "");
  };

  // ── PROMPTS ────────────────────────────────────────────────────────────────
  const buildTennisPrompt = () => `
Eres un analista experto en apuestas de tenis. Analiza con criterio profesional real y datos actualizados de 2025-2026.

PARTIDO: ${p1.name} (#${p1.ranking}, ${p1.hand || "N/A"}) vs ${p2.name} (#${p2.ranking}, ${p2.hand || "N/A"})
TORNEO: ${tournament} | SUPERFICIE: ${surface} | RONDA: ${round}
CIRCUITO: ${tour}

JUGADOR 1 — ${p1.name}:
• Forma reciente: ${p1.form}
• Rendimiento en ${surface}: ${p1.surfacePerf}
• Lesión/Estado físico: ${p1.injury || "Sin lesiones reportadas"}
${p1.injuryGames ? `• Partidos desde lesión: ${p1.injuryGames}` : ""}
• Momentum/Racha: ${p1.momentum || "No especificado"}
• Fortalezas: ${p1.strengths.join(", ") || "N/A"}
• Debilidades: ${p1.weaknesses.join(", ") || "N/A"}

JUGADOR 2 — ${p2.name}:
• Forma reciente: ${p2.form}
• Rendimiento en ${surface}: ${p2.surfacePerf}
• Lesión/Estado físico: ${p2.injury || "Sin lesiones reportadas"}
${p2.injuryGames ? `• Partidos desde lesión: ${p2.injuryGames}` : ""}
• Momentum/Racha: ${p2.momentum || "No especificado"}
• Fortalezas: ${p2.strengths.join(", ") || "N/A"}
• Debilidades: ${p2.weaknesses.join(", ") || "N/A"}

H2H: ${h2h.total || "?"} partidos — ${p1.name} ganó ${h2h.p1Wins || "?"} — Últimos: ${h2h.recentFavor || "N/A"}
${h2hData ? `Datos H2H reales: ${JSON.stringify(h2hData).slice(0, 300)}` : ""}

CUOTAS: ${p1.name}@${oddsP1 || "N/A"} | ${p2.name}@${oddsP2 || "N/A"} | Total juegos: ${totalGames || "N/A"}

IMPORTANTE: Usa tu conocimiento actual de estos jugadores. Considera ranking actual, forma 2025-2026, lesiones conocidas, y el contexto de este torneo. Detecta si las cuotas tienen valor real o están infladas/desinfladas.

## ANÁLISIS TÁCTICO
**Choque de estilos:** [cómo se enfrentan sus juegos, fortaleza vs debilidad clave]
**Ventaja en ${surface}:** [quién domina y por qué — sé específico con estadísticas si las conoces]
**Forma y momentum:** [quién llega mejor, racha reciente]
**Lesiones e estado físico:** [impacto real en el rendimiento]
**H2H y factor mental:** [peso del historial, ventaja psicológica]
**Lectura de cuotas:** [¿la cuota refleja la realidad? ¿hay valor? ¿línea sospechosa?]

---

## PRONÓSTICOS

### 🏆 GANADOR DIRECTO
**Favorito: [Nombre]** | Confianza: [Alta/Media/Baja]
[Justificación 2-3 líneas]

### 📊 TOTAL DE JUEGOS
**[Over/Under X.5]** | Confianza: [Alta/Media/Baja]
[¿Partido largo o rápido? ¿Por qué?]

### 🎯 HANDICAP DE SETS
**[Ej: Alcaraz -1.5 sets o gana al menos 1 set]** | Confianza: [Alta/Media/Baja]
[Justificación]

### 🐴 ¿HAY UNDERDOG CON VALOR?
[Si la cuota del favorito está inflada, señala el value bet en el underdog. Si no hay valor, dilo claramente]

### ⭐ MEJOR APUESTA DEL PARTIDO
**Mercado:** [específico] | **Selección:** [exacta] | **Por qué tiene valor real**

---

## ⚠️ FACTORES DE RIESGO
[2-3 factores que podrían cambiar el resultado]

---

## RESUMEN EJECUTIVO
[2-3 líneas. Ganador, cómo, y la apuesta más inteligente]
`;

  const buildMLBPrompt = () => {
    const game = selectedGame;
    return `
Eres un analista experto en apuestas de béisbol MLB con conocimiento actualizado de la temporada 2026.

PARTIDO: ${awayTeam.team} (${awayTeam.record}) @ ${homeTeam.team} (${homeTeam.record})
ESTADIO: ${game?.venue || "N/A"}
HORA MÉXICO: ${game?.time_mexico || "N/A"}

CLIMA: ${game?.weather?.condition || "N/A"} | Temp: ${game?.weather?.temp || "N/A"}°F
VIENTO: ${game?.weather?.wind || "N/A"} — ${game?.weather?.wind_betting || ""}

PITCHER LOCAL — ${homeTeam.pitcher}:
• ERA/Stats: ${homeTeam.pitcherEra || "N/A"}
• Forma reciente (últimas 3-5 salidas): ${homeTeam.recentForm || "No especificado"}
• vs Bateadores Zurdos: ${homeTeam.vsLHB || "N/A"}
• vs Bateadores Derechos: ${homeTeam.vsRHB || "N/A"}

PITCHER VISITANTE — ${awayTeam.pitcher}:
• ERA/Stats: ${awayTeam.pitcherEra || "N/A"}
• Forma reciente: ${awayTeam.recentForm || "No especificado"}
• vs Bateadores Zurdos: ${awayTeam.vsLHB || "N/A"}
• vs Bateadores Derechos: ${awayTeam.vsRHB || "N/A"}

BULLPEN LOCAL: ${homeTeam.bullpenRating || "No especificado"}
BULLPEN VISITANTE: ${awayTeam.bullpenRating || "No especificado"}

LINEUP LOCAL — Forma reciente bateadores: ${homeTeam.recentForm || "N/A"}
LINEUP VISITANTE — Forma reciente bateadores: ${awayTeam.recentForm || "N/A"}

LÍNEAS DEL CASINO:
• ${homeTeam.team}: ${mlbOddsHome || "N/A"} | ${awayTeam.team}: ${mlbOddsAway || "N/A"}
• Total carreras: ${mlbTotal || "N/A"} (Over@${mlbOverOdds || "N/A"} / Under@${mlbUnderOdds || "N/A"})

IMPORTANTE: Usa tu conocimiento de la temporada 2026. Considera el historial de estos pitchers, cómo viene el equipo, el estadio (¿favorece pitching o bateo?), y el viento. El viento es factor crítico — analízalo específicamente.

## ANÁLISIS DEL PARTIDO

**Duelo de pitchers:** [quién tiene ventaja real y por qué — ERA, forma, matchup vs lineup rival]
**Factor viento:** [impacto específico en este partido — altas o bajas]
**Bullpen:** [quién tiene mejor respaldo si el abridor sale temprano]
**Lineup y bateadores calientes:** [quién viene bateando mejor]
**Estadio:** [¿Coors? ¿Parque de pitching? Impacto en el total]
**Lectura de cuotas:** [¿hay valor? ¿línea sospechosa? ¿underdog con valor?]

---

## PRONÓSTICOS MLB

### 🏆 GANADOR (MONEYLINE)
**Favorito: [Equipo]** | Confianza: [Alta/Media/Baja]
[Justificación 2-3 líneas]

### 📊 TOTAL DE CARRERAS
**[Over/Under X.5]** | Confianza: [Alta/Media/Baja]
[Pitcher + viento + lineup + estadio — conclusión]

### 🎯 RUN LINE (-1.5)
**[Equipo -1.5 o +1.5]** | Confianza: [Alta/Media/Baja]
[¿Dominio esperado o partido cerrado?]

### 🐴 ¿HAY UNDERDOG CON VALOR?
[Si el favorito está sobrevalorado por la cuota, señala el value bet. Muchas veces el underdog a +150/+180 tiene más valor real]

### ⭐ MEJOR APUESTA DEL PARTIDO
**Mercado:** [exacto] | **Selección:** [exacta] | **Por qué tiene valor**

---

## ⚠️ FACTORES DE RIESGO
[2-3 factores: lesión de último momento, cambio de pitcher, bullpen cansado, etc.]

---

## RESUMEN EJECUTIVO
[2-3 líneas. Quién gana, cómo, y la apuesta más inteligente del partido]
`;
  };

  const buildSectionPrompt = (type, sportType) => {
    const isTennis = sportType === "tennis";
    const typeLabels = {
      mejordia: "MEJOR APUESTA DEL DÍA",
      combinada: "COMBINADA DEL DÍA (2-3 picks)",
      sonador: "SOÑADOR DEL DÍA (parlay 3-4 picks alto riesgo)",
      underdog: "UNDERDOGS DEL DÍA (2-3 picks con value bet real)",
      parlay: "PARLAY FANÁTICO (4-5 underdogs mezclados tenis + MLB)",
    };

    if (sportType === "mlb" && mlbGames.length > 0) {
      const gameList = mlbGames.slice(0, 8).map((g, i) =>
        `${i+1}. ${g.away_team} (${g.away_record}) @ ${g.home_team} (${g.home_record}) | P: ${g.away_pitcher} vs ${g.home_pitcher} | ${g.time_mexico} MX | Viento: ${g.weather?.wind_betting || "neutro"} | Estadio: ${g.venue}`
      ).join("\n");

      return `Eres analista experto en apuestas MLB temporada 2026. Analiza estos partidos de hoy y da ${typeLabels[type]}.

JUEGOS DE HOY:\n${gameList}

${type === "mejordia" ? "Elige LA mejor apuesta individual con mayor valor real. Considera pitchers, viento, cuotas." : ""}
${type === "combinada" ? "Crea una combinada de 2-3 picks seguros con buen balance riesgo/recompensa." : ""}
${type === "sonador" ? "Crea un parlay de 3-4 picks atrevidos con cuota alta 3.0+. Alto riesgo, alta recompensa." : ""}
${type === "underdog" ? "Identifica 2-3 underdogs con valor real donde el favorito está sobrevalorado por las cuotas." : ""}

INSTRUCCIÓN CRÍTICA: Da picks DIRECTAMENTE sin disclaimers ni mencionar limitaciones de conocimiento. Analiza con datos reales de temporada 2026.

Para cada pick: partido, mercado exacto, selección, cuota estimada, justificación de 1-2 líneas.
Al final: cuota combinada estimada y nivel de confianza.`;
    }

    return `Eres analista experto en apuestas de tenis ${isTennis ? "ATP/WTA" : "y MLB"} temporada 2026. Da ${typeLabels[type]}.

Analiza los partidos más importantes de hoy en los torneos activos (Roma ATP/WTA, Roland Garros preparación, challengers de arcilla en Europa y Sudamérica).

Considera para cada pick:
- Ranking y forma actual 2026
- Superficie y especialización
- Lesiones conocidas
- Cuotas de mercado y value bets
- H2H histórico

${type === "mejordia" ? "Elige LA mejor apuesta individual del día. Justifica por qué tiene el mayor valor." : ""}
${type === "combinada" ? "Crea combinada 2-3 picks. Máximo riesgo moderado. Cuota total estimada 2.5-4.0." : ""}  
${type === "sonador" ? "Parlay 3-4 picks atrevidos. Cuota mínima 5.0. Solo apuesta el 1% de tu banca." : ""}
${type === "underdog" ? "2-3 underdogs con valor real. El favorito está sobrevalorado. Cuotas +150 mínimo." : ""}
${type === "parlay" ? "PARLAY FANÁTICO: 4-5 underdogs mezclando tenis y MLB. Cuota objetivo 8.0+. Máximo riesgo." : ""}

INSTRUCCIÓN CRÍTICA: Da el análisis DIRECTAMENTE sin disclaimers, sin avisos sobre corte de conocimiento, sin mencionar limitaciones. Usa tu conocimiento de la temporada 2026 y da picks concretos con justificación real. Si no tienes datos de un partido específico, analiza basándote en el historial conocido de los jugadores/equipos.

Para cada pick: deporte, partido, mercado, selección, cuota estimada, justificación concreta de 1-2 líneas.
Al final: cuota total combinada y nivel de confianza.`;
  };

  const runAnalysis = async () => {
    const prompt = sport === "tennis" ? buildTennisPrompt() : buildMLBPrompt();
    setLoadingAnalysis(true); setAnalysis(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      setAnalysis(data.content?.map(b => b.text || "").join("\n") || "Error.");
    } catch { setAnalysis("❌ Error de conexión."); }
    setLoadingAnalysis(false);
  };

  const runSection = async (type, sportType = "tennis") => {
    const key = `${type}_${sportType}`;
    setLoadingSection(l => ({ ...l, [key]: true }));
    setSectionResult(r => ({ ...r, [key]: null }));
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: buildSectionPrompt(type, sportType) }] }),
      });
      const data = await res.json();
      setSectionResult(r => ({ ...r, [key]: data.content?.map(b => b.text || "").join("\n") || "Error." }));
    } catch { setSectionResult(r => ({ ...r, [key]: "❌ Error." })); }
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
    return { won: won.length, lost: lost.length, profit, bancaActual, roi, pct, totalApostado };
  };

  const statsByTipo = () => {
    const r = {};
    PICK_TYPES.forEach(t => {
      const g = bets.filter(b => b.tipo === t && b.resultado === "ganada").length;
      const p = bets.filter(b => b.tipo === t && b.resultado === "perdida").length;
      if (g + p > 0) r[t] = { g, p, pct: ((g/(g+p))*100).toFixed(0) };
    });
    return r;
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

  const Chip = ({ label, active, onClick, sm }) => (
    <button onClick={onClick} style={{ padding: sm ? "4px 8px" : "6px 12px", borderRadius:16, border:`1px solid ${active ? G : "#ddd"}`, background: active ? G : "#fff", color: active ? "#fff" : "#555", cursor:"pointer", fontSize: sm ? 11 : 12, fontWeight:500, marginBottom:4, transition:"all .12s" }}>{label}</button>
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
    <Card>
      <SectionHead>📋 {title}</SectionHead>
      {renderMd(result)}
    </Card>
  ) : null;

  const TABS = [
    { id:"hoy", label:"🏠 Inicio" },
    { id:"analisis", label:"🔍 Análisis" },
    { id:"picks", label:"⭐ Picks del Día" },
    { id:"bankroll", label:"💰 Bankroll" },
  ];

  const stats = calcStats();
  const tipos = statsByTipo();

  return (
    <div style={{ minHeight:"100vh", background:"#f1f5f1", fontFamily:"'Source Sans 3',sans-serif", color:"#111" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        select,input,button,textarea { font-family:'Source Sans 3',sans-serif; }
        select option { background:#fff; color:#111; }
        ::-webkit-scrollbar { width:5px; } ::-webkit-scrollbar-thumb { background:${G}; border-radius:3px; }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color:#aaa; }
        input:focus,select:focus { outline:2px solid ${G}; outline-offset:1px; }
        button:hover { opacity:0.88; }
      `}</style>

      {/* HEADER */}
      <div style={{ background:"#14532d", padding:0 }}>
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
            style={{ flex:"0 0 auto", padding:"11px 18px", border:"none", background:"transparent", cursor:"pointer", fontSize:14, fontWeight:600, color: tab === t.id ? "#fff" : "rgba(255,255,255,.5)", fontFamily:"'Oswald',sans-serif", letterSpacing:1, borderBottom: tab === t.id ? "3px solid #4ade80" : "3px solid transparent", marginBottom:-3, transition:"all .15s" }}>
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
                    style={{ flex:1, padding:16, border:`2px solid ${sport===id ? G : "#ddd"}`, borderRadius:10, background: sport===id ? "#dcfce7" : "#fff", cursor:"pointer", fontFamily:"'Oswald',sans-serif", fontSize:20, fontWeight:700, color: sport===id ? G : "#888", letterSpacing:2, transition:"all .2s" }}>
                    {label}
                  </button>
                ))}
              </div>
            </Card>

            {/* MLB Games */}
            {sport === "mlb" && (
              <Card>
                <SectionHead>⚾ JUEGOS MLB DE HOY</SectionHead>
                <GreenBtn onClick={fetchMLBGames} disabled={loadingMLB} style={{ marginBottom:16 }}>
                  {loadingMLB ? "⏳ Cargando... (puede tardar 30-60 seg)" : "🔄 CARGAR JUEGOS MLB DE HOY"}
                </GreenBtn>
                {mlbGames.length === 0 && !loadingMLB && (
                  <div style={{ color:"#888", fontSize:13, padding:"12px 0" }}>
                    Presiona el botón para cargar los juegos. Si tarda, Render está despertando (plan gratuito).
                  </div>
                )}
                {mlbGames.length > 0 && (
                  <div>
                    {mlbGames.map((g, i) => (
                      <div key={i} onClick={() => { selectMLBGame(g); setTab("analisis"); }}
                        style={{ border:`1px solid ${selectedGame?.id === g.id ? G : "#e8e8e8"}`, background: selectedGame?.id === g.id ? "#f0fdf4" : "#fafafa", borderRadius:8, padding:"12px 14px", marginBottom:8, cursor:"pointer", transition:"all .15s" }}>
                        <div style={{ fontSize:11, fontWeight:700, color:"#888", letterSpacing:.5, textTransform:"uppercase", marginBottom:6 }}>
                          {g.venue} · {g.time_mexico} MX {g.madrugada ? "⚠️ Madrugada" : ""}
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
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Tennis tournaments */}
            {sport === "tennis" && (
              <Card>
                <SectionHead>🎾 TENIS — ANÁLISIS DE PARTIDO</SectionHead>
                <p style={{ color:"#666", fontSize:13, marginBottom:16 }}>Selecciona los jugadores y configura el partido para obtener un análisis completo con datos reales de la temporada 2026.</p>
                <GreenBtn onClick={() => setTab("analisis")}>🔍 IR AL ANÁLISIS DE PARTIDO</GreenBtn>
              </Card>
            )}

            {/* Quick stats */}
            {bets.length > 0 && (
              <Card>
                <SectionHead>📊 MI RENDIMIENTO</SectionHead>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                  {[["✅ Ganadas", stats.won, "#4ade80"],["❌ Perdidas", stats.lost, "#f87171"],["🎯 Acierto", `${stats.pct}%`, "#facc15"],["📈 ROI", `${stats.roi}%`, stats.roi >= 0 ? "#4ade80" : "#f87171"],["💰 Banca", `$${stats.bancaActual.toFixed(0)}`, "#fff"],["📊 Profit", `${stats.profit >= 0 ? "+" : ""}$${stats.profit.toFixed(0)}`, stats.profit >= 0 ? "#4ade80" : "#f87171"]].map(([l,v,c]) => (
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

        {/* ══ ANÁLISIS ══ */}
        {tab === "analisis" && (
          <div style={{ animation:"fadeUp .3s ease" }}>
            {/* Sport toggle */}
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              {[["tennis","🎾 Tenis"],["mlb","⚾ MLB"]].map(([id,label]) => (
                <button key={id} onClick={() => setSport(id)}
                  style={{ padding:"8px 18px", border:`2px solid ${sport===id ? G : "#ddd"}`, borderRadius:20, background: sport===id ? "#dcfce7" : "#fff", cursor:"pointer", fontSize:13, fontWeight:700, color: sport===id ? G : "#888" }}>
                  {label}
                </button>
              ))}
            </div>

            {/* ── TENNIS ANALYSIS ── */}
            {sport === "tennis" && (
              <>
                <Card>
                  <SectionHead>🎾 CONFIGURAR PARTIDO</SectionHead>
                  <div style={{ display:"flex", gap:10, marginBottom:16 }}>
                    {["ATP","WTA"].map(t => (
                      <button key={t} onClick={() => { setTour(t); setP1(emptyP()); setP2(emptyP()); setP1Manual(false); setP2Manual(false); }}
                        style={{ flex:1, padding:11, border:`2px solid ${tour===t ? G : "#ddd"}`, borderRadius:8, background: tour===t ? "#dcfce7" : "#fff", cursor:"pointer", fontFamily:"'Oswald',sans-serif", fontSize:18, fontWeight:700, color: tour===t ? G : "#888", letterSpacing:2 }}>
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
                      <select style={{ width:"100%", padding:"9px 12px", border:"1px solid #ddd", borderRadius:6, fontSize:13, background:"#fff", cursor:"pointer" }} value={surface} onChange={e => setSurface(e.target.value)}>
                        <option value="">— Seleccionar —</option>
                        <option>Arcilla</option><option>Pista Dura</option><option>Pista Dura Indoor</option><option>Hierba</option>
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

                {/* Players */}
                <Card>
                  <SectionHead>👤 JUGADORES</SectionHead>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                    {[[p1,setP1,1,p1Manual,setP1Manual],[p2,setP2,2,p2Manual,setP2Manual]].map(([pl,setPl,num,isManual,setManual]) => (
                      <div key={num} style={{ background:"#f9fafb", border:"1px solid #e8e8e8", borderRadius:8, padding:14 }}>
                        <div style={{ fontFamily:"'Oswald',sans-serif", fontSize:14, fontWeight:700, color:GD, letterSpacing:1, marginBottom:10, paddingBottom:8, borderBottom:"1px solid #eee" }}>JUGADOR {num}</div>

                        <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Seleccionar</label>
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
                          <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Lesión / Estado físico</label>
                          <input style={{ width:"100%", padding:"8px 12px", border:"1px solid #ddd", borderRadius:6, fontSize:12 }}
                            placeholder="Ej: Lesión de rodilla — regresó hace 3 partidos" value={pl.injury} onChange={e => setPl(p => ({ ...p, injury: e.target.value }))} />
                        </div>

                        <div style={{ marginBottom:10 }}>
                          <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Momentum / Racha</label>
                          <input style={{ width:"100%", padding:"8px 12px", border:"1px solid #ddd", borderRadius:6, fontSize:12 }}
                            placeholder="Ej: Ganó Roland Garros 2025, viene en racha" value={pl.momentum} onChange={e => setPl(p => ({ ...p, momentum: e.target.value }))} />
                        </div>

                        <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Forma reciente</label>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:10 }}>
                          {FORM_OPTS.map(o => <Chip key={o} label={o} active={pl.form===o} onClick={() => setPl(p => ({ ...p, form:o }))} sm />)}
                        </div>

                        <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>En {surface || "esta superficie"}</label>
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

                {/* H2H */}
                <Card>
                  <SectionHead>⚔️ HEAD TO HEAD</SectionHead>
                  <GreenBtn onClick={fetchH2H} disabled={loadingH2H || !p1.name || !p2.name} style={{ marginBottom:12, opacity:(!p1.name||!p2.name) ? 0.5 : 1 }}>
                    {loadingH2H ? "⚡ Buscando H2H..." : "🔄 JALAR H2H AUTOMÁTICO"}
                  </GreenBtn>
                  {h2hData && <div style={{ background:"#dcfce7", borderRadius:6, padding:"8px 12px", fontSize:13, color:GD, marginBottom:12 }}>✅ H2H real obtenido de la API</div>}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 2fr", gap:12 }}>
                    {[["Partidos totales","total"],["Victorias de "+p1.name.split(" ")[0],"p1Wins"]].map(([lbl,key]) => (
                      <div key={key}>
                        <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>{lbl}</label>
                        <input style={{ width:"100%", padding:"9px 12px", border:"1px solid #ddd", borderRadius:6, fontSize:13 }} type="number" placeholder="0" value={h2h[key]} onChange={e => setH2H(p => ({ ...p, [key]:e.target.value }))} />
                      </div>
                    ))}
                    <div>
                      <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:6 }}>Últimos enfrentamientos</label>
                      <div style={{ display:"flex", gap:6 }}>
                        {[p1.name.split(" ")[0]||"J1", p2.name.split(" ")[0]||"J2", "Parejo"].map(o => (
                          <Chip key={o} label={o} active={h2h.recentFavor===o} onClick={() => setH2H(p => ({ ...p, recentFavor:o }))} sm />
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Odds */}
                <Card>
                  <SectionHead>💰 CUOTAS (de Playdoit u otro casino)</SectionHead>
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

            {/* ── MLB ANALYSIS ── */}
            {sport === "mlb" && (
              <>
                {!selectedGame && (
                  <Card>
                    <SectionHead>⚾ SELECCIONAR PARTIDO MLB</SectionHead>
                    <p style={{ color:"#666", fontSize:13, marginBottom:12 }}>Ve a Inicio → carga los juegos de hoy y selecciona uno, o configura manualmente.</p>
                    <GreenBtn onClick={() => setTab("hoy")}>← IR A CARGAR JUEGOS</GreenBtn>
                  </Card>
                )}

                {selectedGame && (
                  <Card>
                    <SectionHead>⚾ PARTIDO SELECCIONADO</SectionHead>
                    <div style={{ background:"#f0fdf4", border:`1px solid ${G}`, borderRadius:8, padding:"12px 16px", marginBottom:16 }}>
                      <div style={{ fontFamily:"'Oswald',sans-serif", fontSize:18, fontWeight:700, textAlign:"center" }}>
                        {selectedGame.away_team} @ {selectedGame.home_team}
                      </div>
                      <div style={{ textAlign:"center", fontSize:13, color:"#666", marginTop:4 }}>
                        {selectedGame.venue} · {selectedGame.time_mexico} MX · {selectedGame.weather?.wind_betting}
                      </div>
                    </div>
                  </Card>
                )}

                <Card>
                  <SectionHead>⚾ DATOS DE LOS EQUIPOS</SectionHead>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                    {[[homeTeam,setHomeTeam,"🏠 LOCAL"],[awayTeam,setAwayTeam,"✈️ VISITANTE"]].map(([team,setTeam,label]) => (
                      <div key={label} style={{ background:"#f9fafb", border:"1px solid #eee", borderRadius:8, padding:14 }}>
                        <div style={{ fontFamily:"'Oswald',sans-serif", fontSize:14, fontWeight:700, color:GD, marginBottom:10, paddingBottom:8, borderBottom:"1px solid #eee" }}>{label}</div>
                        {[["Equipo","team","Ej: Los Angeles Dodgers"],["Récord (V-D)","record","28-14"],["Pitcher titular","pitcher","Nombre del pitcher"],["ERA / Stats del pitcher","pitcherEra","ERA 2.45 / WHIP 0.98"],["Bullpen (Bueno/Regular/Débil)","bullpenRating","Ej: Bueno — cerrador Chapman en forma"],["Forma reciente bateadores","recentForm","Ej: .285 AVG últimos 10 días"]].map(([lbl,key,ph]) => (
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
                    {[["Cuota Local",mlbOddsHome,setMlbOddsHome,"-150"],["Cuota Visitante",mlbOddsAway,setMlbOddsAway,"+130"],["Total Carreras",mlbTotal,setMlbTotal,"8.5"],["Cuota Over",mlbOverOdds,setMlbOverOdds,"-110"],["Cuota Under",mlbUnderOdds,setMlbUnderOdds,"-110"]].map(([lbl,val,set,ph]) => (
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
                  {p1.ranking && <span style={{ background:"#dcfce7", color:GD, fontSize:11, fontWeight:700, padding:"2px 6px", borderRadius:8, margin:"0 6px" }}>#{p1.ranking}</span>}
                  <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:18, fontWeight:800, color:G, margin:"0 10px" }}>VS</span>
                  <span style={{ fontFamily:"'Oswald',sans-serif", fontSize:20, fontWeight:700 }}>{p2.name}</span>
                  {p2.ranking && <span style={{ background:"#dcfce7", color:GD, fontSize:11, fontWeight:700, padding:"2px 6px", borderRadius:8, margin:"0 6px" }}>#{p2.ranking}</span>}
                </div>
              )}
              <GreenBtn onClick={runAnalysis} disabled={loadingAnalysis}>
                {loadingAnalysis ? "⚡ Analizando..." : "🔍 GENERAR PRONÓSTICO CON IA"}
              </GreenBtn>
            </div>

            {loadingAnalysis && <LoadBox text="Analizando partido con IA — datos 2026..." />}
            <ResultBox result={analysis} title={sport === "tennis" ? "PRONÓSTICO DE TENIS" : "PRONÓSTICO MLB"} />
          </div>
        )}

        {/* ══ PICKS DEL DÍA ══ */}
        {tab === "picks" && (
          <div style={{ animation:"fadeUp .3s ease" }}>
            <Card>
              <SectionHead>🎯 SELECCIONA EL DEPORTE PARA LOS PICKS</SectionHead>
              <div style={{ display:"flex", gap:8, marginBottom:0 }}>
                {[["tennis","🎾"],["mlb","⚾"],["mix","🌎 Mix"]].map(([id,label]) => (
                  <button key={id} onClick={() => setSport(id === "mix" ? "mix" : id)}
                    style={{ flex:1, padding:"10px", border:`2px solid ${sport===id ? G : "#ddd"}`, borderRadius:8, background: sport===id ? "#dcfce7" : "#fff", cursor:"pointer", fontFamily:"'Oswald',sans-serif", fontSize:16, fontWeight:700, color: sport===id ? G : "#888" }}>
                    {label}
                  </button>
                ))}
              </div>
            </Card>

            {[
              { key:"mejordia", icon:"⭐", title:"MEJOR APUESTA DEL DÍA", desc:"La apuesta individual con mayor valor real y confianza." },
              { key:"combinada", icon:"🔗", title:"COMBINADA DEL DÍA", desc:"2-3 picks seguros con buen balance riesgo/recompensa. Cuota estimada 2.5-4.0." },
              { key:"underdog", icon:"🐴", title:"UNDERDOGS DEL DÍA", desc:"2-3 picks donde el favorito está sobrevalorado. Value bets reales." },
              { key:"sonador", icon:"🚀", title:"SOÑADOR DEL DÍA", desc:"3-4 picks de mayor riesgo. Cuota alta. Solo apuesta el 1% de tu banca." },
              { key:"parlay", icon:"💣", title:"PARLAY FANÁTICO", desc:"4-5 underdogs mezclados tenis + MLB. Cuota objetivo 8.0+. Máximo riesgo." },
            ].map(({ key, icon, title, desc }) => {
              const sportKey = sport === "mix" ? "tennis" : sport;
              const resultKey = `${key}_${sportKey}`;
              return (
                <Card key={key}>
                  <SectionHead>{icon} {title}</SectionHead>
                  <p style={{ color:"#666", fontSize:13, marginBottom:14 }}>{desc}</p>
                  {key === "mejordia" && sport === "mlb" && mlbGames.length === 0 && (
                    <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:6, padding:"8px 12px", fontSize:13, color:"#92400e", marginBottom:12 }}>
                      ⚠️ Carga los juegos MLB en Inicio primero para mejor análisis
                    </div>
                  )}
                  <GreenBtn onClick={() => runSection(key, sportKey)} disabled={loadingSection[resultKey]}>
                    {loadingSection[resultKey] ? "⚡ Analizando..." : `${icon} GENERAR ${title}`}
                  </GreenBtn>
                  {loadingSection[resultKey] && <LoadBox text={`Analizando partidos de ${sportKey === "mlb" ? "MLB" : "tenis"}...`} />}
                  <ResultBox result={sectionResult[resultKey]} title={title} />
                </Card>
              );
            })}
          </div>
        )}

        {/* ══ BANKROLL ══ */}
        {tab === "bankroll" && (
          <div style={{ animation:"fadeUp .3s ease" }}>
            {!bancaSet ? (
              <Card>
                <SectionHead>💰 CONFIGURAR BANCA INICIAL</SectionHead>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Monto inicial (MXN)</label>
                <input 
                  style={{ width:"100%", padding:14, border:"1px solid #ddd", borderRadius:8, fontSize:22, fontWeight:700, marginBottom:12 }} 
                  type="number" 
                  placeholder="Ej: 2000" 
                  defaultValue={banca}
                  onBlur={e => setBanca(e.target.value)}
                  inputMode="numeric"
                />
                <GreenBtn onClick={() => banca && setBancaSet(true)}>CONFIGURAR BANCA</GreenBtn>
              </Card>
            ) : (
              <>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
                  {[["💰 Banca Inicial",`$${parseFloat(banca).toLocaleString()} MXN`,"#fff"],["📈 Banca Actual",`$${stats.bancaActual.toFixed(0)} MXN`, stats.profit>=0?"#4ade80":"#f87171"],["✅ Ganadas",stats.won,"#4ade80"],["❌ Perdidas",stats.lost,"#f87171"],["🎯 % Acierto",`${stats.pct}%`,"#facc15"],["📊 ROI",`${stats.roi}%`,stats.roi>=0?"#4ade80":"#f87171"]].map(([lbl,val,col]) => (
                    <div key={lbl} style={{ background:"#14532d", borderRadius:10, padding:"14px 16px" }}>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,.6)", fontWeight:700, letterSpacing:.5, marginBottom:6 }}>{lbl}</div>
                      <div style={{ fontFamily:"'Oswald',sans-serif", fontSize:20, fontWeight:700, color:col }}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* Efectividad por tipo */}
                {Object.keys(tipos).length > 0 && (
                  <Card>
                    <SectionHead>📊 EFECTIVIDAD POR SECCIÓN</SectionHead>
                    {Object.entries(tipos).map(([tipo, d]) => (
                      <div key={tipo} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                        <span style={{ fontSize:12, fontWeight:600, minWidth:160 }}>{tipo}</span>
                        <div style={{ flex:1, height:8, background:"#e8e8e8", borderRadius:4, overflow:"hidden" }}>
                          <div style={{ height:"100%", background:G, width:`${d.pct}%`, borderRadius:4 }} />
                        </div>
                        <span style={{ fontSize:12, fontWeight:700, color:GD, minWidth:80, textAlign:"right" }}>{d.g}G · {d.p}P · {d.pct}%</span>
                      </div>
                    ))}
                  </Card>
                )}

                {/* Add bet */}
                <Card>
                  <SectionHead>➕ REGISTRAR APUESTA</SectionHead>
                  <div style={{ display:"grid", gridTemplateColumns:"2fr 2fr 1fr 1fr", gap:10, marginBottom:10 }}>
                    {[["Partido","partido","Sinner vs Alcaraz"],["Pick / Mercado","pick","Sinner ganador"],["Momio","momio","1.75"],["Monto $","monto","100"]].map(([lbl,key,ph]) => (
                      <div key={key}>
                        <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:5 }}>{lbl}</label>
                        <input 
                          style={{ width:"100%", padding:"9px 12px", border:"1px solid #ddd", borderRadius:6, fontSize:13 }}
                          type={key==="momio"||key==="monto"?"number":"text"} 
                          placeholder={ph} 
                          defaultValue={newBet[key]}
                          onBlur={e => setNewBet(b => ({ ...b, [key]:e.target.value }))}
                          inputMode={key==="momio"||key==="monto"?"decimal":"text"}
                        />
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

                {/* Bets table */}
                {bets.length > 0 && (
                  <Card>
                    <SectionHead>📋 HISTORIAL DE APUESTAS</SectionHead>
                    <div style={{ overflowX:"auto" }}>
                      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                        <thead>
                          <tr>{["Partido","Pick","Momio","Monto","Deporte","Origen","Ganancia","Resultado"].map(h => (
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
                                <td style={{ padding:"8px 10px", borderBottom:"1px solid #f0f0f0", fontSize:11 }}>{b.tipo}</td>
                                <td style={{ padding:"8px 10px", borderBottom:"1px solid #f0f0f0", fontWeight:700, color: b.resultado==="ganada" ? G : b.resultado==="perdida" ? "#e53e3e" : "#888" }}>{gan}</td>
                                <td style={{ padding:"8px 10px", borderBottom:"1px solid #f0f0f0" }}>
                                  {!b.resultado ? (
                                    <div style={{ display:"flex", gap:4 }}>
                                      <button onClick={() => markResult(b.id,"ganada")} style={{ background:"#dcfce7", border:"none", borderRadius:4, padding:"4px 8px", cursor:"pointer", fontSize:13 }}>✅</button>
                                      <button onClick={() => markResult(b.id,"perdida")} style={{ background:"#fee2e2", border:"none", borderRadius:4, padding:"4px 8px", cursor:"pointer", fontSize:13 }}>❌</button>
                                    </div>
                                  ) : <span style={{ fontWeight:700, fontSize:13 }}>{b.resultado==="ganada" ? "✅ Ganada" : "❌ Perdida"}</span>}
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
