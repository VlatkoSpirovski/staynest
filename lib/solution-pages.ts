export type SolutionPage = {
  path: string;
  title: string;
  metaTitle: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  answer: string;
  sections: { h2: string; paragraphs?: string[]; list?: string[]; steps?: { title: string; text: string }[] }[];
  faq: { q: string; a: string }[];
  related: { label: string; href: string }[];
};

export const SOLUTION_PAGES_UPDATED = "2026-11-17";

export const solutionPages: Record<"qr" | "ai", SolutionPage> = {
  qr: {
    path: "/qr-code-guest-guide",
    title: "QR code guest guide for holiday rentals",
    metaTitle: "QR Code Guest Guide & Welcome Book for Holiday Rentals",
    description:
      "Put your welcome book behind one QR code: guests get Wi-Fi, check-in, house rules and local tips on their phone, no app. Edit anytime, the code stays the same.",
    eyebrow: "QR code guest guide",
    h1: "A QR code guest guide your guests actually open",
    intro:
      "Print one QR code, put it by the door, and every guest has your Wi-Fi, check-in steps, house rules and local tips on their own phone. No app, no paper folder to update.",
    answer:
      "A QR code guest guide is a digital welcome book that guests open by scanning a printed QR code with their phone camera. The code links to a web page, so the guide opens in the browser without an app, and the host can change the content at any time without reprinting the code.",
    sections: [
      {
        h2: "How it works",
        steps: [
          { title: "Create your guide", text: "Paste your Booking.com link or your Airbnb listing text, then add Wi-Fi, check-in and your contact. StayNest builds the mobile guide for you." },
          { title: "Download your QR code", text: "Download it from the Share tab in your dashboard. Once the four essentials are filled in, it is also on your Home screen." },
          { title: "Print it and place it", text: "Print it about 6 cm wide or larger and put it where guests look first. Send the same link in your booking message before arrival." }
        ]
      },
      {
        h2: "What guests see when they scan",
        list: [
          "Wi-Fi network with a one-tap copy button, the password hidden until they tap Show",
          "Check-in and check-out times right on the first screen",
          "House rules, parking and your own notes",
          "Your restaurants, things to do and useful places like the pharmacy, with map links",
          "Your contact with call and WhatsApp buttons, and emergency information",
          "An AI concierge that answers questions from your guide in the guest's language",
          "The guide itself in English, German, French, Italian, Spanish or Dutch, picked from the guest's phone"
        ]
      },
      {
        h2: "Where to put the QR code",
        paragraphs: [
          "Guests look for help at three moments: right after they walk in, when they want the Wi-Fi, and when they are getting ready to leave. Put the code where those moments happen."
        ],
        list: [
          "By the entrance or on the inside of the front door",
          "Next to the Wi-Fi router or on the TV stand",
          "On the fridge or the kitchen counter",
          "In a small frame on the bedside table in larger homes",
          "On a printed welcome card that also shows the link as text, for guests whose camera does not read QR codes"
        ]
      },
      {
        h2: "The printed code never changes",
        paragraphs: [
          "The QR code points to your guide's permanent link, not to the content itself. When you change the Wi-Fi password, add a restaurant or update the check-out time, guests see the new version the next time they scan. You print once.",
          "The link keeps working for as long as your subscription is active. If a subscription ends, guests see a short “temporarily unavailable” page instead of an error, and the same code works again once you subscribe."
        ]
      },
      {
        h2: "A note on privacy",
        paragraphs: [
          "Anyone who has the link or sees the code can open the guide, the same as a paper folder left in the hallway. Keep door and lockbox codes out of the guide and send them in your booking message instead. StayNest reminds you of this in the check-in editor."
        ]
      }
    ],
    faq: [
      { q: "Do guests need an app to scan the code?", a: "No. Current iPhone and Android cameras read QR codes directly, and the guide opens in the phone's browser." },
      { q: "Can I change the guide after printing the QR code?", a: "Yes. Edit anything in your dashboard and it is live for guests immediately. The printed code stays the same." },
      { q: "Can I also make a QR code just for the Wi-Fi?", a: "Yes. StayNest has a free Wi-Fi QR code generator that joins guests to your network without typing the password. Many hosts use both: the Wi-Fi code by the router and the guide code by the door." },
      { q: "How big should I print it?", a: "About 6 cm wide or larger works well from arm's length. Laminate it or put it in a frame so it survives cleaning." },
      { q: "What does it cost?", a: "StayNest costs €20 per year after a 7-day free trial that starts without a card. The QR code, the guide and the AI concierge are all included." }
    ],
    related: [
      { label: "Free Wi-Fi QR code generator", href: "/tools/wifi-qr-code" },
      { label: "How to share your Wi-Fi with guests using a QR code", href: "/guides/wifi-qr-code-for-guests" },
      { label: "Airbnb welcome book: what to include", href: "/guides/airbnb-welcome-book" },
      { label: "Digital vs printed welcome book", href: "/guides/digital-guest-guide" }
    ]
  },
  ai: {
    path: "/ai-guest-assistant",
    title: "AI guest assistant for holiday rentals",
    metaTitle: "AI Guest Assistant & Concierge for Holiday Rentals",
    description:
      "An AI concierge in your guest guide that answers at any hour, in the guest's language, only from what you wrote. What it does, what it does not, how to set it up.",
    eyebrow: "AI guest assistant",
    h1: "An AI guest assistant that only answers from your guide",
    intro:
      "Guests ask about the Wi-Fi at midnight, the checkout time in German and the nearest pharmacy in Polish. StayNest's AI concierge answers from what you wrote in your guide, and sends them to you for anything it does not know.",
    answer:
      "An AI guest assistant is a chat inside the guest guide that answers questions about the stay automatically. StayNest's assistant reads only the host's guide content and notes, replies in the language the guest writes in, and tells the guest to contact the host when the answer is not in the guide.",
    sections: [
      {
        h2: "What it answers",
        list: [
          "Wi-Fi, check-in, check-out, parking and house rules",
          "Your restaurant, beach and activity recommendations",
          "Where things are: towels, blankets, bins, the coffee machine, the fuse box",
          "Practical local questions you have covered, like the nearest supermarket or pharmacy",
          "Questions in other languages: a German guest asking “Wann ist der Check-out?” gets the answer in German"
        ]
      },
      {
        h2: "What it does not do",
        paragraphs: ["Knowing the limits is what makes it safe to put in front of guests."],
        list: [
          "It does not invent anything. If your guide does not say it, the assistant says it does not have that detail and points the guest to you.",
          "It does not make up codes, prices, policies, addresses or emergency instructions.",
          "It does not read or send your Airbnb or Booking.com messages, and it does not take bookings or payments.",
          "It does not replace you for urgent problems. Your contact and emergency information stay one tap away in the guide."
        ]
      },
      {
        h2: "How to teach it more",
        steps: [
          { title: "Fill in your guide", text: "Everything in Wi-Fi, check-in, house rules, contact and your recommendations is already part of what it knows." },
          { title: "Add notes for the concierge", text: "In Content, open “Notes for the AI concierge” and write what guests ask you: where the extra towels are, how the coffee machine works, which bin is for recycling, how to get a taxi." },
          { title: "Ask it yourself", text: "Open your guide, ask a few real guest questions in different languages, and add a note for anything it could not answer." }
        ]
      },
      {
        h2: "Included, not an add-on",
        paragraphs: [
          "The AI concierge is part of the single StayNest plan: €20 per year after a 7-day free trial without a card. There is no per-message charge for hosts. To keep the service fair for everyone, the number of questions per guest and per guide is limited over short periods."
        ]
      }
    ],
    faq: [
      { q: "Which languages does it answer in?", a: "It replies in the language the guest writes in. The guide around it is available in English, German, French, Italian, Spanish and Dutch." },
      { q: "What happens if it does not know the answer?", a: "It tells the guest it does not have that detail and suggests contacting you. Your phone and WhatsApp buttons are in the guide." },
      { q: "Can it see my guest messages on Airbnb or Booking.com?", a: "No. It only uses the content of your StayNest guide and the notes you add for it." },
      { q: "Do guests need to log in?", a: "No. Guests tap the concierge button in the guide and type their question." },
      { q: "Is it included in the price?", a: "Yes. The guide, the QR code and the AI concierge are all part of the €20 yearly plan." }
    ],
    related: [
      { label: "How to reduce repetitive guest questions", href: "/guides/reduce-guest-questions" },
      { label: "Vacation rental house manual template", href: "/guides/house-manual-template" },
      { label: "Local recommendations for guests", href: "/guides/local-recommendations-guide" },
      { label: "QR code guest guide", href: "/qr-code-guest-guide" }
    ]
  }
};
