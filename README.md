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

Copy [`.env.example`](.env.example) and set real values in your environment (or a local `.env` via your process manager — `.env` is gitignored).

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection string (**required**) |
| `JWT_SECRET` | JWT signing secret (**required**) |
| `TLS_CERT_PATH` / `TLS_KEY_PATH` | HTTPS cert/key paths (defaults under `middlewares/`; keep real `*.pem` out of git) |
| `PORT` | Listen port (default **8443**) |
| `PAYTM_MID` / `PAYTM_MERCHANT_KEY` | Paytm merchant credentials |
| `TWO_FACTOR_API_KEY` | 2factor.in OTP API key |
| `BULKSMS_AUTH_KEY` | BulkSMS Blaze auth key |
| `ORDER_ID_SCRAMBLER` / `TRIP_ID_SCRAMBLER` | Format-preserving ID scramblers |

Rotate any credentials that were ever committed historically; treat them as burned.

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
