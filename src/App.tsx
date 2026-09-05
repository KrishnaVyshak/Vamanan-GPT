import React, { createContext, useCallback, useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Hero } from './components/Hero';
import { ChatPage } from './pages/ChatPage';
import { StoryPage } from './pages/StoryPage';

// ---------------------------------------------------------------------------
// Transition Context
// ---------------------------------------------------------------------------

interface TransitionContextValue {
  navigateWithTransition: (to: string) => void;
  isExiting: boolean;
}

export const TransitionContext = createContext<TransitionContextValue>({
  navigateWithTransition: () => {},
  isExiting: false,
});

export function usePageTransition() {
  return useContext(TransitionContext);
}

// ---------------------------------------------------------------------------
// Inner App — has access to useNavigate
// ---------------------------------------------------------------------------

function InnerApp() {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const navigateWithTransition = useCallback(
    (to: string) => {
      // Trigger exit animation on current page
      setIsExiting(true);

      // After the exit animation finishes (0.6s), navigate
      setTimeout(() => {
        navigate(to);
        setIsExiting(false);
      }, 600);
    },
    [navigate],
  );

  return (
    <TransitionContext.Provider value={{ navigateWithTransition, isExiting }}>
      <div className="w-screen h-screen overflow-hidden bg-slate-950">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/story" element={<StoryPage />} />
        </Routes>
      </div>
    </TransitionContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// App root
// ---------------------------------------------------------------------------

function App() {
  return (
    <BrowserRouter>
      <InnerApp />
    </BrowserRouter>
  );
}

export default App;
