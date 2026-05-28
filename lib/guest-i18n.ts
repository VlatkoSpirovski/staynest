export const GUEST_LOCALES = [
  { code: "en", label: "English", short: "EN" },
  { code: "de", label: "Deutsch", short: "DE" },
  { code: "fr", label: "Français", short: "FR" },
  { code: "it", label: "Italiano", short: "IT" },
  { code: "sr", label: "Srpski", short: "SR" },
  { code: "mk", label: "Македонски", short: "MK" }
] as const;

export type GuestLocale = (typeof GUEST_LOCALES)[number]["code"];

export type GuestMessages = {
  digitalConcierge: string;
  yourStaySimplified: string;
  welcomeTo: string;
  heroDescription: string;
  poweredBy: string;
  back: string;
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
  };
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
  };
  sections: Record<
    "wifi" | "contact" | "arrival" | "house" | "restaurants" | "activities" | "essentials" | "reviews" | "emergency",
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
  };
};

const en: GuestMessages = {
  digitalConcierge: "Digital Concierge",
  yourStaySimplified: "Your stay, simplified",
  welcomeTo: "Welcome to",
  heroDescription: "Your digital concierge for Wi-Fi, arrival, house info, local tips and direct host contact.",
  poweredBy: "Powered by",
  back: "Back",
  menu: {
    wifi: { title: "Wi-Fi", subtitle: "Connect" },
    contact: { title: "Contact", subtitle: "We are here" },
    arrival: { title: "Check-in/out", subtitle: "Arrival and departure" },
    house: { title: "House Guide", subtitle: "About the property" },
    restaurants: { title: "Restaurants", subtitle: "Food nearby" },
    activities: { title: "Activities", subtitle: "Things to do" },
    essentials: { title: "Essentials", subtitle: "Nearby help" },
    reviews: { title: "Reviews", subtitle: "Share your stay" },
    emergency: { title: "Emergency", subtitle: "Important contacts" }
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
    errorNow: "I could not answer right now. Please contact your host."
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
    emergency: { eyebrow: "Emergency", title: "Important information." }
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
    leaveReview: "Leave a review",
    reviewBlurb: "A quick review helps future guests and means a lot to your host.",
    noReviewLinks: "Review links will appear here once your host adds them.",
    emergencyContacts: "Emergency contacts",
    emergencyFallback: "For emergencies, call the local emergency number. Contact your host for property issues.",
    openMap: "Open map",
    whatsappStaying: (property) => `Hi, I am staying at ${property} and need help.`
  }
};

export function isGuestLocale(value: string): value is GuestLocale {
  return GUEST_LOCALES.some((locale) => locale.code === value);
}

const de: GuestMessages = {
  digitalConcierge: "Digitaler Concierge",
  yourStaySimplified: "Dein Aufenthalt, ganz einfach",
  welcomeTo: "Willkommen bei",
  heroDescription: "Dein digitaler Concierge für WLAN, Anreise, Hausinfos, lokale Tipps und direkten Host-Kontakt.",
  poweredBy: "Powered by",
  back: "Zurück",
  menu: {
    wifi: { title: "WLAN", subtitle: "Verbinden" },
    contact: { title: "Kontakt", subtitle: "Wir sind da" },
    arrival: { title: "Check‑in/out", subtitle: "Anreise & Abreise" },
    house: { title: "Hausguide", subtitle: "Über die Unterkunft" },
    restaurants: { title: "Restaurants", subtitle: "Essen in der Nähe" },
    activities: { title: "Aktivitäten", subtitle: "Dinge zu tun" },
    essentials: { title: "Wichtiges", subtitle: "Nützliche Orte" },
    reviews: { title: "Bewertungen", subtitle: "Aufenthalt teilen" },
    emergency: { title: "Notfall", subtitle: "Wichtige Kontakte" }
  },
  chat: {
    stayAssistant: "Aufenthalts‑Assistent",
    propertyBot: (name) => `${name} Bot`,
    askProperty: (name) => `Frag ${name}`,
    askYourHost: "Frag deinen Host",
    intro: (bot, property) => `Hi, ich bin der ${bot}. Frag mich alles zu deinem Aufenthalt bei ${property}.`,
    helpTitle: "Wie kann ich dir helfen?",
    helpSubtitle: "WLAN, Check‑out, Parken und lokale Tipps.",
    promptSupermarket: "Wo ist der nächste Supermarkt?",
    promptCheckout: "Wann ist Check‑out?",
    promptWifi: "Wie verbinde ich mich mit dem WLAN?",
    askAnything: "Frag irgendwas…",
    thinking: "Denke nach…",
    errorAnswer: "Ich konnte das nicht beantworten. Bitte kontaktiere deinen Host.",
    errorNow: "Ich konnte gerade nicht antworten. Bitte kontaktiere deinen Host."
  },
  sections: {
    wifi: { eyebrow: "WLAN", title: "Mit dem Internet verbinden." },
    contact: { eyebrow: "Kontakt", title: "Brauchst du Hilfe?" },
    arrival: { eyebrow: "Anreise", title: "Check‑in und Check‑out." },
    house: { eyebrow: "Hausguide", title: "Alles zur Unterkunft." },
    restaurants: { eyebrow: "Restaurants", title: "Wo essen." },
    activities: { eyebrow: "Aktivitäten", title: "In der Nähe." },
    essentials: { eyebrow: "Wichtiges", title: "Nützliche Orte." },
    reviews: { eyebrow: "Bewertungen", title: "Zufrieden mit dem Aufenthalt?" },
    emergency: { eyebrow: "Notfall", title: "Wichtige Informationen." }
  },
  content: {
    network: "Netzwerk",
    password: "Passwort",
    copyWifiPassword: "WLAN‑Passwort kopieren",
    passwordCopied: "Passwort kopiert",
    askHost: "Host fragen",
    yourHost: "Dein Host",
    whatsappHost: "WhatsApp Host",
    callHost: "Host anrufen",
    checkIn: "Check‑in",
    checkOut: "Check‑out",
    checkInFallback: "Sieh in deiner Anreise‑Nachricht nach den Check‑in‑Details.",
    checkOutFallback: "Sieh in deiner Anreise‑Nachricht nach den Check‑out‑Details.",
    parking: "Parken",
    parkingFallback: "Frag deinen Host nach Parkmöglichkeiten.",
    houseRules: "Hausregeln",
    houseRulesFallback: "Bitte behandle das Zuhause sorgfältig und respektiere die Ruhezeiten.",
    noRestaurants: "Der Host hat noch keine Restaurant‑Empfehlungen hinzugefügt.",
    noActivities: "Der Host hat noch keine Aktivitäten hinzugefügt.",
    noEssentials: "Der Host hat noch keine wichtigen Orte hinzugefügt.",
    leaveReview: "Bewertung abgeben",
    reviewBlurb: "Eine kurze Bewertung hilft zukünftigen Gästen und freut deinen Host sehr.",
    noReviewLinks: "Bewertungslinks erscheinen hier, sobald der Host sie hinzufügt.",
    emergencyContacts: "Notfallkontakte",
    emergencyFallback: "Im Notfall rufe die lokale Notrufnummer an. Bei Problemen kontaktiere deinen Host.",
    openMap: "Karte öffnen",
    whatsappStaying: (property) => `Hi, ich wohne bei ${property} und brauche Hilfe.`
  }
};

const fr: GuestMessages = {
  digitalConcierge: "Concierge numérique",
  yourStaySimplified: "Votre séjour, simplifié",
  welcomeTo: "Bienvenue à",
  heroDescription: "Votre concierge numérique pour le Wi‑Fi, l’arrivée, les infos maison, les conseils locaux et le contact direct avec l’hôte.",
  poweredBy: "Propulsé par",
  back: "Retour",
  menu: {
    wifi: { title: "Wi‑Fi", subtitle: "Connexion" },
    contact: { title: "Contact", subtitle: "On est là" },
    arrival: { title: "Arrivée/départ", subtitle: "Check‑in & check‑out" },
    house: { title: "Guide maison", subtitle: "À propos" },
    restaurants: { title: "Restaurants", subtitle: "Manger autour" },
    activities: { title: "Activités", subtitle: "À faire" },
    essentials: { title: "Essentiels", subtitle: "À proximité" },
    reviews: { title: "Avis", subtitle: "Partager" },
    emergency: { title: "Urgence", subtitle: "Contacts" }
  },
  chat: {
    stayAssistant: "Assistant de séjour",
    propertyBot: (name) => `Bot ${name}`,
    askProperty: (name) => `Demander à ${name}`,
    askYourHost: "Demander à l’hôte",
    intro: (bot, property) => `Bonjour, je suis le ${bot}. Posez-moi vos questions sur votre séjour à ${property}.`,
    helpTitle: "Comment puis‑je aider ?",
    helpSubtitle: "Wi‑Fi, départ, parking et conseils locaux.",
    promptSupermarket: "Où est le supermarché le plus proche ?",
    promptCheckout: "À quelle heure est le départ ?",
    promptWifi: "Comment me connecter au Wi‑Fi ?",
    askAnything: "Posez une question…",
    thinking: "Réflexion…",
    errorAnswer: "Je n’ai pas pu répondre. Merci de contacter votre hôte.",
    errorNow: "Je ne peux pas répondre maintenant. Merci de contacter votre hôte."
  },
  sections: {
    wifi: { eyebrow: "Wi‑Fi", title: "Connectez‑vous à Internet." },
    contact: { eyebrow: "Contact", title: "Besoin d’aide ?" },
    arrival: { eyebrow: "Arrivée", title: "Arrivée et départ." },
    house: { eyebrow: "Maison", title: "Infos sur le logement." },
    restaurants: { eyebrow: "Restaurants", title: "Où manger." },
    activities: { eyebrow: "Activités", title: "À proximité." },
    essentials: { eyebrow: "Essentiels", title: "Lieux utiles." },
    reviews: { eyebrow: "Avis", title: "Vous aimez votre séjour ?" },
    emergency: { eyebrow: "Urgence", title: "Infos importantes." }
  },
  content: {
    network: "Réseau",
    password: "Mot de passe",
    copyWifiPassword: "Copier le mot de passe Wi‑Fi",
    passwordCopied: "Mot de passe copié",
    askHost: "Contacter l’hôte",
    yourHost: "Votre hôte",
    whatsappHost: "WhatsApp hôte",
    callHost: "Appeler l’hôte",
    checkIn: "Arrivée",
    checkOut: "Départ",
    checkInFallback: "Consultez votre message d’arrivée pour les infos d’arrivée.",
    checkOutFallback: "Consultez votre message d’arrivée pour les infos de départ.",
    parking: "Parking",
    parkingFallback: "Demandez à votre hôte pour le parking.",
    houseRules: "Règles de la maison",
    houseRulesFallback: "Merci de respecter le logement et les horaires de calme.",
    noRestaurants: "Votre hôte n’a pas encore ajouté de restaurants.",
    noActivities: "Votre hôte n’a pas encore ajouté d’activités.",
    noEssentials: "Votre hôte n’a pas encore ajouté de lieux essentiels.",
    leaveReview: "Laisser un avis",
    reviewBlurb: "Un avis rapide aide les prochains voyageurs et fait plaisir à votre hôte.",
    noReviewLinks: "Les liens d’avis apparaîtront ici une fois ajoutés par l’hôte.",
    emergencyContacts: "Contacts d’urgence",
    emergencyFallback: "En cas d’urgence, appelez le numéro local. Pour le logement, contactez votre hôte.",
    openMap: "Ouvrir la carte",
    whatsappStaying: (property) => `Bonjour, je séjourne à ${property} et j’ai besoin d’aide.`
  }
};

const it: GuestMessages = {
  digitalConcierge: "Concierge digitale",
  yourStaySimplified: "Il tuo soggiorno, semplificato",
  welcomeTo: "Benvenuto a",
  heroDescription: "Il tuo concierge digitale per Wi‑Fi, arrivo, info casa, consigli locali e contatto diretto con l’host.",
  poweredBy: "Powered by",
  back: "Indietro",
  menu: {
    wifi: { title: "Wi‑Fi", subtitle: "Connetti" },
    contact: { title: "Contatti", subtitle: "Siamo qui" },
    arrival: { title: "Check‑in/out", subtitle: "Arrivo e partenza" },
    house: { title: "Guida casa", subtitle: "Info proprietà" },
    restaurants: { title: "Ristoranti", subtitle: "Cibo vicino" },
    activities: { title: "Attività", subtitle: "Cose da fare" },
    essentials: { title: "Essenziali", subtitle: "Luoghi utili" },
    reviews: { title: "Recensioni", subtitle: "Condividi" },
    emergency: { title: "Emergenza", subtitle: "Contatti" }
  },
  chat: {
    stayAssistant: "Assistente soggiorno",
    propertyBot: (name) => `Bot ${name}`,
    askProperty: (name) => `Chiedi a ${name}`,
    askYourHost: "Chiedi all’host",
    intro: (bot, property) => `Ciao, sono il ${bot}. Chiedimi tutto sul tuo soggiorno a ${property}.`,
    helpTitle: "Come posso aiutarti?",
    helpSubtitle: "Wi‑Fi, checkout, parcheggio e consigli locali.",
    promptSupermarket: "Dov’è il supermercato più vicino?",
    promptCheckout: "A che ora è il checkout?",
    promptWifi: "Come mi connetto al Wi‑Fi?",
    askAnything: "Chiedi qualcosa…",
    thinking: "Sto pensando…",
    errorAnswer: "Non ho potuto rispondere. Contatta il tuo host.",
    errorNow: "Non posso rispondere ora. Contatta il tuo host."
  },
  sections: {
    wifi: { eyebrow: "Wi‑Fi", title: "Connettiti a Internet." },
    contact: { eyebrow: "Contatti", title: "Serve aiuto?" },
    arrival: { eyebrow: "Arrivo", title: "Check‑in e check‑out." },
    house: { eyebrow: "Casa", title: "Tutto sulla proprietà." },
    restaurants: { eyebrow: "Ristoranti", title: "Dove mangiare." },
    activities: { eyebrow: "Attività", title: "Cosa fare vicino." },
    essentials: { eyebrow: "Essenziali", title: "Luoghi utili." },
    reviews: { eyebrow: "Recensioni", title: "Ti è piaciuto il soggiorno?" },
    emergency: { eyebrow: "Emergenza", title: "Informazioni importanti." }
  },
  content: {
    network: "Rete",
    password: "Password",
    copyWifiPassword: "Copia password Wi‑Fi",
    passwordCopied: "Password copiata",
    askHost: "Contatta host",
    yourHost: "Il tuo host",
    whatsappHost: "WhatsApp host",
    callHost: "Chiama host",
    checkIn: "Check‑in",
    checkOut: "Check‑out",
    checkInFallback: "Controlla il messaggio di arrivo per i dettagli del check‑in.",
    checkOutFallback: "Controlla il messaggio di arrivo per i dettagli del check‑out.",
    parking: "Parcheggio",
    parkingFallback: "Chiedi al tuo host per le opzioni di parcheggio.",
    houseRules: "Regole della casa",
    houseRulesFallback: "Goditi la casa con cura e rispetta le ore di silenzio.",
    noRestaurants: "L’host non ha ancora aggiunto ristoranti.",
    noActivities: "L’host non ha ancora aggiunto attività.",
    noEssentials: "L’host non ha ancora aggiunto luoghi essenziali.",
    leaveReview: "Lascia una recensione",
    reviewBlurb: "Una breve recensione aiuta i futuri ospiti e significa molto per l’host.",
    noReviewLinks: "I link alle recensioni appariranno qui quando l’host li aggiunge.",
    emergencyContacts: "Contatti di emergenza",
    emergencyFallback: "In caso di emergenza chiama il numero locale. Per problemi contatta l’host.",
    openMap: "Apri mappa",
    whatsappStaying: (property) => `Ciao, sto soggiornando a ${property} e ho bisogno di aiuto.`
  }
};

const sr: GuestMessages = {
  digitalConcierge: "Digitalni konsijerž",
  yourStaySimplified: "Vaš boravak, jednostavnije",
  welcomeTo: "Dobrodošli u",
  heroDescription: "Vaš digitalni konsijerž za Wi‑Fi, dolazak, kućna pravila, lokalne preporuke i kontakt sa domaćinom.",
  poweredBy: "Pokreće",
  back: "Nazad",
  menu: {
    wifi: { title: "Wi‑Fi", subtitle: "Poveži se" },
    contact: { title: "Kontakt", subtitle: "Tu smo" },
    arrival: { title: "Dolazak/odlazak", subtitle: "Check‑in & check‑out" },
    house: { title: "Vodič kroz kuću", subtitle: "O smeštaju" },
    restaurants: { title: "Restorani", subtitle: "Hrana u blizini" },
    activities: { title: "Aktivnosti", subtitle: "Šta raditi" },
    essentials: { title: "Osnovno", subtitle: "Korisna mesta" },
    reviews: { title: "Recenzije", subtitle: "Podeli utisak" },
    emergency: { title: "Hitno", subtitle: "Kontakti" }
  },
  chat: {
    stayAssistant: "Asistent boravka",
    propertyBot: (name) => `Bot ${name}`,
    askProperty: (name) => `Pitaj ${name}`,
    askYourHost: "Pitaj domaćina",
    intro: (bot, property) => `Zdravo, ja sam ${bot}. Pitaj me bilo šta o boravku u ${property}.`,
    helpTitle: "Kako mogu da pomognem?",
    helpSubtitle: "Wi‑Fi, odjava, parking i lokalne preporuke.",
    promptSupermarket: "Gde je najbliži supermarket?",
    promptCheckout: "Kada je odjava?",
    promptWifi: "Kako da se povežem na Wi‑Fi?",
    askAnything: "Pitaj bilo šta…",
    thinking: "Razmišljam…",
    errorAnswer: "Ne mogu da odgovorim. Kontaktirajte domaćina.",
    errorNow: "Trenutno ne mogu da odgovorim. Kontaktirajte domaćina."
  },
  sections: {
    wifi: { eyebrow: "Wi‑Fi", title: "Povežite se na internet." },
    contact: { eyebrow: "Kontakt", title: "Treba pomoć?" },
    arrival: { eyebrow: "Dolazak", title: "Check‑in i check‑out." },
    house: { eyebrow: "Kuća", title: "Sve o smeštaju." },
    restaurants: { eyebrow: "Restorani", title: "Gde jesti." },
    activities: { eyebrow: "Aktivnosti", title: "Šta raditi u blizini." },
    essentials: { eyebrow: "Osnovno", title: "Korisna mesta u blizini." },
    reviews: { eyebrow: "Recenzije", title: "Sviđa vam se boravak?" },
    emergency: { eyebrow: "Hitno", title: "Važne informacije." }
  },
  content: {
    network: "Mreža",
    password: "Lozinka",
    copyWifiPassword: "Kopiraj Wi‑Fi lozinku",
    passwordCopied: "Lozinka kopirana",
    askHost: "Pitaj domaćina",
    yourHost: "Vaš domaćin",
    whatsappHost: "WhatsApp domaćin",
    callHost: "Pozovi domaćina",
    checkIn: "Check‑in",
    checkOut: "Check‑out",
    checkInFallback: "Proverite poruku o dolasku za detalje check‑ina.",
    checkOutFallback: "Proverite poruku o dolasku za detalje check‑outa.",
    parking: "Parking",
    parkingFallback: "Pitajte domaćina za parking opcije.",
    houseRules: "Kućna pravila",
    houseRulesFallback: "Molimo čuvajte smeštaj i poštujte mirne sate.",
    noRestaurants: "Domaćin još nije dodao preporuke za restorane.",
    noActivities: "Domaćin još nije dodao aktivnosti.",
    noEssentials: "Domaćin još nije dodao osnovna mesta.",
    leaveReview: "Ostavi recenziju",
    reviewBlurb: "Kratka recenzija pomaže budućim gostima i znači mnogo domaćinu.",
    noReviewLinks: "Linkovi za recenzije će se pojaviti kada ih domaćin doda.",
    emergencyContacts: "Hitni kontakti",
    emergencyFallback: "U hitnim slučajevima pozovite lokalni broj. Za probleme kontaktirajte domaćina.",
    openMap: "Otvori mapu",
    whatsappStaying: (property) => `Zdravo, boravim u ${property} i potrebna mi je pomoć.`
  }
};

const mk: GuestMessages = {
  digitalConcierge: "Дигитален консиерж",
  yourStaySimplified: "Вашиот престој, поедноставен",
  welcomeTo: "Добредојдовте во",
  heroDescription: "Ваш дигитален консиерж за Wi‑Fi, пристигнување, правила, локални препораки и директен контакт со домаќинот.",
  poweredBy: "Powered by",
  back: "Назад",
  menu: {
    wifi: { title: "Wi‑Fi", subtitle: "Поврзи се" },
    contact: { title: "Контакт", subtitle: "Тука сме" },
    arrival: { title: "Пристигнување/заминување", subtitle: "Check‑in & check‑out" },
    house: { title: "Домашен водич", subtitle: "За сместувањето" },
    restaurants: { title: "Ресторани", subtitle: "Храна во близина" },
    activities: { title: "Активности", subtitle: "Што да правите" },
    essentials: { title: "Основно", subtitle: "Корисни места" },
    reviews: { title: "Рецензии", subtitle: "Сподели" },
    emergency: { title: "Итно", subtitle: "Контакти" }
  },
  chat: {
    stayAssistant: "Асистент за престој",
    propertyBot: (name) => `${name} бот`,
    askProperty: (name) => `Прашај ${name}`,
    askYourHost: "Прашај го домаќинот",
    intro: (bot, property) => `Здраво, јас сум ${bot}. Прашај ме било што за престојот во ${property}.`,
    helpTitle: "Како можам да помогнам?",
    helpSubtitle: "Wi‑Fi, одјава, паркинг и локални совети.",
    promptSupermarket: "Каде е најблискиот маркет?",
    promptCheckout: "Кога е одјавување?",
    promptWifi: "Како да се поврзам на Wi‑Fi?",
    askAnything: "Прашај било што…",
    thinking: "Размислувам…",
    errorAnswer: "Не можам да одговорам. Контактирајте го домаќинот.",
    errorNow: "Моментално не можам да одговорам. Контактирајте го домаќинот."
  },
  sections: {
    wifi: { eyebrow: "Wi‑Fi", title: "Поврзете се на интернет." },
    contact: { eyebrow: "Контакт", title: "Ви треба помош?" },
    arrival: { eyebrow: "Пристигнување", title: "Check‑in и check‑out." },
    house: { eyebrow: "Дом", title: "Сѐ за сместувањето." },
    restaurants: { eyebrow: "Ресторани", title: "Каде да јадете." },
    activities: { eyebrow: "Активности", title: "Што да правите во близина." },
    essentials: { eyebrow: "Основно", title: "Корисни места во близина." },
    reviews: { eyebrow: "Рецензии", title: "Уживате во престојот?" },
    emergency: { eyebrow: "Итно", title: "Важни информации." }
  },
  content: {
    network: "Мрежа",
    password: "Лозинка",
    copyWifiPassword: "Копирај Wi‑Fi лозинка",
    passwordCopied: "Лозинката е копирана",
    askHost: "Прашај домаќин",
    yourHost: "Вашиот домаќин",
    whatsappHost: "WhatsApp домаќин",
    callHost: "Повикај домаќин",
    checkIn: "Check‑in",
    checkOut: "Check‑out",
    checkInFallback: "Проверете ја пораката за пристигнување за детали за check‑in.",
    checkOutFallback: "Проверете ја пораката за пристигнување за детали за check‑out.",
    parking: "Паркинг",
    parkingFallback: "Прашајте го домаќинот за паркинг опции.",
    houseRules: "Правила на домот",
    houseRulesFallback: "Ве молиме почитувајте го домот и мирните часови.",
    noRestaurants: "Домаќинот сѐ уште нема додадено ресторани.",
    noActivities: "Домаќинот сѐ уште нема додадено активности.",
    noEssentials: "Домаќинот сѐ уште нема додадено основни места.",
    leaveReview: "Остави рецензија",
    reviewBlurb: "Кратка рецензија им помага на идните гости и значи многу за домаќинот.",
    noReviewLinks: "Линковите ќе се појават кога домаќинот ќе ги додаде.",
    emergencyContacts: "Итни контакти",
    emergencyFallback: "Во итен случај јавете се на локалниот број. За проблеми контактирајте го домаќинот.",
    openMap: "Отвори мапа",
    whatsappStaying: (property) => `Здраво, престојувам во ${property} и ми треба помош.`
  }
};

export function getGuestMessages(locale: GuestLocale = "en") {
  if (locale === "de") return de;
  if (locale === "fr") return fr;
  if (locale === "it") return it;
  if (locale === "sr") return sr;
  if (locale === "mk") return mk;
  return en;
}

export function getDefaultGuestLocale(): GuestLocale {
  return "en";
}
