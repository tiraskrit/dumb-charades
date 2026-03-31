import React, { useState } from "react";
import { SCREEN } from "./constants/screenConstants";
import WelcomeScreen from "./components/WelcomeScreen";
import GameScreen from "./components/GameScreen";
import ResultScreen from "./components/ResultScreen";
import "./styles/global.css";

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState(SCREEN.WELCOME);
  const [gameConfig, setGameConfig] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  const handleStart = (config) => {
    setGameConfig(config);
    setScreen(SCREEN.GAME);
  };
  const handleEnd = (result) => {
    setGameResult(result);
    setScreen(SCREEN.RESULT);
  };
  const handleRestart = () => {
    setGameConfig(null);
    setGameResult(null);
    setScreen(SCREEN.WELCOME);
  };

  if (screen === SCREEN.WELCOME) return <WelcomeScreen onStart={handleStart}/>;
  if (screen === SCREEN.GAME) return <GameScreen config={gameConfig} onEnd={handleEnd}/>;
  if (screen === SCREEN.RESULT) return <ResultScreen result={gameResult} onRestart={handleRestart}/>;
}