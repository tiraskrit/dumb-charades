import React from "react";

// ── Score Card ────────────────────────────────────────────────────────────────
export default function ScoreCard({ name, score, isActive, isWinning, isLosingBehind, side }) {
  const border = isWinning ? "#2ED573" : isLosingBehind ? "#FF4757" : "rgba(255,255,255,0.1)";
  const glow = isWinning
    ? "0 0 30px rgba(46,213,115,0.25)"
    : isLosingBehind
    ? "0 0 30px rgba(255,71,87,0.2)"
    : "none";
  return (
    <div style={{
      background: isActive ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
      border: `2px solid ${border}`,
      borderRadius: 20,
      padding: "24px 28px",
      minWidth: 160,
      flex:1,
      boxShadow: glow,
      transition: "all 0.4s ease",
      position:"relative",
      overflow:"hidden",
    }}>
      {isActive && (
        <div style={{
          position:"absolute", top:10, right:12,
          background:"#FFD700", borderRadius:20,
          fontSize:10, fontWeight:700, padding:"3px 10px",
          color:"#000", letterSpacing:1,
          fontFamily:"'DM Sans',sans-serif",
        }}>ACTIVE</div>
      )}
      <div style={{
        fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.5)",
        letterSpacing:2, marginBottom:8, fontFamily:"'DM Sans',sans-serif",
        textTransform:"uppercase",
      }}>{side === 0 ? "◀ TEAM A" : "TEAM B ▶"}</div>
      <div style={{
        fontSize:22, fontWeight:700, color:"#fff",
        fontFamily:"'Bebas Neue',sans-serif", letterSpacing:1, marginBottom:12,
        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
      }}>{name}</div>
      <div style={{
        fontSize:52, fontWeight:900, lineHeight:1,
        color: isWinning ? "#2ED573" : isLosingBehind ? "#FF4757" : "#fff",
        fontFamily:"'Bebas Neue',sans-serif", letterSpacing:2,
        transition:"color 0.4s",
      }}>{score}</div>
      <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:4, fontFamily:"'DM Sans',sans-serif" }}>
        POINTS
      </div>
    </div>
  );
}