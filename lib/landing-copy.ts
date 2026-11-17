import type { SeoLocale } from "@/lib/seo";

export type LandingCopy = {
  locale: SeoLocale;
  meta: { title: string; description: string; keywords: string[] };
  nav: { demo: string; how: string; pricing: string; guides?: string; login: string; start: string };
  hero: {
    pill: string;
    h1Lead: string;
    h1Accent: string;
    sub: string;
    cta: string;
    demo: string;
    checks: [string, string, string];
  };
  phone: { guestAsks: string; question: string; review: string; tapAround: string; openDemo: string };
  proof: string;
  features: {
    h2: string;
    sub: string;
    chatTitle: string;
    chatText: string;
    chat: [string, string, string, string];
    wifiTitle: string;
    wifiText: string;
    copy: string;
    reviewTitle: string;
    reviewText: string;
    reviewPrompt: string;
    reviewOn: string;
    small: [{ title: string; text: string }, { title: string; text: string }, { title: string; text: string }];
  };
  preview?: { h2: string; sub: string };
  compare: {
    h2: string;
    sub: string;
    columns: [string, string, string];
    rows: { label: string; values: [string, string, string] }[];
  };
  how: { h2: string; sub: string; steps: [{ title: string; text: string }, { title: string; text: string }, { title: string; text: string }]; cta: string };
  pricing: {
    h2: string;
    sub: string;
    qr: string;
    price: string;
    perYear: string;
    monthly: string;
    features: string[];
    cta: string;
    noCard: string;
  };
  faq: { h2: string; items: { q: string; a: string }[] };
  guides?: { h2: string; links: { label: string; href: string }[] };
  final: { h2: string; sub: string; cta: string; demo: string };
  sticky: string;
  languageLabel: string;
};

export const landingCopy: Record<SeoLocale, LandingCopy> = {
  en: {
    locale: "en",
    meta: {
      title: "Digital Guest Guide & QR Welcome Book for Airbnb Hosts | StayNest",
      description:
        "Create a digital guest guide for your holiday rental: one QR code with Wi-Fi, check-in, house rules, local tips and an AI concierge. 7 days free, no card.",
      keywords: [
        "digital guest guide",
        "digital welcome book",
        "QR code welcome book",
        "Airbnb digital guidebook",
        "vacation rental welcome book",
        "guest guide software",
        "AI concierge for vacation rentals"
      ]
    },
    nav: { demo: "Live demo", how: "How it works", pricing: "Pricing", guides: "Guides", login: "Log in", start: "Start free" },
    hero: {
      pill: "Digital guest guide for Airbnb, Booking.com and villa hosts",
      h1Lead: "Your digital guest guide.",
      h1Accent: "Fewer messages, more 5-star reviews.",
      sub: "One QR code gives guests Wi-Fi, check-in, house rules, your local tips and an AI concierge that replies in their language. Every guest also finds your review link.",
      cta: "Create my guide free",
      demo: "See the live demo",
      checks: ["7 days free", "No card needed", "Ready in minutes"]
    },
    phone: {
      guestAsks: "Guest asks",
      question: "“Wo ist der Schlüssel?”",
      review: "Review link inside",
      tapAround: "This is the real guide. Tap around.",
      openDemo: "Open the live demo"
    },
    proof: "Guests already use it at",
    features: {
      h2: "Guests ask. StayNest answers.",
      sub: "Everything a guest needs, on their phone, in one place.",
      chatTitle: "An AI concierge that knows your place",
      chatText: "Guests ask at 2 a.m., in their own language. It answers from your guide only, and sends them to you for anything else.",
      chat: [
        "Bis wann ist der Check-out?",
        "Check-out ist bis 10:00. Bitte legt die Schlüssel zurück in die Schlüsselbox. Gute Heimreise!",
        "Gdzie zjemy dobrą rybę?",
        "Polecamy Harbor Grill, świeża ryba z jeziora. Zarezerwujcie stolik na zachód słońca."
      ],
      wifiTitle: "Wi-Fi in one tap",
      wifiText: "The question you get on every arrival, answered before anyone texts you.",
      copy: "Copy",
      reviewTitle: "More 5-star reviews",
      reviewText: "Smoother stays, then your review link right where every guest already looks.",
      reviewPrompt: "How was your stay?",
      reviewOn: "Review on Google",
      small: [
        { title: "Check-in", text: "Arrival steps, parking and check-out in plain words." },
        { title: "Your tips", text: "Restaurants, beaches and the pharmacy, with maps." },
        { title: "Six languages", text: "The guide switches to the guest's language automatically." }
      ]
    },
    preview: { h2: "See your own place in StayNest.", sub: "Paste your Booking.com link and get a preview of your guide in about a minute." },
    compare: {
      h2: "Better than a paper folder or a stream of messages",
      sub: "What changes when your welcome book lives on the guest's phone.",
      columns: ["Paper folder", "Answering messages", "StayNest"],
      rows: [
        { label: "Up to date", values: ["Reprint when anything changes", "You retype it every time", "Edit once, live instantly"] },
        { label: "Found by guests", values: ["If they open the folder", "Only after they ask", "Scan the QR code by the door"] },
        { label: "Guest's language", values: ["Usually one language", "Depends on you", "Six languages plus AI answers"] },
        { label: "At 2 a.m.", values: ["If they can find it", "You wake up to messages", "The AI concierge answers"] }
      ]
    },
    how: {
      h2: "Live in three steps",
      sub: "Most hosts finish before their coffee gets cold.",
      steps: [
        { title: "Paste your listing", text: "Paste a Booking.com link or your Airbnb listing text and StayNest fills in the guide for you." },
        { title: "Add Wi-Fi and check-in", text: "The two things every guest asks. Add your review link while you are there." },
        { title: "Print one QR code", text: "Put it by the door. Edit anything later, the QR code never changes." }
      ],
      cta: "Start my free week"
    },
    pricing: {
      h2: "One plan. Everything in.",
      sub: "No tiers to compare and no per-guest fees. Try it for a week, then keep it for less than one cleaning fee a year.",
      qr: "Your printed QR code keeps working for as long as you are subscribed.",
      price: "€20",
      perYear: "per year",
      monthly: "About €1.70 a month, billed once a year.",
      features: [
        "Mobile guest guide with your photos",
        "Wi-Fi, check-in, house rules, local tips",
        "AI concierge that replies in the guest's language",
        "Google, Booking.com and Airbnb review links",
        "Booking.com import and Airbnb text import",
        "Unlimited edits, the QR code never changes"
      ],
      cta: "Start 7 days free",
      noCard: "No card needed. Cancel any time."
    },
    faq: {
      h2: "Questions",
      items: [
        {
          q: "What is a digital guest guide?",
          a: "A digital guest guide is a welcome book that lives on a web page instead of in a paper folder. Guests open it by scanning a QR code or tapping a link, and find Wi-Fi, check-in steps, house rules, local recommendations and how to reach you. StayNest builds this page for you and adds an AI concierge that answers questions from your guide."
        },
        {
          q: "Do I need a card to start?",
          a: "No. The 7-day free trial starts without a card. You only add payment details if you want to keep your guide live after the trial."
        },
        {
          q: "Do my guests need to install an app?",
          a: "No. Guests scan the QR code or open the link and the guide opens in their phone's browser."
        },
        {
          q: "What does the AI concierge know?",
          a: "Only what you put in your guide: Wi-Fi, check-in, house rules, your tips and the notes you add for it. It answers in the guest's own language and tells them to contact you for anything it does not know."
        },
        {
          q: "Does it work for Airbnb and Booking.com listings?",
          a: "Yes. Paste a Booking.com link and StayNest reads the public details. Airbnb does not allow automatic reading, so you paste your listing text instead, which works just as well."
        },
        {
          q: "What happens after the trial?",
          a: "Your guide goes offline for guests and they see a short “temporarily unavailable” page. Everything you set up is saved, and you can subscribe at any time to put it back online. We email you two days before the trial ends."
        },
        { q: "Can I cancel?", a: "Any time, from the billing portal. Your guide stays live until the end of the paid year." }
      ]
    },
    guides: {
      h2: "Free guides for hosts",
      links: [
        { label: "Airbnb welcome book: what to include", href: "/guides/airbnb-welcome-book" },
        { label: "Check-in instructions template", href: "/guides/check-in-instructions-template" },
        { label: "How to reduce repetitive guest questions", href: "/guides/reduce-guest-questions" },
        { label: "QR code guest guide: how it works", href: "/qr-code-guest-guide" },
        { label: "AI guest assistant for holiday rentals", href: "/ai-guest-assistant" },
        { label: "Free Wi-Fi QR code generator", href: "/tools/wifi-qr-code" }
      ]
    },
    final: {
      h2: "Your next guest arrives soon. Be ready.",
      sub: "Set up your guide today and print the QR code before check-in.",
      cta: "Create my guide free",
      demo: "See the live demo"
    },
    sticky: "Create my guide free",
    languageLabel: "Language"
  },

  de: {
    locale: "de",
    meta: {
      title: "Digitale Gästemappe für Ferienwohnungen mit QR-Code | StayNest",
      description:
        "Digitale Gästemappe für Ihre Ferienwohnung: ein QR-Code mit WLAN, Check-in, Hausregeln, Tipps und KI-Concierge in der Sprache des Gastes. 7 Tage gratis.",
      keywords: ["digitale Gästemappe", "Gästemappe Ferienwohnung", "digitale Gästemappe Airbnb", "Gästemappe QR-Code", "Gästeinformation Ferienwohnung"]
    },
    nav: { demo: "Live-Demo", how: "So funktioniert's", pricing: "Preis", login: "Anmelden", start: "Kostenlos starten" },
    hero: {
      pill: "Für Gastgeber auf Airbnb, Booking.com und mit eigener Ferienwohnung",
      h1Lead: "Ihre digitale Gästemappe.",
      h1Accent: "Weniger Nachfragen, mehr 5-Sterne-Bewertungen.",
      sub: "Ein QR-Code, und Ihre Gäste haben WLAN, Check-in, Hausregeln, Ihre Ausflugstipps und einen KI-Concierge, der in ihrer Sprache antwortet. Ihren Bewertungslink finden sie gleich mit.",
      cta: "Gästemappe kostenlos erstellen",
      demo: "Live-Demo ansehen",
      checks: ["7 Tage kostenlos", "Keine Kreditkarte nötig", "In wenigen Minuten fertig"]
    },
    phone: {
      guestAsks: "Ein Gast fragt",
      question: "„Where do I park?“",
      review: "Mit Bewertungslink",
      tapAround: "Das ist die echte Gästemappe. Probieren Sie sie aus.",
      openDemo: "Live-Demo öffnen"
    },
    proof: "Gäste nutzen sie bereits in",
    features: {
      h2: "Gäste fragen. StayNest antwortet.",
      sub: "Alles, was Ihre Gäste brauchen, auf dem Handy und an einem Ort.",
      chatTitle: "Ein KI-Concierge, der Ihre Unterkunft kennt",
      chatText: "Gäste fragen nachts um zwei, in ihrer eigenen Sprache. Er antwortet nur aus Ihrer Gästemappe und verweist bei allem anderen an Sie.",
      chat: [
        "What time is check-out?",
        "Check-out is by 10:00. Please leave the keys in the key box. Have a safe trip home!",
        "Dove posso parcheggiare?",
        "Ci sono due posti auto privati dietro il cancello. Parcheggiate con il muso verso la casa."
      ],
      wifiTitle: "WLAN mit einem Tippen",
      wifiText: "Die Frage, die bei jeder Anreise kommt, ist beantwortet, bevor jemand schreibt.",
      copy: "Kopieren",
      reviewTitle: "Mehr 5-Sterne-Bewertungen",
      reviewText: "Entspanntere Aufenthalte, und Ihr Bewertungslink genau dort, wo jeder Gast ohnehin nachschaut.",
      reviewPrompt: "Wie war Ihr Aufenthalt?",
      reviewOn: "Auf Google bewerten",
      small: [
        { title: "Check-in", text: "Anreise, Parken und Abreise in klaren Worten." },
        { title: "Ihre Tipps", text: "Restaurants, Ausflüge und Apotheke, mit Karte." },
        { title: "Sechs Sprachen", text: "Die Gästemappe wechselt automatisch in die Sprache des Gastes." }
      ]
    },
    compare: {
      h2: "Besser als die Papiermappe oder ständige Nachrichten",
      sub: "Was sich ändert, wenn Ihre Gästemappe auf dem Handy des Gastes ist.",
      columns: ["Papiermappe", "Nachrichten beantworten", "StayNest"],
      rows: [
        { label: "Aktuell", values: ["Neu drucken bei jeder Änderung", "Jedes Mal neu tippen", "Einmal ändern, sofort live"] },
        { label: "Von Gästen gefunden", values: ["Wenn sie die Mappe öffnen", "Erst nachdem sie fragen", "QR-Code an der Tür scannen"] },
        { label: "Sprache des Gastes", values: ["Meist nur eine Sprache", "Hängt von Ihnen ab", "Sechs Sprachen plus KI-Antworten"] },
        { label: "Nachts um zwei", values: ["Wenn sie sie finden", "Sie wachen mit Nachrichten auf", "Der KI-Concierge antwortet"] }
      ]
    },
    how: {
      h2: "In drei Schritten online",
      sub: "Die meisten Gastgeber sind fertig, bevor der Kaffee kalt ist.",
      steps: [
        { title: "Inserat einfügen", text: "Booking.com-Link oder Ihren Airbnb-Inseratstext einfügen, und StayNest füllt die Gästemappe für Sie aus." },
        { title: "WLAN und Check-in ergänzen", text: "Die zwei Dinge, nach denen jeder Gast fragt. Fügen Sie dabei gleich Ihren Bewertungslink hinzu." },
        { title: "Einen QR-Code drucken", text: "An die Eingangstür, fertig. Sie können alles jederzeit ändern, der QR-Code bleibt gleich." }
      ],
      cta: "Kostenlose Woche starten"
    },
    pricing: {
      h2: "Ein Preis. Alles inklusive.",
      sub: "Keine Pakete zum Vergleichen, keine Gebühren pro Gast. Eine Woche testen, danach weniger als eine Endreinigung im Jahr.",
      qr: "Ihr gedruckter QR-Code funktioniert, solange Ihr Abo läuft.",
      price: "20 €",
      perYear: "pro Jahr",
      monthly: "Rund 1,70 € im Monat, einmal jährlich abgerechnet.",
      features: [
        "Mobile Gästemappe mit Ihren Fotos",
        "WLAN, Check-in, Hausregeln, Ausflugstipps",
        "KI-Concierge, der in der Sprache des Gastes antwortet",
        "Bewertungslinks für Google, Booking.com und Airbnb",
        "Import aus Booking.com und Airbnb-Text",
        "Unbegrenzt ändern, der QR-Code bleibt gleich"
      ],
      cta: "7 Tage kostenlos testen",
      noCard: "Keine Kreditkarte nötig. Jederzeit kündbar."
    },
    faq: {
      h2: "Häufige Fragen",
      items: [
        {
          q: "Was ist eine digitale Gästemappe?",
          a: "Eine digitale Gästemappe ist die Gästeinformation Ihrer Ferienwohnung als Webseite statt als Ordner. Gäste öffnen sie per QR-Code oder Link und finden WLAN, Check-in, Hausregeln, Empfehlungen und Ihren Kontakt. StayNest erstellt diese Seite für Sie und ergänzt einen KI-Concierge, der Fragen aus Ihren Angaben beantwortet."
        },
        { q: "Brauche ich eine Kreditkarte?", a: "Nein. Die 7 Tage starten ohne Karte. Zahlungsdaten geben Sie nur an, wenn Ihre Gästemappe danach online bleiben soll." },
        { q: "Müssen meine Gäste eine App installieren?", a: "Nein. Gäste scannen den QR-Code oder öffnen den Link, die Gästemappe öffnet sich im Browser." },
        {
          q: "Was weiß der KI-Concierge?",
          a: "Nur, was in Ihrer Gästemappe steht: WLAN, Check-in, Hausregeln, Ihre Tipps und Ihre zusätzlichen Hinweise. Er antwortet in der Sprache des Gastes und verweist bei allem anderen an Sie."
        },
        {
          q: "Funktioniert das mit Airbnb und Booking.com?",
          a: "Ja. Aus einem Booking.com-Link liest StayNest die öffentlichen Angaben. Airbnb erlaubt kein automatisches Auslesen, dort fügen Sie einfach den Text Ihres Inserats ein."
        },
        {
          q: "Was passiert nach der Testphase?",
          a: "Ihre Gästemappe ist für Gäste vorübergehend nicht erreichbar, alles bleibt gespeichert. Mit einem Abo ist sie sofort wieder online. Zwei Tage vor Ende erinnern wir Sie per E-Mail."
        },
        { q: "Kann ich kündigen?", a: "Jederzeit im Abrechnungsportal. Ihre Gästemappe bleibt bis zum Ende des bezahlten Jahres online." }
      ]
    },
    final: {
      h2: "Ihr nächster Gast kommt bald. Seien Sie bereit.",
      sub: "Erstellen Sie Ihre Gästemappe heute und drucken Sie den QR-Code vor der Anreise.",
      cta: "Gästemappe kostenlos erstellen",
      demo: "Live-Demo ansehen"
    },
    sticky: "Gästemappe kostenlos erstellen",
    languageLabel: "Sprache"
  },

  it: {
    locale: "it",
    meta: {
      title: "Guida digitale per ospiti con QR code per case vacanze | StayNest",
      description:
        "Guida digitale per gli ospiti della tua casa vacanze: un QR code con Wi-Fi, check-in, regole, consigli e concierge AI nella lingua dell'ospite. 7 giorni gratis.",
      keywords: ["guida digitale per ospiti", "guida per ospiti casa vacanze", "libretto di benvenuto digitale", "guida digitale Airbnb", "QR code casa vacanze"]
    },
    nav: { demo: "Demo dal vivo", how: "Come funziona", pricing: "Prezzo", login: "Accedi", start: "Prova gratis" },
    hero: {
      pill: "Per host su Airbnb, Booking.com e proprietari di case vacanze",
      h1Lead: "La tua guida digitale per ospiti.",
      h1Accent: "Meno messaggi, più recensioni a 5 stelle.",
      sub: "Con un solo QR code gli ospiti trovano Wi-Fi, check-in, regole della casa, i tuoi consigli e un concierge AI che risponde nella loro lingua. E trovano anche il tuo link per le recensioni.",
      cta: "Crea la mia guida gratis",
      demo: "Guarda la demo",
      checks: ["7 giorni gratis", "Nessuna carta richiesta", "Pronta in pochi minuti"]
    },
    phone: {
      guestAsks: "Un ospite chiede",
      question: "“Wo kann ich parken?”",
      review: "Link per le recensioni",
      tapAround: "Questa è la guida vera. Provala.",
      openDemo: "Apri la demo"
    },
    proof: "Gli ospiti la usano già a",
    features: {
      h2: "Gli ospiti chiedono. StayNest risponde.",
      sub: "Tutto quello che serve agli ospiti, sul telefono, in un unico posto.",
      chatTitle: "Un concierge AI che conosce la tua casa",
      chatText: "Gli ospiti chiedono alle due di notte, nella loro lingua. Risponde solo con le informazioni della tua guida e per tutto il resto li indirizza a te.",
      chat: [
        "Wann ist der Check-out?",
        "Der Check-out ist bis 10:00. Bitte legt die Schlüssel in die Schlüsselbox. Gute Heimreise!",
        "Where can we eat good fish?",
        "Try Harbor Grill for fresh lake fish. Book a sunset table on the terrace."
      ],
      wifiTitle: "Wi-Fi con un tocco",
      wifiText: "La domanda che arriva a ogni check-in ha già una risposta, prima che qualcuno ti scriva.",
      copy: "Copia",
      reviewTitle: "Più recensioni a 5 stelle",
      reviewText: "Soggiorni più sereni, e il tuo link per le recensioni proprio dove ogni ospite guarda già.",
      reviewPrompt: "Com’è andato il soggiorno?",
      reviewOn: "Recensisci su Google",
      small: [
        { title: "Check-in", text: "Arrivo, parcheggio e partenza spiegati con parole semplici." },
        { title: "I tuoi consigli", text: "Ristoranti, spiagge e farmacia, con la mappa." },
        { title: "Sei lingue", text: "La guida passa da sola alla lingua dell'ospite." }
      ]
    },
    compare: {
      h2: "Meglio di un raccoglitore di carta o di mille messaggi",
      sub: "Cosa cambia quando il libretto di benvenuto è sul telefono dell'ospite.",
      columns: ["Raccoglitore di carta", "Rispondere ai messaggi", "StayNest"],
      rows: [
        { label: "Sempre aggiornata", values: ["Da ristampare a ogni modifica", "Da riscrivere ogni volta", "Modifichi una volta, subito online"] },
        { label: "Trovata dagli ospiti", values: ["Se aprono il raccoglitore", "Solo dopo che chiedono", "Basta scansionare il QR code"] },
        { label: "Lingua dell'ospite", values: ["Di solito una sola lingua", "Dipende da te", "Sei lingue più risposte AI"] },
        { label: "Alle due di notte", values: ["Se riescono a trovarlo", "Ti svegli con i messaggi", "Risponde il concierge AI"] }
      ]
    },
    how: {
      h2: "Online in tre passaggi",
      sub: "La maggior parte degli host finisce prima che il caffè si raffreddi.",
      steps: [
        { title: "Incolla il tuo annuncio", text: "Incolla il link di Booking.com o il testo del tuo annuncio Airbnb e StayNest compila la guida per te." },
        { title: "Aggiungi Wi-Fi e check-in", text: "Le due cose che ogni ospite chiede. Aggiungi anche il tuo link per le recensioni." },
        { title: "Stampa un QR code", text: "Mettilo vicino alla porta. Puoi modificare tutto quando vuoi, il QR code resta lo stesso." }
      ],
      cta: "Inizia la settimana gratis"
    },
    pricing: {
      h2: "Un solo piano. Tutto incluso.",
      sub: "Nessun pacchetto da confrontare, nessun costo per ospite. Provala per una settimana, poi tienila per meno di una pulizia finale all'anno.",
      qr: "Il QR code stampato funziona finché il tuo abbonamento è attivo.",
      price: "20 €",
      perYear: "all'anno",
      monthly: "Circa 1,70 € al mese, fatturati una volta all'anno.",
      features: [
        "Guida mobile con le tue foto",
        "Wi-Fi, check-in, regole della casa, consigli locali",
        "Concierge AI che risponde nella lingua dell'ospite",
        "Link per recensioni su Google, Booking.com e Airbnb",
        "Importazione da Booking.com e dal testo Airbnb",
        "Modifiche illimitate, il QR code non cambia"
      ],
      cta: "Prova 7 giorni gratis",
      noCard: "Nessuna carta richiesta. Disdici quando vuoi."
    },
    faq: {
      h2: "Domande frequenti",
      items: [
        {
          q: "Cos'è una guida digitale per ospiti?",
          a: "È il libretto di benvenuto della tua casa vacanze in forma di pagina web invece che su carta. Gli ospiti la aprono con un QR code o un link e trovano Wi-Fi, check-in, regole della casa, consigli e come contattarti. StayNest crea questa pagina per te e aggiunge un concierge AI che risponde con le informazioni della tua guida."
        },
        { q: "Serve una carta per iniziare?", a: "No. I 7 giorni gratis partono senza carta. Inserisci i dati di pagamento solo se vuoi tenere la guida online dopo la prova." },
        { q: "Gli ospiti devono installare un'app?", a: "No. Scansionano il QR code o aprono il link e la guida si apre nel browser del telefono." },
        {
          q: "Cosa sa il concierge AI?",
          a: "Solo quello che scrivi nella guida: Wi-Fi, check-in, regole, i tuoi consigli e le note che aggiungi. Risponde nella lingua dell'ospite e per tutto il resto lo indirizza a te."
        },
        {
          q: "Funziona con Airbnb e Booking.com?",
          a: "Sì. Da un link Booking.com StayNest legge i dati pubblici. Airbnb non permette la lettura automatica, quindi incolli il testo del tuo annuncio, e funziona altrettanto bene."
        },
        {
          q: "Cosa succede dopo la prova?",
          a: "La guida non è più visibile agli ospiti, ma tutto resta salvato. Con l'abbonamento torna subito online. Ti avvisiamo via email due giorni prima della fine."
        },
        { q: "Posso disdire?", a: "Quando vuoi, dal portale di fatturazione. La guida resta online fino alla fine dell'anno pagato." }
      ]
    },
    final: {
      h2: "Il prossimo ospite arriva presto. Fatti trovare pronto.",
      sub: "Crea la tua guida oggi e stampa il QR code prima del check-in.",
      cta: "Crea la mia guida gratis",
      demo: "Guarda la demo"
    },
    sticky: "Crea la mia guida gratis",
    languageLabel: "Lingua"
  }
};
