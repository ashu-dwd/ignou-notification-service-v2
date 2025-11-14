# 📣 IGNOU Notification Service — Server (2025 Refactored ESM Edition)

Welcome!  
This server powers the IGNOU notification/announcement service, delivering timely email updates to users. The project has been **fully modernized** and refactored with best-practices, using clear folder structure, ES modules (ESM), and separation of concerns — so it's easy to maintain, extend, or just pick up after a long break 🪄

---

## 🌱 What Does This Server Do?

- 🛠️ Scrapes new notifications from the official IGNOU website
- 📨 Emails timely announcements to all subscribers
- 🕑 Runs a scheduled cron job (daily by default)
- 🔗 Offers RESTful APIs for managing emails, triggering notifications, and more

---

## 🗂️ Directory Structure

```
server/
│
├── index.js                  # 🚪 Main ESM entry point — boots DB & server
│
├── README.md                 # 📚 This file!
│
├── package.json              # 📦 Project metadata, dependencies, & settings
│
├── config/                   # ⚙️ App-wide config, connection, and setup
│   ├── database.js           #   ⇾ Mongoose (MongoDB) setup & event handling
│   └── mailer.js             #   ⇾ Nodemailer config/validation (for email sending)
│
├── app/                      # 🏗️ Core application, Express app & server startup
│   ├── app.js                #   ⇾ Middleware, global security, router mounting
│   └── server.js             #   ⇾ HTTP server creation, error handling, process hooks
│
├── controllers/              # 📥 Handle Express req/res for each domain/resource
│   ├── notificationController.js  # ⇾ GET notifications, health/status endpoints
│   └── recipientController.js     # ⇾ Add, remove, list, and email recipients
│
├── routes/                   # 🌐 Resource-based Express routers
│   ├── notificationRoutes.js #   ⇾ Routes for notification APIs
│   └── recipientRoutes.js    #   ⇾ Routes for recipient/email APIs
│
├── services/                 # 💼 Business logic layer (side effects, orchestration)
│   ├── notificationService.js # ⇾ Scraping, formatting, data assembly
│   ├── cronService.js         # ⇾ Cron jobs, admin alerting, retries
│   └── emailService.js        # ⇾ Email sending, retries, footer, etc.
│
├── models/                   # 🗃️ Mongoose schemas/models (if present)
│   └── ...                   #   ⇾ e.g., Notification.js, Recipient.js, etc.
│
├── utils/                    # 🧰 Helpers/utilities for logging, templates, ...
│   ├── emailTemplates.js     #   ⇾ All HTML/text for system emails
│   └── logger.js             #   ⇾ Winston logger (used everywhere)
│
└── logs/                     # 📝 Log files (auto-created)
```

---

## 🔀 How do files connect & requests flow?

1. **Server boot (`index.js`):**

   - Loads env vars
   - Connects MongoDB
   - Boots Express server via `app/server.js`
   - Starts cron scheduler

2. **Express app (`app/app.js`):**

   - Adds security, cors, rate-limiting, JSON parsing
   - Mounts routers under `/api/notifications` and `/api/recipients`

3. **A request comes in (e.g., POST `/api/recipients/add-email`):**

   - Hits **router** (routes/recipientRoutes.js), which delegates to a
   - **Controller** (controllers/recipientController.js) — parses req/res, simple validation
   - Controller calls relevant **service** (`services/recipientService.js`, if implemented, or others)
   - **Service** does heavy lifting: DB lookup, sending mail, etc., using
     - **Models** (MongoDB)
     - **Template utilities** for dynamic mail bodies (utils/emailTemplates.js)
     - **Logger** for all log output (utils/logger.js)

4. **Cron Service:**
   - `cronService.js` regularly scrapes for new notifications and triggers mails
   - Notifies admins on error/success

---

## 🔑 Key Tech/Stack

- 🟦 Node.js (use `node` >= v18 recommended)
- 🦄 ES Modules (ALL code: `import`/`export`, not require/module.exports)
- 🏗️ Express for HTTP API
- 🍃 Mongoose for MongoDB connectivity
- 💌 Nodemailer for sending mail
- ⏰ node-cron for scheduled jobs
- 📜 Winston for consistent, file+console logs
- 💚 dotenv for env variables (`.env` file is recommended for config)

---

## 🚀 How to Run (Local Dev)

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Configure environment**
   - Set up a `.env` file with your secrets (example vars: `MONGO_DB_URI`, `EMAIL_USER`, `EMAIL_PASSWORD`, `ADMIN_EMAIL`, etc.)
3. **For ESM compatibility:**
   - Ensure your `package.json` has:
     ```json
     { "type": "module" }
     ```
   - If not, rename your entry as `index.mjs` _or_ run explicitly:
     ```
     node --loader ts-node/esm index.js
     ```
4. **Start the server!**
   ```sh
   node index.js
   ```

---

## 🛠️ Extending and Hacking

- **Add new APIs**:
  - Make a new controller/service/route file, then wire it in app.js
- **Change scheduler:**
  - Edit cron job expression in `services/cronService.js` or from `.env`
- **Email templates:**
  - Update or create functions in `utils/emailTemplates.js`
- **Logging:**
  - Use `import logger from "../utils/logger.js"` for logs anywhere in code

---

## 💡 Tips for Returning Developers

- Focus on **high-level flow:** Entry → Router → Controller → Service → DB
- **Separation of concerns** makes it easy to update only what you need
- Stumped? `logger.js` will write logs to both console & `logs/cron.log`
- All ESM imports: always include the `.js` file extension

---

## 🤝 Contributing

PRs, issues, and suggestions welcome!  
Please help keep structure and style consistent with this template.  
Questions? Contact repo owner or see comments in code 💬

---

_Automatically generated by Cline (AI), 2025  
For human readability first!_
