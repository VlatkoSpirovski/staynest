export const GUEST_LOCALES = [
  { code: "en", label: "English", short: "EN" },
  { code: "de", label: "German", short: "DE" },
  { code: "fr", label: "French", short: "FR" },
  { code: "nl", label: "Dutch", short: "NL" },
  { code: "be", label: "Belgian Dutch", short: "BE" },
  { code: "cs", label: "Czech", short: "CS" },
  { code: "pl", label: "Polish", short: "PL" },
  { code: "mk", label: "Macedonian", short: "MK" },
  { code: "sr", label: "Serbian", short: "SR" },
  { code: "tr", label: "Turkish", short: "TR" },
  { code: "sq", label: "Albanian", short: "SQ" }
] as const;

export type GuestLocale = (typeof GUEST_LOCALES)[number]["code"];

export const GUEST_LOCALE_STORAGE_KEY = "staynest-guest-lang";

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
    "wifi" | "contact" | "arrival" | "house" | "restaurants" | "activities" | "reviews" | "emergency",
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
    leaveReview: string;
    reviewBlurb: string;
    noReviewLinks: string;
    emergencyContacts: string;
    emergencyFallback: string;
    openMap: string;
    whatsappStaying: (property: string) => string;
  };
};

function m(
  digitalConcierge: string,
  yourStaySimplified: string,
  welcomeTo: string,
  heroDescription: string,
  poweredBy: string,
  back: string,
  menu: GuestMessages["menu"],
  chat: Omit<GuestMessages["chat"], "propertyBot" | "askProperty" | "intro"> & {
    propertyBot: string;
    askProperty: string;
    intro: string;
  },
  sections: GuestMessages["sections"],
  content: Omit<GuestMessages["content"], "whatsappStaying"> & { whatsappStayingTemplate: string }
): GuestMessages {
  const { whatsappStayingTemplate, ...contentFields } = content;
  return {
    digitalConcierge,
    yourStaySimplified,
    welcomeTo,
    heroDescription,
    poweredBy,
    back,
    menu,
    chat: {
      ...chat,
      propertyBot: (name) => chat.propertyBot.replace("{name}", name),
      askProperty: (name) => chat.askProperty.replace("{name}", name),
      intro: (bot, property) => chat.intro.replace("{bot}", bot).replace("{property}", property)
    },
    sections,
    content: {
      ...contentFields,
      whatsappStaying: (property) => whatsappStayingTemplate.replace("{property}", property)
    }
  };
}

const en = m(
  "Digital Concierge",
  "Your stay, simplified",
  "Welcome to",
  "Your digital concierge for Wi-Fi, arrival, house info, local tips and direct host contact.",
  "Powered by",
  "Back",
  {
    wifi: { title: "Wi-Fi", subtitle: "Connect" },
    contact: { title: "Contact", subtitle: "We are here" },
    arrival: { title: "Check-in/out", subtitle: "Arrival and departure" },
    house: { title: "House Guide", subtitle: "About the property" },
    restaurants: { title: "Restaurants", subtitle: "Food nearby" },
    activities: { title: "Activities", subtitle: "Things to do" },
    reviews: { title: "Reviews", subtitle: "Share your stay" },
    emergency: { title: "Emergency", subtitle: "Important contacts" }
  },
  {
    stayAssistant: "Stay assistant",
    propertyBot: "{name} bot",
    askProperty: "Ask {name}",
    askYourHost: "Ask your host",
    intro: "Hi, I'm the {bot}. Ask me anything about your stay at {property}.",
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
  {
    wifi: { eyebrow: "Wi-Fi", title: "Connect to the internet." },
    contact: { eyebrow: "Contact", title: "Need help during your stay?" },
    arrival: { eyebrow: "Arrival", title: "Check-in and check-out." },
    house: { eyebrow: "House guide", title: "Everything inside the property." },
    restaurants: { eyebrow: "Restaurants", title: "Where to eat." },
    activities: { eyebrow: "Activities", title: "Things to do nearby." },
    reviews: { eyebrow: "Reviews", title: "Enjoying your stay?" },
    emergency: { eyebrow: "Emergency", title: "Important information." }
  },
  {
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
    leaveReview: "Leave a review",
    reviewBlurb: "A quick review helps future guests and means a lot to your host.",
    noReviewLinks: "Review links will appear here once your host adds them.",
    emergencyContacts: "Emergency contacts",
    emergencyFallback: "For emergencies, call the local emergency number. Contact your host for property issues.",
    openMap: "Open map",
    whatsappStayingTemplate: "Hi, I am staying at {property} and need help."
  }
);

const de = m(
  "Digitaler Concierge",
  "Ihr Aufenthalt, vereinfacht",
  "Willkommen in",
  "Ihr digitaler Concierge für WLAN, Anreise, Hausinfos, lokale Tipps und direkten Kontakt zum Gastgeber.",
  "Bereitgestellt von",
  "Zurück",
  {
    wifi: { title: "WLAN", subtitle: "Verbinden" },
    contact: { title: "Kontakt", subtitle: "Wir sind da" },
    arrival: { title: "Check-in/out", subtitle: "An- und Abreise" },
    house: { title: "Hausführer", subtitle: "Über die Unterkunft" },
    restaurants: { title: "Restaurants", subtitle: "Essen in der Nähe" },
    activities: { title: "Aktivitäten", subtitle: "Unternehmungen" },
    reviews: { title: "Bewertungen", subtitle: "Teilen Sie Ihren Aufenthalt" },
    emergency: { title: "Notfall", subtitle: "Wichtige Kontakte" }
  },
  {
    stayAssistant: "Aufenthaltsassistent",
    propertyBot: "{name} Bot",
    askProperty: "{name} fragen",
    askYourHost: "Gastgeber fragen",
    intro: "Hallo, ich bin der {bot}. Fragen Sie mich alles über Ihren Aufenthalt in {property}.",
    helpTitle: "Wie kann ich während Ihres Aufenthalts helfen?",
    helpSubtitle: "WLAN, Check-out, Parken und lokale Tipps.",
    promptSupermarket: "Wo ist der nächste Supermarkt?",
    promptCheckout: "Wann ist der Check-out?",
    promptWifi: "Wie verbinde ich mich mit dem WLAN?",
    askAnything: "Fragen Sie etwas...",
    thinking: "Denke nach...",
    errorAnswer: "Das konnte ich nicht beantworten. Bitte kontaktieren Sie Ihren Gastgeber.",
    errorNow: "Ich konnte gerade nicht antworten. Bitte kontaktieren Sie Ihren Gastgeber."
  },
  {
    wifi: { eyebrow: "WLAN", title: "Mit dem Internet verbinden." },
    contact: { eyebrow: "Kontakt", title: "Brauchen Sie Hilfe während Ihres Aufenthalts?" },
    arrival: { eyebrow: "Anreise", title: "Check-in und Check-out." },
    house: { eyebrow: "Hausführer", title: "Alles in der Unterkunft." },
    restaurants: { eyebrow: "Restaurants", title: "Wo essen." },
    activities: { eyebrow: "Aktivitäten", title: "Unternehmungen in der Nähe." },
    reviews: { eyebrow: "Bewertungen", title: "Gefällt Ihnen der Aufenthalt?" },
    emergency: { eyebrow: "Notfall", title: "Wichtige Informationen." }
  },
  {
    network: "Netzwerk",
    password: "Passwort",
    copyWifiPassword: "WLAN-Passwort kopieren",
    passwordCopied: "Passwort kopiert",
    askHost: "Gastgeber fragen",
    yourHost: "Ihr Gastgeber",
    whatsappHost: "Gastgeber per WhatsApp",
    callHost: "Gastgeber anrufen",
    checkIn: "Check-in",
    checkOut: "Check-out",
    checkInFallback: "Details zum Check-in finden Sie in Ihrer Ankunftsnachricht.",
    checkOutFallback: "Details zum Check-out finden Sie in Ihrer Ankunftsnachricht.",
    parking: "Parken",
    parkingFallback: "Fragen Sie Ihren Gastgeber nach Parkmöglichkeiten.",
    houseRules: "Hausregeln",
    houseRulesFallback: "Bitte genießen Sie das Zuhause mit Sorgfalt und beachten Sie die Ruhezeiten.",
    noRestaurants: "Ihr Gastgeber hat noch keine Restaurantempfehlungen hinzugefügt.",
    noActivities: "Ihr Gastgeber hat noch keine Aktivitäten hinzugefügt.",
    leaveReview: "Bewertung hinterlassen",
    reviewBlurb: "Eine kurze Bewertung hilft zukünftigen Gästen und bedeutet Ihrem Gastgeber viel.",
    noReviewLinks: "Bewertungslinks erscheinen hier, sobald Ihr Gastgeber sie hinzufügt.",
    emergencyContacts: "Notfallkontakte",
    emergencyFallback: "Im Notfall rufen Sie die örtliche Notrufnummer an. Bei Problemen mit der Unterkunft kontaktieren Sie Ihren Gastgeber.",
    openMap: "Karte öffnen",
    whatsappStayingTemplate: "Hallo, ich übernachte in {property} und brauche Hilfe."
  }
);

const fr = m(
  "Concierge numérique",
  "Votre séjour, simplifié",
  "Bienvenue à",
  "Votre concierge numérique pour le Wi-Fi, l'arrivée, les infos maison, les conseils locaux et le contact direct avec l'hôte.",
  "Propulsé par",
  "Retour",
  {
    wifi: { title: "Wi-Fi", subtitle: "Se connecter" },
    contact: { title: "Contact", subtitle: "Nous sommes là" },
    arrival: { title: "Arrivée/départ", subtitle: "Arrivée et départ" },
    house: { title: "Guide maison", subtitle: "À propos du logement" },
    restaurants: { title: "Restaurants", subtitle: "Manger à proximité" },
    activities: { title: "Activités", subtitle: "Choses à faire" },
    reviews: { title: "Avis", subtitle: "Partagez votre séjour" },
    emergency: { title: "Urgence", subtitle: "Contacts importants" }
  },
  {
    stayAssistant: "Assistant séjour",
    propertyBot: "Bot {name}",
    askProperty: "Demander {name}",
    askYourHost: "Demander à l'hôte",
    intro: "Bonjour, je suis le {bot}. Posez-moi vos questions sur votre séjour à {property}.",
    helpTitle: "Comment puis-je vous aider pendant votre séjour ?",
    helpSubtitle: "Wi-Fi, départ, parking et conseils locaux.",
    promptSupermarket: "Où est le supermarché le plus proche ?",
    promptCheckout: "À quelle heure est le départ ?",
    promptWifi: "Comment me connecter au Wi-Fi ?",
    askAnything: "Posez une question...",
    thinking: "Réflexion...",
    errorAnswer: "Je n'ai pas pu répondre. Veuillez contacter votre hôte.",
    errorNow: "Je ne peux pas répondre pour le moment. Veuillez contacter votre hôte."
  },
  {
    wifi: { eyebrow: "Wi-Fi", title: "Se connecter à Internet." },
    contact: { eyebrow: "Contact", title: "Besoin d'aide pendant votre séjour ?" },
    arrival: { eyebrow: "Arrivée", title: "Arrivée et départ." },
    house: { eyebrow: "Guide maison", title: "Tout dans le logement." },
    restaurants: { eyebrow: "Restaurants", title: "Où manger." },
    activities: { eyebrow: "Activités", title: "Choses à faire à proximité." },
    reviews: { eyebrow: "Avis", title: "Vous appréciez votre séjour ?" },
    emergency: { eyebrow: "Urgence", title: "Informations importantes." }
  },
  {
    network: "Réseau",
    password: "Mot de passe",
    copyWifiPassword: "Copier le mot de passe Wi-Fi",
    passwordCopied: "Mot de passe copié",
    askHost: "Demander à l'hôte",
    yourHost: "Votre hôte",
    whatsappHost: "WhatsApp hôte",
    callHost: "Appeler l'hôte",
    checkIn: "Arrivée",
    checkOut: "Départ",
    checkInFallback: "Consultez votre message d'arrivée pour les détails d'enregistrement.",
    checkOutFallback: "Consultez votre message d'arrivée pour les détails de départ.",
    parking: "Parking",
    parkingFallback: "Demandez à votre hôte les options de stationnement.",
    houseRules: "Règles de la maison",
    houseRulesFallback: "Profitez du logement avec soin et respectez les heures de calme.",
    noRestaurants: "Votre hôte n'a pas encore ajouté de recommandations de restaurants.",
    noActivities: "Votre hôte n'a pas encore ajouté d'activités.",
    leaveReview: "Laisser un avis",
    reviewBlurb: "Un avis rapide aide les futurs voyageurs et compte beaucoup pour votre hôte.",
    noReviewLinks: "Les liens d'avis apparaîtront ici une fois ajoutés par votre hôte.",
    emergencyContacts: "Contacts d'urgence",
    emergencyFallback: "En cas d'urgence, appelez le numéro local. Pour les problèmes du logement, contactez votre hôte.",
    openMap: "Ouvrir la carte",
    whatsappStayingTemplate: "Bonjour, je séjourne à {property} et j'ai besoin d'aide."
  }
);

const nl = m(
  "Digitale conciërge",
  "Uw verblijf, vereenvoudigd",
  "Welkom bij",
  "Uw digitale conciërge voor wifi, aankomst, huisinfo, lokale tips en direct contact met de host.",
  "Mogelijk gemaakt door",
  "Terug",
  {
    wifi: { title: "Wi-Fi", subtitle: "Verbinden" },
    contact: { title: "Contact", subtitle: "Wij zijn er" },
    arrival: { title: "In/uitchecken", subtitle: "Aankomst en vertrek" },
    house: { title: "Huisgids", subtitle: "Over het verblijf" },
    restaurants: { title: "Restaurants", subtitle: "Eten in de buurt" },
    activities: { title: "Activiteiten", subtitle: "Dingen om te doen" },
    reviews: { title: "Reviews", subtitle: "Deel uw verblijf" },
    emergency: { title: "Noodgeval", subtitle: "Belangrijke contacten" }
  },
  {
    stayAssistant: "Verblijfsassistent",
    propertyBot: "{name} bot",
    askProperty: "Vraag {name}",
    askYourHost: "Vraag uw host",
    intro: "Hallo, ik ben de {bot}. Stel me alles over uw verblijf in {property}.",
    helpTitle: "Hoe kan ik helpen tijdens uw verblijf?",
    helpSubtitle: "Wi-Fi, uitchecken, parkeren en lokale tips.",
    promptSupermarket: "Waar is de dichtstbijzijnde supermarkt?",
    promptCheckout: "Hoe laat is uitchecken?",
    promptWifi: "Hoe verbind ik met Wi-Fi?",
    askAnything: "Stel een vraag...",
    thinking: "Bezig...",
    errorAnswer: "Dat kon ik niet beantwoorden. Neem contact op met uw host.",
    errorNow: "Ik kan nu niet antwoorden. Neem contact op met uw host."
  },
  {
    wifi: { eyebrow: "Wi-Fi", title: "Verbinden met internet." },
    contact: { eyebrow: "Contact", title: "Hulp nodig tijdens uw verblijf?" },
    arrival: { eyebrow: "Aankomst", title: "Inchecken en uitchecken." },
    house: { eyebrow: "Huisgids", title: "Alles in het verblijf." },
    restaurants: { eyebrow: "Restaurants", title: "Waar te eten." },
    activities: { eyebrow: "Activiteiten", title: "Dingen om te doen in de buurt." },
    reviews: { eyebrow: "Reviews", title: "Geniet u van uw verblijf?" },
    emergency: { eyebrow: "Noodgeval", title: "Belangrijke informatie." }
  },
  {
    network: "Netwerk",
    password: "Wachtwoord",
    copyWifiPassword: "Wi-Fi-wachtwoord kopiëren",
    passwordCopied: "Wachtwoord gekopieerd",
    askHost: "Vraag host",
    yourHost: "Uw host",
    whatsappHost: "WhatsApp host",
    callHost: "Bel host",
    checkIn: "Inchecken",
    checkOut: "Uitchecken",
    checkInFallback: "Bekijk uw aankomstbericht voor incheckdetails.",
    checkOutFallback: "Bekijk uw aankomstbericht voor uitcheckdetails.",
    parking: "Parkeren",
    parkingFallback: "Vraag uw host over parkeermogelijkheden.",
    houseRules: "Huisregels",
    houseRulesFallback: "Geniet zorgvuldig van het huis en respecteer de stilte uren.",
    noRestaurants: "Uw host heeft nog geen restaurantaanbevelingen toegevoegd.",
    noActivities: "Uw host heeft nog geen activiteiten toegevoegd.",
    leaveReview: "Laat een review achter",
    reviewBlurb: "Een korte review helpt toekomstige gasten en betekent veel voor uw host.",
    noReviewLinks: "Reviewlinks verschijnen hier zodra uw host ze toevoegt.",
    emergencyContacts: "Noodcontacten",
    emergencyFallback: "Bel bij noodgevallen het lokale alarmnummer. Neem bij problemen contact op met uw host.",
    openMap: "Kaart openen",
    whatsappStayingTemplate: "Hallo, ik verblijf in {property} en heb hulp nodig."
  }
);

const be = nl;

const cs = m(
  "Digitální concierge",
  "Váš pobyt, jednoduše",
  "Vítejte v",
  "Váš digitální concierge pro Wi-Fi, příjezd, informace o domě, místní tipy a přímý kontakt na hostitele.",
  "Provozováno",
  "Zpět",
  {
    wifi: { title: "Wi-Fi", subtitle: "Připojit" },
    contact: { title: "Kontakt", subtitle: "Jsme tu" },
    arrival: { title: "Check-in/out", subtitle: "Příjezd a odjezd" },
    house: { title: "Průvodce domem", subtitle: "O ubytování" },
    restaurants: { title: "Restaurace", subtitle: "Jídlo v okolí" },
    activities: { title: "Aktivity", subtitle: "Co dělat" },
    reviews: { title: "Recenze", subtitle: "Sdílejte pobyt" },
    emergency: { title: "Nouzové", subtitle: "Důležité kontakty" }
  },
  {
    stayAssistant: "Asistent pobytu",
    propertyBot: "Bot {name}",
    askProperty: "Zeptat se {name}",
    askYourHost: "Zeptat se hostitele",
    intro: "Ahoj, jsem {bot}. Zeptejte se mě na cokoli o pobytu v {property}.",
    helpTitle: "Jak vám mohu pomoci během pobytu?",
    helpSubtitle: "Wi-Fi, odjezd, parkování a místní tipy.",
    promptSupermarket: "Kde je nejbližší supermarket?",
    promptCheckout: "Kdy je odjezd?",
    promptWifi: "Jak se připojím k Wi-Fi?",
    askAnything: "Zeptejte se na cokoli...",
    thinking: "Přemýšlím...",
    errorAnswer: "Na to jsem nemohl odpovědět. Kontaktujte hostitele.",
    errorNow: "Teď nemohu odpovědět. Kontaktujte hostitele."
  },
  {
    wifi: { eyebrow: "Wi-Fi", title: "Připojení k internetu." },
    contact: { eyebrow: "Kontakt", title: "Potřebujete pomoc během pobytu?" },
    arrival: { eyebrow: "Příjezd", title: "Check-in a check-out." },
    house: { eyebrow: "Průvodce domem", title: "Vše v ubytování." },
    restaurants: { eyebrow: "Restaurace", title: "Kde jíst." },
    activities: { eyebrow: "Aktivity", title: "Co dělat v okolí." },
    reviews: { eyebrow: "Recenze", title: "Líbí se vám pobyt?" },
    emergency: { eyebrow: "Nouzové", title: "Důležité informace." }
  },
  {
    network: "Síť",
    password: "Heslo",
    copyWifiPassword: "Kopírovat heslo Wi-Fi",
    passwordCopied: "Heslo zkopírováno",
    askHost: "Zeptat se hostitele",
    yourHost: "Váš hostitel",
    whatsappHost: "WhatsApp hostitel",
    callHost: "Zavolat hostiteli",
    checkIn: "Check-in",
    checkOut: "Check-out",
    checkInFallback: "Podrobnosti check-inu najdete v příjezdové zprávě.",
    checkOutFallback: "Podrobnosti check-outu najdete v příjezdové zprávě.",
    parking: "Parkování",
    parkingFallback: "Zeptejte se hostitele na možnosti parkování.",
    houseRules: "Domovní pravidla",
    houseRulesFallback: "Užívejte si dům s péčí a respektujte noční klid.",
    noRestaurants: "Hostitel zatím nepřidal doporučení restaurací.",
    noActivities: "Hostitel zatím nepřidal aktivity.",
    leaveReview: "Napsat recenzi",
    reviewBlurb: "Krátká recenze pomůže budoucím hostům a hostiteli udělá radost.",
    noReviewLinks: "Odkazy na recenze se zobrazí, až je hostitel přidá.",
    emergencyContacts: "Nouzové kontakty",
    emergencyFallback: "V nouzi volejte místné tísňové číslo. Při problémech s ubytováním kontaktujte hostitele.",
    openMap: "Otevřít mapu",
    whatsappStayingTemplate: "Ahoj, pobývám v {property} a potřebuji pomoc."
  }
);

const pl = m(
  "Cyfrowy concierge",
  "Twój pobyt, uproszczony",
  "Witamy w",
  "Twój cyfrowy concierge: Wi-Fi, przyjazd, informacje o domu, lokalne wskazówki i kontakt z gospodarzem.",
  "Obsługiwane przez",
  "Wstecz",
  {
    wifi: { title: "Wi-Fi", subtitle: "Połącz" },
    contact: { title: "Kontakt", subtitle: "Jesteśmy tu" },
    arrival: { title: "Zameld./wym.", subtitle: "Przyjazd i wyjazd" },
    house: { title: "Przewodnik", subtitle: "O obiekcie" },
    restaurants: { title: "Restauracje", subtitle: "Jedzenie w pobliżu" },
    activities: { title: "Atrakcje", subtitle: "Co robić" },
    reviews: { title: "Opinie", subtitle: "Podziel się pobytem" },
    emergency: { title: "Nagłe", subtitle: "Ważne kontakty" }
  },
  {
    stayAssistant: "Asystent pobytu",
    propertyBot: "Bot {name}",
    askProperty: "Zapytaj {name}",
    askYourHost: "Zapytaj gospodarza",
    intro: "Cześć, jestem {bot}. Zapytaj mnie o wszystko dotyczące pobytu w {property}.",
    helpTitle: "Jak mogę pomóc podczas pobytu?",
    helpSubtitle: "Wi-Fi, wymeldowanie, parking i lokalne wskazówki.",
    promptSupermarket: "Gdzie jest najbliższy supermarket?",
    promptCheckout: "O której godzinie wymeldowanie?",
    promptWifi: "Jak połączyć się z Wi-Fi?",
    askAnything: "Zadaj pytanie...",
    thinking: "Myślę...",
    errorAnswer: "Nie mogłem na to odpowiedzieć. Skontaktuj się z gospodarzem.",
    errorNow: "Teraz nie mogę odpowiedzieć. Skontaktuj się z gospodarzem."
  },
  {
    wifi: { eyebrow: "Wi-Fi", title: "Połącz się z internetem." },
    contact: { eyebrow: "Kontakt", title: "Potrzebujesz pomocy podczas pobytu?" },
    arrival: { eyebrow: "Przyjazd", title: "Zameldowanie i wymeldowanie." },
    house: { eyebrow: "Przewodnik", title: "Wszystko w obiekcie." },
    restaurants: { eyebrow: "Restauracje", title: "Gdzie zjeść." },
    activities: { eyebrow: "Atrakcje", title: "Co robić w pobliżu." },
    reviews: { eyebrow: "Opinie", title: "Podoba Ci się pobyt?" },
    emergency: { eyebrow: "Nagłe", title: "Ważne informacje." }
  },
  {
    network: "Sieć",
    password: "Hasło",
    copyWifiPassword: "Kopiuj hasło Wi-Fi",
    passwordCopied: "Hasło skopiowane",
    askHost: "Zapytaj gospodarza",
    yourHost: "Twój gospodarz",
    whatsappHost: "WhatsApp gospodarz",
    callHost: "Zadzwoń do gospodarza",
    checkIn: "Zameldowanie",
    checkOut: "Wymeldowanie",
    checkInFallback: "Szczegóły zameldowania znajdziesz w wiadomości o przyjeździe.",
    checkOutFallback: "Szczegóły wymeldowania znajdziesz w wiadomości o przyjeździe.",
    parking: "Parking",
    parkingFallback: "Zapytaj gospodarza o opcje parkowania.",
    houseRules: "Zasady domu",
    houseRulesFallback: "Korzystaj z domu z troską i szanuj godziny ciszy.",
    noRestaurants: "Gospodarz nie dodał jeszcze rekomendacji restauracji.",
    noActivities: "Gospodarz nie dodał jeszcze atrakcji.",
    leaveReview: "Zostaw opinię",
    reviewBlurb: "Krótka opinia pomaga przyszłym gościom i wiele znaczy dla gospodarza.",
    noReviewLinks: "Linki do opinii pojawią się, gdy gospodarz je doda.",
    emergencyContacts: "Kontakty alarmowe",
    emergencyFallback: "W nagłych wypadkach zadzwoń na lokalny numer alarmowy. W sprawach obiektu skontaktuj się z gospodarzem.",
    openMap: "Otwórz mapę",
    whatsappStayingTemplate: "Cześć, przebywam w {property} i potrzebuję pomocy."
  }
);

const mk = m(
  "Дигитален консиерж",
  "Вашиот престој, поедноставен",
  "Добредојдовте во",
  "Вашиот дигитален консиерж за Wi-Fi, пристигнување, информации за домот, локални совети и директен контакт со домаќинот.",
  "Овозможено од",
  "Назад",
  {
    wifi: { title: "Wi-Fi", subtitle: "Поврзи се" },
    contact: { title: "Контакт", subtitle: "Сме тука" },
    arrival: { title: "Пријава/одија", subtitle: "Пристигнување и заминување" },
    house: { title: "Водич за дом", subtitle: "За сместувањето" },
    restaurants: { title: "Ресторани", subtitle: "Храна во близина" },
    activities: { title: "Активности", subtitle: "Што да правите" },
    reviews: { title: "Оцени", subtitle: "Споделете го престојот" },
    emergency: { title: "Итно", subtitle: "Важни контакти" }
  },
  {
    stayAssistant: "Асистент за престој",
    propertyBot: "{name} бот",
    askProperty: "Прашај {name}",
    askYourHost: "Прашај го домаќинот",
    intro: "Здраво, јас сум {bot}. Прашајте ме за сè за вашиот престој во {property}.",
    helpTitle: "Како можам да помогнам за време на престојот?",
    helpSubtitle: "Wi-Fi, одјава, паркирање и локални совети.",
    promptSupermarket: "Каде е најблиската супермаркет?",
    promptCheckout: "Во колку е одјавата?",
    promptWifi: "Како да се поврзам на Wi-Fi?",
    askAnything: "Прашајте нешто...",
    thinking: "Размислувам...",
    errorAnswer: "Не можев да одговорам. Контактирајте го домаќинот.",
    errorNow: "Моментално не можам да одговорам. Контактирајте го домаќинот."
  },
  {
    wifi: { eyebrow: "Wi-Fi", title: "Поврзете се на интернет." },
    contact: { eyebrow: "Контакт", title: "Ви треба помош за време на престојот?" },
    arrival: { eyebrow: "Пристигнување", title: "Пријава и одјава." },
    house: { eyebrow: "Водич за дом", title: "Сè во сместувањето." },
    restaurants: { eyebrow: "Ресторани", title: "Каде да јадете." },
    activities: { eyebrow: "Активности", title: "Што да правите во близина." },
    reviews: { eyebrow: "Оцени", title: "Уживате во престојот?" },
    emergency: { eyebrow: "Итно", title: "Важни информации." }
  },
  {
    network: "Мрежа",
    password: "Лозинка",
    copyWifiPassword: "Копирај Wi-Fi лозинка",
    passwordCopied: "Лозинката е копирана",
    askHost: "Прашај домаќин",
    yourHost: "Вашиот домаќин",
    whatsappHost: "WhatsApp домаќин",
    callHost: "Повикај домаќин",
    checkIn: "Пријава",
    checkOut: "Одјава",
    checkInFallback: "Детали за пријава се во пораката за пристигнување.",
    checkOutFallback: "Детали за одјава се во пораката за пристигнување.",
    parking: "Паркирање",
    parkingFallback: "Прашајте го домаќинот за паркирање.",
    houseRules: "Куќни правила",
    houseRulesFallback: "Уживајте во домот со грижа и почитувајте ги тивките часови.",
    noRestaurants: "Домаќинот сè уште нема додадено препораки за ресторани.",
    noActivities: "Домаќинот сè уште нема додадено активности.",
    leaveReview: "Остави оценка",
    reviewBlurb: "Кратка оценка им помага на идните гости и многу значи за домаќинот.",
    noReviewLinks: "Линковите за оцени ќе се појават кога домаќинот ќе ги додаде.",
    emergencyContacts: "Итни контакти",
    emergencyFallback: "За итни случаи повикајте локален број. За проблеми со сместувањето контактирајте домаќин.",
    openMap: "Отвори мапа",
    whatsappStayingTemplate: "Здраво, престојувам во {property} и ми треба помош."
  }
);

const sr = m(
  "Digitalni koncijerž",
  "Vaš boravak, pojednostavljen",
  "Dobrodošli u",
  "Vaš digitalni koncijerž za Wi-Fi, dolazak, informacije o kući, lokalne savete i direktan kontakt sa domaćinom.",
  "Omogućeno od",
  "Nazad",
  {
    wifi: { title: "Wi-Fi", subtitle: "Poveži se" },
    contact: { title: "Kontakt", subtitle: "Tu smo" },
    arrival: { title: "Prijava/odjava", subtitle: "Dolazak i odlazak" },
    house: { title: "Vodič kroz kuću", subtitle: "O smeštaju" },
    restaurants: { title: "Restorani", subtitle: "Hrana u blizini" },
    activities: { title: "Aktivnosti", subtitle: "Šta raditi" },
    reviews: { title: "Recenzije", subtitle: "Podelite boravak" },
    emergency: { title: "Hitno", subtitle: "Važni kontakti" }
  },
  {
    stayAssistant: "Asistent za boravak",
    propertyBot: "{name} bot",
    askProperty: "Pitaj {name}",
    askYourHost: "Pitaj domaćina",
    intro: "Zdravo, ja sam {bot}. Pitajte me sve o boravku u {property}.",
    helpTitle: "Kako mogu da pomognem tokom boravka?",
    helpSubtitle: "Wi-Fi, odjava, parking i lokalni saveti.",
    promptSupermarket: "Gde je najbliža prodavnica?",
    promptCheckout: "Koje je vreme odjave?",
    promptWifi: "Kako da se povežem na Wi-Fi?",
    askAnything: "Pitajte bilo šta...",
    thinking: "Razmišljam...",
    errorAnswer: "Nisam mogao da odgovorim. Kontaktirajte domaćina.",
    errorNow: "Trenutno ne mogu da odgovorim. Kontaktirajte domaćina."
  },
  {
    wifi: { eyebrow: "Wi-Fi", title: "Povežite se na internet." },
    contact: { eyebrow: "Kontakt", title: "Potrebna vam je pomoć tokom boravka?" },
    arrival: { eyebrow: "Dolazak", title: "Prijava i odjava." },
    house: { eyebrow: "Vodič kroz kuću", title: "Sve u smeštaju." },
    restaurants: { eyebrow: "Restorani", title: "Gde jesti." },
    activities: { eyebrow: "Aktivnosti", title: "Šta raditi u blizini." },
    reviews: { eyebrow: "Recenzije", title: "Uživate u boravku?" },
    emergency: { eyebrow: "Hitno", title: "Važne informacije." }
  },
  {
    network: "Mreža",
    password: "Lozinka",
    copyWifiPassword: "Kopiraj Wi-Fi lozinku",
    passwordCopied: "Lozinka kopirana",
    askHost: "Pitaj domaćina",
    yourHost: "Vaš domaćin",
    whatsappHost: "WhatsApp domaćin",
    callHost: "Pozovi domaćina",
    checkIn: "Prijava",
    checkOut: "Odjava",
    checkInFallback: "Detalje prijave pogledajte u poruci o dolasku.",
    checkOutFallback: "Detalje odjave pogledajte u poruci o dolasku.",
    parking: "Parking",
    parkingFallback: "Pitajte domaćina za opcije parkiranja.",
    houseRules: "Kućni red",
    houseRulesFallback: "Uživajte u domu pažljivo i poštujte noćni mir.",
    noRestaurants: "Domaćin još nije dodao preporuke restorana.",
    noActivities: "Domaćin još nije dodao aktivnosti.",
    leaveReview: "Ostavite recenziju",
    reviewBlurb: "Kratka recenzija pomaže budućim gostima i mnogo znači domaćinu.",
    noReviewLinks: "Linkovi za recenzije će se pojaviti kada ih domaćin doda.",
    emergencyContacts: "Hitni kontakti",
    emergencyFallback: "Za hitne slučajeve pozovite lokalni broj. Za probleme sa smeštajem kontaktirajte domaćina.",
    openMap: "Otvori mapu",
    whatsappStayingTemplate: "Zdravo, boravim u {property} i treba mi pomoć."
  }
);

const tr = m(
  "Dijital Concierge",
  "Konaklamanız, sadeleştirildi",
  "Hoş geldiniz",
  "Wi-Fi, varış, ev bilgileri, yerel ipuçları ve ev sahibiyle doğrudan iletişim için dijital concierge.",
  "Altyapı",
  "Geri",
  {
    wifi: { title: "Wi-Fi", subtitle: "Bağlan" },
    contact: { title: "İletişim", subtitle: "Buradayız" },
    arrival: { title: "Giriş/çıkış", subtitle: "Varış ve ayrılış" },
    house: { title: "Ev rehberi", subtitle: "Konaklama hakkında" },
    restaurants: { title: "Restoranlar", subtitle: "Yakında yemek" },
    activities: { title: "Aktiviteler", subtitle: "Yapılacaklar" },
    reviews: { title: "Yorumlar", subtitle: "Konaklamanızı paylaşın" },
    emergency: { title: "Acil", subtitle: "Önemli kişiler" }
  },
  {
    stayAssistant: "Konaklama asistanı",
    propertyBot: "{name} botu",
    askProperty: "{name} sor",
    askYourHost: "Ev sahibine sor",
    intro: "Merhaba, ben {bot}. {property} konaklamanız hakkında her şeyi sorabilirsiniz.",
    helpTitle: "Konaklamanız boyunca nasıl yardımcı olabilirim?",
    helpSubtitle: "Wi-Fi, çıkış, otopark ve yerel ipuçları.",
    promptSupermarket: "En yakın market nerede?",
    promptCheckout: "Çıkış saati kaçta?",
    promptWifi: "Wi-Fi'ye nasıl bağlanırım?",
    askAnything: "Bir şey sorun...",
    thinking: "Düşünüyorum...",
    errorAnswer: "Buna cevap veremedim. Lütfen ev sahibinizle iletişime geçin.",
    errorNow: "Şu anda cevap veremiyorum. Lütfen ev sahibinizle iletişime geçin."
  },
  {
    wifi: { eyebrow: "Wi-Fi", title: "İnternete bağlanın." },
    contact: { eyebrow: "İletişim", title: "Konaklama sırasında yardıma mı ihtiyacınız var?" },
    arrival: { eyebrow: "Varış", title: "Giriş ve çıkış." },
    house: { eyebrow: "Ev rehberi", title: "Konaklamadaki her şey." },
    restaurants: { eyebrow: "Restoranlar", title: "Nerede yemek yenir." },
    activities: { eyebrow: "Aktiviteler", title: "Yakında yapılacaklar." },
    reviews: { eyebrow: "Yorumlar", title: "Konaklamanızdan memnun musunuz?" },
    emergency: { eyebrow: "Acil", title: "Önemli bilgiler." }
  },
  {
    network: "Ağ",
    password: "Şifre",
    copyWifiPassword: "Wi-Fi şifresini kopyala",
    passwordCopied: "Şifre kopyalandı",
    askHost: "Ev sahibine sor",
    yourHost: "Ev sahibiniz",
    whatsappHost: "WhatsApp ev sahibi",
    callHost: "Ev sahibini ara",
    checkIn: "Giriş",
    checkOut: "Çıkış",
    checkInFallback: "Giriş detayları için varış mesajınıza bakın.",
    checkOutFallback: "Çıkış detayları için varış mesajınıza bakın.",
    parking: "Otopark",
    parkingFallback: "Otopark seçenekleri için ev sahibinize sorun.",
    houseRules: "Ev kuralları",
    houseRulesFallback: "Evi özenle kullanın ve sessiz saatleri gözetin.",
    noRestaurants: "Ev sahibi henüz restoran önerisi eklemedi.",
    noActivities: "Ev sahibi henüz aktivite eklemedi.",
    leaveReview: "Yorum bırak",
    reviewBlurb: "Kısa bir yorum gelecek misafirlere yardımcı olur ve ev sahibi için çok değerlidir.",
    noReviewLinks: "Yorum bağlantıları ev sahibi eklediğinde burada görünecek.",
    emergencyContacts: "Acil kişiler",
    emergencyFallback: "Acil durumlarda yerel acil numarayı arayın. Konaklama sorunları için ev sahibinize ulaşın.",
    openMap: "Haritayı aç",
    whatsappStayingTemplate: "Merhaba, {property} konaklıyorum ve yardıma ihtiyacım var."
  }
);

const sq = m(
  "Conciergj dixhital",
  "Qëndrimi juaj, i thjeshtuar",
  "Mirë se vini në",
  "Conciergj juaj dixhital për Wi-Fi, arritjen, informacionin e shtëpisë, këshilla lokale dhe kontakt të drejtpërdrejtë me pronarin.",
  "Mundësuar nga",
  "Kthehu",
  {
    wifi: { title: "Wi-Fi", subtitle: "Lidhu" },
    contact: { title: "Kontakt", subtitle: "Jemi këtu" },
    arrival: { title: "Check-in/out", subtitle: "Arritja dhe nisja" },
    house: { title: "Udhëzues shtëpie", subtitle: "Rreth pronës" },
    restaurants: { title: "Restorante", subtitle: "Ushqim afër" },
    activities: { title: "Aktivitete", subtitle: "Çfarë të bëni" },
    reviews: { title: "Vlerësime", subtitle: "Ndani qëndrimin" },
    emergency: { title: "Urgjencë", subtitle: "Kontakte të rëndësishme" }
  },
  {
    stayAssistant: "Asistent i qëndrimit",
    propertyBot: "Bot {name}",
    askProperty: "Pyet {name}",
    askYourHost: "Pyet pronarin",
    intro: "Përshëndetje, unë jam {bot}. Më pyetni për gjithçka rreth qëndrimit në {property}.",
    helpTitle: "Si mund t'ju ndihmoj gjatë qëndrimit?",
    helpSubtitle: "Wi-Fi, check-out, parkim dhe këshilla lokale.",
    promptSupermarket: "Ku është supermarketi më i afërt?",
    promptCheckout: "Kur është check-out?",
    promptWifi: "Si të lidhem me Wi-Fi?",
    askAnything: "Pyetni diçka...",
    thinking: "Duke menduar...",
    errorAnswer: "Nuk mund ta përgjigjja. Ju lutemi kontaktoni pronarin.",
    errorNow: "Tani nuk mund të përgjigjem. Ju lutemi kontaktoni pronarin."
  },
  {
    wifi: { eyebrow: "Wi-Fi", title: "Lidhu me internetin." },
    contact: { eyebrow: "Kontakt", title: "Keni nevojë për ndihmë gjatë qëndrimit?" },
    arrival: { eyebrow: "Arritja", title: "Check-in dhe check-out." },
    house: { eyebrow: "Udhëzues shtëpie", title: "Gjithçka në pronë." },
    restaurants: { eyebrow: "Restorante", title: "Ku të hani." },
    activities: { eyebrow: "Aktivitete", title: "Çfarë të bëni afër." },
    reviews: { eyebrow: "Vlerësime", title: "Po shijoni qëndrimin?" },
    emergency: { eyebrow: "Urgjencë", title: "Informacion i rëndësishëm." }
  },
  {
    network: "Rrjeti",
    password: "Fjalëkalimi",
    copyWifiPassword: "Kopjo fjalëkalimin Wi-Fi",
    passwordCopied: "Fjalëkalimi u kopjua",
    askHost: "Pyet pronarin",
    yourHost: "Pronari juaj",
    whatsappHost: "WhatsApp pronar",
    callHost: "Telefono pronarin",
    checkIn: "Check-in",
    checkOut: "Check-out",
    checkInFallback: "Detajet e check-in gjenden në mesazhin e arritjes.",
    checkOutFallback: "Detajet e check-out gjenden në mesazhin e arritjes.",
    parking: "Parkimi",
    parkingFallback: "Pyetni pronarin për opsionet e parkimit.",
    houseRules: "Rregullat e shtëpisë",
    houseRulesFallback: "Shijoni shtëpinë me kujdes dhe respektoni orët e qetësisë.",
    noRestaurants: "Pronari nuk ka shtuar ende rekomandime restorantesh.",
    noActivities: "Pronari nuk ka shtuar ende aktivitete.",
    leaveReview: "Lini një vlerësim",
    reviewBlurb: "Një vlerësim i shkurtër ndihmon mysafirët e ardhshëm dhe vlen shumë për pronarin.",
    noReviewLinks: "Linqet e vlerësimit do të shfaqen kur pronari t'i shtojë.",
    emergencyContacts: "Kontakte urgjence",
    emergencyFallback: "Për urgjenca, telefononi numrin lokal. Për probleme me pronën, kontaktoni pronarin.",
    openMap: "Hape hartën",
    whatsappStayingTemplate: "Përshëndetje, po qëndroj në {property} dhe kam nevojë për ndihmë."
  }
);

const messages: Record<GuestLocale, GuestMessages> = {
  en,
  de,
  fr,
  nl,
  be,
  cs,
  pl,
  mk,
  sr,
  tr,
  sq
};

export function isGuestLocale(value: string): value is GuestLocale {
  return GUEST_LOCALES.some((locale) => locale.code === value);
}

export function getGuestMessages(locale: GuestLocale): GuestMessages {
  return messages[locale] ?? en;
}

export function getDefaultGuestLocale(): GuestLocale {
  return "en";
}
