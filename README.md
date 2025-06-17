# ReplAI 🤖 #
Inbox overwhelmed? Don’t just reply — ReplAI.

# Overview 🚀 #
ReplAI is a modern, AI-powered email client that streamlines email management and composition. Built with Next.js, Gemini, NeonDB and Prisma, it enables users to sync emails, manage threads, and compose smart replies using AI. With features like real-time sync, full-text search, and intelligent suggestions, ReplAI enhances productivity and simplifies communication. Designed for performance and usability, it offers a seamless, responsive experience for professionals handling daily email workflows.

# Features 🌟 #
* **AI Assistant**: Ask questions about your emails and the AI assistant will use relevant email context retrieved via Orama vector search to respond intelligently.
* **AI Smart Compose**: Compose emails or replies using AI that understands the entire email thread context if present, ensuring coherent and personalized replies.
* **AI Autocomplete (Win + J)**: Speed up your writing with an AI autocomplete feature.
* **Full Email Functionality**: Connect multiple email accounts via OAuth with Aurinko for syncing emails, sending and receiving messages, and composing new emails in threaded conversations.
* **Real-time Syncing**: Initial and incremental email synchronization via APIs to ensure your inbox reflects the latest updates.
* **Robust Authentication & Authorization**: Sign up and log in securely using Clerk, supporting session management and modern authentication methods.
* **Instant Search**: Quickly search through emails using Orama's high-performance full-text search engine.
* **Command Bar (Cmd + K)**: Boost navigation speed with a command palette for quick actions, improving the overall UX, facilitated by KBar.
* **Rich Email Editing**: Compose emails using a full-featured, markdown-supported rich-text editor built with Tiptap.
* **Responsive UI with ShadCN & Tailwind**: Elegant and functional UI crafted using ShadCN components and Tailwind CSS for seamless performance, supports Light mode and Dark mode.
  
# Tech Stack 🛠 #
* **Next.js**: React framework used to build the full-stack app with server-side rendering, routing, and API endpoints.
* **Typescript**: Strongly typed JavaScript that improves code reliability and developer experience.
* **NeonDB**: A fast, serverless PostgreSQL database used with Prisma to store all app data.
* **Prisma ORM**: Type-safe, scalable ORM used to model and query the PostgreSQL database.
* **Vercel AI SDK**: Faciliates streaming responses and provides hooks such as useChat to maintain real-time, persistent AI conversations between the user and assistant.
* **Gemini 2.5 Flash**: Powers all AI interactions such as smart reply generation, auto-complete, and assistant responses with fast, context-aware outputs.
* **Gemini Embedding EXP 03-07**: Utilized to generate high-quality embeddings for user emails and queries, enabling semantic vector search via Orama.
* **Orama**: High-performance vector and full-text search engine used for contextual email search and AI assistant grounding.
* **TRPC**: Type-safe API routing and data fetching strategy with seamless client-server integration.
* **Clerk**: Authentication and user management system for secure sign-up, login, and session handling.
* **Aurinko API**: Email sync and threading powered by Aurinko's email integration platform.
* **Tailwind CSS**: Utility-first CSS framework for designing custom UIs quickly and responsively.
* **ShadCN UI**: Known for its modular and flexible design, ShadCN UI provides a modern approach to building user interfaces.
