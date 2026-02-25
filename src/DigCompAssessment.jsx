import { useState, useRef } from "react";

// ═══════════════════════════════════════════════════════════
// BANC DE PREGUNTES — 5 àrees × 5 preguntes = 25 preguntes
// Cada pregunta té 4 opcions alineades amb DigComp A1/A2/B1/B2
// Algunes preguntes s'adapten per cicle (1r-2n vs 3r-4t)
// Tipus: "self" (autoavaluació), "situational" (escenari pràctic)
// ═══════════════════════════════════════════════════════════

const allQuestions = [
  // ─── ÀREA 1: INFORMACIÓ I DADES ───
  {
    area: "Informació i dades",
    type: "situational",
    scenario: "Escenari: Has de fer un treball sobre el canvi climàtic. Busques a Google i trobes un article en un blog personal que diu que el canvi climàtic no existeix, i un informe de l'ONU que diu el contrari.",
    question: "Què faries amb aquestes dues fonts?",
    options: [
      { text: "Agafaria la que em resulti més fàcil d'entendre, sense fixar-me en qui l'ha escrit", level: 1 },
      { text: "Triaria la de l'ONU perquè em sona més fiable, però no sabria explicar per què exactament", level: 2 },
      { text: "Compararia l'autoria, les dades i les referències de cadascuna per decidir quina és més creïble", level: 3 },
      { text: "Analitzaria les fonts amb criteris concrets (autoria, evidències, revisió per parells) i buscaria més fonts per contrastar", level: 4 },
    ],
  },
  {
    area: "Informació i dades",
    type: "self",
    question: "Quan fas una cerca a internet per a un treball escolar, com proceeixes?",
    options: [
      { text: "Escric una frase llarga i agafo el primer resultat que surt", level: 1 },
      { text: "Utilitzo paraules clau i miro els primers 3-4 resultats", level: 2 },
      { text: "Faig servir paraules clau, filtres (data, tipus) i comparo diverses fonts", level: 3 },
      { text: "Faig cerques estratègiques amb operadors, consulto bases de dades especialitzades i avaluo la fiabilitat de cada font", level: 4 },
    ],
  },
  {
    area: "Informació i dades",
    type: "situational",
    scenario: "Escenari: Un company et passa per WhatsApp una notícia que diu que demà tanquen l'institut per una alerta meteorològica. No ho has vist enlloc més.",
    question: "Com reacciones?",
    options: [
      { text: "La reenvio als meus amics perquè s'assabentin", level: 1 },
      { text: "No la reenvio fins que no ho confirmi algú de confiança, com un professor", level: 2 },
      { text: "Busco la notícia en fonts oficials (web de l'institut, Protecció Civil) abans de creure-m'ho", level: 3 },
      { text: "Verifico la font original, comprovo en webs oficials, i si és falsa, informo al meu company i li explico com verificar-ho", level: 4 },
    ],
  },
  {
    area: "Informació i dades",
    type: "self",
    question: "Com organitzes els teus fitxers digitals de classe (apunts, treballs, fotos...)?",
    options: [
      { text: "No els organitzo gaire, els tinc per l'escriptori o en descàrregues i em costa trobar-los", level: 1 },
      { text: "Tinc algunes carpetes per assignatura, però no sempre les mantinc ordenades", level: 2 },
      { text: "Tinc un sistema clar de carpetes al núvol (Drive) organitzat per assignatura i trimestre", level: 3 },
      { text: "Tinc un sistema complet amb carpetes, nomenclatura coherent, còpies de seguretat i sé recuperar versions anteriors", level: 4 },
    ],
  },
  {
    area: "Informació i dades",
    type: "situational",
    cycle_specific: true,
    scenario_junior: "Escenari: El professor et demana que busquis tres fets sobre l'antiga Roma per a una presentació.",
    question_junior: "Com tries quins fets incloure i d'on els treus?",
    scenario_senior: "Escenari: Has de preparar una recerca sobre energies renovables amb dades actuals i de fonts variades.",
    question_senior: "Com planifiques la recerca i selecciones la informació?",
    options_junior: [
      { text: "Copio directament de la Viquipèdia el que trobi primer", level: 1 },
      { text: "Llegeixo la Viquipèdia i trio els fets que em semblen més interessants, reformulant-los", level: 2 },
      { text: "Consulto 2-3 webs diferents, comparo la informació i selecciono els fets que coincideixen", level: 3 },
      { text: "Busco en enciclopèdies digitals, pàgines educatives i museus virtuals, contrasto i cito les fonts", level: 4 },
    ],
    options_senior: [
      { text: "Busco a Google i agafo informació dels primers resultats sense qüestionar-la", level: 1 },
      { text: "Consulto diverses webs i intento agafar dades recents, però no sempre verifico les fonts", level: 2 },
      { text: "Planifico la cerca amb paraules clau, selecciono fonts fiables (institucionals, científiques) i organitzo la informació", level: 3 },
      { text: "Faig una estratègia de cerca, utilitzo bases de dades, filtro per any i fiabilitat, i creo un esquema organitzat amb cites correctes", level: 4 },
    ],
  },

  // ─── ÀREA 2: COMUNICACIÓ I COL·LABORACIÓ ───
  {
    area: "Comunicació i col·laboració",
    type: "situational",
    scenario: "Escenari: Heu de fer un treball en grup de 4 persones. El professor us diu que us organitzeu vosaltres.",
    question: "Com t'organitzaries digitalment amb el grup?",
    options: [
      { text: "Parlem per WhatsApp i cadascú fa la seva part sense coordinar-nos gaire", level: 1 },
      { text: "Creem un document compartit a Google Docs i ens repartim les parts", level: 2 },
      { text: "Organitzem el treball amb un document compartit, assignem tasques i ens posem terminis", level: 3 },
      { text: "Creem un espai de treball col·laboratiu amb rols, calendari, revisió creuada entre membres i control de versions", level: 4 },
    ],
  },
  {
    area: "Comunicació i col·laboració",
    type: "situational",
    scenario: "Escenari: Has d'enviar un correu electrònic al teu professor per demanar-li una tutoria perquè tens dubtes d'un examen.",
    question: "Com redactaries aquest correu?",
    options: [
      { text: "Escric \"profe tinc dubtes\" sense assumpte ni salutació formal", level: 1 },
      { text: "Poso un assumpte, saludo i demano la tutoria, però el to és informal com un missatge de mòbil", level: 2 },
      { text: "Redacto un correu formal amb assumpte clar, salutació, cos explicatiu i comiat adequat", level: 3 },
      { text: "Redacto un correu formal, proposo dates/hores, adjunto els dubtes concrets i adapto el registre al context acadèmic", level: 4 },
    ],
  },
  {
    area: "Comunicació i col·laboració",
    type: "self",
    question: "Com gestiones la teva presència i identitat als espais digitals (xarxes, perfils, fòrums...)?",
    options: [
      { text: "No em preocupo gaire del que publico ni de qui ho pot veure", level: 1 },
      { text: "Tinc cura del que publico, però no he revisat mai la configuració de privacitat dels meus comptes", level: 2 },
      { text: "Configuro la privacitat dels meus perfils, penso abans de publicar i sóc respectuós/a amb els altres", level: 3 },
      { text: "Gestiono activament la meva identitat digital, diferencio àmbits (personal/acadèmic), i ajudo companys a millorar la seva privacitat", level: 4 },
    ],
  },
  {
    area: "Comunicació i col·laboració",
    type: "situational",
    scenario: "Escenari: En un treball col·laboratiu a Google Docs, un company ha esborrat sense voler una part important que tu havies escrit.",
    question: "Què fas?",
    options: [
      { text: "M'enfado i no sé com recuperar-ho, haig de tornar-ho a escriure tot", level: 1 },
      { text: "Demano ajuda al professor perquè no sé com recuperar-ho, però sé que potser es pot", level: 2 },
      { text: "Vaig a l'historial de versions del document i restauro la versió anterior", level: 3 },
      { text: "Recupero la versió, li ensenyo al company com funciona l'historial i proposo normes de treball per evitar-ho en el futur", level: 4 },
    ],
  },
  {
    area: "Comunicació i col·laboració",
    type: "situational",
    cycle_specific: true,
    scenario_junior: "Escenari: Un company penja a Instagram una foto teva fent el broma a classe sense demanar-te permís.",
    question_junior: "Què fas?",
    scenario_senior: "Escenari: Descobreixes que algú del teu curs ha creat un perfil fals amb fotos teves a una xarxa social.",
    question_senior: "Com gestiones aquesta situació?",
    options_junior: [
      { text: "No faig res, és broma i tothom ho fa", level: 1 },
      { text: "Li dic que la tregui, però no faig res més si no em fa cas", level: 2 },
      { text: "Li explico que necessita el meu permís, i si no la treu, ho comunico a un adult de confiança", level: 3 },
      { text: "Li explico els seus drets i els meus sobre la imatge personal, li demano que la retiri, i si cal reporto el contingut i informo l'institut", level: 4 },
    ],
    options_senior: [
      { text: "No sé què fer, em quedo paralitzat/da i espero que desaparegui", level: 1 },
      { text: "Demano als meus amics que reportin el perfil", level: 2 },
      { text: "Reporto el perfil a la plataforma, guardo proves (captures) i informo un adult de confiança o tutor/a", level: 3 },
      { text: "Documento tot amb captures de pantalla, reporto a la plataforma, informo l'institut, conec els meus drets legals (LOPD, dret d'imatge) i sé on denunciar-ho si cal", level: 4 },
    ],
  },

  // ─── ÀREA 3: CREACIÓ DE CONTINGUTS DIGITALS ───
  {
    area: "Creació de continguts",
    type: "self",
    question: "Quines eines de creació digital saps fer servir de manera autònoma?",
    options: [
      { text: "Bàsicament editors de text (Word/Docs) per escriure i poc més", level: 1 },
      { text: "Editors de text, presentacions (Slides/PowerPoint) i alguna eina de retoc d'imatge senzilla", level: 2 },
      { text: "A més de les anteriors, edito vídeo, àudio o faig servir eines de disseny com Canva amb soltesa", level: 3 },
      { text: "Domino eines avançades de disseny, edició multimèdia, i sé fer servir eines de programació o codi per crear contingut interactiu", level: 4 },
    ],
  },
  {
    area: "Creació de continguts",
    type: "situational",
    scenario: "Escenari: Has de crear una presentació sobre els ecosistemes per exposar-la a classe davant dels companys.",
    question: "Com la prepares?",
    options: [
      { text: "Copio text de la Viquipèdia i el poso directament a les diapositives amb molta lletra", level: 1 },
      { text: "Faig diapositives amb punts clau, algunes imatges d'internet i un disseny bàsic", level: 2 },
      { text: "Creo diapositives visuals amb poc text, imatges de qualitat, una estructura narrativa clara i cito les fonts", level: 3 },
      { text: "Dissenyo una presentació amb multimèdia integrat (vídeo, infografies pròpies), interactivitat, un guió per a l'exposició oral, i llicències correctes per a tot el material", level: 4 },
    ],
  },
  {
    area: "Creació de continguts",
    type: "situational",
    scenario: "Escenari: Necessites una imatge per il·lustrar un treball. Trobes una foto perfecta a internet.",
    question: "Què fas amb aquesta imatge?",
    options: [
      { text: "La descarrego i la poso al treball directament sense pensar-hi", level: 1 },
      { text: "La faig servir però poso a sota \"imatge extreta d'internet\"", level: 2 },
      { text: "Comprovo si té llicència lliure (Creative Commons, Unsplash...) i la cito correctament", level: 3 },
      { text: "Busco en bancs d'imatges lliures, verifico la llicència, cito segons el format adequat i sé la diferència entre CC-BY, CC-BY-SA, CC-BY-NC, etc.", level: 4 },
    ],
  },
  {
    area: "Creació de continguts",
    type: "self",
    cycle_specific: true,
    question_junior: "Si haguessis de crear un pòster digital per a una activitat de l'institut, com ho faries?",
    question_senior: "Si haguessis de crear una web senzilla o un recurs interactiu per a un projecte de classe, com ho faries?",
    options_junior: [
      { text: "No sabria per on començar sense que algú m'ajudi pas a pas", level: 1 },
      { text: "Faria servir una plantilla de Canva i canviaria el text i alguna imatge", level: 2 },
      { text: "Dissenyaria el pòster des de zero a Canva o similar, triant colors, tipografia i imatges coherents amb el missatge", level: 3 },
      { text: "Crearia un disseny original amb composició visual treballada, jerarquia tipogràfica, paleta de colors pròpia i elements gràfics originals", level: 4 },
    ],
    options_senior: [
      { text: "No sabria com fer-ho, necessitaria instruccions molt detallades", level: 1 },
      { text: "Podria fer servir Google Sites o una eina senzilla per muntar alguna cosa bàsica", level: 2 },
      { text: "Sé crear webs amb Google Sites o similars, amb estructura clara, navegació i multimèdia integrat", level: 3 },
      { text: "Puc crear contingut interactiu amb eines avançades o codi bàsic (HTML/CSS), integrant multimèdia, formularis i disseny responsive", level: 4 },
    ],
  },
  {
    area: "Creació de continguts",
    type: "situational",
    scenario: "Escenari: Fas servir una intel·ligència artificial (com ChatGPT) per ajudar-te amb un treball de classe.",
    question: "Quin ús en fas?",
    options: [
      { text: "Li demano que m'escrigui el treball sencer i l'entrego tal qual", level: 1 },
      { text: "Li demano idees i informació, però copio fragments sense revisar-los gaire", level: 2 },
      { text: "La faig servir per generar idees, estructurar el treball i buscar informació, però sempre reviso, reformulo i contrasto", level: 3 },
      { text: "La utilitzo com a eina de suport: genero esborranys, reviso críticament, contrasto amb altres fonts, reformulo amb les meves paraules i declaro que l'he utilitzada", level: 4 },
    ],
  },

  // ─── ÀREA 4: SEGURETAT ───
  {
    area: "Seguretat",
    type: "self",
    question: "Com gestiones les teves contrasenyes dels serveis digitals que fas servir?",
    options: [
      { text: "Faig servir la mateixa contrasenya (o molt similar) per a quasi tot", level: 1 },
      { text: "Tinc 2-3 contrasenyes diferents que vaig alternant segons el servei", level: 2 },
      { text: "Tinc contrasenyes úniques i complexes per als serveis importants i faig servir verificació en dos passos", level: 3 },
      { text: "Faig servir un gestor de contrasenyes, totes són úniques i llargues, tinc 2FA activat i reviso periòdicament si hi ha filtracions", level: 4 },
    ],
  },
  {
    area: "Seguretat",
    type: "situational",
    scenario: "Escenari: Reps un correu que diu ser de Google. Et demana que facis clic a un enllaç per verificar el teu compte perquè \"han detectat activitat sospitosa\". L'adreça del remitent és security@g00gle-support.com.",
    question: "Què fas?",
    options: [
      { text: "Faig clic a l'enllaç ràpidament perquè em preocupa que em tanquin el compte", level: 1 },
      { text: "Dubto, però com que parla de seguretat, potser sí que hauria de fer clic per assegurar-me", level: 2 },
      { text: "No faig clic. L'adreça del remitent em sembla sospitosa (g00gle amb zeros) i verifico directament des del meu compte de Google", level: 3 },
      { text: "Identifico els indicadors de phishing (remitent fals, urgència, enllaç sospitós), no faig clic, reporto el correu com a phishing i aviso companys o familiars que podrien rebre'l", level: 4 },
    ],
  },
  {
    area: "Seguretat",
    type: "self",
    question: "Quines mesures prens per protegir els teus dispositius (mòbil, ordinador, tauleta)?",
    options: [
      { text: "No en prenc cap d'especial, a vegades posposo les actualitzacions indefinidament", level: 1 },
      { text: "Tinc bloqueig de pantalla i instal·lo actualitzacions quan me les demana, però no faig gaire més", level: 2 },
      { text: "Mantinc els dispositius actualitzats, tinc bloqueig segur, no instal·lo apps de fonts desconegudes i tinc antivirus", level: 3 },
      { text: "A més, faig còpies de seguretat regulars, reviso permisos de les apps, xifro dades sensibles i sé restaurar el dispositiu si cal", level: 4 },
    ],
  },
  {
    area: "Seguretat",
    type: "situational",
    scenario: "Escenari: Un amic et demana que li comparteixis la contrasenya del teu compte de Netflix/Spotify perquè el vol provar.",
    question: "Com actues?",
    options: [
      { text: "Li dono la contrasenya sense pensar-hi, és un amic", level: 1 },
      { text: "Li dono la contrasenya però li dic que no la comparteixi amb ningú més", level: 2 },
      { text: "No li dono la contrasenya directament, busco una alternativa com crear-li un perfil o compartir des de l'app", level: 3 },
      { text: "Li explico per què compartir contrasenyes és un risc de seguretat, li proposo alternatives segures i m'asseguro que els meus comptes tenen 2FA", level: 4 },
    ],
  },
  {
    area: "Seguretat",
    type: "situational",
    cycle_specific: true,
    scenario_junior: "Escenari: Estàs jugant en línia i un desconegut et demana el teu nom real, la teva edat i a quin institut vas.",
    question_junior: "Com reacciones?",
    scenario_senior: "Escenari: Per registrar-te en una app nova et demana accés als teus contactes, fotos, ubicació i micròfon.",
    question_senior: "Com actues?",
    options_junior: [
      { text: "Li dic la informació perquè sembla bona persona i volem jugar junts", level: 1 },
      { text: "No li dic el meu nom real, però potser li dic l'edat o la ciutat on visc", level: 2 },
      { text: "No comparteixo dades personals amb desconeguts en línia i canvio de tema o el bloquejo", level: 3 },
      { text: "No comparteixo res, bloquejo i reporto l'usuari, i sé explicar als meus companys per què és perillós compartir dades personals amb desconeguts", level: 4 },
    ],
    options_senior: [
      { text: "Accepto tots els permisos per poder fer servir l'app ràpidament", level: 1 },
      { text: "Em fixo en els permisos que demana però al final accepto quasi tots perquè si no l'app no funciona", level: 2 },
      { text: "Reviso cada permís i només concedeixo els estrictament necessaris per al funcionament de l'app", level: 3 },
      { text: "Analitzo els permisos, llegeixo la política de privacitat resumida, busco alternatives si demana massa permisos i configuro restriccions des dels ajustos del mòbil", level: 4 },
    ],
  },

  // ─── ÀREA 5: RESOLUCIÓ DE PROBLEMES ───
  {
    area: "Resolució de problemes",
    type: "situational",
    scenario: "Escenari: Estàs fent un treball a l'ordinador de l'institut i de sobte es bloqueja. No pots guardar el que tenies.",
    question: "Què fas?",
    options: [
      { text: "Em quedo aturat/da i crido el professor immediatament", level: 1 },
      { text: "Intento esperar una mica i si no reacciona, forço el reinici (Ctrl+Alt+Supr o botó)", level: 2 },
      { text: "Intento tancar l'aplicació bloquejada des del Gestor de Tasques, comprovo si el document s'ha autoguardat", level: 3 },
      { text: "Utilitzo el Gestor de Tasques per diagnosticar el problema, recupero l'arxiu des de l'autoguardat o versions anteriors, i prenc mesures preventives (guardar sovint, còpies al núvol)", level: 4 },
    ],
  },
  {
    area: "Resolució de problemes",
    type: "self",
    question: "Quan necessites fer servir una aplicació o eina digital nova que no coneixes, com aprens?",
    options: [
      { text: "Necessito que algú s'assegui amb mi i m'ensenyi pas a pas cada cosa", level: 1 },
      { text: "Miro un tutorial de YouTube i intento seguir-lo pas a pas", level: 2 },
      { text: "Exploro l'eina per compte meu, busco tutorials si cal, i practico fins que la domino", level: 3 },
      { text: "Aprenc de manera autònoma combinant exploració, documentació oficial i tutorials. Comparo alternatives i trio l'eina més adequada per cada necessitat", level: 4 },
    ],
  },
  {
    area: "Resolució de problemes",
    type: "situational",
    scenario: "Escenari: El Wi-Fi de casa teva no funciona. Necessites connectar-te per entregar un treball que s'ha de lliurar avui.",
    question: "Com soluciones la situació?",
    options: [
      { text: "No sé què fer, espero que algú de casa ho arregli o no entrego el treball", level: 1 },
      { text: "Reinicio el router i si no funciona, comparteixo dades del mòbil per connectar-me", level: 2 },
      { text: "Comprovo el router, reinicio, provo des del mòbil, i si no funciona, busco una alternativa (dades mòbils, casa d'un amic, biblioteca)", level: 3 },
      { text: "Diagnostico el problema (llums del router, configuració, prova amb cable), i tinc un pla B preparat (treballs autoguardats al núvol, accés des del mòbil, opcions alternatives de connexió)", level: 4 },
    ],
  },
  {
    area: "Resolució de problemes",
    type: "self",
    cycle_specific: true,
    question_junior: "Si haguessis d'automatitzar una tasca repetitiva a l'ordinador (per exemple, renombrar 50 fitxers), com ho faries?",
    question_senior: "Si necessitessis crear un programa senzill o automatitzar un procés digital (per exemple, organitzar dades, crear un formulari amb lògica), com ho faries?",
    options_junior: [
      { text: "No sé què vol dir automatitzar, ho faria un per un a mà", level: 1 },
      { text: "Sé que existeixen maneres de fer-ho ràpid, però no sé com", level: 2 },
      { text: "Buscaria una eina o tutorial per fer-ho, i seguiria les instruccions fins a aconseguir-ho", level: 3 },
      { text: "Conec eines per fer-ho (reanomenar per lots, macros bàsiques) o sabria buscar i aprendre'n ràpidament", level: 4 },
    ],
    options_senior: [
      { text: "No sabria per on començar, la programació em supera completament", level: 1 },
      { text: "Podria intentar-ho amb eines senzilles (formularis de Google, Scratch) amb ajuda", level: 2 },
      { text: "Puc crear formularis amb lògica, fulls de càlcul amb fórmules avançades o programes bàsics amb Scratch/Python", level: 3 },
      { text: "Sé programar bàsicament (Python/JavaScript), crear automatitzacions amb fórmules i scripts, i integrar diferents eines per solucionar problemes complexos", level: 4 },
    ],
  },
  {
    area: "Resolució de problemes",
    type: "situational",
    scenario: "Escenari: Has de decidir quina eina digital fer servir per a un projecte de classe. Pots triar entre fer un vídeo, un pòdcast, una infografia o una web.",
    question: "Com prens la decisió?",
    options: [
      { text: "Trio el que em resulti més fàcil o el que fan els meus amics", level: 1 },
      { text: "Penso en quina eina sé fer servir millor i trio aquella", level: 2 },
      { text: "Valoro quina eina és més adequada per al contingut i el públic, i trio en funció d'això encara que hagi d'aprendre una mica", level: 3 },
      { text: "Analitzo el contingut, el públic, el temps disponible i les meves habilitats, trio l'eina que millor comuniqui el missatge i planifico el procés de creació", level: 4 },
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// RÚBRICA D'OBSERVACIÓ DEL PROFESSOR
// ═══════════════════════════════════════════════════════════
const teacherRubric = [
  {
    area: "Informació i dades",
    criteria: [
      { name: "Cerca d'informació", a1: "Cerca aleatòria, primer resultat", a2: "Paraules clau bàsiques, revisa 2-3 resultats", b1: "Cerca estratègica, filtra i compara", b2: "Cerca experta, fonts especialitzades, operadors" },
      { name: "Avaluació de fonts", a1: "No qüestiona les fonts", a2: "Intueix que algunes són millors", b1: "Aplica criteris de fiabilitat", b2: "Avaluació crítica sistemàtica" },
      { name: "Organització de dades", a1: "Fitxers desordenats", a2: "Carpetes bàsiques", b1: "Sistema organitzat al núvol", b2: "Sistema complet amb versions i còpies" },
    ],
  },
  {
    area: "Comunicació i col·laboració",
    criteria: [
      { name: "Treball col·laboratiu", a1: "No sap col·laborar digitalment", a2: "Comparteix documents bàsics", b1: "Col·labora en temps real amb organització", b2: "Lidera i coordina projectes col·laboratius" },
      { name: "Comunicació digital", a1: "Registre inadequat", a2: "Comunicació acceptable", b1: "Adapta registre al context", b2: "Comunicació excel·lent, proactiva" },
      { name: "Ciutadania digital", a1: "No considera l'impacte de les accions", a2: "Respecte bàsic", b1: "Gestiona identitat i privacitat", b2: "Model de conducta digital responsable" },
    ],
  },
  {
    area: "Creació de continguts",
    criteria: [
      { name: "Producció multimèdia", a1: "Només text bàsic", a2: "Text i imatge senzills", b1: "Contingut visual de qualitat", b2: "Multimèdia avançat i creatiu" },
      { name: "Drets d'autor", a1: "Copia sense citar", a2: "Cita parcialment", b1: "Respecta llicències i cita", b2: "Coneix CC, cita correctament, crea original" },
      { name: "Ús de la IA", a1: "Copia resultats d'IA directament", a2: "Usa IA amb revisió parcial", b1: "IA com a suport, revisa i reformula", b2: "Ús crític, declarat i complementari de la IA" },
    ],
  },
  {
    area: "Seguretat",
    criteria: [
      { name: "Protecció personal", a1: "Comparteix dades sense precaució", a2: "Precaució bàsica", b1: "Gestiona privacitat activament", b2: "Protecció avançada, ajuda companys" },
      { name: "Contrasenyes i comptes", a1: "Contrasenyes febles/repetides", a2: "Alguna varietat", b1: "Contrasenyes fortes + 2FA", b2: "Gestor de contrasenyes, monitoritza filtracions" },
      { name: "Detecció d'amenaces", a1: "No detecta phishing/estafes", a2: "Sospita vagament", b1: "Identifica i evita amenaces", b2: "Identifica, reporta i educa altres" },
    ],
  },
  {
    area: "Resolució de problemes",
    criteria: [
      { name: "Resolució tècnica", a1: "No sap reaccionar", a2: "Solucions bàsiques (reiniciar)", b1: "Diagnostica i resol de manera autònoma", b2: "Diagnostica, resol i preveu problemes" },
      { name: "Aprenentatge autònom", a1: "Necessita guia constant", a2: "Segueix tutorials pas a pas", b1: "Aprèn explorant amb autonomia", b2: "Autodidacta, compara i selecciona eines" },
      { name: "Pensament computacional", a1: "No identifica patrons automatitzables", a2: "Intueix possibilitats", b1: "Automatitza tasques senzilles", b2: "Programa/automatitza i integra eines" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// CONSTANTS I HELPERS
// ═══════════════════════════════════════════════════════════
const areaColors = {
  "Informació i dades": "#0891b2",
  "Comunicació i col·laboració": "#7c3aed",
  "Creació de continguts": "#dc2626",
  "Seguretat": "#059669",
  "Resolució de problemes": "#d97706",
};

const areaIcons = {
  "Informació i dades": "🔍",
  "Comunicació i col·laboració": "💬",
  "Creació de continguts": "🎨",
  "Seguretat": "🛡️",
  "Resolució de problemes": "⚙️",
};

const levelInfo = {
  1: { code: "A1", label: "Bàsic", emoji: "🌱", color: "#ef4444", desc: "Necessita guia constant. Coneixement molt limitat de les eines i pràctiques digitals." },
  2: { code: "A2", label: "Bàsic+", emoji: "🌿", color: "#f59e0b", desc: "Amb ajuda puntual pot realitzar tasques senzilles. Comença a desenvolupar hàbits digitals." },
  3: { code: "B1", label: "Intermedi", emoji: "🌳", color: "#6366f1", desc: "Autònom/a en tasques habituals. Aplica bones pràctiques i pren decisions informades." },
  4: { code: "B2", label: "Avançat", emoji: "🏔️", color: "#10b981", desc: "Nivell alt d'autonomia, criteri i creativitat. Pot ajudar i orientar companys/es." },
};

const areaDescriptions = {
  "Informació i dades": "Cerca, avaluació, gestió i organització d'informació i dades digitals",
  "Comunicació i col·laboració": "Interacció, compartició, col·laboració i ciutadania en entorns digitals",
  "Creació de continguts": "Producció, edició i reutilització de continguts digitals respectant drets d'autor",
  "Seguretat": "Protecció de dispositius, dades personals, salut i entorn digital",
  "Resolució de problemes": "Identificació de necessitats, resolució tècnica i pensament computacional",
};

function getAdaptedQuestion(q, cycle) {
  if (!q.cycle_specific) {
    return {
      scenario: q.scenario || null,
      question: q.question,
      options: q.options,
    };
  }
  if (cycle === "junior") {
    return {
      scenario: q.scenario_junior || null,
      question: q.question_junior || q.question,
      options: q.options_junior || q.options,
    };
  }
  return {
    scenario: q.scenario_senior || null,
    question: q.question_senior || q.question,
    options: q.options_senior || q.options,
  };
}

// ═══════════════════════════════════════════════════════════
// COMPONENT PRINCIPAL
// ═══════════════════════════════════════════════════════════
export default function DigCompAssessment() {
  const [screen, setScreen] = useState("intro");
  const [studentName, setStudentName] = useState("");
  const [studentSurname1, setStudentSurname1] = useState("");
  const [studentSurname2, setStudentSurname2] = useState("");
  const [studentCourse, setStudentCourse] = useState("");
  const [formError, setFormError] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [expandedArea, setExpandedArea] = useState(null);
  const [showRubric, setShowRubric] = useState(false);
  const [rubricScores, setRubricScores] = useState({});

  const cycle = (studentCourse === "1r ESO" || studentCourse === "2n ESO") ? "junior" : "senior";

  const handleStart = () => {
    if (!studentName.trim() || !studentSurname1.trim() || !studentSurname2.trim() || !studentCourse) {
      setFormError(true);
      return;
    }
    setScreen("quiz");
  };

  const handleSelect = (level) => {
    if (animating) return;
    setSelectedOption(level);
    setAnimating(true);
    setTimeout(() => {
      const q = allQuestions[currentQ];
      setAnswers([...answers, { area: q.area, level, type: q.type }]);
      if (currentQ < allQuestions.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelectedOption(null);
        setAnimating(false);
      } else {
        setScreen("results");
        setAnimating(false);
      }
    }, 450);
  };

  const restart = () => {
    setScreen("intro");
    setCurrentQ(0);
    setAnswers([]);
    setSelectedOption(null);
    setStudentName("");
    setStudentSurname1("");
    setStudentSurname2("");
    setStudentCourse("");
    setFormError(false);
    setExpandedArea(null);
    setShowRubric(false);
    setRubricScores({});
  };

  const getAreaScores = () => {
    const areas = {};
    answers.forEach((a) => {
      if (!areas[a.area]) areas[a.area] = [];
      areas[a.area].push(a.level);
    });
    const result = {};
    Object.keys(areas).forEach((area) => {
      const avg = areas[area].reduce((s, v) => s + v, 0) / areas[area].length;
      result[area] = Math.round(avg * 10) / 10;
    });
    return result;
  };

  const getGlobalScore = () => {
    if (answers.length === 0) return 0;
    return Math.round((answers.reduce((s, a) => s + a.level, 0) / answers.length) * 10) / 10;
  };

  const getLevel = (score) => {
    if (score < 1.5) return 1;
    if (score < 2.5) return 2;
    if (score < 3.5) return 3;
    return 4;
  };

  const fullName = `${studentName} ${studentSurname1} ${studentSurname2}`;

  const exportCSV = () => {
    const areaScores = getAreaScores();
    const globalScore = getGlobalScore();
    const globalLevel = getLevel(globalScore);
    let csv = "Nom,Cognom1,Cognom2,Curs,Puntuació Global,Nivell Global";
    const areas = Object.keys(areaScores);
    areas.forEach(a => { csv += `,${a} (puntuació),${a} (nivell)`; });
    csv += "\n";
    csv += `${studentName},${studentSurname1},${studentSurname2},${studentCourse},${globalScore},${levelInfo[globalLevel].code}`;
    areas.forEach(a => {
      const l = getLevel(areaScores[a]);
      csv += `,${areaScores[a]},${levelInfo[l].code}`;
    });
    csv += "\n\nDetall de respostes\nPregunta,Àrea,Tipus,Nivell\n";
    answers.forEach((a, i) => {
      csv += `${i + 1},${a.area},${a.type},${levelInfo[a.level].code}\n`;
    });

    if (Object.keys(rubricScores).length > 0) {
      csv += "\nRúbrica d'observació del professor\nÀrea,Criteri,Nivell\n";
      Object.entries(rubricScores).forEach(([key, val]) => {
        const [area, criterion] = key.split("|||");
        csv += `${area},${criterion},${val}\n`;
      });
    }

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `digcomp_${studentSurname1}_${studentSurname2}_${studentName}_${studentCourse.replace(/\s/g, "")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── STYLES ───
  const bg = "linear-gradient(145deg, #0c1222 0%, #162032 40%, #0f1a2e 100%)";
  const card = {
    background: "rgba(255,255,255,0.025)",
    backdropFilter: "blur(16px)",
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.07)",
  };
  const inputStyle = (hasError) => ({
    width: "100%",
    padding: "13px 16px",
    borderRadius: 10,
    border: hasError ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    color: "#f1f5f9",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  });

  // ═══════════════ PANTALLA D'INICI ═══════════════
  if (screen === "intro") {
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div style={{ ...card, maxWidth: 520, width: "100%", padding: "44px 36px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🧭</div>
          <h1 style={{ color: "#f1f5f9", fontSize: 24, fontWeight: 700, marginBottom: 4, letterSpacing: "-0.4px" }}>
            Avaluació de Competència Digital
          </h1>
          <p style={{ color: "#64748b", fontSize: 13, marginBottom: 6 }}>Basat en el marc europeu DigComp 2.2</p>
          <div style={{ display: "inline-flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 24 }}>
            <span style={{ padding: "3px 10px", borderRadius: 12, background: "rgba(99,102,241,0.12)", color: "#a5b4fc", fontSize: 11 }}>25 preguntes</span>
            <span style={{ padding: "3px 10px", borderRadius: 12, background: "rgba(99,102,241,0.12)", color: "#a5b4fc", fontSize: 11 }}>4 nivells DigComp</span>
            <span style={{ padding: "3px 10px", borderRadius: 12, background: "rgba(99,102,241,0.12)", color: "#a5b4fc", fontSize: 11 }}>Adaptat per cicle</span>
            <span style={{ padding: "3px 10px", borderRadius: 12, background: "rgba(99,102,241,0.12)", color: "#a5b4fc", fontSize: 11 }}>Escenaris pràctics</span>
          </div>

          {formError && (
            <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5", fontSize: 13, marginBottom: 14, textAlign: "left" }}>
              ⚠️ Tots els camps són obligatoris.
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            <input type="text" placeholder="Nom *" value={studentName} onChange={(e) => { setStudentName(e.target.value); setFormError(false); }} style={inputStyle(formError && !studentName.trim())} />
            <input type="text" placeholder="Primer cognom *" value={studentSurname1} onChange={(e) => { setStudentSurname1(e.target.value); setFormError(false); }} style={inputStyle(formError && !studentSurname1.trim())} />
            <input type="text" placeholder="Segon cognom *" value={studentSurname2} onChange={(e) => { setStudentSurname2(e.target.value); setFormError(false); }} style={inputStyle(formError && !studentSurname2.trim())} />
            <select value={studentCourse} onChange={(e) => { setStudentCourse(e.target.value); setFormError(false); }} style={{ ...inputStyle(formError && !studentCourse), color: studentCourse ? "#f1f5f9" : "#64748b", cursor: "pointer" }}>
              <option value="" style={{ background: "#1a2332" }}>Selecciona el teu curs *</option>
              <option value="1r ESO" style={{ background: "#1a2332" }}>1r d'ESO</option>
              <option value="2n ESO" style={{ background: "#1a2332" }}>2n d'ESO</option>
              <option value="3r ESO" style={{ background: "#1a2332" }}>3r d'ESO</option>
              <option value="4t ESO" style={{ background: "#1a2332" }}>4t d'ESO</option>
            </select>
          </div>

          <button onClick={handleStart} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 20px rgba(79,70,229,0.3)", transition: "all 0.3s" }}>
            Començar l'avaluació →
          </button>

          <p style={{ color: "#475569", fontSize: 11, marginTop: 20, lineHeight: 1.5 }}>
            ⏱ Temps estimat: 10-15 minuts · Les preguntes s'adapten al teu curs
            <br />* Camps obligatoris
          </p>
        </div>
      </div>
    );
  }

  // ═══════════════ PANTALLA DEL QÜESTIONARI ═══════════════
  if (screen === "quiz") {
    const rawQ = allQuestions[currentQ];
    const q = getAdaptedQuestion(rawQ, cycle);
    const color = areaColors[rawQ.area];

    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", flexDirection: "column", alignItems: "center", padding: 20, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        {/* Progress */}
        <div style={{ width: "100%", maxWidth: 640, marginBottom: 24, marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 16, background: `${color}15`, color, fontSize: 12, fontWeight: 600, border: `1px solid ${color}25` }}>
                {areaIcons[rawQ.area]} {rawQ.area}
              </span>
              <span style={{ padding: "4px 10px", borderRadius: 16, background: rawQ.type === "situational" ? "rgba(249,115,22,0.12)" : "rgba(148,163,184,0.12)", color: rawQ.type === "situational" ? "#fb923c" : "#94a3b8", fontSize: 11, fontWeight: 500 }}>
                {rawQ.type === "situational" ? "📋 Escenari pràctic" : "📝 Autoavaluació"}
              </span>
            </div>
            <span style={{ color: "#64748b", fontSize: 13, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
              {currentQ + 1} / {allQuestions.length}
            </span>
          </div>
          <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${((currentQ + 1) / allQuestions.length) * 100}%`, background: `linear-gradient(90deg, ${color}, ${color}88)`, borderRadius: 3, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)" }} />
          </div>
        </div>

        {/* Question */}
        <div style={{ ...card, maxWidth: 640, width: "100%", padding: "32px 30px" }}>
          {q.scenario && (
            <div style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.12)", marginBottom: 18 }}>
              <p style={{ color: "#fbbf24", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>📋 Escenari</p>
              <p style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{q.scenario}</p>
            </div>
          )}

          <h2 style={{ color: "#f1f5f9", fontSize: 17, fontWeight: 600, marginBottom: 22, lineHeight: 1.5 }}>
            {q.question}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((opt, i) => {
              const isSelected = selectedOption === opt.level;
              const badges = ["A", "B", "C", "D"];
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(opt.level)}
                  disabled={animating}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    padding: "14px 16px", borderRadius: 14, textAlign: "left",
                    border: isSelected ? `2px solid ${color}` : "2px solid rgba(255,255,255,0.05)",
                    background: isSelected ? `${color}10` : "rgba(255,255,255,0.015)",
                    color: "#e2e8f0", fontSize: 13, lineHeight: 1.55,
                    cursor: animating ? "default" : "pointer",
                    transition: "all 0.25s",
                    opacity: animating && !isSelected ? 0.3 : 1,
                    transform: isSelected ? "scale(1.01)" : "scale(1)",
                    fontFamily: "inherit",
                  }}
                >
                  <span style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    minWidth: 28, height: 28, borderRadius: 7,
                    background: isSelected ? color : "rgba(255,255,255,0.07)",
                    color: isSelected ? "#fff" : "#94a3b8",
                    fontSize: 12, fontWeight: 700, transition: "all 0.25s",
                  }}>
                    {badges[i]}
                  </span>
                  <span style={{ paddingTop: 3 }}>{opt.text}</span>
                </button>
              );
            })}
          </div>

          <p style={{ color: "#475569", fontSize: 11, marginTop: 16, textAlign: "center" }}>
            Tria l'opció que millor et descriu. No hi ha respostes correctes ni incorrectes.
          </p>
        </div>
      </div>
    );
  }

  // ═══════════════ PANTALLA DE RESULTATS ═══════════════
  if (screen === "results") {
    const areaScores = getAreaScores();
    const globalScore = getGlobalScore();
    const globalLevel = getLevel(globalScore);

    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 20px", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        {/* Header */}
        <div style={{ maxWidth: 680, width: "100%", textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>{levelInfo[globalLevel].emoji}</div>
          <h1 style={{ color: "#f1f5f9", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
            {fullName}
          </h1>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12, flexWrap: "wrap" }}>
            <span style={{ padding: "4px 12px", borderRadius: 16, background: "rgba(99,102,241,0.12)", color: "#a5b4fc", fontSize: 12, fontWeight: 500 }}>{studentCourse}</span>
            <span style={{ padding: "4px 12px", borderRadius: 16, background: `${levelInfo[globalLevel].color}18`, color: levelInfo[globalLevel].color, fontSize: 12, fontWeight: 600 }}>
              Nivell {levelInfo[globalLevel].code} — {levelInfo[globalLevel].label}
            </span>
          </div>
          <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6, maxWidth: 500, margin: "0 auto" }}>
            {levelInfo[globalLevel].desc}
          </p>
        </div>

        {/* Score ring */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <div style={{ position: "relative", width: 130, height: 130 }}>
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle cx="65" cy="65" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="9" />
              <circle cx="65" cy="65" r="54" fill="none" stroke={levelInfo[globalLevel].color} strokeWidth="9" strokeDasharray={`${(globalScore / 4) * 339.3} 339.3`} strokeLinecap="round" transform="rotate(-90 65 65)" style={{ transition: "stroke-dasharray 1s ease" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#f1f5f9", fontSize: 28, fontWeight: 700 }}>{globalScore}</span>
              <span style={{ color: "#64748b", fontSize: 11 }}>de 4.0</span>
            </div>
          </div>
        </div>

        {/* Area breakdown */}
        <div style={{ ...card, maxWidth: 680, width: "100%", padding: "28px 28px", marginBottom: 20 }}>
          <h3 style={{ color: "#e2e8f0", fontSize: 15, fontWeight: 600, marginBottom: 20 }}>
            Resultats per àrea competencial
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Object.entries(areaScores).map(([area, score]) => {
              const areaLevel = getLevel(score);
              const isExpanded = expandedArea === area;
              return (
                <div key={area} onClick={() => setExpandedArea(isExpanded ? null : area)} style={{ cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 7, color: "#e2e8f0", fontSize: 13, fontWeight: 500 }}>
                      <span style={{ fontSize: 16 }}>{areaIcons[area]}</span>
                      {area}
                      <span style={{ color: "#475569", fontSize: 11 }}>{isExpanded ? "▲" : "▼"}</span>
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: "#94a3b8", fontSize: 12, fontVariantNumeric: "tabular-nums" }}>{score}/4</span>
                      <span style={{ padding: "3px 9px", borderRadius: 10, background: `${levelInfo[areaLevel].color}15`, color: levelInfo[areaLevel].color, fontSize: 11, fontWeight: 600 }}>
                        {levelInfo[areaLevel].code}
                      </span>
                    </div>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(score / 4) * 100}%`, background: `linear-gradient(90deg, ${areaColors[area]}, ${areaColors[area]}88)`, borderRadius: 3, transition: "width 0.8s ease" }} />
                  </div>
                  {isExpanded && (
                    <div style={{ marginTop: 10, padding: "12px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                      <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.5, margin: "0 0 8px 0" }}>
                        {areaDescriptions[area]}
                      </p>
                      <p style={{ color: "#cbd5e1", fontSize: 12, lineHeight: 1.5, margin: 0 }}>
                        {levelInfo[areaLevel].emoji} <strong>Nivell {levelInfo[areaLevel].code}:</strong> {levelInfo[areaLevel].desc}
                      </p>
                      <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {answers.filter(a => a.area === area).map((a, i) => (
                          <span key={i} style={{ padding: "2px 8px", borderRadius: 8, background: `${levelInfo[a.level].color}15`, color: levelInfo[a.level].color, fontSize: 10, fontWeight: 600 }}>
                            P{answers.indexOf(a) + 1}: {levelInfo[a.level].code} {a.type === "situational" ? "📋" : "📝"}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div style={{ ...card, maxWidth: 680, width: "100%", padding: "28px 28px", marginBottom: 20 }}>
          <h3 style={{ color: "#e2e8f0", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            💡 Recomanacions de millora
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.entries(areaScores)
              .sort((a, b) => a[1] - b[1])
              .map(([area, score]) => {
                const areaLevel = getLevel(score);
                const recs = {
                  "Informació i dades": {
                    1: "Practica cercant informació amb paraules clau en lloc de frases llargues. Comença comparant dos resultats abans d'escollir-ne un.",
                    2: "Aprèn a fer servir filtres de cerca (per data, tipus). Practica identificant si una font és fiable preguntant-te: Qui ho escriu? Quan? Per què?",
                    3: "Explora cercadors acadèmics (Google Scholar) i aprèn la tècnica SIFT per verificar fonts. Crea un sistema de gestió d'informació al núvol.",
                    4: "Comparteix les teves estratègies amb companys. Explora bases de dades especialitzades i contribueix a millorar l'alfabetització informacional del grup.",
                  },
                  "Comunicació i col·laboració": {
                    1: "Practica enviant correus formals amb assumpte, salutació i comiat. Aprèn a fer servir Google Docs compartit.",
                    2: "Revisa la configuració de privacitat de tots els teus comptes. Practica col·laborant en temps real amb documents compartits.",
                    3: "Aprèn a organitzar projectes col·laboratius amb rols i calendari. Reflexiona sobre la teva empremta digital.",
                    4: "Lidera projectes digitals col·laboratius i ajuda companys a millorar les seves habilitats de comunicació digital i privacitat.",
                  },
                  "Creació de continguts": {
                    1: "Comença amb eines senzilles com Canva. Aprèn que no es pot copiar d'internet sense citar la font.",
                    2: "Explora l'edició bàsica de vídeo i imatge. Aprèn què són les llicències Creative Commons i busca imatges lliures.",
                    3: "Aprofundeix en eines d'edició multimèdia. Practica citant fonts correctament i declarant l'ús d'IA als teus treballs.",
                    4: "Explora la creació de contingut interactiu amb codi. Comparteix els teus coneixements de creació digital amb companys.",
                  },
                  "Seguretat": {
                    1: "Canvia les teves contrasenyes repetides per contrasenyes úniques. No comparteixis mai dades personals amb desconeguts en línia.",
                    2: "Activa la verificació en dos passos als teus comptes importants. Aprèn a identificar correus de phishing (mira l'adreça del remitent!).",
                    3: "Explora gestors de contrasenyes. Practica revisant els permisos de les apps del mòbil i eliminant els innecessaris.",
                    4: "Comparteix els teus coneixements de seguretat amb la comunitat. Mantén-te al dia sobre noves amenaces i bones pràctiques.",
                  },
                  "Resolució de problemes": {
                    1: "Quan tinguis un problema tècnic, intenta buscar la solució a Google abans de demanar ajuda. Practica explorant eines noves.",
                    2: "Aprèn a fer servir el Gestor de Tasques per diagnosticar problemes. Practica instal·lant aplicacions i configurant-les autònomament.",
                    3: "Explora l'automatització de tasques repetitives. Comença amb fórmules avançades de fulls de càlcul o Scratch/Python bàsic.",
                    4: "Aprofundeix en programació i automatització. Comparteix solucions tècniques amb companys i crea tutorials per als altres.",
                  },
                };
                return (
                  <div key={area} style={{ padding: "12px 16px", borderRadius: 12, background: `${areaColors[area]}06`, border: `1px solid ${areaColors[area]}18` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 14 }}>{areaIcons[area]}</span>
                      <span style={{ color: areaColors[area], fontSize: 12, fontWeight: 600 }}>{area}</span>
                      <span style={{ color: levelInfo[areaLevel].color, fontSize: 11 }}>({levelInfo[areaLevel].code})</span>
                    </div>
                    <p style={{ color: "#cbd5e1", fontSize: 12, lineHeight: 1.55, margin: 0 }}>
                      {recs[area][areaLevel]}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Teacher rubric toggle */}
        <div style={{ ...card, maxWidth: 680, width: "100%", padding: "28px 28px", marginBottom: 20 }}>
          <button
            onClick={() => setShowRubric(!showRubric)}
            style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <h3 style={{ color: "#e2e8f0", fontSize: 15, fontWeight: 600, margin: 0 }}>
              📋 Rúbrica d'observació del professor
            </h3>
            <span style={{ color: "#64748b", fontSize: 18 }}>{showRubric ? "−" : "+"}</span>
          </button>

          {showRubric && (
            <div style={{ marginTop: 20 }}>
              <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.5, marginBottom: 16 }}>
                Aquesta rúbrica permet al professorat complementar l'autoavaluació amb observació directa.
                Selecciona el nivell observat per a cada criteri. Els resultats s'inclouran en l'exportació CSV.
              </p>

              {teacherRubric.map((section) => (
                <div key={section.area} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                    <span style={{ fontSize: 16 }}>{areaIcons[section.area]}</span>
                    <span style={{ color: areaColors[section.area], fontSize: 13, fontWeight: 600 }}>{section.area}</span>
                  </div>
                  {section.criteria.map((crit) => {
                    const key = `${section.area}|||${crit.name}`;
                    const selected = rubricScores[key];
                    return (
                      <div key={crit.name} style={{ marginBottom: 14, paddingLeft: 12 }}>
                        <p style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{crit.name}</p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
                          {[
                            { code: "A1", desc: crit.a1 },
                            { code: "A2", desc: crit.a2 },
                            { code: "B1", desc: crit.b1 },
                            { code: "B2", desc: crit.b2 },
                          ].map(({ code, desc }) => {
                            const isActive = selected === code;
                            const lvl = { A1: 1, A2: 2, B1: 3, B2: 4 }[code];
                            return (
                              <button
                                key={code}
                                onClick={(e) => { e.stopPropagation(); setRubricScores({ ...rubricScores, [key]: code }); }}
                                style={{
                                  padding: "8px 6px", borderRadius: 8, border: isActive ? `2px solid ${levelInfo[lvl].color}` : "2px solid rgba(255,255,255,0.05)",
                                  background: isActive ? `${levelInfo[lvl].color}12` : "rgba(255,255,255,0.015)",
                                  cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.2s",
                                }}
                              >
                                <span style={{ display: "block", color: isActive ? levelInfo[lvl].color : "#94a3b8", fontSize: 10, fontWeight: 700, marginBottom: 3 }}>{code}</span>
                                <span style={{ display: "block", color: "#cbd5e1", fontSize: 10, lineHeight: 1.4 }}>{desc}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 28 }}>
          <button onClick={exportCSV} style={{ padding: "12px 28px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 16px rgba(79,70,229,0.3)" }}>
            📥 Exportar CSV
          </button>
          <button onClick={() => window.print()} style={{ padding: "12px 28px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#94a3b8", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
            🖨️ Imprimir
          </button>
          <button onClick={restart} style={{ padding: "12px 28px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#94a3b8", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
            🔄 Nova avaluació
          </button>
        </div>

        <p style={{ color: "#334155", fontSize: 10, textAlign: "center", maxWidth: 500 }}>
          Avaluació basada en el marc DigComp 2.2 de la Comissió Europea · Adaptat per a ESO (1r-4t) ·
          Combina autoavaluació i escenaris situacionals · Complementar amb rúbrica d'observació directa per a una avaluació significativa
        </p>
      </div>
    );
  }
}
