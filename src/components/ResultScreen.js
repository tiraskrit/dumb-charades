import React from "react";
import Confetti from "./Confetti";

// ═══════════════════════════════════════════════════════════════════════════════
// RESULT SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
export default function ResultScreen({ result, onRestart }) {
  const { scores, teams } = result;
  const isTie = scores[0] === scores[1];
  const winner = isTie ? null : scores[0] > scores[1] ? 0 : 1;

  return (
    <div style={{
      minHeight:"100vh", background:"#0A0A0F", color:"#fff",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      fontFamily:"'DM Sans',sans-serif", padding:"40px 20px",
      backgroundImage:"radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,61,183,0.4) 0%, transparent 60%)",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <Confetti/>

      <div style={{ fontSize:80, marginBottom:16 }}>{isTie ? "🤝" : "🏆"}</div>
      <h1 style={{
        fontSize:72, margin:"0 0 8px", fontFamily:"'Bebas Neue',sans-serif", letterSpacing:4,
        background: isTie
          ? "linear-gradient(135deg, #FFD700, #FFA502)"
          : "linear-gradient(135deg, #2ED573, #1ABC9C)",
        WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
      }}>
        {isTie ? "IT'S A TIE!" : `${teams[winner]} WINS!`}
      </h1>
      {!isTie && (
        <p style={{ fontSize:16, color:"rgba(255,255,255,0.4)", marginBottom:48, letterSpacing:1 }}>
          Congratulations to the champions! 🎉
        </p>
      )}
      {isTie && <p style={{ fontSize:16, color:"rgba(255,255,255,0.4)", marginBottom:48 }}>Both teams played equally well!</p>}

      {/* Final scores */}
      <div style={{ display:"flex", gap:24, marginBottom:48 }}>
        {teams.map((t, i) => (
          <div key={i} style={{
            background: i === winner ? "rgba(46,213,115,0.08)" : "rgba(255,255,255,0.04)",
            border: `2px solid ${i === winner ? "#2ED573" : "rgba(255,255,255,0.1)"}`,
            borderRadius:20, padding:"28px 48px", textAlign:"center",
            boxShadow: i === winner ? "0 0 40px rgba(46,213,115,0.2)" : "none",
          }}>
            <div style={{ fontSize:13, letterSpacing:2, color:"rgba(255,255,255,0.4)", marginBottom:8 }}>FINAL SCORE</div>
            <div style={{ fontSize:24, fontWeight:700, marginBottom:4 }}>{t}</div>
            <div style={{
              fontSize:64, fontWeight:900, fontFamily:"'Bebas Neue',sans-serif",
              color: i === winner ? "#2ED573" : i === (1-winner) && !isTie ? "#FF4757" : "#fff",
            }}>{scores[i]}</div>
          </div>
        ))}
      </div>

      <button onClick={onRestart} style={{
        padding:"18px 56px", borderRadius:50, border:"none",
        background:"linear-gradient(135deg, #7C3AED, #A78BFA)",
        color:"#fff", fontSize:20, fontWeight:700, cursor:"pointer",
        fontFamily:"'Bebas Neue',sans-serif", letterSpacing:3,
        boxShadow:"0 8px 32px rgba(124,58,237,0.4)",
      }}>↩ PLAY AGAIN</button>
    </div>
  );
}