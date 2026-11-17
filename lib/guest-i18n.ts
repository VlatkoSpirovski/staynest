export const GUEST_LOCALES = [
  { code: "en", label: "English", short: "EN" },
  { code: "de", label: "Deutsch", short: "DE" },
  { code: "fr", label: "Français", short: "FR" },
  { code: "it", label: "Italiano", short: "IT" },
  { code: "es", label: "Español", short: "ES" },
  { code: "nl", label: "Nederlands", short: "NL" }
] as const;

export type GuestLocale = (typeof GUEST_LOCALES)[number]["code"];

export type GuestMessages = {
  digitalConcierge: string;
  yourStaySimplified: string;
  welcomeTo: string;
  heroDescription: string;
  poweredBy: string;
  back: string;
  heroEyebrow: Record<"classic" | "modern" | "darkLuxury" | "mediterranean", string>;
  menu: {
    wifi: { title: string; subtitle: string };
    contact: { title: string; subtitle: string };
    arrival: { title: string; subtitle: string };
    house: { title: string; subtitle: string };
    restaurants: { title: string; subtitle: string };
    activities: { title: string; subtitle: string };
    essentials: { title: string; subtitle: string };
    reviews: { title: string; subtitle: string };
    emergency: { title: string; subtitle: string };
    explore: { title: string; subtitle: string };
  };
  heroTagline: string;
  guestGuide: string;
  readMore: string;
  showLess: string;
  chat: {
    stayAssistant: string;
    propertyBot: (name: string) => string;
    askProperty: (name: string) => string;
    askYourHost: string;
    intro: (bot: string, property: string) => string;
    helpTitle: string;
    helpSubtitle: string;
    promptSupermarket: string;
    promptCheckout: string;
    promptWifi: string;
    askAnything: string;
    thinking: string;
    errorAnswer: string;
    errorNow: string;
    conciergeHint: string;
  };
  sections: Record<
    "wifi" | "contact" | "arrival" | "house" | "restaurants" | "activities" | "essentials" | "reviews" | "emergency" | "explore",
    { eyebrow: string; title: string }
  >;
  content: {
    network: string;
    password: string;
    copyWifiPassword: string;
    passwordCopied: string;
    askHost: string;
    yourHost: string;
    whatsappHost: string;
    callHost: string;
    checkIn: string;
    checkOut: string;
    checkInFallback: string;
    checkOutFallback: string;
    parking: string;
    parkingFallback: string;
    houseRules: string;
    houseRulesFallback: string;
    noRestaurants: string;
    noActivities: string;
    noEssentials: string;
    leaveReview: string;
    reviewBlurb: string;
    noReviewLinks: string;
    emergencyContacts: string;
    emergencyFallback: string;
    openMap: string;
    whatsappStaying: (property: string) => string;
    showPassword: string;
    hidePassword: string;
    reviewOn: (platform: string) => string;
    noPlaces: string;
    eat: string;
    doNearby: string;
    usefulPlaces: string;
  };
};

const en: GuestMessages = {
  digitalConcierge: "Digital Concierge",
  yourStaySimplified: "Your stay, simplified",
  welcomeTo: "Welcome to",
  heroDescription: "Your digital concierge for Wi-Fi, arrival, house info, local tips and direct host contact.",
  poweredBy: "Powered by",
  back: "Back",
  heroTagline: "Everything for a smooth stay",
  guestGuide: "Guest guide",
  readMore: "Read more",
  showLess: "Show less",
  heroEyebrow: { classic: "Welcome", modern: "Arrival ready", darkLuxury: "Private retreat", mediterranean: "Welcome by the sea" },
  menu: {
    wifi: { title: "Wi-Fi", subtitle: "Connect" },
    contact: { title: "Contact", subtitle: "We are here" },
    arrival: { title: "Check-in/out", subtitle: "Arrival and departure" },
    house: { title: "House Guide", subtitle: "About the property" },
    restaurants: { title: "Restaurants", subtitle: "Food nearby" },
    activities: { title: "Activities", subtitle: "Things to do" },
    essentials: { title: "Essentials", subtitle: "Nearby help" },
    reviews: { title: "Reviews", subtitle: "Share your stay" },
    emergency: { title: "Emergency", subtitle: "Important contacts" },
    explore: { title: "Explore", subtitle: "Eat, see, essentials" }
  },
  chat: {
    stayAssistant: "Stay assistant",
    propertyBot: (name) => `${name} bot`,
    askProperty: (name) => `Ask ${name}`,
    askYourHost: "Ask your host",
    intro: (bot, property) => `Hi, I'm the ${bot}. Ask me anything about your stay at ${property}.`,
    helpTitle: "How can I help during your stay?",
    helpSubtitle: "Wi-Fi, checkout, parking, and local tips.",
    promptSupermarket: "Where is the nearest supermarket?",
    promptCheckout: "What time is checkout?",
    promptWifi: "How do I connect to Wi-Fi?",
    askAnything: "Ask anything...",
    thinking: "Thinking...",
    errorAnswer: "I could not answer that. Please contact your host.",
    errorNow: "I could not answer right now. Please contact your host.",
    conciergeHint: "Answers in seconds, in your language"
  },
  sections: {
    wifi: { eyebrow: "Wi-Fi", title: "Connect to the internet." },
    contact: { eyebrow: "Contact", title: "Need help during your stay?" },
    arrival: { eyebrow: "Arrival", title: "Check-in and check-out." },
    house: { eyebrow: "House guide", title: "Everything inside the property." },
    restaurants: { eyebrow: "Restaurants", title: "Where to eat." },
    activities: { eyebrow: "Activities", title: "Things to do nearby." },
    essentials: { eyebrow: "Essentials", title: "Useful places nearby." },
    reviews: { eyebrow: "Reviews", title: "Enjoying your stay?" },
    emergency: { eyebrow: "Emergency", title: "Important information." },
    explore: { eyebrow: "Explore", title: "Around the house." }
  },
  content: {
    network: "Network",
    password: "Password",
    copyWifiPassword: "Copy Wi-Fi password",
    passwordCopied: "Password copied",
    askHost: "Ask host",
    yourHost: "Your host",
    whatsappHost: "WhatsApp host",
    callHost: "Call host",
    checkIn: "Check-in",
    checkOut: "Check-out",
    checkInFallback: "Check your arrival message for check-in details.",
    checkOutFallback: "Check your arrival message for check-out details.",
    parking: "Parking",
    parkingFallback: "Ask your host about parking options.",
    houseRules: "House rules",
    houseRulesFallback: "Please enjoy the home with care and respect quiet hours.",
    noRestaurants: "Your host has not added restaurant recommendations yet.",
    noActivities: "Your host has not added activities yet.",
    noEssentials: "Your host has not added essential places yet.",
    leaveReview: "How was your stay?",
    reviewBlurb: "Honest reviews help future guests choose and help your host improve. Thank you for taking a minute.",
    noReviewLinks: "Review links will appear here once your host adds them.",
    emergencyContacts: "Emergency contacts",
    emergencyFallback: "For emergencies, call the local emergency number. Contact your host for property issues.",
    openMap: "Open map",
    whatsappStaying: (property) => `Hi, I am staying at ${property} and need help.`,
    showPassword: "Show",
    hidePassword: "Hide",
    reviewOn: (platform) => `Review on ${platform}`,
    noPlaces: "Your host has not added any places yet.",
    eat: "Eat and drink",
    doNearby: "Things to do",
    usefulPlaces: "Useful places"
  }
};

const de: GuestMessages = {
  digitalConcierge: "Digitaler Concierge",
  yourStaySimplified: "Ihr Aufenthalt, ganz einfach",
  welcomeTo: "Willkommen in",
  heroDescription: "Ihr digitaler Concierge für WLAN, Anreise, Hausinfos, lokale Tipps und den direkten Kontakt zum Gastgeber.",
  poweredBy: "Bereitgestellt von",
  back: "Zurück",
  heroTagline: "Alles für einen entspannten Aufenthalt",
  guestGuide: "Gästemappe",
  readMore: "Mehr lesen",
  showLess: "Weniger",
  heroEyebrow: { classic: "Willkommen", modern: "Bereit für Ihre Ankunft", darkLuxury: "Privater Rückzugsort", mediterranean: "Willkommen am Meer" },
  menu: {
    wifi: { title: "WLAN", subtitle: "Verbinden" },
    contact: { title: "Kontakt", subtitle: "Wir sind für Sie da" },
    arrival: { title: "Check-in/out", subtitle: "Anreise und Abreise" },
    house: { title: "Hausinfos", subtitle: "Alles zur Unterkunft" },
    restaurants: { title: "Restaurants", subtitle: "Essen in der Nähe" },
    activities: { title: "Aktivitäten", subtitle: "Was man unternehmen kann" },
    essentials: { title: "Wichtiges", subtitle: "Hilfe in der Nähe" },
    reviews: { title: "Bewertungen", subtitle: "Teilen Sie Ihren Aufenthalt" },
    emergency: { title: "Notfall", subtitle: "Wichtige Kontakte" },
    explore: { title: "Entdecken", subtitle: "Essen, Ausflüge, Wichtiges" }
  },
  chat: {
    stayAssistant: "Aufenthalts-Assistent",
    propertyBot: (name) => `${name}-Assistent`,
    askProperty: (name) => `${name} fragen`,
    askYourHost: "Gastgeber fragen",
    intro: (bot, property) => `Hallo, ich bin der ${bot}. Fragen Sie mich alles zu Ihrem Aufenthalt in ${property}.`,
    helpTitle: "Wie kann ich während Ihres Aufenthalts helfen?",
    helpSubtitle: "WLAN, Check-out, Parken und lokale Tipps.",
    promptSupermarket: "Wo ist der nächste Supermarkt?",
    promptCheckout: "Wann ist der Check-out?",
    promptWifi: "Wie verbinde ich mich mit dem WLAN?",
    askAnything: "Fragen Sie etwas...",
    thinking: "Einen Moment...",
    errorAnswer: "Das konnte ich nicht beantworten. Bitte kontaktieren Sie Ihren Gastgeber.",
    errorNow: "Ich kann gerade nicht antworten. Bitte kontaktieren Sie Ihren Gastgeber.",
    conciergeHint: "Antworten in Sekunden, in Ihrer Sprache"
  },
  sections: {
    wifi: { eyebrow: "WLAN", title: "Mit dem Internet verbinden." },
    contact: { eyebrow: "Kontakt", title: "Brauchen Sie Hilfe?" },
    arrival: { eyebrow: "Anreise", title: "Check-in und Check-out." },
    house: { eyebrow: "Hausinfos", title: "Alles rund um die Unterkunft." },
    restaurants: { eyebrow: "Restaurants", title: "Wo man gut isst." },
    activities: { eyebrow: "Aktivitäten", title: "Unternehmungen in der Nähe." },
    essentials: { eyebrow: "Wichtiges", title: "Nützliche Orte in der Nähe." },
    reviews: { eyebrow: "Bewertungen", title: "Gefällt Ihnen Ihr Aufenthalt?" },
    emergency: { eyebrow: "Notfall", title: "Wichtige Informationen." },
    explore: { eyebrow: "Entdecken", title: "Rund um die Unterkunft." }
  },
  content: {
    network: "Netzwerk",
    password: "Passwort",
    copyWifiPassword: "WLAN-Passwort kopieren",
    passwordCopied: "Passwort kopiert",
    askHost: "Gastgeber fragen",
    yourHost: "Ihr Gastgeber",
    whatsappHost: "WhatsApp an Gastgeber",
    callHost: "Gastgeber anrufen",
    checkIn: "Check-in",
    checkOut: "Check-out",
    checkInFallback: "Die Check-in-Details finden Sie in Ihrer Anreise-Nachricht.",
    checkOutFallback: "Die Check-out-Details finden Sie in Ihrer Anreise-Nachricht.",
    parking: "Parken",
    parkingFallback: "Fragen Sie Ihren Gastgeber nach Parkmöglichkeiten.",
    houseRules: "Hausregeln",
    houseRulesFallback: "Bitte gehen Sie sorgsam mit der Unterkunft um und halten Sie die Ruhezeiten ein.",
    noRestaurants: "Ihr Gastgeber hat noch keine Restaurant-Tipps hinzugefügt.",
    noActivities: "Ihr Gastgeber hat noch keine Aktivitäten hinzugefügt.",
    noEssentials: "Ihr Gastgeber hat noch keine wichtigen Orte hinzugefügt.",
    leaveReview: "Wie war Ihr Aufenthalt?",
    reviewBlurb: "Ehrliche Bewertungen helfen künftigen Gästen bei der Wahl und Ihrem Gastgeber, besser zu werden. Danke, dass Sie sich kurz Zeit nehmen.",
    noReviewLinks: "Bewertungslinks erscheinen hier, sobald Ihr Gastgeber sie hinzufügt.",
    emergencyContacts: "Notfallkontakte",
    emergencyFallback: "Im Notfall wählen Sie die örtliche Notrufnummer. Bei Problemen mit der Unterkunft kontaktieren Sie Ihren Gastgeber.",
    openMap: "Karte öffnen",
    whatsappStaying: (property) => `Hallo, ich wohne gerade in ${property} und brauche Hilfe.`,
    showPassword: "Anzeigen",
    hidePassword: "Verbergen",
    reviewOn: (platform) => `Auf ${platform} bewerten`,
    noPlaces: "Ihr Gastgeber hat noch keine Orte hinzugefügt.",
    eat: "Essen und Trinken",
    doNearby: "Unternehmungen",
    usefulPlaces: "Nützliche Orte"
  }
};

const fr: GuestMessages = {
  digitalConcierge: "Concierge numérique",
  yourStaySimplified: "Votre séjour, simplifié",
  welcomeTo: "Bienvenue à",
  heroDescription: "Votre concierge numérique pour le Wi-Fi, l'arrivée, le logement, les bonnes adresses et le contact direct avec votre hôte.",
  poweredBy: "Propulsé par",
  back: "Retour",
  heroTagline: "Tout pour un séjour serein",
  guestGuide: "Guide du séjour",
  readMore: "Lire la suite",
  showLess: "Réduire",
  heroEyebrow: { classic: "Bienvenue", modern: "Prêt pour votre arrivée", darkLuxury: "Retraite privée", mediterranean: "Bienvenue au bord de la mer" },
  menu: {
    wifi: { title: "Wi-Fi", subtitle: "Se connecter" },
    contact: { title: "Contact", subtitle: "Nous sommes là" },
    arrival: { title: "Arrivée/départ", subtitle: "Check-in et check-out" },
    house: { title: "Le logement", subtitle: "Tout sur les lieux" },
    restaurants: { title: "Restaurants", subtitle: "Où manger à proximité" },
    activities: { title: "Activités", subtitle: "Que faire" },
    essentials: { title: "Essentiels", subtitle: "Aide à proximité" },
    reviews: { title: "Avis", subtitle: "Partagez votre séjour" },
    emergency: { title: "Urgence", subtitle: "Contacts importants" },
    explore: { title: "Explorer", subtitle: "Manger, visiter, essentiels" }
  },
  chat: {
    stayAssistant: "Assistant de séjour",
    propertyBot: (name) => `Assistant de ${name}`,
    askProperty: (name) => `Demander à ${name}`,
    askYourHost: "Demander à votre hôte",
    intro: (bot, property) => `Bonjour, je suis l'${bot.charAt(0).toLowerCase()}${bot.slice(1)}. Posez-moi vos questions sur votre séjour à ${property}.`,
    helpTitle: "Comment puis-je vous aider pendant votre séjour ?",
    helpSubtitle: "Wi-Fi, départ, parking et bonnes adresses.",
    promptSupermarket: "Où est le supermarché le plus proche ?",
    promptCheckout: "À quelle heure est le départ ?",
    promptWifi: "Comment me connecter au Wi-Fi ?",
    askAnything: "Posez votre question...",
    thinking: "Un instant...",
    errorAnswer: "Je n'ai pas pu répondre. Veuillez contacter votre hôte.",
    errorNow: "Je ne peux pas répondre pour le moment. Veuillez contacter votre hôte.",
    conciergeHint: "Réponses en quelques secondes, dans votre langue"
  },
  sections: {
    wifi: { eyebrow: "Wi-Fi", title: "Se connecter à Internet." },
    contact: { eyebrow: "Contact", title: "Besoin d'aide pendant votre séjour ?" },
    arrival: { eyebrow: "Arrivée", title: "Arrivée et départ." },
    house: { eyebrow: "Le logement", title: "Tout ce qu'il faut savoir sur les lieux." },
    restaurants: { eyebrow: "Restaurants", title: "Où manger." },
    activities: { eyebrow: "Activités", title: "Que faire à proximité." },
    essentials: { eyebrow: "Essentiels", title: "Adresses utiles à proximité." },
    reviews: { eyebrow: "Avis", title: "Vous appréciez votre séjour ?" },
    emergency: { eyebrow: "Urgence", title: "Informations importantes." },
    explore: { eyebrow: "Explorer", title: "Autour du logement." }
  },
  content: {
    network: "Réseau",
    password: "Mot de passe",
    copyWifiPassword: "Copier le mot de passe Wi-Fi",
    passwordCopied: "Mot de passe copié",
    askHost: "Demander à l'hôte",
    yourHost: "Votre hôte",
    whatsappHost: "WhatsApp à l'hôte",
    callHost: "Appeler l'hôte",
    checkIn: "Arrivée",
    checkOut: "Départ",
    checkInFallback: "Consultez votre message d'arrivée pour les détails du check-in.",
    checkOutFallback: "Consultez votre message d'arrivée pour les détails du départ.",
    parking: "Parking",
    parkingFallback: "Demandez à votre hôte les possibilités de stationnement.",
    houseRules: "Règlement intérieur",
    houseRulesFallback: "Merci de prendre soin du logement et de respecter les heures de calme.",
    noRestaurants: "Votre hôte n'a pas encore ajouté de restaurants.",
    noActivities: "Votre hôte n'a pas encore ajouté d'activités.",
    noEssentials: "Votre hôte n'a pas encore ajouté d'adresses utiles.",
    leaveReview: "Comment s'est passé votre séjour ?",
    reviewBlurb: "Les avis honnêtes aident les futurs voyageurs à choisir et votre hôte à s'améliorer. Merci de prendre une minute.",
    noReviewLinks: "Les liens d'avis apparaîtront ici dès que votre hôte les aura ajoutés.",
    emergencyContacts: "Contacts d'urgence",
    emergencyFallback: "En cas d'urgence, appelez le numéro d'urgence local. Pour un problème dans le logement, contactez votre hôte.",
    openMap: "Ouvrir la carte",
    whatsappStaying: (property) => `Bonjour, je séjourne à ${property} et j'ai besoin d'aide.`,
    showPassword: "Afficher",
    hidePassword: "Masquer",
    reviewOn: (platform) => `Laisser un avis sur ${platform}`,
    noPlaces: "Votre hôte n'a pas encore ajouté d'adresses.",
    eat: "Manger et boire",
    doNearby: "À faire",
    usefulPlaces: "Adresses utiles"
  }
};

const it: GuestMessages = {
  digitalConcierge: "Concierge digitale",
  yourStaySimplified: "Il tuo soggiorno, semplice",
  welcomeTo: "Benvenuti a",
  heroDescription: "Il tuo concierge digitale per Wi-Fi, arrivo, informazioni sulla casa, consigli locali e contatto diretto con l'host.",
  poweredBy: "Realizzato con",
  back: "Indietro",
  heroTagline: "Tutto per un soggiorno sereno",
  guestGuide: "Guida per gli ospiti",
  readMore: "Leggi tutto",
  showLess: "Mostra meno",
  heroEyebrow: { classic: "Benvenuti", modern: "Pronto per il tuo arrivo", darkLuxury: "Rifugio privato", mediterranean: "Benvenuti al mare" },
  menu: {
    wifi: { title: "Wi-Fi", subtitle: "Connettiti" },
    contact: { title: "Contatti", subtitle: "Siamo qui" },
    arrival: { title: "Check-in/out", subtitle: "Arrivo e partenza" },
    house: { title: "La casa", subtitle: "Tutto sull'alloggio" },
    restaurants: { title: "Ristoranti", subtitle: "Dove mangiare" },
    activities: { title: "Attività", subtitle: "Cosa fare" },
    essentials: { title: "Servizi utili", subtitle: "Aiuto nelle vicinanze" },
    reviews: { title: "Recensioni", subtitle: "Racconta il tuo soggiorno" },
    emergency: { title: "Emergenza", subtitle: "Contatti importanti" },
    explore: { title: "Esplora", subtitle: "Mangiare, vedere, servizi" }
  },
  chat: {
    stayAssistant: "Assistente del soggiorno",
    propertyBot: (name) => `assistente di ${name}`,
    askProperty: (name) => `Chiedi a ${name}`,
    askYourHost: "Chiedi all'host",
    intro: (bot, property) => `Ciao, sono l'${bot}. Chiedimi qualsiasi cosa sul tuo soggiorno a ${property}.`,
    helpTitle: "Come posso aiutarti durante il soggiorno?",
    helpSubtitle: "Wi-Fi, check-out, parcheggio e consigli locali.",
    promptSupermarket: "Dov'è il supermercato più vicino?",
    promptCheckout: "A che ora è il check-out?",
    promptWifi: "Come mi collego al Wi-Fi?",
    askAnything: "Chiedi qualcosa...",
    thinking: "Un momento...",
    errorAnswer: "Non sono riuscito a rispondere. Contatta il tuo host.",
    errorNow: "Non riesco a rispondere ora. Contatta il tuo host.",
    conciergeHint: "Risposte in pochi secondi, nella tua lingua"
  },
  sections: {
    wifi: { eyebrow: "Wi-Fi", title: "Connettiti a Internet." },
    contact: { eyebrow: "Contatti", title: "Hai bisogno di aiuto?" },
    arrival: { eyebrow: "Arrivo", title: "Check-in e check-out." },
    house: { eyebrow: "La casa", title: "Tutto sull'alloggio." },
    restaurants: { eyebrow: "Ristoranti", title: "Dove mangiare." },
    activities: { eyebrow: "Attività", title: "Cosa fare nei dintorni." },
    essentials: { eyebrow: "Servizi utili", title: "Luoghi utili nelle vicinanze." },
    reviews: { eyebrow: "Recensioni", title: "Ti piace il soggiorno?" },
    emergency: { eyebrow: "Emergenza", title: "Informazioni importanti." },
    explore: { eyebrow: "Esplora", title: "Intorno alla casa." }
  },
  content: {
    network: "Rete",
    password: "Password",
    copyWifiPassword: "Copia la password Wi-Fi",
    passwordCopied: "Password copiata",
    askHost: "Chiedi all'host",
    yourHost: "Il tuo host",
    whatsappHost: "WhatsApp all'host",
    callHost: "Chiama l'host",
    checkIn: "Check-in",
    checkOut: "Check-out",
    checkInFallback: "Trovi i dettagli del check-in nel messaggio di arrivo.",
    checkOutFallback: "Trovi i dettagli del check-out nel messaggio di arrivo.",
    parking: "Parcheggio",
    parkingFallback: "Chiedi all'host dove parcheggiare.",
    houseRules: "Regole della casa",
    houseRulesFallback: "Tratta la casa con cura e rispetta le ore di silenzio.",
    noRestaurants: "L'host non ha ancora aggiunto ristoranti.",
    noActivities: "L'host non ha ancora aggiunto attività.",
    noEssentials: "L'host non ha ancora aggiunto servizi utili.",
    leaveReview: "Com’è andato il soggiorno?",
    reviewBlurb: "Le recensioni oneste aiutano i futuri ospiti a scegliere e il tuo host a migliorare. Grazie per il tuo minuto.",
    noReviewLinks: "I link per le recensioni appariranno qui quando l'host li aggiungerà.",
    emergencyContacts: "Contatti di emergenza",
    emergencyFallback: "In caso di emergenza chiama il numero di emergenza locale. Per problemi con l'alloggio contatta l'host.",
    openMap: "Apri la mappa",
    whatsappStaying: (property) => `Ciao, sto soggiornando a ${property} e ho bisogno di aiuto.`,
    showPassword: "Mostra",
    hidePassword: "Nascondi",
    reviewOn: (platform) => `Recensisci su ${platform}`,
    noPlaces: "L'host non ha ancora aggiunto luoghi.",
    eat: "Mangiare e bere",
    doNearby: "Cosa fare",
    usefulPlaces: "Luoghi utili"
  }
};

const es: GuestMessages = {
  digitalConcierge: "Conserje digital",
  yourStaySimplified: "Tu estancia, más fácil",
  welcomeTo: "Bienvenidos a",
  heroDescription: "Tu conserje digital para el Wi-Fi, la llegada, la casa, recomendaciones locales y el contacto directo con el anfitrión.",
  poweredBy: "Con la tecnología de",
  back: "Volver",
  heroTagline: "Todo para una estancia tranquila",
  guestGuide: "Guía para huéspedes",
  readMore: "Leer más",
  showLess: "Ver menos",
  heroEyebrow: { classic: "Bienvenidos", modern: "Listo para tu llegada", darkLuxury: "Refugio privado", mediterranean: "Bienvenidos al mar" },
  menu: {
    wifi: { title: "Wi-Fi", subtitle: "Conectarse" },
    contact: { title: "Contacto", subtitle: "Estamos aquí" },
    arrival: { title: "Entrada/salida", subtitle: "Llegada y salida" },
    house: { title: "La casa", subtitle: "Todo sobre el alojamiento" },
    restaurants: { title: "Restaurantes", subtitle: "Dónde comer cerca" },
    activities: { title: "Actividades", subtitle: "Qué hacer" },
    essentials: { title: "Esenciales", subtitle: "Ayuda cercana" },
    reviews: { title: "Reseñas", subtitle: "Comparte tu estancia" },
    emergency: { title: "Emergencia", subtitle: "Contactos importantes" },
    explore: { title: "Explorar", subtitle: "Comer, visitar, esenciales" }
  },
  chat: {
    stayAssistant: "Asistente de la estancia",
    propertyBot: (name) => `asistente de ${name}`,
    askProperty: (name) => `Preguntar a ${name}`,
    askYourHost: "Preguntar al anfitrión",
    intro: (bot, property) => `Hola, soy el ${bot}. Pregúntame lo que quieras sobre tu estancia en ${property}.`,
    helpTitle: "¿Cómo puedo ayudarte durante tu estancia?",
    helpSubtitle: "Wi-Fi, salida, aparcamiento y recomendaciones.",
    promptSupermarket: "¿Dónde está el supermercado más cercano?",
    promptCheckout: "¿A qué hora es la salida?",
    promptWifi: "¿Cómo me conecto al Wi-Fi?",
    askAnything: "Pregunta lo que quieras...",
    thinking: "Un momento...",
    errorAnswer: "No he podido responder. Por favor, contacta con tu anfitrión.",
    errorNow: "Ahora mismo no puedo responder. Por favor, contacta con tu anfitrión.",
    conciergeHint: "Respuestas en segundos, en tu idioma"
  },
  sections: {
    wifi: { eyebrow: "Wi-Fi", title: "Conéctate a Internet." },
    contact: { eyebrow: "Contacto", title: "¿Necesitas ayuda durante tu estancia?" },
    arrival: { eyebrow: "Llegada", title: "Entrada y salida." },
    house: { eyebrow: "La casa", title: "Todo sobre el alojamiento." },
    restaurants: { eyebrow: "Restaurantes", title: "Dónde comer." },
    activities: { eyebrow: "Actividades", title: "Qué hacer cerca." },
    essentials: { eyebrow: "Esenciales", title: "Lugares útiles cerca." },
    reviews: { eyebrow: "Reseñas", title: "¿Disfrutas de tu estancia?" },
    emergency: { eyebrow: "Emergencia", title: "Información importante." },
    explore: { eyebrow: "Explorar", title: "Alrededor del alojamiento." }
  },
  content: {
    network: "Red",
    password: "Contraseña",
    copyWifiPassword: "Copiar contraseña del Wi-Fi",
    passwordCopied: "Contraseña copiada",
    askHost: "Preguntar al anfitrión",
    yourHost: "Tu anfitrión",
    whatsappHost: "WhatsApp al anfitrión",
    callHost: "Llamar al anfitrión",
    checkIn: "Entrada",
    checkOut: "Salida",
    checkInFallback: "Consulta tu mensaje de llegada para los detalles de la entrada.",
    checkOutFallback: "Consulta tu mensaje de llegada para los detalles de la salida.",
    parking: "Aparcamiento",
    parkingFallback: "Pregunta a tu anfitrión dónde aparcar.",
    houseRules: "Normas de la casa",
    houseRulesFallback: "Por favor, cuida la casa y respeta las horas de descanso.",
    noRestaurants: "Tu anfitrión aún no ha añadido restaurantes.",
    noActivities: "Tu anfitrión aún no ha añadido actividades.",
    noEssentials: "Tu anfitrión aún no ha añadido lugares útiles.",
    leaveReview: "¿Qué tal tu estancia?",
    reviewBlurb: "Las opiniones sinceras ayudan a futuros huéspedes a elegir y a tu anfitrión a mejorar. Gracias por dedicarle un minuto.",
    noReviewLinks: "Los enlaces de reseñas aparecerán aquí cuando tu anfitrión los añada.",
    emergencyContacts: "Contactos de emergencia",
    emergencyFallback: "En caso de emergencia, llama al número de emergencias local. Para problemas con el alojamiento, contacta con tu anfitrión.",
    openMap: "Abrir mapa",
    whatsappStaying: (property) => `Hola, me estoy alojando en ${property} y necesito ayuda.`,
    showPassword: "Mostrar",
    hidePassword: "Ocultar",
    reviewOn: (platform) => `Opinar en ${platform}`,
    noPlaces: "Tu anfitrión aún no ha añadido lugares.",
    eat: "Comer y beber",
    doNearby: "Qué hacer",
    usefulPlaces: "Lugares útiles"
  }
};

const nl: GuestMessages = {
  digitalConcierge: "Digitale conciërge",
  yourStaySimplified: "Je verblijf, eenvoudig",
  welcomeTo: "Welkom in",
  heroDescription: "Je digitale conciërge voor wifi, aankomst, info over het huis, lokale tips en direct contact met je gastheer.",
  poweredBy: "Mogelijk gemaakt door",
  back: "Terug",
  heroTagline: "Alles voor een zorgeloos verblijf",
  guestGuide: "Gastengids",
  readMore: "Lees meer",
  showLess: "Minder",
  heroEyebrow: { classic: "Welkom", modern: "Klaar voor je aankomst", darkLuxury: "Privé toevluchtsoord", mediterranean: "Welkom aan zee" },
  menu: {
    wifi: { title: "Wifi", subtitle: "Verbinden" },
    contact: { title: "Contact", subtitle: "Wij helpen graag" },
    arrival: { title: "In-/uitchecken", subtitle: "Aankomst en vertrek" },
    house: { title: "Huisinfo", subtitle: "Alles over de accommodatie" },
    restaurants: { title: "Restaurants", subtitle: "Eten in de buurt" },
    activities: { title: "Activiteiten", subtitle: "Wat te doen" },
    essentials: { title: "Handig", subtitle: "Hulp in de buurt" },
    reviews: { title: "Reviews", subtitle: "Deel je verblijf" },
    emergency: { title: "Noodgeval", subtitle: "Belangrijke contacten" },
    explore: { title: "Ontdekken", subtitle: "Eten, uitjes, handig" }
  },
  chat: {
    stayAssistant: "Verblijfsassistent",
    propertyBot: (name) => `assistent van ${name}`,
    askProperty: (name) => `Vraag het ${name}`,
    askYourHost: "Vraag je gastheer",
    intro: (bot, property) => `Hoi, ik ben de ${bot}. Vraag me alles over je verblijf in ${property}.`,
    helpTitle: "Hoe kan ik je helpen tijdens je verblijf?",
    helpSubtitle: "Wifi, uitchecken, parkeren en lokale tips.",
    promptSupermarket: "Waar is de dichtstbijzijnde supermarkt?",
    promptCheckout: "Hoe laat is het uitchecken?",
    promptWifi: "Hoe maak ik verbinding met de wifi?",
    askAnything: "Stel een vraag...",
    thinking: "Even denken...",
    errorAnswer: "Dat kon ik niet beantwoorden. Neem contact op met je gastheer.",
    errorNow: "Ik kan nu niet antwoorden. Neem contact op met je gastheer.",
    conciergeHint: "Antwoord binnen seconden, in jouw taal"
  },
  sections: {
    wifi: { eyebrow: "Wifi", title: "Verbinden met internet." },
    contact: { eyebrow: "Contact", title: "Hulp nodig tijdens je verblijf?" },
    arrival: { eyebrow: "Aankomst", title: "Inchecken en uitchecken." },
    house: { eyebrow: "Huisinfo", title: "Alles over de accommodatie." },
    restaurants: { eyebrow: "Restaurants", title: "Waar je goed eet." },
    activities: { eyebrow: "Activiteiten", title: "Wat te doen in de buurt." },
    essentials: { eyebrow: "Handig", title: "Handige plekken in de buurt." },
    reviews: { eyebrow: "Reviews", title: "Geniet je van je verblijf?" },
    emergency: { eyebrow: "Noodgeval", title: "Belangrijke informatie." },
    explore: { eyebrow: "Ontdekken", title: "Rondom de accommodatie." }
  },
  content: {
    network: "Netwerk",
    password: "Wachtwoord",
    copyWifiPassword: "Wifi-wachtwoord kopiëren",
    passwordCopied: "Wachtwoord gekopieerd",
    askHost: "Vraag de gastheer",
    yourHost: "Je gastheer",
    whatsappHost: "WhatsApp de gastheer",
    callHost: "Bel de gastheer",
    checkIn: "Inchecken",
    checkOut: "Uitchecken",
    checkInFallback: "Je vindt de incheckgegevens in je aankomstbericht.",
    checkOutFallback: "Je vindt de uitcheckgegevens in je aankomstbericht.",
    parking: "Parkeren",
    parkingFallback: "Vraag je gastheer naar parkeermogelijkheden.",
    houseRules: "Huisregels",
    houseRulesFallback: "Ga zorgvuldig om met het huis en respecteer de stiltetijden.",
    noRestaurants: "Je gastheer heeft nog geen restaurants toegevoegd.",
    noActivities: "Je gastheer heeft nog geen activiteiten toegevoegd.",
    noEssentials: "Je gastheer heeft nog geen handige plekken toegevoegd.",
    leaveReview: "Hoe was je verblijf?",
    reviewBlurb: "Eerlijke reviews helpen toekomstige gasten kiezen en je gastheer verbeteren. Bedankt dat je even de tijd neemt.",
    noReviewLinks: "Reviewlinks verschijnen hier zodra je gastheer ze toevoegt.",
    emergencyContacts: "Noodcontacten",
    emergencyFallback: "Bel bij nood het lokale alarmnummer. Neem voor problemen met de accommodatie contact op met je gastheer.",
    openMap: "Kaart openen",
    whatsappStaying: (property) => `Hoi, ik verblijf in ${property} en heb hulp nodig.`,
    showPassword: "Tonen",
    hidePassword: "Verbergen",
    reviewOn: (platform) => `Review op ${platform}`,
    noPlaces: "Je gastheer heeft nog geen plekken toegevoegd.",
    eat: "Eten en drinken",
    doNearby: "Wat te doen",
    usefulPlaces: "Handige plekken"
  }
};

const messages: Record<GuestLocale, GuestMessages> = { en, de, fr, it, es, nl };

export function isGuestLocale(value: string): value is GuestLocale {
  return GUEST_LOCALES.some((locale) => locale.code === value);
}

export function getGuestMessages(locale: GuestLocale = "en") {
  return messages[locale] ?? en;
}

export function getDefaultGuestLocale(): GuestLocale {
  return "en";
}

export function detectGuestLocale(languages: readonly string[] | undefined | null): GuestLocale {
  for (const language of languages ?? []) {
    const base = language.toLowerCase().split("-")[0];
    if (isGuestLocale(base)) return base;
  }
  return "en";
}
