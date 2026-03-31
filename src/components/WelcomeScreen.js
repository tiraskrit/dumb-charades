import React, { useState, useRef } from "react";
import { SAMPLE_MOVIES } from "../utils/sampleMovies";
import { shuffle } from "../utils/helpers";

// ═══════════════════════════════════════════════════════════════════════════════
// WELCOME SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
export default function WelcomeScreen({ onStart }) {
  const [team1, setTeam1] = useState("Team Alpha");
  const [team2, setTeam2] = useState("Team Bravo");
  const [rounds, setRounds] = useState(25);
  const [movies, setMovies] = useState([]);
  const [movieText, setMovieText] = useState("");
  const [fileLoaded, setFileLoaded] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split("\n").map(l => l.trim()).filter(Boolean);
      setMovies(lines);
      setMovieText(lines.join("\n"));
      setFileLoaded(true);
      setError("");
    };
    reader.readAsText(file);
  };

  const handleStart = () => {
    if (!team1.trim() || !team2.trim()) { setError("Please enter both team names."); return; }
    if (rounds < 1 || rounds > 50) { setError("Rounds must be between 1 and 50."); return; }
    const list = movies.length > 0 ? movies : SAMPLE_MOVIES;
    if (list.length < rounds * 2) { setError(`Need at least ${rounds * 2} movies. You have ${list.length}.`); return; }
    onStart({ team1: team1.trim(), team2: team2.trim(), rounds, movies: shuffle(list) });
  };

  return (
    <div style={{
      minHeight:"100vh", background:"#0A0A0F",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'DM Sans',sans-serif",
      backgroundImage:"radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,61,183,0.35) 0%, transparent 70%)",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>

      <div style={{ width:"100%", maxWidth:520, padding:"0 20px" }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{
            display:"inline-block", background:"rgba(255,255,255,0.05)",
            border:"1px solid rgba(255,255,255,0.1)", borderRadius:16,
            padding:"8px 20px", marginBottom:20,
            fontSize:12, letterSpacing:3, color:"rgba(255,255,255,0.4)",
          }}>🎬 HOST CONSOLE</div>
          <h1 style={{
            fontSize:64, margin:0, lineHeight:1,
            fontFamily:"'Bebas Neue',sans-serif", letterSpacing:4,
            background:"linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.4))",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          }}>DUMB</h1>
          <h1 style={{
            fontSize:64, margin:0, lineHeight:1,
            fontFamily:"'Bebas Neue',sans-serif", letterSpacing:4,
            background:"linear-gradient(135deg, #A78BFA, #6366F1)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          }}>CHARADES</h1>
          <p style={{ color:"rgba(255,255,255,0.35)", fontSize:14, marginTop:12, letterSpacing:1 }}>
            The silent movie game — host edition
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:24, padding:36,
        }}>
          {/* Team Names */}
          <div style={{ marginBottom:28 }}>
            <label style={{ display:"block", fontSize:11, letterSpacing:2, color:"rgba(255,255,255,0.4)", marginBottom:14, textTransform:"uppercase" }}>
              Team Names
            </label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                [team1, setTeam1, "Team Alpha"],
                [team2, setTeam2, "Team Bravo"],
              ].map(([val, set, ph], i) => (
                <input key={i} value={val} onChange={e => set(e.target.value)} placeholder={ph}
                  style={{
                    background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
                    borderRadius:12, padding:"13px 16px", color:"#fff", fontSize:15, fontWeight:600,
                    outline:"none", fontFamily:"'DM Sans',sans-serif",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Rounds */}
          <div style={{ marginBottom:28 }}>
            <label style={{ display:"block", fontSize:11, letterSpacing:2, color:"rgba(255,255,255,0.4)", marginBottom:14, textTransform:"uppercase" }}>
              Number of Rounds
            </label>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              {[10,15,20,30].map(n => (
                <button key={n} onClick={() => setRounds(n)} style={{
                  flex:1, padding:"12px 0", borderRadius:12, border:"1px solid",
                  borderColor: rounds === n ? "#A78BFA" : "rgba(255,255,255,0.1)",
                  background: rounds === n ? "rgba(167,139,250,0.15)" : "transparent",
                  color: rounds === n ? "#A78BFA" : "rgba(255,255,255,0.4)",
                  fontSize:18, fontWeight:700, cursor:"pointer", fontFamily:"'Bebas Neue',sans-serif",
                  letterSpacing:1, transition:"all 0.2s",
                }}>{n}</button>
              ))}
              <input type="number" value={rounds} min={1} max={50}
                onChange={e => setRounds(Number(e.target.value))}
                style={{
                  flex:1, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:12, padding:"12px 0", color:"#fff", fontSize:18, fontWeight:700,
                  textAlign:"center", outline:"none", fontFamily:"'Bebas Neue',sans-serif",
                }}
              />
            </div>
          </div>

          {/* Movie File */}
          <div style={{ marginBottom:28 }}>
            <label style={{ display:"block", fontSize:11, letterSpacing:2, color:"rgba(255,255,255,0.4)", marginBottom:14, textTransform:"uppercase" }}>
              Movie List (optional)
            </label>
            <input ref={fileRef} type="file" accept=".txt" onChange={handleFile} style={{ display:"none" }}/>
            <button onClick={() => fileRef.current.click()} style={{
              width:"100%", padding:"14px", borderRadius:12, border:"1px dashed rgba(255,255,255,0.2)",
              background:"transparent", color: fileLoaded ? "#2ED573" : "rgba(255,255,255,0.4)",
              fontSize:14, cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
              transition:"all 0.2s",
            }}>
              {fileLoaded ? `✓ ${movies.length} movies loaded` : "📁 Upload .txt file (one movie per line)"}
            </button>
            {!fileLoaded && (
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.25)", marginTop:8, textAlign:"center" }}>
                No file? We'll use {SAMPLE_MOVIES.length} sample movies.
              </p>
            )}
          </div>

          {error && (
            <div style={{
              background:"rgba(255,71,87,0.12)", border:"1px solid rgba(255,71,87,0.3)",
              borderRadius:10, padding:"12px 16px", marginBottom:20,
              color:"#FF6B7A", fontSize:13,
            }}>{error}</div>
          )}

          <button onClick={handleStart} style={{
            width:"100%", padding:"18px", borderRadius:14,
            background:"linear-gradient(135deg, #7C3AED, #A78BFA)",
            border:"none", color:"#fff", fontSize:18, fontWeight:700,
            cursor:"pointer", fontFamily:"'Bebas Neue',sans-serif", letterSpacing:3,
            boxShadow:"0 8px 32px rgba(124,58,237,0.4)",
            transition:"transform 0.15s, box-shadow 0.15s",
          }}
            onMouseEnter={e => { e.target.style.transform="translateY(-2px)"; e.target.style.boxShadow="0 12px 40px rgba(124,58,237,0.5)"; }}
            onMouseLeave={e => { e.target.style.transform="none"; e.target.style.boxShadow="0 8px 32px rgba(124,58,237,0.4)"; }}
          >
            START GAME →
          </button>
        </div>

        <p style={{ textAlign:"center", color:"rgba(255,255,255,0.2)", fontSize:12, marginTop:24 }}>
          20 pts for correct answer · 10 pts for passed answer · 90s / 10s timers
        </p>
      </div>
    </div>
  );
}