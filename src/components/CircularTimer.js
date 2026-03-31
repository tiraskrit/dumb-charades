import React from "react";
import { pad } from "../utils/helpers";

// ── Circular Timer ────────────────────────────────────────────────────────────
export default function CircularTimer({ timeLeft, totalTime, isPassed }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const pct = timeLeft / totalTime;
  const dash = circ * pct;
  const color = timeLeft <= 10 ? "#FF4757" : isPassed ? "#FFA502" : "#2ED573";
  return (
    <div style={{ position:"relative", width:140, height:140, display:"flex", alignItems:"center", justifyContent:"center", overflow:"visible" }}>
      <svg width="140" height="140" style={{ transform:"rotate(-90deg)", overflow:"visible", position:"absolute", inset:0 }}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10"/>
        <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition:"stroke-dasharray 0.5s linear, stroke 0.3s" }}
        />
      </svg>
      <div style={{
        position:"absolute", top:"50%", left:"50%", transform:"translate(-50%, -50%)",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        width:"100%", height:"100%",
      }}>
        <span className="timer-text" style={{ fontSize:36, fontWeight:800, color, fontFamily:"'Bebas Neue',sans-serif", letterSpacing:2 }}>
          {pad(Math.floor(timeLeft/60))}:{pad(timeLeft%60)}
        </span>
        <span className="timer-label" style={{ fontSize:11, color:"rgba(255,255,255,0.45)", fontFamily:"'DM Sans',sans-serif", letterSpacing:1 }}>
          {isPassed ? "PASSED" : "SECONDS"}
        </span>
      </div>
    </div>
  );
}