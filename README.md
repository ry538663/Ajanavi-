# Ajnavi (अजनबी) — Random Chat Application

A modern full-stack web application for meeting and chatting with strangers in real-time, featuring text chat, WebRTC video calling, interest matching, and anonymous profiles.

---

## 🛠 Tech Stack

- **Frontend (`ajnavi-frontend`)**: Next.js 15, React 19, TypeScript, TailwindCSS, Socket.io-client, Lucide icons.
- **Backend (`ajnavi-backend`)**: NestJS, TypeScript, Socket.io, WebSockets Gateway, in-memory matching service.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment Variables

**Backend (`ajnavi-backend/.env`)**:
```env
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

**Frontend (`ajnavi-frontend/.env.local`)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_TURN_URL=
NEXT_PUBLIC_TURN_USERNAME=
NEXT_PUBLIC_TURN_CREDENTIAL=
```

---

## 💻 Running the Application

### Run Both Simultaneously:
```bash
npm run dev
```

### Run Individually:
- **Backend**:
  ```bash
  npm run dev:backend
  ```
- **Frontend**:
  ```bash
  npm run dev:frontend
  ```

---

## 🌐 URLs

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API & Health**: [http://localhost:4000/health](http://localhost:4000/health)
