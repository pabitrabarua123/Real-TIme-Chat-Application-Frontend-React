# 💬 Real-Time Chat App - Frontend

A simple real-time chat application frontend built with React, TypeScript, and Socket.IO client.

---

## Core Features

- Built with React + TypeScript
- Real-time messaging using Socket.IO
- Authentication (Login/Register/JWT)
- One-to-one chat interface
- Online/offline user status
- Fast development with Vite

## Project Structure

```
client/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── vite.svg
├── src/
│   ├── App.css
│   ├── index.css
│   ├── main.tsx
│   ├── vite-env.d.ts
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   └── Signout.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── Admin.tsx
│   │   ├── Chat.tsx
│   │   ├── ChatDesign.tsx
│   │   ├── Home.tsx
│   │   ├── Signin.tsx
│   │   ├── Signup.tsx
│   │   └── socket.ts
│   └── router/
│       ├── Layout.tsx
│       └── router.tsx
```

---

## Getting Started

Follow these steps to run the project locally:

1. **Install dependencies:**
	```bash
	npm install
	```

2. **Start the development server:**
	```bash
	npm run dev
	```

3. **Open your browser:**
	Visit [http://localhost:5173](http://localhost:5173) to view the app.

---

> **Note:** Make sure the backend server you need to setup, clone and start with this repo
[https://github.com/pabitrabarua123/Real-Time-Chat-Application-Backend-Node](https://github.com/pabitrabarua123/Real-Time-Chat-Application-Backend-Node)
