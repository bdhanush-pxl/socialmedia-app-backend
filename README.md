# Scalable Social Media Backend

A modular REST API backend for a social media platform, built with Node.js, Express, and MongoDB — featuring secure authentication and Redis-backed rate limiting for protection against abuse.

---

## ✨ Features

- **REST API** — Modular architecture organized into controllers, routes, and middleware layers for maintainability.
- **Authentication** — JWT-based authentication (`jsonwebtoken`) with `bcrypt` password hashing and cookie-based session handling (`cookie-parser`).
- **Rate Limiting** — Redis-backed API rate limiting (`express-rate-limit` + `rate-limit-redis`) to protect endpoints from abuse and improve reliability under load.
- **Media Uploads** — Image/media handling via Cloudinary and `multer`.
- **CORS-Enabled** — Configured for secure cross-origin requests.

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express 5 |
| **Database** | MongoDB with Mongoose |
| **Authentication** | JWT (jsonwebtoken), bcrypt |
| **Rate Limiting / Caching** | Redis, express-rate-limit, rate-limit-redis |
| **Media Storage** | Cloudinary, Multer |
| **Middleware** | CORS, cookie-parser |
| **Dev Tools** | Nodemon, colors |

---

## 📂 Project Structure

```
socialmedia-app-backend/
├── config/         # App & third-party service configuration (DB, Cloudinary, Redis, etc.)
├── controllers/    # Route handler logic
├── middlewares/    # Auth guards, rate limiter, error handling, upload middleware, etc.
├── models/         # Mongoose schemas/models
├── routes/         # Express route definitions
├── utils/          # Helper utilities
├── index.js        # App entry point
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm
- A MongoDB instance (local or Atlas)
- A Redis instance (local or hosted, e.g. Upstash/Redis Cloud) for rate limiting

### Installation

```bash
# Clone the repository
git clone https://github.com/bdhanush-pxl/socialmedia-app-backend.git
cd socialmedia-app-backend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=your_frontend_url
```

> Adjust variable names above to match what's actually referenced in `config/` and `middlewares/`.

### Run Locally

```bash
npm run dev
```

The API will be available at `http://localhost:5000` (or your configured `PORT`) by default.

> Note: `npm run dev` requires a `dev` script (typically `nodemon index.js`) in `package.json` — add one if it isn't already present.

---

## 📄 License

ISC — see repository for details.

---

## 👤 Author

**Dhanush Bandi**
- GitHub: [@bdhanush-pxl](https://github.com/bdhanush-pxl)
- LinkedIn: [dhanushbandi](https://www.linkedin.com/in/dhanush-bandi-0b06412b5/)
