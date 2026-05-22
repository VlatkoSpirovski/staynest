import { PrismaClient, ReviewPlatform, UserRole } from "@prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@staynest.app" },
    update: {
      name: "StayNest Admin",
      role: UserRole.ADMIN,
      passwordHash: hashPassword("Admin123!"),
      emailVerifiedAt: new Date(),
      mustChangePassword: false
    },
    create: {
      name: "StayNest Admin",
      email: "admin@staynest.app",
      role: UserRole.ADMIN,
      passwordHash: hashPassword("Admin123!"),
      emailVerifiedAt: new Date(),
      mustChangePassword: false
    }
  });

  const owner = await prisma.user.upsert({
    where: { email: "example-host@staynest.site" },
    update: {
      name: "Example Host",
      role: UserRole.OWNER,
      passwordHash: hashPassword("Owner123!"),
      emailVerifiedAt: new Date(),
      mustChangePassword: true
    },
    create: {
      name: "Example Host",
      email: "example-host@staynest.site",
      role: UserRole.OWNER,
      passwordHash: hashPassword("Owner123!"),
      emailVerifiedAt: new Date(),
      mustChangePassword: true
    }
  });

  const examplePropertyData = {
    ownerId: owner.id,
    name: "Example Stay",
    logoUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=400&auto=format&fit=crop",
    coverImageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop",
    accentColor: "#4a8a8f",
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
      "Pool towels are in the hallway cabinet. Extra blankets are in the bedroom wardrobe. The nearest supermarket is a short drive away. If guests need anything not listed, they should contact the host."
  };

  const property = await prisma.property.upsert({
    where: { slug: "example-stay" },
    update: examplePropertyData,
    create: {
      slug: "example-stay",
      ...examplePropertyData
    }
  });

  const accommodationData = {
    ownerId: owner.id,
    name: "M&M House",
    logoUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad933beb?q=80&w=400&auto=format&fit=crop",
    coverImageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
    accentColor: "#4a8a8f",
    welcomeMessage:
      "Welcome to M&M House. Settle into the living room, connect to Wi-Fi, and use this guide for arrival details, house notes and our favorite nearby spots.",
    wifiName: "MMHouse_Guest",
    wifiPassword: "mountain-2026",
    checkInInfo: "Check-in is from 15:00. The key lockbox is beside the front door. Your code will be sent before arrival.",
    checkOutInfo: "Check-out is by 10:00. Please close the terrace doors, turn off heating, and return keys to the lockbox.",
    parkingInfo: "One private parking space is available directly in front of the house.",
    houseRules: "Quiet hours are from 22:00 to 08:00. Shoes off indoors. Smoking is allowed only on the terrace.",
    emergencyInfo: "Emergency number: 112. For urgent property issues, call your host.",
    hostContactName: "M&M Hosts",
    hostPhone: "+389 70 111 222",
    hostEmail: "hello@mmhouse.stay",
    aiKnowledge:
      "Firewood is in the shed beside the terrace. Extra blankets are in the bedroom wardrobe. The nearest supermarket is 8 minutes by car."
  };

  const accommodation = await prisma.property.upsert({
    where: { slug: "accommodation" },
    update: accommodationData,
    create: {
      slug: "accommodation",
      ...accommodationData
    }
  });

  await prisma.guideSection.deleteMany({ where: { propertyId: property.id } });
  await prisma.recommendation.deleteMany({ where: { propertyId: property.id } });
  await prisma.reviewLink.deleteMany({ where: { propertyId: property.id } });

  await prisma.guideSection.createMany({
    data: [
      {
        propertyId: property.id,
        type: "WELCOME",
        title: "A Note From Your Host",
        content: "Settle in, open the terrace doors and make yourself at home. If anything feels unclear, message us anytime.",
        sortOrder: 1
      },
      {
        propertyId: property.id,
        type: "CUSTOM",
        title: "Pool Towels",
        content: "Pool towels are in the hallway cabinet. Please leave them to dry outdoors after use.",
        sortOrder: 2
      }
    ]
  });

  await prisma.recommendation.createMany({
    data: [
      {
        propertyId: property.id,
        title: "Old Town Dinner",
        category: "Restaurant",
        description: "A cozy local restaurant with grilled dishes, salads and Macedonian wine.",
        address: "Old Town Center",
        url: "https://maps.google.com",
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop",
        sortOrder: 1
      },
      {
        propertyId: property.id,
        title: "Sunset Viewpoint",
        category: "Experience",
        description: "Best reached 30 minutes before sunset. Bring water and a light jacket.",
        address: "Hill View Road",
        url: "https://maps.google.com",
        imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
        sortOrder: 2
      },
      {
        propertyId: property.id,
        title: "Morning Bakery",
        category: "Cafe",
        description: "Fresh pastries, coffee and breakfast basics within a short drive.",
        address: "Market Street 12",
        imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop",
        sortOrder: 3
      }
    ]
  });

  await prisma.reviewLink.createMany({
    data: [
      {
        propertyId: property.id,
        platform: ReviewPlatform.GOOGLE,
        url: "https://google.com"
      },
      {
        propertyId: property.id,
        platform: ReviewPlatform.BOOKING,
        url: "https://booking.com"
      },
      {
        propertyId: property.id,
        platform: ReviewPlatform.AIRBNB,
        url: "https://airbnb.com"
      }
    ]
  });

  await prisma.recommendation.deleteMany({ where: { propertyId: accommodation.id } });
  await prisma.reviewLink.deleteMany({ where: { propertyId: accommodation.id } });

  await prisma.recommendation.createMany({
    data: [
      {
        propertyId: accommodation.id,
        title: "Alpine Kitchen",
        category: "Restaurant",
        description: "Comfort food, local wine and a relaxed dinner after travel.",
        address: "Village Center",
        url: "https://maps.google.com",
        sortOrder: 1
      },
      {
        propertyId: accommodation.id,
        title: "Forest Walk",
        category: "Experience",
        description: "A gentle morning trail through pine trees, 15 minutes from the house.",
        address: "Trailhead Road",
        url: "https://maps.google.com",
        sortOrder: 2
      }
    ]
  });

  await prisma.reviewLink.createMany({
    data: [
      {
        propertyId: accommodation.id,
        platform: ReviewPlatform.GOOGLE,
        url: "https://google.com"
      }
    ]
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
