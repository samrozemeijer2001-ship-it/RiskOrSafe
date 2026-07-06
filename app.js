/* =========================================================================
   SAFE / RISK - Party Edition
   app.js  (vanilla JavaScript, geen frameworks)

   Structuur van dit bestand:
   1. PUNISHMENTS   -> hier pas je de straffen/opdrachten aan
   2. CONFIG        -> kansen, kleuren en labels aanpassen
   3. HELPERS       -> kleine hulpfuncties (levels, kleuren, tekst)
   4. STATE         -> spelersdata en spelvoortgang
   5. SCREENS       -> navigatie tussen schermen
   6. GAME LOGIC    -> de eigenlijke spelregels
   7. INIT          -> knoppen koppelen
   ========================================================================= */


/* =========================================================================
   1. PUNISHMENTS  >>> HIER PAS JE DE STRAFFEN AAN <<<
   -------------------------------------------------------------------------
   Elke categorie is een lijst met opdrachten. Je mag zoveel toevoegen als
   je wilt. Twee vormen zijn toegestaan:

     a) Gewone tekst (string):
        "{player}, neem 2 slokken."

     b) Object met een 'force' (verplicht de volgende keuze van iemand):
        { text: "{player}, verplicht volgende ronde SAFE.",
          force: { who: "self", choice: "safe" } }

        who:    "self"      = de huidige speler
                "next"      = de volgende speler
                "previous"  = de vorige speler
        choice: "safe" of "risk"

   PLACEHOLDERS die je in teksten mag gebruiken:
     {player}         = huidige speler
     {leftPlayer}     = speler links / vorige speler
     {rightPlayer}    = speler rechts / volgende speler
     {nextPlayer}     = volgende speler aan de beurt
     {previousPlayer} = vorige speler

   BELANGRIJK: de app kiest NOOIT zelf een slachtoffer voor uitdeel-straffen.
   Schrijf dus "deel 4 slokken uit" en laat de speler zelf kiezen aan wie.
   ========================================================================= */
const punishments = {

  /* ---------- SAFE (veilig spelen) ---------- */
  safe: {
    // level 1 = 1x achter elkaar SAFE
    level1: {
      good: [
        "{player}, lekker veilig. Je mag deze ronde uitdelen: geef 1 slok weg.",
        "{player}, niks aan de hand. Neem een slokje water als je wilt.",
        "{player}, rustig begin. {rightPlayer} neemt 1 slok.",
        "{player}, veilig gespeeld. Iedereen proost, jij hoeft niet.",
        "{player}, je mag deze ronde een simpele regel bedenken voor 2 minuten."
      ],
      bad: [
        "{player}, toch even pech: neem 1 slok.",
        "{player}, klein prijsje: neem 1 slok.",
        "{player}, saai wordt afgestraft, neem 1 slok.",
        "{player}, deel 1 slok uit en neem er zelf ook 1.",
        "{leftPlayer}, geef {player} gezelschap: allebei 1 slok."
      ]
    },
    // level 2 = 2x achter elkaar SAFE
    level2: {
      good: [
        "{player}, nog steeds droog. Deel 2 slokken uit.",
        "{player}, safe queen/king. Kies iemand die 1 slok neemt.",
        "{player}, je ontsnapt. {leftPlayer} en {rightPlayer} nemen 1 slok.",
        "{player}, niks te doen. Verzin een toast.",
        "{player}, veilig maar verdacht rustig. Sla deze ronde over."
      ],
      bad: [
        "{player}, te voorzichtig: neem 2 slokken.",
        "{player}, de saaiheidsbelasting: neem 2 slokken.",
        "{player}, neem 1 slok en deel er 1 uit.",
        "{player}, twijfelaar, neem 2 slokken.",
        "{previousPlayer} wijst en lacht: {player} neemt 2 slokken."
      ]
    },
    // level 3 = 3x achter elkaar SAFE
    level3: {
      good: [
        "{player}, meesterlijk ontweken. Deel 3 slokken uit.",
        "{player}, teflon-speler. Iedereen behalve jij neemt 1 slok.",
        "{player}, je glipt er weer langs. Kies iemand die moet zingen.",
        "{player}, safe god. Maak een regel voor de komende 5 minuten.",
        "{player}, ontsnapt! {rightPlayer} neemt 2 slokken namens jou."
      ],
      bad: [
        "{player}, dit was te veilig: neem 3 slokken.",
        "{player}, de lafheid haalt je in: neem 3 slokken.",
        "{player}, neem 2 slokken en deel er 1 uit.",
        "{player}, verstopt achter SAFE: 3 slokken.",
        "Iedereen wijst naar {player}: neem 3 slokken."
      ]
    },
    // level 4 = 4x of vaker achter elkaar SAFE (blijft level 4)
    level4: {
      good: [
        "{player}, onaantastbaar. Deel 4 slokken uit zoals jij wilt.",
        "{player}, de veiligste van de avond. Iedereen neemt 1 slok, jij niet.",
        {
          text: "{player}, je ontsnapt - maar kies wie jouw lot overneemt (verplicht RISK).",
          force: { who: "next", choice: "risk" }
        },
        "{player}, ijskoud ontweken. Verzin een regel die de hele ronde geldt.",
        "{player}, safe legend. Wijs iemand aan die 3 slokken neemt."
      ],
      bad: [
        "{player}, zo veilig dat het pijn doet: neem 4 slokken.",
        "{player}, de lafheidsmeter is vol: neem 4 slokken.",
        "{player}, neem 3 slokken en deel er 1 uit.",
        {
          text: "{player}, straf voor te veel SAFE: neem 3 slokken en speel volgende ronde verplicht RISK.",
          force: { who: "self", choice: "risk" }
        },
        "Iedereen drinkt 1, behalve {player} - maar {player} neemt er 4."
      ]
    }
  },

  /* ---------- RISK (alles of niets) ---------- */
  risk: {
    // heat 1 = 1e keer RISK
    heat1: {
      win: [
        "{player}, gewonnen! Deel 2 slokken uit.",
        "{player}, gedurfd en beloond. {rightPlayer} neemt 1 slok.",
        "{player}, mooi risico. Iedereen behalve jij neemt 1 slok.",
        "{player}, winst! Kies iemand die een shotje neemt (of slok).",
        "{player}, je durft. Maak een regel voor 3 minuten."
      ],
      lose: [
        "{player}, mis: neem 2 slokken.",
        "{player}, risico mislukt, neem 2 slokken.",
        "{player}, doe een korte dans of neem 2 slokken.",
        "{player}, verloren. Neem 1 slok en deel er 1 uit.",
        "{leftPlayer} mag kiezen: laat {player} 2 slokken nemen."
      ]
    },
    // heat 2
    heat2: {
      win: [
        "{player}, on fire! Deel 3 slokken uit.",
        "{player}, gewonnen. Iedereen neemt 1 slok op jouw gezondheid.",
        "{player}, gedurfd. Kies iemand die zijn/haar telefoon 1 ronde weglegt.",
        "{player}, winst! {leftPlayer} en {rightPlayer} nemen 1 slok.",
        "{player}, lekker bezig. Verzin een uitdaging voor de volgende speler."
      ],
      lose: [
        "{player}, au: neem 3 slokken.",
        "{player}, risico ging mis, neem 3 slokken.",
        "{player}, doe 5 push-ups of neem 3 slokken.",
        "{player}, verloren. Neem 2 slokken en deel er 1 uit.",
        "{player}, vertel een gênant feitje over jezelf of neem 3 slokken."
      ]
    },
    // heat 3
    heat3: {
      win: [
        "{player}, ijzersterk! Deel 4 slokken uit.",
        "{player}, gewonnen. Iedereen neemt 2 slokken, jij deelt uit.",
        "{player}, durfal. Kies iemand die de volgende ronde jouw opdracht overneemt.",
        "{player}, winst! Maak een stevige regel voor de rest van het spel.",
        "{player}, held. {rightPlayer} neemt 3 slokken namens jou."
      ],
      lose: [
        "{player}, dat doet zeer: neem 4 slokken.",
        "{player}, flink misgegokt, neem 4 slokken.",
        "{player}, imiteer iemand aan tafel of neem 4 slokken.",
        {
          text: "{player}, verloren. Neem 3 slokken en speel volgende ronde verplicht SAFE.",
          force: { who: "self", choice: "safe" }
        },
        "{player}, vertel je meest embarrassante verhaal of drink 4."
      ]
    },
    // heat 4 = 4e keer of vaker RISK (blijft heat 4)
    heat4: {
      win: [
        "{player}, ongenaakbaar! Deel 5 slokken uit zoals jij wilt.",
        "{player}, gewonnen op het hoogste niveau. Iedereen neemt 2 slokken.",
        "{player}, absolute durfal. Verzin de heftigste regel van de avond.",
        {
          text: "{player}, gewonnen - dwing de volgende speler tot RISK.",
          force: { who: "next", choice: "risk" }
        },
        "{player}, legende. Kies twee mensen die elk 2 slokken nemen."
      ],
      lose: [
        "{player}, verbrand: neem 5 slokken.",
        "{player}, alles of niets... en het werd niets: neem 5 slokken.",
        "{player}, vertel je meest gênante verhaal OF drink 4.",
        "{player}, doe iets geks (naar keuze van de groep) of neem 5 slokken.",
        {
          text: "{player}, oververhit. Neem 4 slokken en speel volgende ronde verplicht SAFE.",
          force: { who: "self", choice: "safe" }
        }
      ]
    }
  }
};


/* =========================================================================
   2. CONFIG  >>> HIER PAS JE KANSEN, KLEUREN EN LABELS AAN <<<
   ========================================================================= */

/* ---- Kans op 'bad' bij SAFE, per straf-level (1 t/m 4) ----
   (win/lose bij RISK is altijd 50/50 - zie ROLL_RISK)          */
const SAFE_BAD_CHANCE = {
  1: 0.15,  // level 1: 85% good / 15% bad
  2: 0.30,  // level 2: 70% / 30%
  3: 0.60,  // level 3: 40% / 60%
  4: 0.80   // level 4: 20% / 80%
};

/* ---- Statuslabels per visualLevel (0 t/m 10) ---- */
const LABELS = {
  risk: [
    "Neutraal",       // 0
    "Warm",           // 1
    "Risky",          // 2
    "Heet",           // 3
    "Oververhit",     // 4
    "Verbrand",       // 5
    "Geen controle",  // 6
    "Donker rood",    // 7
    "Zwart randje",   // 8
    "Geen weg terug", // 9
    "Opgebrand"       // 10
  ],
  safe: [
    "Neutraal",           // 0
    "Safe",               // 1
    "Te veilig",          // 2
    "Verdacht",           // 3
    "Lafheidsmeter vol",  // 4
    "IJskoud",            // 5
    "Te stil",            // 6
    "Bevroren",           // 7
    "Wit alarm",          // 8
    "Geen lef gevonden",  // 9
    "Doorgelicht"         // 10
  ]
};

/* ---- Sfeerkleuren per visualLevel (0 t/m 10) ----
   Elk niveau: bg1 (bovenkant gradient), bg2 (onderkant),
   accent (knop/badge/balk), glow (gloed rond de kaart).
   RISK: van donker -> knalrood (4) -> steeds donkerder/verbrand (10)
   SAFE: van donker -> fel ijsblauw (4) -> steeds lichter/wit (10)   */
const NEUTRAL = { bg1: "#1a1a1f", bg2: "#0a0a0d", accent: "#6b6b78", glow: "rgba(0,0,0,0)" };

const COLORS = {
  risk: [
    NEUTRAL,                                                                           // 0
    { bg1: "#2a1618", bg2: "#120a0c", accent: "#b3564f", glow: "rgba(200,70,70,0.15)" },// 1 subtiele gloed
    { bg1: "#3a1618", bg2: "#170a0b", accent: "#d1443f", glow: "rgba(210,60,60,0.22)" },// 2 duidelijker
    { bg1: "#4d1414", bg2: "#1c0909", accent: "#e63b3b", glow: "rgba(230,55,55,0.32)" },// 3 fel
    { bg1: "#611010", bg2: "#210707", accent: "#ff3838", glow: "rgba(255,60,60,0.42)" },// 4 knalrood
    { bg1: "#520f0f", bg2: "#1c0606", accent: "#df3030", glow: "rgba(210,45,45,0.40)" },// 5
    { bg1: "#450d0d", bg2: "#170505", accent: "#c22a2a", glow: "rgba(180,38,38,0.38)" },// 6
    { bg1: "#390b0a", bg2: "#130404", accent: "#a12622", glow: "rgba(150,32,30,0.36)" },// 7 donker rood
    { bg1: "#2d0a07", bg2: "#0e0303", accent: "#82211b", glow: "rgba(120,28,22,0.34)" },// 8 bruinrood
    { bg1: "#210805", bg2: "#0a0202", accent: "#631c14", glow: "rgba(90,24,16,0.32)" }, // 9
    { bg1: "#160603", bg2: "#050101", accent: "#45160d", glow: "rgba(60,18,10,0.30)" }  // 10 verbrand
  ],
  safe: [
    NEUTRAL,                                                                            // 0
    { bg1: "#16202e", bg2: "#0a0e14", accent: "#4f7fd6", glow: "rgba(70,120,210,0.15)" },// 1 subtiel blauw
    { bg1: "#16293c", bg2: "#0a1017", accent: "#4a92d6", glow: "rgba(60,140,215,0.22)" },// 2 koeler
    { bg1: "#164a5e", bg2: "#091c24", accent: "#4fb3e6", glow: "rgba(70,180,235,0.32)" },// 3 lichtblauw
    { bg1: "#1a708f", bg2: "#082530", accent: "#4fd6ff", glow: "rgba(90,215,255,0.42)" },// 4 fel ijsblauw
    { bg1: "#2c83a6", bg2: "#0f3540", accent: "#7fdcf5", glow: "rgba(150,228,255,0.44)" },// 5
    { bg1: "#3f97b8", bg2: "#164450", accent: "#a3e6f7", glow: "rgba(180,235,255,0.46)" },// 6
    { bg1: "#5aabc9", bg2: "#24555f", accent: "#c2eef9", glow: "rgba(200,240,255,0.48)" },// 7 bleekblauw
    { bg1: "#83c2d9", bg2: "#3a6d78", accent: "#dbf5fb", glow: "rgba(220,245,255,0.52)" },// 8 bijna wit
    { bg1: "#addae8", bg2: "#5f929c", accent: "#ecfaff", glow: "rgba(235,250,255,0.58)" },// 9
    { bg1: "#daf0f7", bg2: "#94bcc4", accent: "#ffffff", glow: "rgba(255,255,255,0.65)" } // 10 ijskoud/wit
  ]
};

/* ---- Grenzen aan het aantal spelers ---- */
const MIN_PLAYERS = 3;
const MAX_PLAYERS = 12;


/* =========================================================================
   3. HELPERS
   ========================================================================= */

// Straf-level: nooit hoger dan 4 (straffen groeien niet verder).
function punishmentLevel(value) {
  return Math.max(1, Math.min(4, value));
}

// Visueel niveau: 0 t/m 10 (sfeer mag wel doorgroeien).
function visualLevel(value) {
  return Math.max(0, Math.min(10, value));
}

// Kies willekeurig een item uit een lijst.
function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Zet placeholders in een tekst om naar echte namen.
function fillPlaceholders(text, index) {
  const n = state.players.length;
  const cur = state.players[index].name;
  const prev = state.players[(index - 1 + n) % n].name;
  const next = state.players[(index + 1) % n].name;
  return text
    .replace(/{player}/g, cur)
    .replace(/{previousPlayer}/g, prev)
    .replace(/{leftPlayer}/g, prev)
    .replace(/{nextPlayer}/g, next)
    .replace(/{rightPlayer}/g, next);
}

// Normaliseer een straf-item: string OF { text, force }.
function normalizePunishment(item) {
  if (typeof item === "string") return { text: item, force: null };
  return { text: item.text, force: item.force || null };
}

// Pas de sfeerkleuren toe op basis van type + visualLevel.
function applyMood(type, vLevel) {
  const c = COLORS[type][vLevel];
  const app = document.getElementById("app");
  app.style.setProperty("--bg-1", c.bg1);
  app.style.setProperty("--bg-2", c.bg2);
  app.style.setProperty("--accent", c.accent);
  app.style.setProperty("--glow", c.glow);
}

// Reset de sfeer naar neutraal (bv. op start/tussen-schermen).
function resetMood() {
  const app = document.getElementById("app");
  app.style.setProperty("--bg-1", NEUTRAL.bg1);
  app.style.setProperty("--bg-2", NEUTRAL.bg2);
  app.style.setProperty("--accent", NEUTRAL.accent);
  app.style.setProperty("--glow", NEUTRAL.glow);
}


/* =========================================================================
   4. STATE  (alle spelinformatie)
   ========================================================================= */
const state = {
  playerCount: 4,
  players: [],       // { name, safeStreak, riskHeat, forceNextChoice }
  current: 0,        // index van de speler die aan de beurt is
  round: 1
};

// Maak een leeg speler-object.
function makePlayer(name) {
  return {
    name: name,
    safeStreak: 0,
    riskHeat: 0,
    forceNextChoice: null   // null | "safe" | "risk"
  };
}


/* =========================================================================
   5. SCREENS (navigatie)
   ========================================================================= */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("screen--active"));
  document.getElementById(id).classList.add("screen--active");
}


/* =========================================================================
   6. GAME LOGIC
   ========================================================================= */

/* ---- Aantal spelers scherm ---- */
function renderCount() {
  document.getElementById("count-number").textContent = state.playerCount;

  // dots: 1 per mogelijk spelersaantal (3 t/m 12)
  const dots = document.getElementById("count-dots");
  dots.innerHTML = "";
  for (let i = MIN_PLAYERS; i <= MAX_PLAYERS; i++) {
    const d = document.createElement("span");
    d.className = "dot" + (i === state.playerCount ? " is-active" : "");
    dots.appendChild(d);
  }
}

function changeCount(delta) {
  state.playerCount = Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, state.playerCount + delta));
  renderCount();
}

/* ---- Namen invullen scherm ---- */
function renderNameInputs() {
  const list = document.getElementById("name-list");
  list.innerHTML = "";
  for (let i = 0; i < state.playerCount; i++) {
    const row = document.createElement("div");
    row.className = "name-row";
    row.innerHTML =
      '<span class="name-badge">' + (i + 1) + '</span>' +
      '<input class="name-input" type="text" maxlength="16" ' +
      'placeholder="Speler ' + (i + 1) + '" data-index="' + i + '" />';
    list.appendChild(row);
  }
}

// Bouw de spelers op basis van de ingevulde namen.
// Lege velden worden automatisch "Speler X".
function buildPlayers(useDefaults) {
  state.players = [];
  const inputs = document.querySelectorAll(".name-input");
  for (let i = 0; i < state.playerCount; i++) {
    let name = "Speler " + (i + 1);
    if (!useDefaults && inputs[i]) {
      const typed = inputs[i].value.trim();
      if (typed) name = typed;
    }
    state.players.push(makePlayer(name));
  }
  state.current = 0;
  state.round = 1;
}

/* ---- Beurtscherm ---- */
function renderTurn() {
  resetMood();
  const player = state.players[state.current];

  document.getElementById("turn-round").textContent = "RONDE " + state.round;
  document.getElementById("turn-player").textContent = player.name;

  // dots bovenaan tonen wie aan de beurt is (max 12)
  const dots = document.getElementById("turn-dots");
  dots.innerHTML = "";
  const shown = Math.min(state.players.length, 12);
  for (let i = 0; i < shown; i++) {
    const d = document.createElement("span");
    d.className = "dot" + (i === state.current ? " is-active" : "");
    dots.appendChild(d);
  }

  // forceNextChoice: blokkeer de andere knop indien nodig
  const safeCard = document.getElementById("card-safe");
  const riskCard = document.getElementById("card-risk");
  safeCard.classList.remove("is-locked");
  riskCard.classList.remove("is-locked");

  if (player.forceNextChoice === "safe") {
    riskCard.classList.add("is-locked");   // moet SAFE kiezen
  } else if (player.forceNextChoice === "risk") {
    safeCard.classList.add("is-locked");   // moet RISK kiezen
  }

  showScreen("screen-turn");
}

/* ---- De speler maakt een keuze: "safe" of "risk" ---- */
function makeChoice(type) {
  const player = state.players[state.current];

  // De verplichting van deze beurt is nu benut -> weer vrijgeven.
  player.forceNextChoice = null;

  let level;        // straf-level (1..4)
  let vLevel;       // visueel niveau (0..10)
  let outcome;      // safe: good/bad   |  risk: win/lose
  let bucket;       // de juiste lijst met opdrachten

  if (type === "safe") {
    // SAFE: streak omhoog, heat langzaam afkoelen (min 0)
    player.safeStreak += 1;
    player.riskHeat = Math.max(0, player.riskHeat - 1);

    level = punishmentLevel(player.safeStreak);
    vLevel = visualLevel(player.safeStreak);

    outcome = Math.random() < SAFE_BAD_CHANCE[level] ? "bad" : "good";
    bucket = punishments.safe["level" + level][outcome];

  } else {
    // RISK: streak reset, heat omhoog
    player.safeStreak = 0;
    player.riskHeat += 1;

    level = punishmentLevel(player.riskHeat);
    vLevel = visualLevel(player.riskHeat);

    outcome = Math.random() < 0.5 ? "win" : "lose";
    bucket = punishments.risk["heat" + level][outcome];
  }

  // Kies een opdracht en verwerk placeholders + eventuele 'force'.
  const chosen = normalizePunishment(pick(bucket));
  const text = fillPlaceholders(chosen.text, state.current);

  if (chosen.force) {
    applyForce(chosen.force);
  }

  renderResult(type, level, vLevel, outcome, text);
}

// Zet forceNextChoice op de juiste speler.
function applyForce(force) {
  const n = state.players.length;
  let idx = state.current;
  if (force.who === "next") idx = (state.current + 1) % n;
  else if (force.who === "previous") idx = (state.current - 1 + n) % n;
  // "self" => blijft state.current
  state.players[idx].forceNextChoice = force.choice;
}

/* ---- Resultaatscherm ---- */
function renderResult(type, level, vLevel, outcome, text) {
  applyMood(type, vLevel);

  const player = state.players[state.current];
  const isSafe = type === "safe";
  const icon = isSafe ? "❄" : "🔥";

  document.getElementById("result-level").textContent = vLevel;
  document.getElementById("result-pill").textContent = type.toUpperCase();
  document.getElementById("result-name").textContent = player.name;
  document.getElementById("result-played-icon").textContent = icon;
  document.getElementById("result-played-type").textContent = type.toUpperCase();
  document.getElementById("result-text").textContent = text;

  // statuslabel + intensiteitsbalk (0..10 -> 0..100%)
  document.getElementById("result-status").textContent = LABELS[type][vLevel];
  const fill = Math.round((vLevel / 10) * 100);
  document.getElementById("result-fill").style.width = Math.max(8, fill) + "%";

  showScreen("screen-result");
}

/* ---- Volgende speler ---- */
function nextPlayer() {
  state.current += 1;
  if (state.current >= state.players.length) {
    state.current = 0;         // terug naar speler 1
    state.round += 1;          // nieuwe ronde
  }
  renderTurn();
}


/* =========================================================================
   7. INIT  (knoppen koppelen)
   ========================================================================= */
function init() {
  // Start
  document.getElementById("btn-start").addEventListener("click", () => {
    renderCount();
    showScreen("screen-count");
  });

  // Aantal spelers
  document.getElementById("count-minus").addEventListener("click", () => changeCount(-1));
  document.getElementById("count-plus").addEventListener("click", () => changeCount(1));
  document.getElementById("btn-count-next").addEventListener("click", () => {
    renderNameInputs();
    showScreen("screen-names");
  });

  // Namen
  document.getElementById("btn-names-start").addEventListener("click", () => {
    buildPlayers(false);
    renderTurn();
  });
  document.getElementById("btn-names-skip").addEventListener("click", () => {
    buildPlayers(true);
    renderTurn();
  });

  // Beurt: SAFE / RISK
  document.getElementById("card-safe").addEventListener("click", () => makeChoice("safe"));
  document.getElementById("card-risk").addEventListener("click", () => makeChoice("risk"));

  // Resultaat
  document.getElementById("btn-next-player").addEventListener("click", nextPlayer);

  // Terugknoppen (data-back="scherm-id")
  document.querySelectorAll("[data-back]").forEach(btn => {
    btn.addEventListener("click", () => showScreen(btn.getAttribute("data-back")));
  });

  // Reset -> terug naar startscherm
  document.getElementById("btn-reset").addEventListener("click", () => {
    if (confirm("Spel opnieuw beginnen?")) {
      state.players = [];
      state.current = 0;
      state.round = 1;
      resetMood();
      showScreen("screen-start");
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
