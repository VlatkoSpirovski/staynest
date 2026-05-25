export const GUEST_LOCALES = [{ code: "en", label: "English", short: "EN" }] as const;

export type GuestLocale = "en";

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
  return value === "en";
}

export function getGuestMessages() {
  return en;
}

export function getDefaultGuestLocale(): GuestLocale {
  return "en";
}
