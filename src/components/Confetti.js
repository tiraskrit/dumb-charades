import React from "react";

// ── Confetti helper ───────────────────────────────────────────────────────────
export default function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    color: ["#FFD700","#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FFEAA7","#DDA0DD","#98D8C8"][i % 8],
    size: 6 + Math.random() * 10,
    duration: 2 + Math.random() * 2,
  }));
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:999 }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position:"absolute", left:`${p.left}%`, top:"-20px",
          width:p.size, height:p.size,
          background:p.color,
          borderRadius: p.id % 3 === 0 ? "50%" : "2px",
          animation:`fall ${p.duration}s ${p.delay}s ease-in forwards`,
        }}/>
      ))}
      <style>{`@keyframes fall{to{transform:translateY(105vh) rotate(720deg);opacity:0}}`}</style>
    </div>
  );
}