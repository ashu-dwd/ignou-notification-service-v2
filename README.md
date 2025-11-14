# 🎓 IGNOU Notification Service V2

> _Because manually checking the IGNOU website for updates is so 2010_ 🙄

![Build Status](https://img.shields.io/badge/build-probably%20works-brightgreen)
![Code Quality](https://img.shields.io/badge/code%20quality-chef's%20kiss-orange)
![Bugs](https://img.shields.io/badge/bugs-what%20bugs%3F-blue)
![Maintained](https://img.shields.io/badge/maintained-when%20I%20feel%20like%20it-yellow)

---

## 🤔 What Even Is This?

Remember when you had to refresh the IGNOU website 47 times a day hoping for that one notification about exam dates? Yeah, those dark ages are over.

This bad boy scrapes IGNOU's website, finds new notifications, and **emails them to you** like it's nobody's business. It's basically your personal IGNOU stalker, but legal and helpful.

![Notification Meme](https://i.imgflip.com/4/2fm6x.jpg)
_Me waiting for IGNOU notifications before this service existed_

---

## ✨ Features That'll Blow Your Mind (Maybe)

- 🤖 **Automated Scraping** - Because F5 is so last decade
- 📧 **Email Notifications** - Straight to your inbox, like spam but useful
- ⏰ **Cron Jobs** - Runs daily (or whenever you want, I'm not your boss)
- 🎨 **React Frontend** - Pretty buttons that do things
- 🐳 **Docker Support** - "Works on my machine" certified
- 🧠 **AI-Powered** - Uses Google's Gemini because why not throw AI at everything
- 🔒 **Secure AF** - Helmet, CORS, rate limiting... we got the whole security theater

---

## 🏗️ Architecture (Fancy Word for "How It Works")

```
┌─────────────────┐
│   React Web     │  ← Pretty UI for humans
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Express API    │  ← The brain (debatable)
└────────┬────────┘
         │
         ├──► MongoDB  (Stores your precious emails)
         ├──► Nodemailer  (Sends emails like a boss)
         └──► IGNOU Website  (The victim of our scraping)
```

---

## 🚀 Getting Started (AKA "Make It Work")

### Prerequisites

- Node.js (v18+ or whatever's trendy now)
- MongoDB (or just use Docker, you lazy genius)
- Gmail account (for sending emails, duh)
- Coffee ☕ (not technically required but highly recommended)

### Installation

**1. Clone this masterpiece:**

```bash
git clone https://github.com/ashu-dwd/ignou-notification-service-v2.git
cd ignou-notification-service-v2
```

**2. Fire up MongoDB with Docker:**

```bash
docker-compose up -d
```

_Connection string: `mongodb://mongoadmin:mongopass@localhost:27017/ignou_notifications?authSource=admin`_

**3. Backend Setup:**

```bash
cd server
npm install
# Create a .env file (see server/README.md for details)
npm start
```

**4. Frontend Setup:**

```bash
cd web
npm install
npm run dev
```

**5. Profit** 💰

---

## 🎯 Tech Stack (Buzzword Bingo)

### Backend

- **Node.js + Express** - Because JavaScript everywhere is our destiny
- **MongoDB + Mongoose** - NoSQL baby, schemas are for the weak
- **Nodemailer** - Email sending without the headache
- **Cheerio** - Web scraping like jQuery but cooler
- **Google Gemini AI** - For that sweet, sweet AI hype
- **Winston** - Logging because `console.log` is for amateurs
- **node-cron** - Scheduled tasks without the pain

### Frontend

- **React 19** - The latest and greatest (until next month)
- **Vite** - Because webpack is too mainstream
- **Axios** - Fetch but with more features

### DevOps

- **Docker** - "It works on my machine" → "It works everywhere"
- **Docker Compose** - One command to rule them all

---

## 📁 Project Structure

```
ignou-notification-service-v2/
├── server/              # Backend magic happens here
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── services/    # Business logic (the smart stuff)
│   │   ├── models/      # MongoDB schemas
│   │   ├── routes/      # API endpoints
│   │   └── utils/       # Helper functions
│   └── index.js         # Entry point
│
├── web/                 # Frontend prettiness
│   ├── src/
│   │   ├── App.jsx      # Main React component
│   │   └── ...
│   └── index.html
│
└── docker-compose.yml   # One-click MongoDB
```

---

## 🎮 API Endpoints (For the Nerds)

### Notifications

- `GET /api/notifications/health` - Is this thing on?
- `GET /api/notifications/latest` - Get the freshest notifications
- `POST /api/notifications/trigger` - Manually trigger scraping (impatient much?)

### Recipients

- `POST /api/recipients/add-email` - Subscribe to the chaos
- `DELETE /api/recipients/remove-email` - Unsubscribe (we'll miss you)
- `GET /api/recipients/list` - See who's in the club
- `POST /api/recipients/send-test` - Test if emails actually work

---

## 🤖 How the Magic Happens

1. **Cron job wakes up** (daily at midnight, like a vampire)
2. **Scrapes IGNOU website** (politely, we're not monsters)
3. **Finds new notifications** (if any exist)
4. **Stores in MongoDB** (for posterity)
5. **Sends emails to everyone** (spam but make it useful)
6. **Goes back to sleep** (until tomorrow)

![Cron Job Meme](https://i.imgflip.com/4/1otk96.jpg)
_The cron job doing its thing at 3 AM_

---

## 🐛 Known Issues (Features, Actually)

- Sometimes IGNOU's website is down (not our fault, we swear)
- Email might end up in spam (Gmail thinks we're suspicious)
- The AI sometimes gets creative with notification summaries (it's learning, okay?)
- MongoDB might eat your RAM (feed it more RAM)

---

## 🤝 Contributing

Found a bug? Want to add a feature? PRs are welcome!

Just remember:

- Write code that doesn't make me cry
- Test your stuff (or at least pretend you did)
- Keep it clean (we have standards... sort of)

---

## 📜 License

ISC - Do whatever you want, just don't blame me if it breaks

---

## 🙏 Acknowledgments

- IGNOU for having a website that's scrapable
- Coffee for existing
- Stack Overflow for basically writing this
- That one person who starred this repo (you're the real MVP)

---

## 📞 Contact

Got questions? Found a bug? Want to complain?

Open an issue or send a carrier pigeon 🐦

---

<div align="center">

**Made with 💻 and ☕ by someone who was tired of checking IGNOU's website**

_If this saved you time, consider starring the repo ⭐_

_If it broke something, I don't know you 🙈_

</div>

---

## 🎭 Meme Gallery

Because every good README needs memes:

**When the notification finally arrives:**

![Success](https://imgflip.com/i/ac46br)

**When IGNOU's website is down:**

![Down](https://i.imgflip.com/4/1g8my4.jpg)

**When you realize you could've built this in a weekend:**

![Regret](https://i.imgflip.com/4/1bij.jpg)

---

_Last updated: When I remembered to update this_  
_Next update: When I feel like it_  
_Bugs fixed: Yes_  
_New bugs introduced: Also yes_
