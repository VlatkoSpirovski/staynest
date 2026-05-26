export const examplePublicGuide = {
  slug: "example-stay",
  name: "Example Stay",
  logoUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=400&auto=format&fit=crop",
  coverImageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop",
  accentColor: "#4a8a8f",
  templateId: "classic",
  designSerif: false,
  designRounded: true,
  welcomeMessage:
    "Welcome to Example Stay. We are happy to host you and hope your stay feels calm, private and effortless. This guide includes everything you need for arrival, Wi-Fi, house rules and our favorite nearby places.",
  wifiName: "Example Guest",
  wifiPassword: "Stay2026!",
  checkInInfo: "Check-in is from 15:00. The key box is next to the main gate. Your access code will be sent before arrival.",
  checkOutInfo: "Check-out is by 10:00. Please close all windows, turn off the AC and leave the keys in the key box.",
  parkingInfo: "Private parking is available inside the property gate for two cars.",
  houseRules:
    "Quiet hours are from 22:00 to 08:00. Smoking is allowed only outdoors. Please do not move indoor furniture outside and report any accidental damage early.",
  emergencyInfo:
    "Emergency number: 112. Nearest pharmacy: City Pharmacy, 8 minutes by car. For urgent property issues call your host.",
  hostContactName: "Example Host",
  hostPhone: "+389 70 000 000",
  hostEmail: "example-host@staynest.site",
  aiKnowledge:
    "Pool towels are in the hallway cabinet. Extra blankets are in the bedroom wardrobe. The nearest supermarket is a short drive away. If guests need anything not listed, they should contact the host.",
  guideSections: [
    {
      id: "example-section-pool-towels",
      title: "Pool Towels",
      content: "Pool towels are in the hallway cabinet. Please leave them to dry outdoors after use."
    },
    {
      id: "example-section-host-note",
      title: "A Note From Your Host",
      content: "Settle in, open the terrace doors and make yourself at home. If anything feels unclear, message us anytime."
    }
  ],
  recommendations: [
    {
      id: "example-rec-dinner",
      title: "Old Town Dinner",
      category: "Restaurant",
      description: "A cozy local restaurant with grilled dishes, salads and Macedonian wine.",
      address: "Old Town Center",
      url: "https://maps.google.com",
      imageUrl: null,
      placeId: null,
      name: "Old Town Dinner",
      customTitle: null,
      customDescription: null,
      formattedAddress: "Old Town Center",
      latitude: null,
      longitude: null,
      googleMapsUrl: "https://maps.google.com",
      rating: 4.7,
      userRatingsTotal: 120,
      openingHours: [],
      website: null,
      phoneNumber: null,
      photoUrl: null,
      isEssential: false,
      isVisible: true
    },
    {
      id: "example-rec-pharmacy",
      title: "City Pharmacy",
      category: "Pharmacy",
      description: "Nearest pharmacy for essentials and urgent items.",
      address: "City Center",
      url: "https://maps.google.com",
      imageUrl: null,
      placeId: null,
      name: "City Pharmacy",
      customTitle: null,
      customDescription: null,
      formattedAddress: "City Center",
      latitude: null,
      longitude: null,
      googleMapsUrl: "https://maps.google.com",
      rating: 4.5,
      userRatingsTotal: 80,
      openingHours: [],
      website: null,
      phoneNumber: null,
      photoUrl: null,
      isEssential: true,
      isVisible: true
    }
  ],
  reviewLinks: [
    {
      id: "example-review-google",
      platform: "GOOGLE",
      url: "https://google.com"
    }
  ]
};

export function isExamplePublicGuide(slug: string) {
  return slug === examplePublicGuide.slug;
}
