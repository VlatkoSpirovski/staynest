export type GuideSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  steps?: string[];
  template?: string;
};

export type GuideArticle = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  category: string;
  updated: string;
  readMinutes: number;
  intro: string[];
  sections: GuideSection[];
  faq: { question: string; answer: string }[];
  related: string[];
};

export const GUIDES_UPDATED = "2026-11-13";

export const guides: GuideArticle[] = [
  {
    slug: "airbnb-welcome-book",
    title: "Airbnb welcome book: what to include, with a free template",
    metaTitle: "Airbnb Welcome Book: What to Include (Free Template)",
    description:
      "What to put in an Airbnb welcome book, in which order, and a copy-ready template. Covers Wi-Fi, check-in, house rules, local tips, checkout and emergencies.",
    category: "Guest guide",
    updated: GUIDES_UPDATED,
    readMinutes: 7,
    intro: [
      "A welcome book answers your guests' questions before they message you. A good one is short where guests need speed (Wi-Fi, door code, parking) and detailed where they need confidence (house rules, checkout, emergencies).",
      "This guide lists what to include, the order that works best, and a template you can copy into a printed folder or a digital guide."
    ],
    sections: [
      {
        heading: "Start with what guests need in the first ten minutes",
        paragraphs: [
          "Guests open a welcome book right after arrival, usually tired and with luggage. Put the answers to their first questions on the first page, before any welcome message or history of the house."
        ],
        list: [
          "Wi-Fi network name and password",
          "How to get in: key box, smart lock or meeting point",
          "Where to park and whether it costs anything",
          "Your phone number and when you answer",
          "Check-out time"
        ]
      },
      {
        heading: "Then the things that prevent problems",
        paragraphs: [
          "Most negative reviews come from small surprises, not big failures: a heater nobody could switch on, rubbish nobody knew where to take, a quiet-hours rule that was never mentioned. Explain those clearly and neutrally."
        ],
        list: [
          "House rules: quiet hours, smoking, parties, pets, extra guests",
          "Heating, air conditioning and hot water: one or two lines each",
          "Kitchen appliances that are not obvious (induction hob, coffee machine)",
          "Rubbish and recycling: what goes where, and collection days",
          "What to do if something breaks"
        ]
      },
      {
        heading: "Local tips that guests actually use",
        paragraphs: [
          "Guests trust a host's personal picks more than a search engine. Keep it to a few places per category and add one sentence on why you recommend each one."
        ],
        list: [
          "Restaurants and cafés, ideally with one walkable option",
          "Supermarket, pharmacy and cash machine",
          "Beaches, viewpoints, walks or day trips",
          "Taxi or public transport tips"
        ]
      },
      {
        heading: "Checkout and the review moment",
        paragraphs: [
          "Close the book with a simple checkout list and a friendly thank-you. If you want reviews, make it easy: one direct link to your listing or Google profile. Do not offer gifts or discounts in exchange for reviews; Airbnb and Booking.com do not allow incentivised reviews."
        ]
      },
      {
        heading: "Copy-ready welcome book template",
        template: `WELCOME TO [PROPERTY NAME]

FIRST THINGS FIRST
Wi-Fi: [network] / Password: [password]
Getting in: [key box location and code, or smart lock steps]
Parking: [where, free or paid]
Your host: [name], [phone], answers [hours]
Check-out: [time]

HOUSE RULES
Quiet hours: [from]–[to]
Smoking: [allowed where / not allowed]
Pets / parties / extra guests: [rules]

HOW THINGS WORK
Heating / AC: [one line]
Hot water: [one line]
Kitchen: [anything not obvious]
Rubbish: [where, collection days]

OUR FAVOURITE PLACES
Eat: [place] – [why]
Shop: [supermarket, pharmacy]
Do: [beach, walk, day trip]

IN AN EMERGENCY
Emergency number: 112
Nearest hospital: [name, address]
Host: [phone]

BEFORE YOU LEAVE
[ ] Dishes in the dishwasher
[ ] Rubbish out
[ ] Windows closed, lights off
[ ] Keys back in [place]

Thank you for staying with us! If you enjoyed it, a review helps us a lot: [link]`
      },
      {
        heading: "Printed folder or digital guide?",
        paragraphs: [
          "A printed folder works without a phone but goes out of date the moment your Wi-Fi password or a restaurant changes. A digital guide behind a QR code can be updated in seconds, works in the guest's language and can sit next to a printed one-page summary."
        ]
      }
    ],
    faq: [
      {
        question: "How long should an Airbnb welcome book be?",
        answer: "Short enough to scan. Put the essentials on one page and keep each topic to a few lines. Guests rarely read long text, but they do come back to find one specific answer."
      },
      {
        question: "Should I include the Wi-Fi password in the welcome book?",
        answer: "Yes. It is the most common question guests ask. If you worry about the password being shared, change it between seasons and update the guide; a digital guide makes that a one-minute job."
      },
      {
        question: "Can I ask guests for a review in the welcome book?",
        answer: "You can thank guests and share a link to your listing. Do not offer anything in exchange for a review or ask only happy guests to review, because Airbnb and Booking.com prohibit incentivised or selective review requests."
      }
    ],
    related: ["house-manual-template", "check-in-instructions-template", "get-more-airbnb-reviews"]
  },
  {
    slug: "house-manual-template",
    title: "Vacation rental house manual: a complete template",
    metaTitle: "Vacation Rental House Manual Template (Copy & Use)",
    description:
      "A complete house manual template for holiday rentals and villas: appliances, heating, safety, house rules and checkout, with tips to keep it short and easy to update.",
    category: "Templates",
    updated: GUIDES_UPDATED,
    readMinutes: 6,
    intro: [
      "A house manual explains how your property works. Where a welcome book greets guests, the manual is the reference they open when they cannot find the light switch for the terrace or the dishwasher shows an error.",
      "Use the template below as a checklist. Remove anything that does not apply to your property; an empty section is better than a vague one."
    ],
    sections: [
      {
        heading: "Organise it by room, not by topic",
        paragraphs: [
          "Guests look for answers where they stand. Grouping by room (entrance, kitchen, bathroom, bedrooms, outdoor) makes the manual faster to use than one long list of appliances."
        ]
      },
      {
        heading: "Write each instruction as one action",
        paragraphs: [
          "Instead of a paragraph about the heating system, write the steps a guest needs. If a photo of a control panel saves a sentence, use the photo."
        ],
        steps: [
          "Name the appliance and where it is.",
          "Write the 2–4 steps to use it.",
          "Add the one mistake guests usually make.",
          "Say who to contact if it still does not work."
        ]
      },
      {
        heading: "Safety information belongs in every manual",
        list: [
          "Emergency number (112 in Europe) and the property's full address",
          "Location of the fire extinguisher, first-aid kit and main water tap",
          "Fuse box location and how to reset it",
          "Pool, balcony or stair safety notes if relevant",
          "Nearest hospital and pharmacy"
        ]
      },
      {
        heading: "House manual template",
        template: `HOUSE MANUAL – [PROPERTY NAME]
Address: [full address]

ENTRANCE
Door / lock: [steps]
Lights: [where the switches are]
Fuse box: [location, how to reset]

KITCHEN
Hob / oven: [steps]
Dishwasher: [tablets location, program to use]
Coffee machine: [steps]
Rubbish & recycling: [bins, collection days]

LIVING ROOM
TV / streaming: [steps, which remote]
Heating / AC: [steps, recommended setting]

BATHROOM
Hot water: [how it works, how long to heat]
Towels: [where, when they are changed]

BEDROOMS
Extra blankets / pillows: [location]

OUTDOOR
Terrace / garden / pool: [rules, lights, safety]
BBQ: [allowed? where is the gas / charcoal]

SAFETY
Emergency: 112
Fire extinguisher: [location]
First-aid kit: [location]
Main water tap: [location]
Nearest hospital: [name, address]

CHECKOUT
[Checkout steps and time]

Questions? [host name], [phone]`
      },
      {
        heading: "Keep it current",
        paragraphs: [
          "Every time a guest asks you a question that the manual should have answered, add the answer. After a season, your manual covers almost everything, and you answer far fewer messages."
        ]
      }
    ],
    faq: [
      {
        question: "What is the difference between a house manual and a welcome book?",
        answer: "A welcome book covers the essentials and local tips for the first hours of a stay. A house manual is the detailed reference for how the property works. Many hosts combine both in one digital guide with separate sections."
      },
      {
        question: "Where should I keep the house manual?",
        answer: "Somewhere guests find it without asking: a printed copy in the kitchen, and a QR code at the entrance that opens the digital version on their phone."
      }
    ],
    related: ["airbnb-welcome-book", "house-rules-template", "digital-guest-guide"]
  },
  {
    slug: "check-in-instructions-template",
    title: "Check-in instructions for guests: template and examples",
    metaTitle: "Check-in Instructions Template for Airbnb & Booking.com",
    description:
      "Clear self check-in instructions for holiday rentals: what to send and when, a step-by-step template for key boxes and smart locks, and how to avoid late-night calls.",
    category: "Templates",
    updated: GUIDES_UPDATED,
    readMinutes: 5,
    intro: [
      "Check-in is the moment a stay can go wrong first. Guests arrive tired, sometimes at night, often with no mobile data. Instructions that work at 11 pm in the rain are the goal.",
      "Here is what to include, when to send it, and a template you can adapt."
    ],
    sections: [
      {
        heading: "Send it at the right time",
        list: [
          "With the booking confirmation: address, check-in time and how check-in works in one sentence",
          "Two or three days before arrival: the full step-by-step instructions",
          "On the arrival day: a short reminder with the door code and your phone number"
        ]
      },
      {
        heading: "Write steps a stranger can follow",
        paragraphs: [
          "Imagine someone who has never been to your street. Name landmarks, not just street numbers. Mention the gate, the floor, the colour of the door. If there is a tricky part (a lock that needs a push, a hidden key box), say so explicitly."
        ]
      },
      {
        heading: "Self check-in template",
        template: `CHECK-IN – [PROPERTY NAME]

Address: [full address]
Map pin: [link]
Check-in from: [time]

1. Parking: [where to park, free or paid]
2. Find the entrance: [landmark, gate, colour of the door]
3. Key box: [exact location], code [code]
   (Push the button down firmly after entering the code.)
4. Apartment: [floor], door [number or description]
5. Wi-Fi: [network] / [password]

Arriving late or lost? Call or message [name] on [phone].`
      },
      {
        heading: "Add a plan B",
        paragraphs: [
          "Batteries die and codes get mistyped. Tell guests what to do if the key box or smart lock fails: a second code, a neighbour, or a phone number that is answered at night."
        ]
      },
      {
        heading: "Make it available offline",
        paragraphs: [
          "Ask guests to save the instructions before travelling, or put the key steps in a message they can screenshot. A digital guide link they open once at home stays in their browser history for arrival."
        ]
      }
    ],
    faq: [
      {
        question: "Should I send the door code before arrival?",
        answer: "Most hosts send it on the arrival day or the day before. Many smart locks can generate a code that only works during the stay, which is safer than a permanent code."
      },
      {
        question: "How do I reduce late-night calls from guests?",
        answer: "Send step-by-step instructions with photos or landmarks, include a plan B, and put Wi-Fi, parking and the door steps in one guide the guest can open at any time."
      }
    ],
    related: ["airbnb-welcome-book", "wifi-qr-code-for-guests", "house-manual-template"]
  },
  {
    slug: "wifi-qr-code-for-guests",
    title: "How to share your Wi-Fi with guests using a QR code",
    metaTitle: "Wi-Fi QR Code for Guests: How to Make One (Free)",
    description:
      "Let guests join your Wi-Fi by scanning a QR code: how Wi-Fi QR codes work, how to create one for free without sharing your password online, and where to place it.",
    category: "Wi-Fi",
    updated: GUIDES_UPDATED,
    readMinutes: 4,
    intro: [
      "“What is the Wi-Fi password?” is the question hosts hear most. A Wi-Fi QR code lets guests connect by pointing their camera at it: no typing, no mistakes with similar-looking characters.",
      "You can create one in a minute with our free Wi-Fi QR code generator, which runs entirely in your browser."
    ],
    sections: [
      {
        heading: "How a Wi-Fi QR code works",
        paragraphs: [
          "A Wi-Fi QR code contains your network name, password and security type in a standard format that the camera apps on current iPhones and Android phones recognise. Scanning it shows a “Join network” prompt."
        ],
        template: "WIFI:T:WPA;S:YourNetworkName;P:YourPassword;;"
      },
      {
        heading: "Create one safely",
        steps: [
          "Open the free StayNest Wi-Fi QR code generator.",
          "Enter your network name exactly as it appears, including capitals.",
          "Enter the password and choose the security type (usually WPA/WPA2).",
          "Download the QR code and print it.",
          "Test it with an iPhone and an Android phone before guests arrive."
        ],
        paragraphs: [
          "Our generator creates the code in your browser, so your password is never sent to a server."
        ]
      },
      {
        heading: "Where to put it",
        list: [
          "Next to the router, so guests find it when the signal drops",
          "On the fridge or the inside of the entrance door",
          "In your welcome book or digital guest guide",
          "On the bedside table in larger properties"
        ]
      },
      {
        heading: "When you change the password",
        paragraphs: [
          "A printed Wi-Fi QR code stops working when you change the password, so print a new one at the same time. If your guests open a digital guide through a separate QR code, you only update the Wi-Fi details in the guide and the printed code stays the same."
        ]
      }
    ],
    faq: [
      {
        question: "Do guests need an app to scan a Wi-Fi QR code?",
        answer: "No. The built-in camera on current iPhones and most Android phones recognises Wi-Fi QR codes and offers to join the network."
      },
      {
        question: "Is it safe to put my Wi-Fi password in a QR code?",
        answer: "The QR code contains the password in readable form, so treat it like the password itself: keep it inside the property. Use a separate guest network if your router supports it."
      },
      {
        question: "Why does my Wi-Fi QR code not work?",
        answer: "Usually the network name or password has a typo, different capitals or a trailing space, or the security type is wrong. Generate it again with the exact values and test it on two phones."
      }
    ],
    related: ["check-in-instructions-template", "airbnb-welcome-book", "digital-guest-guide"]
  },
  {
    slug: "get-more-airbnb-reviews",
    title: "How to get more 5-star reviews on Airbnb and Booking.com",
    metaTitle: "How to Get More 5-Star Reviews on Airbnb & Booking.com",
    description:
      "Practical, rule-compliant ways for hosts to earn more 5-star reviews: remove small frustrations, answer questions before they are asked, and make the review step easy.",
    category: "Reviews",
    updated: GUIDES_UPDATED,
    readMinutes: 6,
    intro: [
      "Reviews decide how often your listing is shown and booked. You cannot buy them and you should not pressure guests, but you can remove the reasons a good stay ends with four stars instead of five.",
      "These are the habits that consistently make the difference."
    ],
    sections: [
      {
        heading: "Most lost stars come from small frustrations",
        paragraphs: [
          "Guests rarely downgrade a stay because of one big problem that you fixed quickly. They downgrade because of friction: unclear arrival, a slow reply, Wi-Fi that did not connect, no idea where the rubbish goes. Each answer you give before the question is asked protects your rating."
        ]
      },
      {
        heading: "Answer the top questions before arrival",
        list: [
          "How do I get in, and what if I arrive late?",
          "Where can I park?",
          "What is the Wi-Fi password?",
          "Where can I eat nearby?",
          "What do I need to do at checkout?"
        ],
        paragraphs: [
          "Put these answers in one place guests can open on their phone. A guide behind a QR code at the entrance means guests find answers even when you are asleep."
        ]
      },
      {
        heading: "Be reachable, and say when",
        paragraphs: [
          "Guests forgive a lot if they know when you will reply. State your response hours in your guide and messages. For questions outside those hours, an AI assistant that only uses your property's information can answer the routine ones."
        ]
      },
      {
        heading: "Make the review step easy, not pushy",
        paragraphs: [
          "At the end of a stay, a short thank-you message with a direct link to your listing or Google profile removes friction. Ask every guest the same way. Airbnb and Booking.com do not allow offering incentives for reviews or asking only guests you expect to be happy."
        ]
      },
      {
        heading: "Use reviews as a to-do list",
        paragraphs: [
          "Read every review, including the good ones, for small complaints. If two guests mention the same thing, fix it and add a line to your guide. Reply to reviews briefly and politely; future guests read your replies too."
        ]
      }
    ],
    faq: [
      {
        question: "Is it allowed to ask guests for a review?",
        answer: "Yes, you can ask politely and share a link. You may not offer money, discounts or gifts in exchange, and you should not ask only the guests you expect to leave good reviews."
      },
      {
        question: "When is the best time to ask for a review?",
        answer: "Shortly after checkout, while the stay is fresh. A friendly message with a direct link works better than a long request."
      },
      {
        question: "How do I get Google reviews for my holiday rental?",
        answer: "Create a Google Business Profile for the property if it is eligible, copy its review link, and add it next to your Airbnb or Booking.com link in your thank-you message and guest guide."
      }
    ],
    related: ["airbnb-welcome-book", "digital-guest-guide", "local-recommendations-guide"]
  },
  {
    slug: "house-rules-template",
    title: "House rules for holiday rentals: examples and template",
    metaTitle: "Airbnb House Rules Template & Examples",
    description:
      "How to write house rules for an Airbnb, Booking.com listing or villa that guests respect: what to cover, friendly wording, and a copy-ready template.",
    category: "Templates",
    updated: GUIDES_UPDATED,
    readMinutes: 4,
    intro: [
      "Good house rules protect your property and your neighbours without making guests feel unwelcome. The trick is to be clear, specific and brief, and to explain the reason when it is not obvious.",
      "Make sure the rules in your guide match the rules on your listing, so guests are never surprised."
    ],
    sections: [
      {
        heading: "What house rules should cover",
        list: [
          "Quiet hours and noise",
          "Smoking and vaping, including balconies",
          "Parties and events",
          "Maximum number of guests and visitors",
          "Pets",
          "Check-in and check-out times",
          "Rubbish, recycling and energy use",
          "Pool, garden or terrace rules"
        ]
      },
      {
        heading: "Friendly wording that still works",
        paragraphs: [
          "Explain the why in a few words: “Quiet hours are 22:00–08:00 because our neighbours have small children” is respected more often than “NO NOISE AFTER 22:00”. Avoid capital letters and threats; keep consequences factual and in line with your listing."
        ]
      },
      {
        heading: "House rules template",
        template: `HOUSE RULES – [PROPERTY NAME]

Check-in from [time] · Check-out by [time]
Maximum [number] guests. Visitors: [rule]

Quiet hours [from]–[to]. Please keep music and voices low on the terrace in the evening.
No smoking inside. [Smoking is allowed on / not allowed on] the balcony.
No parties or events.
Pets: [allowed / not allowed / on request].
Please separate rubbish: [how and where].
Please switch off the AC when windows are open and when you go out.
Pool: [hours, children supervised, no glass].

Thank you for treating our home like your own.`
      }
    ],
    faq: [
      {
        question: "Where should I show my house rules?",
        answer: "On your listing before booking, in your check-in message, and in your guest guide so guests can check them during the stay."
      },
      {
        question: "Can my house rules differ from my Airbnb listing?",
        answer: "They should not. Guests agree to the rules on the listing when they book, so keep your guide consistent with it."
      }
    ],
    related: ["house-manual-template", "airbnb-welcome-book", "check-in-instructions-template"]
  },
  {
    slug: "local-recommendations-guide",
    title: "Local recommendations for guests: how to write them",
    metaTitle: "Local Recommendations for Airbnb Guests: How to Write Them",
    description:
      "How hosts can write local recommendations guests actually use: how many to include, what to say about each place, categories that matter and how to keep them current.",
    category: "Guest guide",
    updated: GUIDES_UPDATED,
    readMinutes: 4,
    intro: [
      "Local tips are the part of a guest guide that makes a stay feel personal. Guests can search a map themselves; what they value is your judgement: where you would take a friend.",
      "A short, honest list beats a long one copied from a travel site."
    ],
    sections: [
      {
        heading: "Pick a few per category",
        paragraphs: [
          "Three to five places per category is enough. More than that and guests stop reading. Cover different budgets and at least one option within walking distance."
        ],
        list: [
          "Breakfast and coffee",
          "Lunch and dinner",
          "Supermarket, bakery and pharmacy",
          "Beaches, parks, viewpoints and walks",
          "Day trips and activities",
          "Getting around: taxi, bus, bike rental"
        ]
      },
      {
        heading: "Say why, in one sentence",
        paragraphs: [
          "“Best grilled fish in town, ask for the table by the water” tells guests more than a star rating. Mention practical details guests care about: whether to book ahead, cash only, closed on Mondays, child-friendly."
        ]
      },
      {
        heading: "Mark the essentials",
        paragraphs: [
          "Separate essentials (pharmacy, supermarket, hospital, cash machine) from leisure tips. When something goes wrong, guests should find the pharmacy in seconds, not scroll past restaurant tips."
        ]
      },
      {
        heading: "Keep them current",
        paragraphs: [
          "Restaurants close and opening hours change. Review your list at the start of each season and remove anything you would not recommend today. In a digital guide, a change is visible to the next guest immediately."
        ]
      }
    ],
    faq: [
      {
        question: "How many recommendations should I include?",
        answer: "Around three to five per category, with at least one walkable option. Quality and a one-line reason matter more than quantity."
      },
      {
        question: "Should I include places that pay me a commission?",
        answer: "Only recommend places you genuinely like, and be transparent if you have a business relationship. Guests notice when tips feel like adverts."
      }
    ],
    related: ["airbnb-welcome-book", "get-more-airbnb-reviews", "digital-guest-guide"]
  },
  {
    slug: "digital-guest-guide",
    title: "Digital guest guide vs printed welcome book",
    metaTitle: "Digital Guest Guide vs Printed Welcome Book for Hosts",
    description:
      "Should you use a digital guest guide, a printed welcome book or both? A practical comparison for holiday rental hosts: updates, languages, cost and guest experience.",
    category: "Guest guide",
    updated: GUIDES_UPDATED,
    readMinutes: 5,
    intro: [
      "Printed welcome folders have been the standard for years. Digital guides behind a QR code are now common too. Both can work; the right choice depends on how often your information changes and who your guests are.",
      "Here is an honest comparison."
    ],
    sections: [
      {
        heading: "Where a printed welcome book still wins",
        list: [
          "Works without a phone or internet connection",
          "Feels personal when it is well designed",
          "Good for guests who prefer paper"
        ]
      },
      {
        heading: "Where a digital guide wins",
        list: [
          "Update the Wi-Fi password or a restaurant tip in seconds, for every future guest",
          "Guests can open it before arrival, for check-in and parking",
          "Can show content in the guest's language",
          "Links open maps, phone numbers and review pages directly",
          "No reprinting and no worn-out folders"
        ]
      },
      {
        heading: "The combination most hosts end up with",
        paragraphs: [
          "Many hosts keep one printed page with the essentials (Wi-Fi, door, emergency number, the QR code) and put everything else in a digital guide. The printed page answers the first questions; the QR code opens the full guide."
        ]
      },
      {
        heading: "What to look for in a digital guest guide",
        list: [
          "Opens in the browser: guests do not need to install an app",
          "Works well on a small phone screen",
          "Easy to edit without design skills",
          "The QR code stays the same when you change content",
          "Clear pricing without per-guest fees"
        ]
      },
      {
        heading: "How StayNest fits in",
        paragraphs: [
          "StayNest is a digital guest guide built for this combination: import the basics from your listing link, add Wi-Fi, check-in, house rules, local tips and review links, then print one QR code. Guests can also ask an AI chat that answers only from your property's information. It costs EUR 20 per year after a 7-day free trial without a card."
        ]
      }
    ],
    faq: [
      {
        question: "Do guests actually use digital guest guides?",
        answer: "Guests use whatever answers their question fastest. A QR code at the entrance and the guide link in your check-in message make the digital guide the fastest option."
      },
      {
        question: "What if a guest has no mobile data?",
        answer: "Put the Wi-Fi details on a printed page or a Wi-Fi QR code, so the guest can connect first and then open the digital guide."
      }
    ],
    related: ["airbnb-welcome-book", "wifi-qr-code-for-guests", "house-manual-template"]
  }
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug) ?? null;
}
