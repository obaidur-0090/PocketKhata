# PocketKhata

A responsive digital ledger for small businesses, built with React, Vite, Tailwind CSS, DaisyUI, React Router, Recharts, and Firebase Authentication.

## Demo
    upcomming...
## Run locally

```sh
npm install
npm run dev
```
Without Firebase settings, the app runs in demo mode: admin sign-in accepts a non-empty email and password, and the customer portal uses the seeded customer email plus its 8-digit access key. Demo data and sessions are stored in the browser's `local storage`.

## Main routes

- Product landing page
- Admin sign-in with email or Google, Firebase account creation, and password reset
- Admin dashboard and due chart
- Customer search, balance filters, profile edits, per-customer history with editable transactions, dated due/payment updates, and deletion
- Transaction history
- Customer sign-in with an 8-digit access key
- Read-only account history and payment options
