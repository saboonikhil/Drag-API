# Drag-API

HTTPS **Express** REST API for a ride-sharing style product: users, partners (admins), cabs, locations, pooled rides, payments (checksum flow), and OTP. Data is stored in **MongoDB** via **Mongoose**, with a layered layout: `routes` → `controllers` → `models`, plus `middlewares` (auth, TLS assets).

> **Security:** Use environment variables for `MONGODB_URI` and keep TLS private keys **out of git**. Rotate any credentials that were ever committed in source history.

## Stack

- Node.js + **Express** 4.x
- **MongoDB** / **Mongoose** 5.x
- **JWT** auth (`jsonwebtoken`, `jwt-simple`) — `validateRequest` applies to `/api/*`
- **Helmet**, **Morgan** + **Winston**, **bcryptjs**
- **HTTPS** on port **8443** (cert/key paths are wired in `app.js`; adjust for your deploy)

## Layout

| Path | Role |
|------|------|
| `app.js` | Express app, HTTPS server, DB connection, CORS, `/api/*` auth gate |
| `routes.js` | All HTTP routes |
| `controllers/` | Handlers (auth, users, cabs, partners, locations, payments, rides, OTP) |
| `models/` | Mongoose schemas |
| `middlewares/` | Request validation, TLS files (do not commit real keys) |
| `config/` | Winston logger, etc. |

## Prerequisites

- Node.js (LTS recommended)
- MongoDB (local or Atlas)
- TLS certificate + key if you keep HTTPS as in the current `app.js`

## Install

```bash
git clone https://github.com/saboonikhil/Drag-API.git
cd Drag-API
npm install
```

## Configuration

1. **MongoDB** — Prefer `process.env.MONGODB_URI` (or similar) in `app.js` instead of a hardcoded URI.
2. **HTTPS** — Supply cert/key paths, or terminate TLS at a reverse proxy and use HTTP internally.
3. **Port** — Default in code is **8443**.

## Run

```bash
npm start
```

Development (per `package.json`; adjust if `mongod` is not local):

```bash
npm run watch
```

## API overview

**Public-style routes** (see `app.js` + `routes.js` for exact paths and auth):

- `POST /signIn`, `POST /signUp`
- `POST /getOtp`, `POST /verifyOtp`
- `GET /locations`

**`/api/*`** (JWT validation middleware):

- Users: trips, profile, password, notifications, feedback
- Cabs: fares, availability, admin cab operations
- Partners: admin signup, partner trips
- Locations: authenticated listing
- Payments: checksum + trip creation
- Rides: create, list, join (user + admin lists)

Authoritative list: [`routes.js`](routes.js).

## Linting

ESLint (Airbnb config). Example:

```bash
npx eslint .
```

## License

See [LICENSE](LICENSE) in this repository.

## Author

Nikhil Saboo
