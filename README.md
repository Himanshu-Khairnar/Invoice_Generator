# BillPartner — Invoice Generator

A modern, full-featured invoice management platform built with Next.js 16. Create, send, and track invoices with ease.

![BillPartner](public/invoice-logo.svg)

## Features

- **Invoice Management** — Create, edit, and manage invoices with multiple line items, tax slabs, and discounts
- **PDF Generation** — Generate and download professional PDF invoices using `@react-pdf/renderer`
- **Email Delivery** — Send invoices directly to clients via Nodemailer
- **Client Management** — Track clients with aggregated stats (total invoiced, unpaid balance, draft count)
- **Item Catalog** — Maintain a reusable product/service catalog with usage tracking
- **Payment Tracking** — Mark invoices as paid, track due amounts and balance
- **OTP Authentication** — Passwordless sign-in via email OTP
- **Google OAuth** — One-click sign-in with Google
- **Dark / Light Mode** — Full theme support via CSS variables
- **Dashboard Analytics** — Charts for revenue, invoices, and client activity (Recharts)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animation | Framer Motion |
| Database | MongoDB + Mongoose 9 |
| Auth | JWT + bcryptjs + Google OAuth |
| Email | Nodemailer |
| PDF | @react-pdf/renderer |
| Forms | React Hook Form + Zod |
| Charts | Recharts |

## Project Structure

```
invoice-generator/
├── app/
│   ├── (auth)/          # Login & Register pages
│   ├── (site)/          # Protected app pages
│   │   ├── homepage/    # Dashboard
│   │   ├── invoices/    # Invoice list & detail
│   │   ├── client/      # Client management
│   │   ├── items/       # Product catalog
│   │   └── settings/    # Business profile & settings
│   ├── api/             # API routes
│   │   ├── auth/        # Login, logout, Google OAuth, OTP
│   │   ├── invoice/     # Invoice CRUD & email
│   │   ├── pay/         # Payment & pay OTP
│   │   └── userdetail/  # Business profile
│   └── pay/[id]/        # Public payment page
├── components/
│   ├── Invoice/         # Invoice form, table, detail view
│   ├── Client/          # Client dialog
│   ├── Dashboard/       # Analytics charts
│   ├── Layout/          # Sidebar, theme switcher
│   ├── Settings/        # Business profile form
│   └── Shared/          # Reusable table component
├── models/              # Mongoose schemas
├── services/            # API service functions
├── types/               # TypeScript interfaces
└── lib/                 # PDF generation, mailer, OTP utils
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)
- MongoDB instance (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/Himanshu-Khairnar/Invoice_Generator.git
cd Invoice_Generator

# Install dependencies
pnpm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/invoice-generator

# JWT
JWT_SECRET=your_jwt_secret_key

# App URL (used for OAuth callback and email links)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
pnpm build
pnpm start
```

## Authentication

BillPartner supports three sign-in methods:

1. **Email + Password** — Traditional credential-based login
2. **Email OTP** — Passwordless one-time code sent to your inbox
3. **Google OAuth** — Sign in with your Google account

## Invoice Workflow

1. Create an invoice and add line items from your catalog or manually
2. Set tax slabs, discounts, and due date
3. Send the invoice to your client via email (PDF attached)
4. Client can view the invoice on the public payment page
5. Mark as paid once payment is received

## Deployment

Deploy on [Vercel](https://vercel.com) with zero configuration:

```bash
vercel
```

Make sure to add all environment variables in your Vercel project settings.

---

Built by [Himanshu Khairnar](https://github.com/Himanshu-Khairnar)
