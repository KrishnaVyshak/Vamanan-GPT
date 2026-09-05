![VamananGPT](https://vamanan.krishnavyshak.com/logo_text_repo.png)

VamananGPT is a character chat web app. You talk to Vamanan, the dwarf avatar of Lord Vishnu from Hindu mythology. Vamanan replies in Manglish and speaks in the voice of a witty, playful character from the story of Onam.

The app has three pages:

- **Home** — an illustrated scene. Click the signs on the board to go to the chat or the story.
- **Chat** — type a message and Vamanan replies. His character image changes expression to match the reply.
- **Story** — a six-chapter retelling of the Vamanan and Mahabali story. Click a chapter card to read it.

---

## Technologies

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev) | Builds and updates the UI |
| [TypeScript](https://www.typescriptlang.org) | Adds type checking to the JavaScript code |
| [Vite](https://vite.dev) | Runs the local dev server and builds the app |
| [Tailwind CSS v4](https://tailwindcss.com) | Applies utility CSS classes |
| [React Router v7](https://reactrouter.com) | Handles navigation between the three pages |
| [Google Gemini API (`@google/genai`)](https://ai.google.dev) | Sends messages to the Gemini model and gets replies |

The chat page sends each user message to the Gemini model `gemini-3.1-flash-lite`.

The background on all three pages is a multi-layer parallax scene. On desktop, each layer moves a different amount as you move the mouse. On the home page, the character's eyes also follow the mouse cursor.

---

## Setup

### Requirements

- [Node.js](https://nodejs.org) 18 or later
- A Gemini API key. Get one at [aistudio.google.com](https://aistudio.google.com/app/apikey).

### Steps

1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Copy `.env.example` to `.env`.
4. Open `.env` and set `VITE_GEMINI_API_KEY` to your API key.
5. Run `npm run dev` to start the local dev server.
6. Open the URL that the terminal shows (usually `http://localhost:5173`).

---

## How to Use the App

### Home Page

The home page shows an illustrated scene with the VamananGPT title and a sign board.

**On desktop:** Two clickable signs appear on the board. Click the left sign to go to the Story page. Click the right sign to go to the Chat page.

**On mobile:** The same board image appears at the bottom of the screen. Tap the left half of the board image to go to the Story page. Tap the right half to go to the Chat page.

Click the **VamananGPT** title on any page to return to the home page.

### Chat Page

1. Read the opening greeting from Vamanan in the chat panel.
2. Type a message in the input bar at the bottom.
3. Press **Enter** or tap the orange send button.
4. Wait for Vamanan's reply to appear. Three dots show while the reply loads.

On desktop, four suggestion buttons appear above the input bar. Click one to send that message immediately.

On desktop, the character image on the left side of the screen changes expression after each reply. On mobile, a small character sprite appears above the input bar.

### Story Page

The story page shows the Vamanan and Mahabali myth as six chapter cards.

1. Click or tap any chapter card to expand it and read the full text.
2. A fun fact appears at the bottom of each expanded chapter.
3. On desktop, the character image on the left changes expression to match the active chapter.
4. Click **Return to Vaikunta** at the bottom of the page to go back to the home page.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_GEMINI_API_KEY` | Yes | Your Google Gemini API key. Without this, the chat panel shows an error and sends no messages. |

---

## Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts the local dev server |
| `npm run build` | Builds the production files to `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint on all source files |
