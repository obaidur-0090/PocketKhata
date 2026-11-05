# PocketKhata

A responsive digital ledger for small businesses, built with React, Vite, Tailwind CSS, DaisyUI, React Router, Recharts, and Firebase Authentication.

## Run locally

```sh
npm install
npm run dev
```

Without Firebase settings, the app runs in demo mode: admin sign-in accepts a non-empty email and password, and the customer portal uses the seeded customer email plus its 8-digit access key. Demo data and sessions are stored in the browser's local storage.

## Firebase Authentication

1. Create a Firebase project and enable Email/Password and Google providers in Authentication.
2. Copy `.env.example` to `.env` and set `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, and `VITE_FIREBASE_APP_ID`.
3. Restart the Vite development server.

Firebase config values are public client configuration, not server secrets. Restrict the Firebase API key to the intended services and configure Firebase Authentication authorized domains before deployment. Admin accounts are Firebase accounts; customer data is currently browser-local demo data and needs a trusted backend before multi-device or production use.

## Main routes

- `/` — product landing page
- `/admin/login` — admin sign-in with email or Google, Firebase account creation, and password reset
- `/admin` — admin dashboard and due chart
- `/admin/users` — customer search, balance filters, profile edits, per-customer history with editable transactions, dated due/payment updates, and deletion
- `/admin/transactions` — transaction history
- `/customer/login` — customer sign-in with an 8-digit access key
- `/customer` — read-only account history and payment options
