# StayNest

StayNest is a production-ready MVP SaaS for rental and villa owners. Owners create a branded digital guest guide for a property, then guests open it through a QR code or public link.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- QR code generation
- Vercel-ready structure

## MVP Features

- Landing page with product positioning and €15/property/month pricing
- Admin-provisioned owner accounts
- Email/password login with secure HTTP-only session cookies
- First-login forced password change for temporary passwords
- Forgot/reset password structure with email reset links
- Password hashing with Node crypto `scrypt`
- Middleware protection for dashboard/admin routes
- Role-based access: `ADMIN` and `OWNER`
- Admin dashboard for creating/editing/deleting users and properties
- Image upload cards for property logo, cover image and recommendation images
- Logo URL, cover image URL, property name, slug and accent color customization
- Wi-Fi, check-in, check-out, parking, house rules and emergency contact fields
- Local recommendations
- Review links for Google, Booking and Airbnb
- Public mobile-first guest guide at `/stay/[slug]`
- QR code for the public guest guide URL
- Future AI placeholders: Translate with AI, Improve text with AI, Generate guest answer
- Seed example property: Example Stay

## Example Logins

After running the seed script, use:

```text
Admin email: admin@staynest.app
Admin password: Admin123!

Owner email: example-host@staynest.site
Owner temporary password: Owner123!
```

The seeded owner must change password on first login.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Set `DATABASE_URL` in `.env` to your PostgreSQL database.

4. Run the database migration:

```bash
npx prisma migrate dev
```

5. Seed the example stay:

```bash
npm run seed
```

6. Start the dev server:

```bash
npm run dev
```

Open:

- Landing page: `http://localhost:3000`
- Login: `http://localhost:3000/login`
- Admin: `http://localhost:3000/admin`
- Dashboard: `http://localhost:3000/dashboard`
- Example guide: `http://localhost:3000/stay/example-stay`

## Account Creation

Public self-registration is disabled for the MVP. A platform admin creates owner accounts from `/admin` with:

- Name
- Email
- Temporary password
- Role

The owner logs in with the temporary password and must change it before dashboard access.

Password rules:

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

## Password Reset

Forgot/reset password is available at `/forgot-password`. If SMTP variables are empty in local development, StayNest prints the reset email and link in the dev server terminal.

To send real reset email, add SMTP credentials:

```bash
SMTP_HOST="smtp.your-provider.com"
SMTP_PORT="587"
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-password"
EMAIL_FROM="StayNest <hello@your-domain.com>"
```

## Image Uploads

StayNest supports direct image uploads for:

- Property logo
- Property cover image
- Recommendation image

Uploads accept JPG, PNG and WEBP files up to 5MB. The dashboard also keeps a fallback field where you can paste an image URL if uploads are not configured yet.

For Vercel, configure Cloudinary:

1. Create a Cloudinary account.
2. Copy your cloud name, API key and API secret.
3. Add these env variables locally and in Vercel:

```bash
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
CLOUDINARY_UPLOAD_FOLDER="staynest"
```

Uploaded image URLs are stored in PostgreSQL and used automatically on the public guest guide.

## Guest AI Assistant

StayNest can show a property-specific guest chat on each public guide. Add these environment variables locally and in Vercel:

```bash
OPENAI_API_KEY=""
OPENAI_MODEL="gpt-5-mini"
```

Hosts and admins can add extra AI assistant knowledge per property. The assistant uses the property guide fields, recommendations, review links and those extra notes. If `OPENAI_API_KEY` is empty, the chat asks guests to contact the host instead.

## Social Login

Google and Apple login are disabled for the MVP. The app keeps disabled route stubs that redirect back to login with a clear message.

## Online PostgreSQL Setup

StayNest uses Prisma with PostgreSQL. For production, use a hosted PostgreSQL database and a pooled connection string when the provider offers one, especially on serverless hosting.

Recommended production flow:

1. Create a PostgreSQL database with Neon, Supabase, Prisma Postgres, Vercel Marketplace storage or another hosted PostgreSQL provider.
2. Copy the production connection string.
   - Prefer a pooled connection string for the app runtime.
   - Keep the direct connection string available for migrations if your provider recommends that.
3. Add these environment variables in your hosting dashboard:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SITE_URL=https://staynest.site`
   - `NEXT_PUBLIC_APP_URL=https://app.staynest.site`
   - `NEXT_PUBLIC_ADMIN_URL=https://admin.staynest.site`
   - `SESSION_COOKIE_DOMAIN=.staynest.site`
4. Run Prisma migration against production from a secure terminal:

```bash
npm run db:deploy
```

5. Optional: seed example/admin data only if this is a fresh production database and you want the seed users/property:

```bash
npm run seed
```

6. Build command:

```bash
npm run build
```

7. Start command:

```bash
npm run start
```

After changing production environment variables, redeploy the app so the live site uses the online database.

## Notes

Billing is intentionally lightweight in this MVP. Stripe is not integrated yet. The product is structured so Stripe checkout, AI translation and an AI guest assistant can be added later without changing the core guest guide model.
