import React, { useState, useEffect, useRef, useCallback } from "react";
import Confetti from "./Confetti";
import CircularTimer from "./CircularTimer";
import ScoreCard from "./ScoreCard";
import { ORIGINAL_TIME, PASSED_TIME, CORRECT_PTS, PASSED_PTS } from "../constants/gameConstants";

// ═══════════════════════════════════════════════════════════════════════════════
// GAME SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
export default function GameScreen({ config, onEnd }) {
  const { team1, team2, rounds, movies } = config;

  // State
  const [scores, setScores] = useState([0, 0]);           // [team0, team1]
  const [currentRound, setCurrentRound] = useState(1);    // 1-indexed
  const [movieIndex, setMovieIndex] = useState(0);
  const [activeTeam, setActiveTeam] = useState(() => Math.floor(Math.random() * 2));
  const [isPassed, setIsPassed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ORIGINAL_TIME);
  const [timerRunning, setTimerRunning] = useState(false);
  const [phase, setPhase] = useState("PRE");              // PRE | PLAYING | PASSED_PROMPT | PASSED_PLAYING | ROUND_DONE
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastPoints, setLastPoints] = useState(null);     // { team, pts }
  const [roundStartTeam, setRoundStartTeam] = useState(null); // team that started current round
  const timerRef = useRef(null);

  const teams = [team1, team2];
  const otherTeam = (t) => 1 - t;

  // ── Timer tick ──
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            handleTimeUp();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]); // eslint-disable-line

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setTimerRunning(false);
  };

  // ── Time up handler ──
  const handleTimeUp = useCallback(() => {
    if (!isPassed) {
      // Original team ran out — offer pass to other team
      setPhase("PASSED_PROMPT");
    } else {
      // Passed team also couldn't — no points, next round
      endRound(null, null);
    }
  }, [isPassed, activeTeam]); // eslint-disable-line

  // ── Start the round timer ──
  const startRound = () => {
    setRoundStartTeam(activeTeam);
    setIsPassed(false);
    setTimeLeft(ORIGINAL_TIME);
    setPhase("PLAYING");
    setTimerRunning(true);
    setLastPoints(null);
  };

  // ── Correct answer ──
  const handleCorrect = () => {
    stopTimer();
    const pts = isPassed ? PASSED_PTS : CORRECT_PTS;
    const winner = activeTeam;
    setScores(s => { const n=[...s]; n[winner]+=pts; return n; });
    setLastPoints({ team: winner, pts });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2500);
    // Whoever answered the passed question starts next round
    // Whoever answered their own question — other team starts next round
    const nextStarter = isPassed ? activeTeam : otherTeam(activeTeam);
    endRound(winner, pts, nextStarter);
  };

  // ── Wrong / skip ──
  const handleWrong = () => {
    stopTimer();
    if (!isPassed) {
      // Give to other team
      setPhase("PASSED_PROMPT");
    } else {
      // Both failed
      endRound(null, null);
    }
  };

  // ── Pass to other team ──
  const handlePassToOther = () => {
    const other = otherTeam(activeTeam);
    setActiveTeam(other);
    setIsPassed(true);
    setTimeLeft(PASSED_TIME);
    setPhase("PASSED_PLAYING");
    setTimerRunning(true);
  };

  const handleSkipPass = () => {
    endRound(null, null);
  };

  // ── End round ──
  const endRound = (winnerTeam, pts, nextStarter) => {
    setPhase("ROUND_DONE");
    // determine who starts next
    const _nextStarter = nextStarter !== undefined ? nextStarter : otherTeam(activeTeam);
    setActiveTeam(_nextStarter);
  };

  // ── Next round ──
  const handleNextRound = () => {
    if (currentRound >= rounds) {
      onEnd({ scores, teams });
      return;
    }
    setCurrentRound(r => r + 1);
    setMovieIndex(i => i + 1);
    setIsPassed(false);
    setPhase("PRE");
    setTimeLeft(ORIGINAL_TIME);
    setLastPoints(null);
  };

  // ── Derived ──
  const movie = movies[movieIndex] || "???";
  const totalTime = isPassed ? PASSED_TIME : ORIGINAL_TIME;
  const isWinning = (i) => scores[i] > scores[1-i];
  const isTie = scores[0] === scores[1];

  // ── Render phase overlays ──
  const renderPhaseContent = () => {
    if (phase === "PRE") {
      return (
        <div style={{ textAlign:"center" }}>
          <div style={{
            background:"rgba(167,139,250,0.12)", border:"1px solid rgba(167,139,250,0.3)",
            borderRadius:16, padding:"20px 32px", marginBottom:28, display:"inline-block",
          }}>
            <div style={{ fontSize:12, letterSpacing:2, color:"rgba(255,255,255,0.4)", marginBottom:6 }}>ROUND {currentRound} OF {rounds}</div>
            <div style={{ fontSize:18, fontWeight:600, color:"#A78BFA" }}>
              {teams[activeTeam]} starts this round
            </div>
          </div>
          <br/>
          <button onClick={startRound} style={{
            padding:"18px 56px", borderRadius:50, border:"none",
            background:"linear-gradient(135deg, #7C3AED, #A78BFA)",
            color:"#fff", fontSize:20, fontWeight:700, cursor:"pointer",
            fontFamily:"'Bebas Neue',sans-serif", letterSpacing:3,
            boxShadow:"0 8px 32px rgba(124,58,237,0.45)",
          }}>
            BEGIN ROUND →
          </button>
        </div>
      );
    }

    if (phase === "PASSED_PROMPT") {
      return (
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>⏰</div>
          <div style={{ fontSize:22, fontWeight:700, color:"#FFA502", marginBottom:8, fontFamily:"'Bebas Neue',sans-serif", letterSpacing:2 }}>
            TIME'S UP FOR {teams[activeTeam].toUpperCase()}!
          </div>
          <div style={{ fontSize:15, color:"rgba(255,255,255,0.5)", marginBottom:28 }}>
            Does <strong style={{color:"#fff"}}>{teams[otherTeam(activeTeam)]}</strong> want to attempt?
          </div>
          <div style={{ display:"flex", gap:16, justifyContent:"center" }}>
            <button onClick={handlePassToOther} style={{
              padding:"14px 36px", borderRadius:50, border:"none",
              background:"linear-gradient(135deg, #FFA502, #FF6348)",
              color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer",
              fontFamily:"'Bebas Neue',sans-serif", letterSpacing:2,
              boxShadow:"0 6px 24px rgba(255,165,2,0.4)",
            }}>YES — PASS IT! (+10)</button>
            <button onClick={handleSkipPass} style={{
              padding:"14px 36px", borderRadius:50,
              border:"1px solid rgba(255,255,255,0.15)",
              background:"transparent", color:"rgba(255,255,255,0.4)",
              fontSize:16, fontWeight:600, cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",
            }}>Skip</button>
          </div>
        </div>
      );
    }

    if (phase === "PLAYING" || phase === "PASSED_PLAYING") {
      return (
        <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
          <button onClick={handleCorrect} style={{
            padding:"16px 48px", borderRadius:50, border:"none",
            background:"linear-gradient(135deg, #2ED573, #1ABC9C)",
            color:"#fff", fontSize:20, fontWeight:700, cursor:"pointer",
            fontFamily:"'Bebas Neue',sans-serif", letterSpacing:3,
            boxShadow:"0 6px 28px rgba(46,213,115,0.45)",
          }}>✓ CORRECT {isPassed ? "(+10)" : "(+20)"}</button>
          <button onClick={handleWrong} style={{
            padding:"16px 48px", borderRadius:50, border:"none",
            background:"linear-gradient(135deg, #FF4757, #FF6B81)",
            color:"#fff", fontSize:20, fontWeight:700, cursor:"pointer",
            fontFamily:"'Bebas Neue',sans-serif", letterSpacing:3,
            boxShadow:"0 6px 28px rgba(255,71,87,0.4)",
          }}>{isPassed ? "✗ WRONG" : "✗ WRONG / PASS"}</button>
        </div>
      );
    }

    if (phase === "ROUND_DONE") {
      return (
        <div style={{ textAlign:"center" }}>
          {lastPoints ? (
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:48, marginBottom:4 }}>🎉</div>
              <div style={{ fontSize:22, fontWeight:700, color:"#2ED573", fontFamily:"'Bebas Neue',sans-serif", letterSpacing:2 }}>
                {teams[lastPoints.team]} +{lastPoints.pts} pts!
              </div>
            </div>
          ) : (
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:48, marginBottom:4 }}>😅</div>
              <div style={{ fontSize:18, color:"rgba(255,255,255,0.5)" }}>No points awarded this round</div>
              <div style={{ fontSize:14, color:"rgba(255,255,255,0.35)", marginTop:6 }}>The movie was: <em style={{color:"rgba(255,255,255,0.7)"}}>{movie}</em></div>
            </div>
          )}
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.35)", marginBottom:20 }}>
            Next round starts with <strong style={{color:"rgba(255,255,255,0.7)"}}>{teams[activeTeam]}</strong>
          </div>
          <button onClick={handleNextRound} style={{
            padding:"16px 52px", borderRadius:50, border:"none",
            background: currentRound >= rounds
              ? "linear-gradient(135deg, #FFD700, #FFA502)"
              : "linear-gradient(135deg, #7C3AED, #A78BFA)",
            color:"#fff", fontSize:20, fontWeight:700, cursor:"pointer",
            fontFamily:"'Bebas Neue',sans-serif", letterSpacing:3,
            boxShadow: currentRound >= rounds
              ? "0 6px 28px rgba(255,215,0,0.4)"
              : "0 6px 28px rgba(124,58,237,0.4)",
          }}>
            {currentRound >= rounds ? "🏆 END GAME" : "NEXT ROUND →"}
          </button>
        </div>
      );
    }
  };

  return (
    <div style={{
      minHeight:"100vh", background:"#0A0A0F", color:"#fff",
      fontFamily:"'DM Sans',sans-serif", padding:"24px 20px",
      backgroundImage:"radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,61,183,0.2) 0%, transparent 60%)",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      {showConfetti && <Confetti/>}

      {/* Header bar */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28, maxWidth:900, margin:"0 auto 28px" }}>
        <div style={{
          background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:50, padding:"8px 20px", fontSize:13, fontWeight:600, letterSpacing:1,
        }}>
          🎬 DUMB CHARADES
        </div>
        <div style={{ display:"flex", gap:10 }}>
          {Array.from({length: rounds}, (_, i) => (
            <div key={i} style={{
              width:10, height:10, borderRadius:"50%",
              background: i < currentRound - 1 ? "#A78BFA"
                : i === currentRound - 1 ? "#fff"
                : "rgba(255,255,255,0.15)",
              transition:"background 0.3s",
            }}/>
          ))}
        </div>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)", letterSpacing:1 }}>
          ROUND <span style={{color:"#fff",fontWeight:700}}>{currentRound}</span> / {rounds}
        </div>
      </div>

      <div style={{ maxWidth:900, margin:"0 auto" }}>
        {/* Movie name */}
        {(phase === "PLAYING" || phase === "PASSED_PLAYING") && (
          <div style={{
            textAlign:"center", marginBottom:32,
            background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:20, padding:"28px 40px",
            position:"relative",
          }}>
            <div style={{
              fontSize:11, letterSpacing:3, color:"rgba(255,255,255,0.3)",
              marginBottom:10, textTransform:"uppercase",
            }}>
              🎬 {isPassed ? `PASSED → ${teams[activeTeam]}` : `${teams[activeTeam]}'s Turn`}
            </div>
            <div style={{
              fontSize:42, fontWeight:800, letterSpacing:1,
              fontFamily:"'Bebas Neue',sans-serif",
              background:"linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.6))",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            }}>
              {movie}
            </div>
            {isPassed && (
              <div style={{
                position:"absolute", top:14, right:18,
                background:"rgba(255,165,2,0.15)", border:"1px solid rgba(255,165,2,0.4)",
                borderRadius:20, padding:"4px 14px", fontSize:11, color:"#FFA502",
                fontWeight:700, letterSpacing:1,
              }}>PASSED +10</div>
            )}
          </div>
        )}

        {/* Scorecards + Timer row */}
        <div style={{ display:"flex", gap:20, alignItems:"center", marginBottom:32 }}>
          <ScoreCard
            name={teams[0]} score={scores[0]}
            isActive={activeTeam === 0 && (phase==="PLAYING"||phase==="PASSED_PLAYING")}
            isWinning={!isTie && isWinning(0)}
            isLosingBehind={!isTie && !isWinning(0)}
            side={0}
          />

          {/* Center timer + round info */}
          <div style={{ textAlign:"center", flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
            <CircularTimer timeLeft={timeLeft} totalTime={totalTime} isPassed={isPassed}/>
            {isTie && scores[0] > 0 && (
              <div style={{
                background:"rgba(255,215,0,0.1)", border:"1px solid rgba(255,215,0,0.3)",
                borderRadius:20, padding:"4px 14px", fontSize:11, color:"#FFD700",
                fontWeight:700, letterSpacing:1,
              }}>🤝 TIE</div>
            )}
          </div>

          <ScoreCard
            name={teams[1]} score={scores[1]}
            isActive={activeTeam === 1 && (phase==="PLAYING"||phase==="PASSED_PLAYING")}
            isWinning={!isTie && isWinning(1)}
            isLosingBehind={!isTie && !isWinning(1)}
            side={1}
          />
        </div>

        {/* Phase actions */}
        <div style={{
          background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
          borderRadius:24, padding:"32px 40px", textAlign:"center",
          minHeight:120, display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          {renderPhaseContent()}
        </div>

        {/* Movie hint for non-playing phases */}
        {(phase === "PRE" || phase === "ROUND_DONE" || phase === "PASSED_PROMPT") && phase !== "ROUND_DONE" && (
          <div style={{
            marginTop:20, textAlign:"center",
            background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)",
            borderRadius:14, padding:"14px 24px",
          }}>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.25)", letterSpacing:1 }}>UPCOMING MOVIE: </span>
            <span style={{ fontSize:14, fontWeight:600, color:"rgba(255,255,255,0.6)" }}>{movie}</span>
          </div>
        )}
      </div>
    </div>
  );
}