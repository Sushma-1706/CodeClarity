# 💡 CodeViz: Understand Code Like Never Before

**CodeViz** is an intelligent AI-powered web platform that takes your pasted code snippets or uploaded files and transforms them into easy-to-understand, visually interactive explanations.

Whether you're a student, educator, or developer, CodeViz helps you **see how code works** — from beginner-friendly explanations to detailed technical breakdowns — all visualized with flowcharts, 3D diagrams, and voice narration.

---

## 🌟 What You Can Do with CodeViz

- 📥 Paste or upload code in **C, C++, Python, Java, or JavaScript**
- 👶 Choose how you want the explanation: like you're **10 or 20 years old**
- 📊 See code logic through **interactive flowcharts and execution diagrams**
- 🧠 Understand loops, conditions, arrays, trees, graphs — all visually
- ❓ Click on any line and ask **“Why?”** to get smart reasoning
- 🛠️ Detect and fix bugs, and see **AI suggestions with improvements**
- 🔊 Hear natural voice-based explanations
- 📈 Analyze time and space complexity
- 🧪 Run your code in a **safe sandbox** with step-by-step execution
- 🔄 Compare different versions of your code
- 💡 Get smart refactoring suggestions with explanations
- 📎 Export diagrams, summaries, and explanations as files
- 🧠 Auto-generated **quizzes** and **test cases**
- 🔍 Highlight and tag key concepts: loops, recursion, arrays, conditions
- 🌍 Learn through **real-world analogies** that make code intuitive
- 🔗 Connect GitHub repos for live project analysis (future support)
- 🤝 Pair-mode and collaboration tools (coming soon!)

---

## 🧠 Use Cases

- 👩‍💻 Beginners trying to understand code line-by-line
- 🧑‍🏫 Teachers explaining logic in a classroom
- 🐞 Developers debugging or optimizing code
- 📚 Students learning concepts visually
- 🧪 Test-driven development learners

---

## ⚙️ Tech Stack

Built using:

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.dev/)
- [Lovable](https://lovable.dev/) (for visual-first prototyping)

---

## 🚀 Get Started

### 📦 Clone and run locally

```bash
git clone https://github.com/Sushma-1706/CodeClarity.git
cd CodeClarity/CodeViz
npm install
npm run dev
```

### ▶ Sandbox Backend (Real Code Execution)

The editor sandbox now uses a backend API for running JavaScript, Python, Java, C, and C++.
The output panel is also backend-driven (not browser-eval) and reads compile/runtime output from this API.
By default the backend targets a public Piston-compatible endpoint. If that endpoint is blocked,
configure your own execution provider URL via `SANDBOX_EXECUTOR_API_URL`.

Default frontend API path is proxied through Vite:

```bash
VITE_SANDBOX_API_URL=/api/sandbox/execute
```

Start frontend + backend together:

```bash
npm run dev:full
```

Or run only backend:

```bash
npm run sandbox:dev
```

Optional backend config:

```bash
SANDBOX_PORT=8787
SANDBOX_EXECUTOR_API_URL=https://your-runtime-provider/execute
```

### 🔑 Configure Grok API

1. Copy `.env.example` to `.env` inside `CodeViz/`.
2. Add your xAI key and model:

```bash
VITE_GROK_API_KEY=your_xai_api_key_here
VITE_GROK_MODEL=grok-2-latest
VITE_SANDBOX_API_URL=http://localhost:8787/api/sandbox/execute
```

If `VITE_GROK_API_KEY` is not set, CodeViz automatically falls back to local heuristic explanations.
