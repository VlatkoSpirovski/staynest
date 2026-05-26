import { GuideSectionType, PrismaClient, ReviewPlatform, UserRole } from "@prisma/client";
import { examplePublicGuide } from "../lib/example-public-guide";
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
    name: examplePublicGuide.name,
    logoUrl: examplePublicGuide.logoUrl,
    coverImageUrl: examplePublicGuide.coverImageUrl,
    accentColor: examplePublicGuide.accentColor,
    templateId: examplePublicGuide.templateId,
    designSerif: examplePublicGuide.designSerif,
    designRounded: examplePublicGuide.designRounded,
    welcomeMessage: examplePublicGuide.welcomeMessage,
    wifiName: examplePublicGuide.wifiName,
    wifiPassword: examplePublicGuide.wifiPassword,
    checkInInfo: examplePublicGuide.checkInInfo,
    checkOutInfo: examplePublicGuide.checkOutInfo,
    parkingInfo: examplePublicGuide.parkingInfo,
    houseRules: examplePublicGuide.houseRules,
    emergencyInfo: examplePublicGuide.emergencyInfo,
    hostContactName: examplePublicGuide.hostContactName,
    hostPhone: examplePublicGuide.hostPhone,
    hostEmail: examplePublicGuide.hostEmail,
    aiKnowledge: examplePublicGuide.aiKnowledge
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
    data: examplePublicGuide.guideSections.map((section, index) => ({
      propertyId: property.id,
      type: index === 0 ? GuideSectionType.WELCOME : GuideSectionType.CUSTOM,
      title: section.title,
      content: section.content,
      sortOrder: index + 1
    }))
  });

  await prisma.recommendation.createMany({
    data: examplePublicGuide.recommendations.map((recommendation, index) => ({
      propertyId: property.id,
      title: recommendation.title,
      category: recommendation.category,
      description: recommendation.description,
      address: recommendation.address,
      url: recommendation.url,
      imageUrl: recommendation.imageUrl,
      placeId: recommendation.placeId,
      name: recommendation.name,
      customTitle: recommendation.customTitle,
      customDescription: recommendation.customDescription,
      formattedAddress: recommendation.formattedAddress,
      latitude: recommendation.latitude,
      longitude: recommendation.longitude,
      googleMapsUrl: recommendation.googleMapsUrl,
      rating: recommendation.rating,
      userRatingsTotal: recommendation.userRatingsTotal,
      openingHours: recommendation.openingHours,
      website: recommendation.website,
      phoneNumber: recommendation.phoneNumber,
      photoUrl: recommendation.photoUrl,
      isEssential: recommendation.isEssential,
      isVisible: recommendation.isVisible,
      sortOrder: index + 1
    }))
  });

  await prisma.reviewLink.createMany({
    data: examplePublicGuide.reviewLinks.map((link) => ({
      propertyId: property.id,
      platform: link.platform as ReviewPlatform,
      url: link.url
    }))
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
