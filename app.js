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
        "{player}, laf gespeeld, maar vooruit. Deel 1 slokken uit.",
        "{player}, veilige keuze. Niet spannend, wel effectief. Deel 1 slokken uit.",
        "{player}, kijk aan, schadevrij door. Deel 1 slokken uit.",
        "{player}, weinig lef, prima opbrengst. Deel 1 slokken uit.",
        "{player}, je glipt er makkelijk tussendoor. Deel 1 slokken uit.",
        "{player}, saaie keuze, goed resultaat. Deel 1 slokken uit.",
        "{player}, dit was niet indrukwekkend, maar het werkt. Deel 1 slokken uit.",
        "{player}, laf gekozen en alsnog beloond. Deel 1 slokken uit.",
        "{player}, niemand is onder de indruk, maar jij mag uitdelen. Deel 1 slokken uit.",
        "{player}, rustig aan gedaan en toch winst gepakt. Deel 1 slokken uit."
      ],
      bad: [
        "{player}, da’s nog eens een taaie. Neem 1 slokken.",
        "{player}, veilig spelen en alsnog de klos. Neem 1 slokken.",
        "{player}, zelfs SAFE helpt je niet. Neem 1 slokken.",
        "{player}, laf gekozen, slecht beloond. Neem 1 slokken.",
        "{player}, dat was dus nergens voor nodig. Neem 1 slokken.",
        "{player}, voorzichtig doen en alsnog nat gaan. Neem 1 slokken.",
        "{player}, kleine schade, maar wel schade. Neem 1 slokken.",
        "{player}, SAFE gedrukt en toch pech. Neem 1 slokken.",
        "{player}, dit is een matige start. Neem 1 slokken.",
        "{player}, de app begint meteen vervelend te doen. Neem 1 slokken."
      ]
    },
    // level 2 = 2x achter elkaar SAFE
    level2: {
      good: [
        "{player}, moah, laf maar niet gek. Deel 2 slokken uit.",
        "{player}, kijk aan, veilig gekozen en alsnog winst. Deel 2 slokken uit.",
        "{player}, weinig lef, prima opbrengst. Deel 2 slokken uit.",
        "{player}, dit is smerig veilig gespeeld. Deel 2 slokken uit.",
        "{player}, saaie keuze, goed resultaat. Deel 2 slokken uit.",
        "{player}, netjes hoor. Niemand onder de indruk, maar jij mag 2 slokken uitdelen.",
        "{player}, veilige route gepakt. Laf, maar effectief. Deel 2 slokken uit.",
        "{player}, je komt er weer mee weg. Knap irritant. Deel 2 slokken uit.",
        "{player}, weinig risico, veel praat. Deel 2 slokken uit.",
        "{player}, mwah, dit had slechter kunnen aflopen. Deel 2 slokken uit."
      ],
      bad: [
        "{player}, poah, veilig gespeeld en alsnog genaaid. Neem 2 slokken.",
        "{player}, da’s nog eens een taaie. Neem 2 slokken.",
        "{player}, dat is nou net jammer. Neem 2 slokken.",
        "{player}, laf gekozen, hard afgerekend. Neem 2 slokken.",
        "{player}, ja hoor, daar is de rekening. Neem 2 slokken.",
        "{player}, kijk aan, voorzichtig doen en alsnog nat gaan. Neem 2 slokken.",
        "{player}, dit was dus nergens voor nodig. Neem 2 slokken.",
        "{player}, veilige keuze, onveilige uitkomst. Neem 2 slokken.",
        "{player}, moah, dat pakt toch even kut uit. Neem 2 slokken.",
        "{player}, je wilde slim doen. De app dacht van niet. Neem 2 slokken."
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
        "{player}, slecht idee, prima uitvoering. Deel 2 slokken uit.",
        "{player}, dat had fout moeten gaan. Deel 2 slokken uit.",
        "{player}, nergens op gebaseerd, toch gelukt. Deel 2 slokken uit.",
        "{player}, kijk aan, dom gekozen en beloond ook nog. Deel 2 slokken uit.",
        "{player}, niet slim, wel lekker. Deel 2 slokken uit.",
        "{player}, risico gepakt en ermee weggekomen. Deel 2 slokken uit.",
        "{player}, dit was onverdiend, maar vooruit. Deel 2 slokken uit.",
        "{player}, matige keuze, prima resultaat. Deel 2 slokken uit.",
        "{player}, je komt hier veel te makkelijk mee weg. Deel 2 slokken uit.",
        "{player}, belachelijk dat dit werkt. Deel 2 slokken uit.",
        "{player}, eerste risk en meteen mazzel. Deel 2 slokken uit.",
        "{player}, slecht plan, goede afloop. Deel 2 slokken uit.",
        "{player}, de app laat je er nog één keer mee wegkomen. Deel 2 slokken uit.",
        "{player}, dit was geen tactiek, dit was geluk. Deel 2 slokken uit.",
        "{player}, vieze winst. Deel 2 slokken uit.",
        "{player}, grote gok, kleine beloning. Deel 2 slokken uit.",
        "{player}, dat ging net goed. Deel 2 slokken uit.",
        "{player}, niemand snapt waarom, maar het werkte. Deel 2 slokken uit.",
        "{player}, je doet maar wat en het lukt nog ook. Deel 2 slokken uit.",
        "{player}, risk gekozen zonder plan. Toch gewonnen. Deel 2 slokken uit."
      ],
      lose: [
        "{player}, ja hoor, grote mond en meteen betalen. Neem 2 slokken.",
        "{player}, slecht idee, slechte afloop. Neem 2 slokken.",
        "{player}, dat ging ongeveer zoals verwacht. Neem 2 slokken.",
        "{player}, je zocht risico en vond dorst. Neem 2 slokken.",
        "{player}, kijk aan, eerste foutje is binnen. Neem 2 slokken.",
        "{player}, niet best. Neem 2 slokken.",
        "{player}, dat was kort stoer doen. Neem 2 slokken.",
        "{player}, risico gepakt, niks gekregen. Neem 2 slokken.",
        "{player}, dit was niet je moment. Neem 2 slokken.",
        "{player}, prima poging, matige uitkomst. Neem 2 slokken.",
        "{player}, volledig terecht. Neem 2 slokken.",
        "{player}, je had ook gewoon normaal kunnen doen. Neem 2 slokken.",
        "{player}, de eerste waarschuwing is binnen. Neem 2 slokken.",
        "{player}, dat was dus nergens op gebaseerd. Neem 2 slokken.",
        "{player}, stoer gekozen, slap geëindigd. Neem 2 slokken.",
        "{player}, risk gedrukt en direct spijt. Neem 2 slokken.",
        "{player}, daar ging je momentje. Neem 2 slokken.",
        "{player}, je probeerde spannend te doen. Viel tegen. Neem 2 slokken.",
        "{player}, dit noemen we een matige gok. Neem 2 slokken.",
        "{player}, pech of dom? Maakt niet uit. Neem 2 slokken."
      ]
    },

    // heat 2
    heat2: {
      win: [
        "{player}, risk nog een keer en weer mazzel. Deel 4 slokken uit.",
        "{player}, je speelt gevaarlijk, maar het levert op. Deel 4 slokken uit.",
        "{player}, dit is irritant effectief. Deel 4 slokken uit.",
        "{player}, slecht idee nummer twee werkt ook nog. Deel 4 slokken uit.",
        "{player}, je komt hier smerig goed mee weg. Deel 4 slokken uit.",
        "{player}, niemand gunt je dit, maar jij mag uitdelen. Deel 4 slokken uit.",
        "{player}, dat was riskant genoeg om vervelend te zijn. Deel 4 slokken uit.",
        "{player}, kijk aan, schade voor de rest. Deel 4 slokken uit.",
        "{player}, dit had je niet verdiend. Deel 4 slokken uit.",
        "{player}, je doet alsof dit skill is. Deel 4 slokken uit.",
        "{player}, tweede risk en nog steeds overeind. Deel 4 slokken uit.",
        "{player}, je bent aan het gokken met vertrouwen. Deel 4 slokken uit.",
        "{player}, vieze keuze, vieze winst. Deel 4 slokken uit.",
        "{player}, de app had je moeten pakken. Gebeurde niet. Deel 4 slokken uit.",
        "{player}, dit begint vervelend knap te worden. Deel 4 slokken uit.",
        "{player}, slechte planning, goede uitkomst. Deel 4 slokken uit.",
        "{player}, je loopt op dun ijs, maar vooruit. Deel 4 slokken uit.",
        "{player}, niemand vroeg hierom, maar jij wint. Deel 4 slokken uit.",
        "{player}, volledig onverantwoord, prima resultaat. Deel 4 slokken uit.",
        "{player}, risk betaald zich uit. Vies. Deel 4 slokken uit."
      ],
      lose: [
        "{player}, daar is de rekening. Neem 4 slokken.",
        "{player}, tweede risk en meteen op je bek. Neem 4 slokken.",
        "{player}, dit begint op een patroon te lijken. Neem 4 slokken.",
        "{player}, je wilde vuurwerk. Je kreeg schade. Neem 4 slokken.",
        "{player}, kijk aan, spijt met prik. Neem 4 slokken.",
        "{player}, dat was iets te veel vertrouwen. Neem 4 slokken.",
        "{player}, risk gekozen alsof je iets kon. Neem 4 slokken.",
        "{player}, je maakt het jezelf ook niet makkelijk. Neem 4 slokken.",
        "{player}, dit is gewoon slecht gegokt. Neem 4 slokken.",
        "{player}, grote plannen, lege uitvoering. Neem 4 slokken.",
        "{player}, je dacht dat je lekker bezig was. Niet dus. Neem 4 slokken.",
        "{player}, vier slokken voor deze matige beslissing. Neem 4 slokken.",
        "{player}, dat liep precies verkeerd. Neem 4 slokken.",
        "{player}, risk werkt niet op hoop alleen. Neem 4 slokken.",
        "{player}, je had kunnen stoppen bij SAFE. Neem 4 slokken.",
        "{player}, de app geeft geen tweede waarschuwing. Neem 4 slokken.",
        "{player}, dit was geen pech meer, dit was keuze. Neem 4 slokken.",
        "{player}, je gokte groot en verloor simpel. Neem 4 slokken.",
        "{player}, dat zag er al dom uit voordat je klikte. Neem 4 slokken.",
        "{player}, volledig terecht, helaas voor jou. Neem 4 slokken."
      ]
    },

    // heat 3
    heat3: {
      win: [
        "{player}, derde risk en nog steeds niet gepakt. Deel 6 slokken uit.",
        "{player}, dit slaat nergens op, maar het werkt. Deel 6 slokken uit.",
        "{player}, je bent aan het ontsporen en wordt beloond. Deel 6 slokken uit.",
        "{player}, de app haat de rest blijkbaar meer dan jou. Deel 6 slokken uit.",
        "{player}, dit is smerig goed gegokt. Deel 6 slokken uit.",
        "{player}, niemand wil dit toegeven, maar dit was sterk. Deel 6 slokken uit.",
        "{player}, je staat in brand en wint nog ook. Deel 6 slokken uit.",
        "{player}, zes slokken schade voor iemand anders. Deel 6 slokken uit.",
        "{player}, dit is geen strategie meer, dit is brutaliteit. Deel 6 slokken uit.",
        "{player}, je blijft maar glippen. Irritant. Deel 6 slokken uit.",
        "{player}, gevaarlijke keuze, belachelijke beloning. Deel 6 slokken uit.",
        "{player}, je maakt slechte keuzes op hoog niveau. Deel 6 slokken uit.",
        "{player}, dit had je moeten slopen. In plaats daarvan win je. Deel 6 slokken uit.",
        "{player}, risk heat loopt op en jij doet alsof het normaal is. Deel 6 slokken uit.",
        "{player}, de rest mag jouw slechte besluit voelen. Deel 6 slokken uit.",
        "{player}, dit is vies geluk met zelfvertrouwen. Deel 6 slokken uit.",
        "{player}, de groep baalt, jij lacht. Deel 6 slokken uit.",
        "{player}, dit was dom, hard en effectief. Deel 6 slokken uit.",
        "{player}, geen idee hoe, maar vooruit. Deel 6 slokken uit.",
        {
          text: "{player}, smerig gewonnen. Deel 6 slokken uit en de volgende speler moet verplicht RISK.",
          force: { who: "next", choice: "risk" }
        }
      ],
      lose: [
        "{player}, daar ging je grote verhaal. Neem 6 slokken.",
        "{player}, derde risk en nu wordt het taai. Neem 6 slokken.",
        "{player}, dit is de schade waar je om vroeg. Neem 6 slokken.",
        "{player}, je bleef drukken en nu drukt de app terug. Neem 6 slokken.",
        "{player}, kijk aan, probleem gevonden. Jij bent het. Neem 6 slokken.",
        "{player}, dat was geen lef, dat was kortsluiting. Neem 6 slokken.",
        "{player}, je wilde risico. Niet gaan zeuren nu. Neem 6 slokken.",
        "{player}, zes slokken voor deze matige stunt. Neem 6 slokken.",
        "{player}, dit begint serieus slecht te worden. Neem 6 slokken.",
        "{player}, niemand is verbaasd. Neem 6 slokken.",
        "{player}, dit zag je aankomen en toch deed je het. Neem 6 slokken.",
        "{player}, je bent officieel te ver gegaan. Neem 6 slokken.",
        "{player}, risk heat hoog, verstand laag. Neem 6 slokken.",
        "{player}, je gooide jezelf onder de bus. Neem 6 slokken.",
        "{player}, hier is je prijs voor dom vertrouwen. Neem 6 slokken.",
        "{player}, dit was een taaie. Neem 6 slokken.",
        "{player}, de app had er zin in. Jij iets minder. Neem 6 slokken.",
        "{player}, je had één taak: niet dom doen. Neem 6 slokken.",
        "{player}, dit is geen ongeluk meer. Neem 6 slokken.",
        {
          text: "{player}, hard verloren. Neem 6 slokken en speel volgende ronde verplicht SAFE.",
          force: { who: "self", choice: "safe" }
        }
      ]
    },

    // heat 4 = 4e keer of vaker RISK (blijft heat 4)
    heat4: {
      win: [
        "{player}, je bent niet meer aan het spelen, je bent aan het gokken met sfeer. Deel een atje uit.",
        "{player}, hoogste risk en nog winnen ook. Deel een atje uit.",
        "{player}, dit is compleet onnodig, maar wel gewonnen. Deel een atje uit.",
        "{player}, de app had je moeten slopen. In plaats daarvan sloop jij iemand anders. Deel een atje uit.",
        "{player}, je bent officieel een probleem voor de tafel. Deel een atje uit.",
        "{player}, niemand gunt je dit. Deel een atje uit.",
        "{player}, dit is geen geluk meer, dit is verdacht. Deel een atje uit.",
        "{player}, je blijft maar leven. Deel een atje uit.",
        "{player}, vieze winst op het hoogste niveau. Deel een atje uit.",
        "{player}, de schade is nu voor iemand anders. Deel een atje uit.",
        "{player}, je had allang gepakt moeten worden. Deel een atje uit.",
        "{player}, dit is risk met een grote bek. Deel een atje uit.",
        "{player}, je speelt alsof gevolgen niet bestaan. Deel een atje uit.",
        "{player}, smerigste winst van de avond. Deel een atje uit.",
        "{player}, dit wordt niet vergeten. Deel een atje uit.",
        "{player}, kies iemand die jouw slechte keuzes mag verwerken. Deel een atje uit.",
        "{player}, je komt hier schandalig goed mee weg. Deel een atje uit.",
        "{player}, dit is precies waarom mensen je niet vertrouwen. Deel een atje uit.",
        "{player}, hoogste heat, laagste moraal. Deel een atje uit.",
        {
          text: "{player}, gewonnen op standje probleemgeval. Deel een atje uit en de volgende speler moet verplicht RISK.",
          force: { who: "next", choice: "risk" }
        }
      ],
      lose: [
        "{player}, ja hoor. Daar is-ie dan. Atje.",
        "{player}, alles of niets. Het werd niets. Atje.",
        "{player}, je hebt dit volledig zelf gedaan. Atje.",
        "{player}, hoogste risk, hardste rekening. Atje.",
        "{player}, dit is geen pech meer. Dit is beleid. Atje.",
        "{player}, je wilde chaos. Drink chaos. Atje.",
        "{player}, daar ging je avondstrategie. Atje.",
        "{player}, je bent nu officieel de klos. Atje.",
        "{player}, dit zat eraan te komen. Atje.",
        "{player}, risk heat maximaal, spijt maximaal. Atje.",
        "{player}, niemand gaat je helpen. Atje.",
        "{player}, je koos geweld. De app koos terug. Atje.",
        "{player}, dit is het gevolg van te veel zelfvertrouwen. Atje.",
        "{player}, volledig terecht. Atje.",
        "{player}, je had kunnen afkoelen. Deed je niet. Atje.",
        "{player}, dit was een dramatische keuze. Atje.",
        "{player}, je hebt jezelf keurig genaaid. Atje.",
        "{player}, geen woorden meer nodig. Atje.",
        "{player}, dit is het moment waarop SAFE ineens goed klinkt. Atje.",
        {
          text: "{player}, oververhit en afgestraft. Atje en volgende ronde verplicht SAFE.",
          force: { who: "self", choice: "safe" }
        }
      ]
    }
  }
};


/* =========================================================================
   NIEUWE RISK-KAARTMOTOR
   Elke kaart heeft een type, mood, gewicht en eventueel een effect.
   ========================================================================= */
const CARD_TYPES = {
  DRINK: "drink", CHALLENGE: "challenge", SOCIAL: "social",
  POWER: "power", PUNISHMENT: "punishment", EVENT: "event"
};

const CARD_MOODS = {
  LUCKY: "lucky", FUNNY: "funny", SOCIAL: "social",
  EVIL: "evil", CHAOS: "chaos", PUNISHMENT: "punishment"
};

const RISK_TYPE_CHANCES = {
  1: {
    win: { drink: 50, challenge: 20, social: 20, power: 10 },
    lose: { drink: 55, challenge: 20, social: 15, punishment: 10 }
  },
  2: {
    win: { drink: 40, challenge: 20, social: 25, power: 10, event: 5 },
    lose: { drink: 40, challenge: 20, social: 20, punishment: 15, event: 5 }
  },
  3: {
    win: { drink: 30, challenge: 20, social: 25, power: 15, event: 10 },
    lose: { drink: 30, challenge: 20, social: 20, punishment: 20, event: 10 }
  },
  4: {
    win: { drink: 20, challenge: 20, social: 25, power: 15, event: 20 },
    lose: { drink: 20, challenge: 20, social: 20, punishment: 20, event: 20 }
  }
};

function card(id, type, mood, text, weight = 1, extra = {}) {
  return { id, type, mood, text, weight, ...extra };
}

const RISK_CARDS = {
  heat1: {
    win: [
      card("r1w-d1", "drink", "lucky", "{player}, slecht idee, prima uitvoering. Deel 2 slokken uit.", 10),
      card("r1w-d2", "drink", "lucky", "{player}, eerste RISK en meteen mazzel. Verdeel 2 slokken zoals jij wilt.", 9),
      card("r1w-c1", "challenge", "funny", "{player}, kies iemand die 30 seconden moet planken. Weigeren kost 2 slokken.", 6),
      card("r1w-c2", "challenge", "funny", "{player}, Laat je laatste 5 zoekopdrachten op Google zien.", 6),
      card("r1w-s1", "social", "social", "{player}, wijs twee spelers aan voor steen-papier-schaar. De verliezer neemt 2 slokken.", 7),
      card("r1w-s2", "social", "funny", "{player}, kies iemand voor een roast-battle. De groep kiest de winnaar; de verliezer neemt 2 slokken.", 5),
      card("r1w-p1", "power", "lucky", "{player}, jij krijgt een joker. Je mag één toekomstige opdracht weigeren.", 3, { effect: { action: "giveEffect", role: "joker", label: "Joker: weiger één opdracht", duration: "untilUsed" } }),
      card("r1w-p2", "power", "evil", "{player}, kies een verboden woord tot jouw volgende beurt. Wie het zegt, neemt 1 slok.", 3, { effect: { action: "globalRule", role: "forbiddenWord", label: "Verboden woord actief", duration: "untilNextTurn" } })
    ],
    lose: [
      card("r1l-d1", "drink", "punishment", "{player}, grote mond en meteen betalen. Neem 2 slokken.", 10),
      card("r1l-d2", "drink", "evil", "{player}, risk gedrukt en direct spijt. Neem 2 slokken.", 9),
      card("r1l-c1", "challenge", "funny", "{player}, praat tot je volgende beurt met een overdreven frans accent. Weigeren kost 2 slokken.", 6, { effect: { action: "giveEffect", role: "accent", label: "Praat met een overdreven accent", duration: "untilNextTurn" } }),
      card("r1l-c2", "challenge", "funny", "{player}, doe 20 squats of neem 2 slokken.", 6),
      card("r1l-s1", "social", "social", "{player}, speel steen-papier-schaar tegen {rightPlayer}. De verliezer neemt 2 slokken.", 6),
      card("r1l-s2", "social", "evil", "{player}, laat de groep kiezen: zing een refrein of neem 2 slokken.", 5),
      card("r1l-p1", "punishment", "punishment", "{player}, drink tot je volgende beurt met je verkeerde hand.", 4, { effect: { action: "giveEffect", role: "wrongHand", label: "Drink met je verkeerde hand", duration: "untilNextTurn" } }),
      card("r1l-p2", "punishment", "evil", "{player}, je moet voor iedere slok eerst kakelen tot je volgende beurt.", 4, { effect: { action: "giveEffect", role: "toastFirst", label: "Eerst proosten voor iedere slok", duration: "untilNextTurn" } })
    ]
  },
  heat2: {
    win: [
      card("r2w-d1", "drink", "lucky", "{player}, irritant effectief. Deel 4 slokken uit.", 9),
      card("r2w-d2", "drink", "lucky", "{player}, iedereen behalve jij neemt 1 slok. De rest mag jouw geluk voelen.", 7),
      card("r2w-c1", "challenge", "funny", "{player}, wijs iemand aan die zijn laatste bericht met een gekozen woord moet voorlezen alsof het breaking news is", 6),
      card("r2w-c2", "challenge", "funny", "{player}, kies iemand die het laatste bericht aan zijn moeder moet voorlezen.", 6),
      card("r2w-s1", "social", "social", "{player}, wijs twee spelers aan voor een plankwedstrijd. De eerste die stopt neemt 3 slokken.", 6),
      card("r2w-s2", "social", "evil", "{player}, kies iemand die samen met jou een dramatische filmscène naspeelt.", 5),
      card("r2w-p1", "power", "lucky", "{player}, maak één regel die geldt tot jouw volgende beurt.", 4, { effect: { action: "globalRule", role: "customRule", label: "Zelfgekozen regel actief", duration: "untilNextTurn" } }),
      card("r2w-e1", "event", "chaos", "FREEZE! Iedereen bevriest. De eerste die beweegt neemt 3 slokken.", 3, { title: "FREEZE" })
    ],
    lose: [
      card("r2l-d1", "drink", "punishment", "{player}, daar is de rekening. Neem 4 slokken.", 9),
      card("r2l-d2", "drink", "evil", "{player}, neem 3 slokken en deel er daarna 1 uit.", 7),
      card("r2l-c1", "challenge", "funny", "Volgende ronde spreek je iedereen aan met majesteit en neem je nu 2 slokken", 6),
      card("r2l-c2", "challenge", "funny", "{player}, laat drie spelers ieder één woord kiezen. Iedere zien die je uitspreekt moet deze woorden bevatten.", 5),
      card("r2l-s1", "social", "social", "{player}, geef {leftPlayer} een overdreven serieus compliment. Lachen kost 2 slokken.", 5),
      card("r2l-p1", "punishment", "punishment", "{player}, je mag tot je volgende beurt niemand bij de voornaam noemen.", 5, { effect: { action: "giveEffect", role: "noNames", label: "Geen voornamen gebruiken", duration: "untilNextTurn" } }),
      card("r2l-p2", "punishment", "evil", "{player}, je mag één ronde niet wijzen. Toch wijzen is 2 slokken.", 4, { effect: { action: "giveEffect", role: "noPointing", label: "Niet wijzen", duration: "oneRound" } }),
      card("r2l-e1", "event", "chaos", "STOELENWISSEL! De telefoon blijft bij deze stoel. Iedereen wisselt van plek. De laatste die zit neemt 3 slokken.", 3, { title: "STOELENWISSEL" })
    ]
  },
  heat3: {
    win: [
      card("r3w-d1", "drink", "lucky", "{player}, derde RISK en nog steeds niet gepakt. Deel 6 slokken uit.", 8),
      card("r3w-d2", "drink", "evil", "{player}, verdeel 6 slokken over maximaal drie spelers.", 7),
      card("r3w-c1", "challenge", "funny", "{player}, kies iemand die 3 rondes lang iedere zin rijmend af moet maken.", 6),
      card("r3w-c2", "challenge", "evil", "{player}, De groep kiest een woord, laat zien wat er als eerste in je chatGPT teksten op komt als je die in tikt", 5),
      card("r3w-s1", "social", "social", "{player}, wijs twee spelers aan. Zij houden een stare-down; de eerste die lacht neemt 4 slokken.", 6),
      card("r3w-s2", "social", "evil", "{player}, Kies iemand die 1 ronde zonder de letter E mag praten", 5),
      card("r3w-p1", "power", "lucky", "{player}, jij bent medusa tot je volgende beurt. Iedereen die je aankijkt drinkt.", 4, { effect: { action: "giveEffect", role: "sheriff", label: "Sheriff: toestemming geven voor drinken", duration: "untilNextTurn" } }),
        card("r3w-e1", "event", "chaos", "STILLE RONDE! Niemand praat tot iedereen één keer aan de beurt is geweest. Praten kost 2 slokken.", 4, { title: "STILLE RONDE", effect: { action: "globalRule", role: "silentRound", label: "Stille ronde actief", duration: "oneRound" } })
    ],
    lose: [
      card("r3l-d1", "drink", "punishment", "{player}, de app drukt terug. Neem 6 slokken.", 8),
      card("r3l-d2", "drink", "evil", "{player}, neem 4 slokken en laat {rightPlayer} bepalen hoe snel.", 6),
      card("r3l-c1", "challenge", "funny", "{player}, De groep kiest een woord, laat zien wat er als eerste in je chatGPT teksten op komt als je die in tikt", 6),
      card("r3l-c2", "challenge", "evil", "{player}, Laat de speler rechts van je een regel verzinnen voor jou voor de volgende ronde", 5),
      card("r3l-s1", "social", "social", "{player}, laat de groep een opdracht kiezen. Weigeren kost 6 slokken.", 6),
      card("r3l-p1", "punishment", "punishment", "{player}, je drinkt één ronde met je verkeerde hand en moet steeds proosten.", 5, { effect: { action: "giveEffect", role: "doubleRule", label: "Verkeerde hand + eerst proosten", duration: "oneRound" } }),
      card("r3l-p2", "punishment", "evil", "{player}, De groep kiest een woord die jij de volgende 3 rondes niet mag zeggen. Verspreken is 5 slokken.", 5, { effect: { action: "giveEffect", role: "selfForbiddenWord", label: "Zelfgekozen verboden woord", duration: "untilNextTurn" } }),
      card("r3l-e1", "event", "chaos", "REVOLUTIE! Alle tijdelijke regels en powers vervallen direct.", 4, { title: "REVOLUTIE", effect: { action: "clearEffects" } })
    ]
  },
  heat4: {
    win: [
      card("r4w-d1", "drink", "chaos", "{player}, hoogste RISK en nog winnen ook. Deel een atje uit.", 6),
      card("r4w-d2", "drink", "evil", "{player}, kies: deel een atje uit of verdeel 8 slokken over de groep.", 6),
      card("r4w-c1", "challenge", "chaos", "{player}, Verzin een regel voor de komende 2 rondes voor de speler tegenover je", 6),
      card("r4w-c2", "challenge", "evil", "{player}, Verzin een regel voor de komende 3 rondes voor de speler links van je", 5),
      card("r4w-s1", "social", "chaos", "{player}, wijs twee spelers aan voor best-of-three steen-papier-schaar. De verliezer neemt 6 slokken.", 6),
      card("r4w-s2", "social", "evil", "{player}, de groep kiest twee spelers voor een stare-down. Jij bepaalt de straf voor de verliezer: maximaal 6 slokken.", 5),
      card("r4w-p1", "power", "chaos", "{player}, je krijgt een duivelsrecht: verdubbel één toekomstige straf.", 4, { effect: { action: "giveEffect", role: "doublePunishment", label: "Verdubbel één kleine straf", duration: "untilUsed" } }),
      card("r4w-e1", "event", "chaos", "KINGS COURT! Jij kiest wie een groepsopdracht uitvoert. De groep kiest een opdracht.", 6, { title: "KINGS COURT" }),
      card("r4w-e2", "event", "chaos", "CHAOSRONDE! Tot jouw volgende beurt moet iedereen voor het drinken eerst jouw naam roepen.", 5, { title: "CHAOSRONDE", effect: { action: "globalRule", role: "shoutName", label: "Roep de winnaar voor iedere slok", duration: "untilNextTurn" } })
    ],
    lose: [
      card("r4l-d1", "drink", "chaos", "{player}, alles of niets. Het werd niets. Atje.", 6),
      card("r4l-d2", "drink", "punishment", "{player}, neem een atje of 8 slokken verspreid over twee minuten.", 6),
      card("r4l-c1", "challenge", "chaos", "{player}, geef een reden aan de groep waarom je niet zou moeten atten, de groep bepaald of het goedgekeurd word of niet", 5),
      card("r4l-c2", "challenge", "evil", "{player}, haal iemand over om een atje mee te doen, of neem ze allebij zelf", 5),
      card("r4l-s1", "social", "chaos", "{player}, laat de groep een catogorie kiezen, als jij er daar geen 5 van weet op te noemen binnen 30 seconde? 6 slokken", 6),
      card("r4l-p1", "punishment", "punishment", "{player}, je mag één ronde alleen praten nadat iemand jouw naam zegt.", 5, { effect: { action: "giveEffect", role: "namePermission", label: "Alleen praten na je naam", duration: "oneRound" } }),
      card("r4l-e1", "event", "chaos", "TOTALE STILTE! De eerste die praat neemt 6 slokken.", 6, { title: "TOTALE STILTE" }),
      card("r4l-e2", "event", "chaos", "REVOLUTIE! Alle tijdelijke regels vervallen, maar jij neemt eerst 4 slokken.", 5, { title: "REVOLUTIE", effect: { action: "clearEffects" } })
    ]
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

function getWeightedRandomItem(items) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const total = items.reduce((sum, item) => sum + Math.max(0, item.weight ?? 1), 0);
  if (total <= 0) return items[0];
  let value = Math.random() * total;
  for (const item of items) {
    value -= Math.max(0, item.weight ?? 1);
    if (value <= 0) return item;
  }
  return items[items.length - 1];
}

function chooseRiskCard(level, outcome) {
  const allCards = RISK_CARDS["heat" + level]?.[outcome] || [];
  if (!allCards.length) return null;
  const fresh = allCards.filter(item => !state.cardHistory.includes(item.id));
  const pool = fresh.length ? fresh : allCards;
  const typeEntries = Object.entries(RISK_TYPE_CHANCES[level][outcome])
    .map(([type, weight]) => ({ type, weight }));
  const selectedType = getWeightedRandomItem(typeEntries)?.type;
  const typedPool = pool.filter(item => item.type === selectedType);
  return getWeightedRandomItem(typedPool.length ? typedPool : pool);
}

function rememberCard(id) {
  if (!id) return;
  state.cardHistory.push(id);
  if (state.cardHistory.length > 8) state.cardHistory.shift();
}

// Zet placeholders in een tekst om naar echte namen.
function fillPlaceholders(text, index) {
  const n = state.players.length;
  const cur = state.players[index].name;
  const prev = state.players[(index - 1 + n) % n].name;
  const next = state.players[(index + 1) % n].name;
  const others = state.players.filter((_, i) => i !== index);
  const randomPlayer = (others.length ? pick(others) : state.players[index]).name;
  return text
    .replace(/{player}/g, cur)
    .replace(/{previousPlayer}/g, prev)
    .replace(/{leftPlayer}/g, prev)
    .replace(/{nextPlayer}/g, next)
    .replace(/{rightPlayer}/g, next)
    .replace(/{randomPlayer}/g, randomPlayer);
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
  round: 1,
  cardHistory: [],
  globalEffects: []
};

// Maak een leeg speler-object.
function makePlayer(name) {
  return {
    name: name,
    safeStreak: 0,
    riskHeat: 0,
    forceNextChoice: null,  // null | "safe" | "risk"
    activeEffects: []
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
  state.cardHistory = [];
  state.globalEffects = [];
}

/* ---- Beurtscherm ---- */
function renderTurn() {
  resetMood();
  const player = state.players[state.current];
  expireEffectsForCurrentPlayer();

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
  player.forceNextChoice = null;

  let level;
  let vLevel;
  let outcome;
  let selectedCard;

  if (type === "safe") {
    player.safeStreak += 1;
    player.riskHeat = Math.max(0, player.riskHeat - 1);
    level = punishmentLevel(player.safeStreak);
    vLevel = visualLevel(player.safeStreak);
    outcome = Math.random() < SAFE_BAD_CHANCE[level] ? "bad" : "good";
    const bucket = punishments.safe["level" + level][outcome];
    const chosen = normalizePunishment(pick(bucket));
    selectedCard = {
      id: "safe-" + level + "-" + outcome + "-" + Math.random(),
      type: outcome === "good" ? CARD_TYPES.DRINK : CARD_TYPES.PUNISHMENT,
      mood: outcome === "good" ? CARD_MOODS.LUCKY : CARD_MOODS.PUNISHMENT,
      text: chosen.text,
      force: chosen.force,
      title: outcome === "good" ? "VEILIGE WINST" : "SAFE GING MIS"
    };
  } else {
    player.safeStreak = 0;
    player.riskHeat += 1;
    level = punishmentLevel(player.riskHeat);
    vLevel = visualLevel(player.riskHeat);
    outcome = Math.random() < 0.5 ? "win" : "lose";
    selectedCard = chooseRiskCard(level, outcome) || {
      id: "fallback-risk-card", type: "drink", mood: "funny",
      text: "{player}, de kaartmotor is de weg kwijt. Neem 1 slok.", weight: 1
    };
  }

  const text = fillPlaceholders(selectedCard.text, state.current);
  if (selectedCard.force) applyForce(selectedCard.force);
  if (selectedCard.effect) applyCardEffect(selectedCard.effect);
  if (type === "risk") rememberCard(selectedCard.id);

  renderResult(type, level, vLevel, outcome, text, selectedCard);
}

function makeEffect(effect) {
  return {
    id: "effect-" + Date.now() + "-" + Math.random().toString(16).slice(2),
    role: effect.role,
    label: effect.label || effect.role,
    duration: effect.duration || "untilNextTurn",
    createdRound: state.round,
    createdPlayer: state.current,
    used: false
  };
}

function applyCardEffect(effect) {
  if (effect.action === "clearEffects") {
    state.players.forEach(player => { player.activeEffects = []; });
    state.globalEffects = [];
    return;
  }
  const newEffect = makeEffect(effect);
  if (effect.action === "globalRule") state.globalEffects.push(newEffect);
  if (effect.action === "giveEffect") state.players[state.current].activeEffects.push(newEffect);
}

function expireEffectsForCurrentPlayer() {
  const player = state.players[state.current];
  player.activeEffects = player.activeEffects.filter(effect => {
    if (effect.duration === "untilNextTurn" && effect.createdPlayer === state.current &&
      (effect.createdRound < state.round || state.current !== effect.createdPlayer)) return false;
    if (effect.duration === "oneRound" && state.round > effect.createdRound) return false;
    if (effect.duration === "untilUsed" && effect.used) return false;
    return true;
  });
  state.globalEffects = state.globalEffects.filter(effect => {
    if (effect.duration === "oneRound" && state.round > effect.createdRound) return false;
    if (effect.duration === "untilNextTurn" && effect.createdPlayer === state.current && state.round > effect.createdRound) return false;
    return true;
  });
}

function getVisibleRules() {
  const playerRules = state.players[state.current].activeEffects.map(effect => effect.label);
  const globalRules = state.globalEffects.map(effect => effect.label);
  return [...globalRules, ...playerRules];
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

function getCardTypeLabel(type) {
  return ({ drink: "DRINKEN", challenge: "OPDRACHT", social: "SAMEN", power: "POWER-UP", punishment: "STRAF", event: "EVENT" })[type] || "OPDRACHT";
}

function getMoodLabel(mood) {
  return ({ lucky: "MAZZEL", funny: "GRAPPIG", social: "SOCIAAL", evil: "GEMEEN", chaos: "CHAOS", punishment: "PECH" })[mood] || "";
}

function getCardTitle(cardData, outcome) {
  if (cardData.title) return cardData.title;
  const labels = {
    drink: outcome === "win" || outcome === "good" ? "UITDELEN!" : "DRINKEN!",
    challenge: "JOUW OPDRACHT", social: "IEDEREEN DOET MEE",
    power: "POWER-UP", punishment: "JOUW STRAF", event: "EVENT"
  };
  return labels[cardData.type] || "JOUW OPDRACHT";
}

/* ---- Resultaatscherm ---- */
function renderResult(type, level, vLevel, outcome, text, cardData) {
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

  const resultCard = document.getElementById("result-card");
  resultCard.className = "result-card type-" + cardData.type + " mood-" + cardData.mood;
  document.getElementById("result-card-type").textContent = getCardTypeLabel(cardData.type);
  document.getElementById("result-card-mood").textContent = getMoodLabel(cardData.mood);
  document.getElementById("result-card-title").textContent = cardData.title || getCardTitle(cardData, outcome);

  const activeRule = document.getElementById("active-rule");
  const rules = getVisibleRules();
  if (rules.length) {
    activeRule.textContent = "ACTIEF: " + rules.join(" · ");
    activeRule.classList.remove("hidden");
  } else {
    activeRule.textContent = "";
    activeRule.classList.add("hidden");
  }

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
      state.cardHistory = [];
      state.globalEffects = [];
      resetMood();
      showScreen("screen-start");
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
