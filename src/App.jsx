import { useState, useEffect } from "react";

const STEPS = [
  { narration: <>We have <strong>9 baskets</strong> and <strong>6 apples</strong>, that's <strong>96</strong>. Let's divide by <strong>3</strong>!</>, btnLabel: "Start Mission 🚀", btnColor: "green" },
  { narration: <>Division means making <strong>equal groups</strong>. Let's split <strong>96</strong> into <strong>3 equal groups</strong>.</>, btnLabel: "Divide the Baskets →", btnColor: "teal" },
  { narration: <>First the <strong>tens</strong>: 9 baskets ÷ 3 groups = <strong>3 baskets each!</strong></>, btnLabel: "Divide the Apples →", btnColor: "orange" },
  { narration: <>Now the <strong>ones</strong>: 6 apples ÷ 3 groups = <strong>2 apples each!</strong></>, btnLabel: "See Final Result →", btnColor: "orange" },
  { narration: <>🎉 Done! <strong>96 ÷ 3 = 32</strong>. Each group has 3 baskets and 2 apples. Mission complete!</>, btnLabel: "Mission Complete! 🌟", btnColor: "done" },
];

const BTN_BG = { green: "#4A8C3F", teal: "#009AAB", orange: "#E0712C", done: "#355CAA" };

function Basket({ scale = 1, faded = false, falling = false, delay = 0 }) {
  const [visible, setVisible] = useState(delay === 0);
  useEffect(() => { if (delay > 0) { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); } }, [delay]);
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      opacity: faded ? 0 : visible ? 1 : 0,
      transform: falling ? "translateY(60px) scale(0)" : visible ? `scale(${scale})` : "scale(0)",
      transition: "all 0.6s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      <div style={{ width: "2rem", height: "0.9rem", borderTop: "3px solid #fcd34d", borderLeft: "3px solid #fcd34d", borderRight: "3px solid #fcd34d", borderRadius: "9999px 9999px 0 0", opacity: 0.7, marginBottom: "-2px" }} />
      <div style={{ background: "#fef3c7", borderBottom: "3px solid #fcd34d", borderLeft: "2px solid #fde68a", borderRight: "2px solid #fde68a", borderRadius: "0 0 8px 8px", padding: "3px", display: "flex", flexWrap: "wrap", gap: "1px", width: "2.8rem", justifyContent: "center", minHeight: "40px", boxShadow: "0 2px 4px rgba(0,0,0,0.06)" }}>
        {Array(10).fill(null).map((_, i) => (<span key={i} style={{ fontSize: "8px", lineHeight: 1 }}>🍎</span>))}
      </div>
      <span style={{ fontSize: "9px", fontWeight: 700, color: "#d97706", marginTop: "2px" }}>10</span>
    </div>
  );
}

function Apple({ delay = 0, faded = false }) {
  const [visible, setVisible] = useState(delay === 0);
  useEffect(() => { if (delay > 0) { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); } }, [delay]);
  return (
    <span style={{
      fontSize: "1.4rem", lineHeight: 1, display: "inline-block",
      opacity: faded ? 0 : visible ? 1 : 0,
      transform: faded ? "translateY(40px) scale(0)" : visible ? "scale(1)" : "scale(0)",
      transition: "all 0.45s cubic-bezier(0.34,1.56,0.64,1)",
    }} aria-hidden="true">🍎</span>
  );
}

// Renders a pile of baskets + loose apples. Used for the "96" starting pile
// and for each "32" group after division.
function Pile({ baskets = 3, apples = 2, label, scale = 1, basketDelayBase = 0, appleDelayBase = 250 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
      <div style={{ display: "flex", gap: "4px", alignItems: "flex-end", justifyContent: "center", minHeight: "60px", flexWrap: "wrap", maxWidth: "240px" }}>
        {Array(baskets).fill(null).map((_, i) => (<Basket key={i} scale={scale} delay={basketDelayBase + i * 60} />))}
      </div>
      <div style={{ display: "flex", gap: "2px", justifyContent: "center", minHeight: "20px", flexWrap: "wrap", maxWidth: "140px" }}>
        {Array(apples).fill(null).map((_, i) => (<Apple key={i} delay={appleDelayBase + i * 50} />))}
      </div>
      {label && <span style={{ fontSize: "10px", fontWeight: 700, color: "#92A1AA", textTransform: "uppercase", letterSpacing: "0.07em", marginTop: "2px" }}>{label}</span>}
    </div>
  );
}

export default function LongDivisionLab() {
  const [step, setStep] = useState(0);
  const [showTensResult, setShowTensResult] = useState(false);
  const [showOnesResult, setShowOnesResult] = useState(false);
  const [highlightTens, setHighlightTens] = useState(false);
  const [highlightOnes, setHighlightOnes] = useState(false);

  function reset() {
    setStep(0);
    setShowTensResult(false);
    setShowOnesResult(false);
    setHighlightTens(false);
    setHighlightOnes(false);
  }

  function handleNext() {
    const next = step + 1;
    setStep(next);
    // Long division algorithm goes LEFT to RIGHT: tens first, then ones.
    if (next === 2) {
      setHighlightTens(true);
      setTimeout(() => setShowTensResult(true), 600);
    }
    if (next === 3) {
      setHighlightTens(false);
      setHighlightOnes(true);
      setTimeout(() => setShowOnesResult(true), 600);
    }
    if (next === 4) {
      setHighlightOnes(false);
    }
  }

  const isDone = step >= 4;
  const current = STEPS[Math.min(step, STEPS.length - 1)];

  // Step 0: one pile of 96 (9 baskets + 6 apples). Step 1+: three groups of 32.
  const showAsOnePile = step === 0;
  const groupCount = showAsOnePile ? 1 : 3;

  return (
    <div style={{ fontFamily: "Andika, sans-serif", background: "#FAFAFA", minHeight: "100vh", padding: "10px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Andika:wght@400;700&display=swap');`}</style>

      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* ── Header ── */}
        <header style={{ background: "#355CAA", borderBottom: "8px solid #153363", borderRadius: "16px 16px 0 0", padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "clamp(1.8rem, 6vw, 2.6rem)", fontWeight: 700, color: "white", lineHeight: 1 }} aria-hidden="true">÷</span>
          <div>
            <h1 style={{ color: "white", fontSize: "clamp(1rem,4vw,1.45rem)", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>Long Division Lab</h1>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "10px", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Learning to divide with baskets &amp; apples</p>
          </div>
        </header>

        {/* ── Main card ── */}
        <div style={{ background: "white", border: "2px solid #E9EEF3", borderTop: "none", borderRadius: "0 0 24px 24px", padding: "14px" }}>

          {/* ── Legend ── */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "clamp(16px,5vw,48px)", marginBottom: "14px", padding: "10px 16px", background: "#FAFAFA", border: "2px solid #E9EEF3", borderRadius: "16px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ transform: "scale(0.7)", transformOrigin: "bottom center", height: "52px", display: "flex", alignItems: "flex-end" }}>
                <Basket />
              </div>
              <span style={{ fontSize: "clamp(0.75rem,3vw,0.88rem)", fontWeight: 700, color: "#6E777E" }}>1 Basket = 10 Apples</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.5rem" }} aria-hidden="true">🍎</span>
              <span style={{ fontSize: "clamp(0.75rem,3vw,0.88rem)", fontWeight: 700, color: "#6E777E" }}>1 Apple = 1 Unit</span>
            </div>
          </div>

          {/* ── Two columns ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "12px", marginBottom: "14px" }}>

            {/* Visual: starting pile (step 0) or three result groups (steps 1+) */}
            <div style={{ background: "#FAFAFA", border: "2px solid #E9EEF3", borderRadius: "24px", padding: "14px" }}>
              <div style={{ display: "flex", gap: "clamp(8px,2vw,16px)", justifyContent: "center", alignItems: "flex-end", minHeight: "150px", flexWrap: "wrap" }}>
                {showAsOnePile ? (
                  <div key="pile" style={{ padding: "8px 10px" }}>
                    <Pile baskets={9} apples={6} label="96 apples" />
                  </div>
                ) : (
                  Array(groupCount).fill(null).map((_, i) => (
                    <div key={`${step}-${i}`} style={{
                      padding: "8px 10px", borderRadius: "16px",
                      background: (highlightTens || highlightOnes) ? "white" : "transparent",
                      border: (highlightTens || highlightOnes) ? "2px solid #51A7D6" : "2px solid transparent",
                      boxShadow: (highlightTens || highlightOnes) ? "0 4px 12px rgba(81,167,214,0.15)" : "none",
                      transition: "all 0.4s ease",
                    }}>
                      <Pile baskets={3} apples={2} label={`Group ${i + 1}`} />
                    </div>
                  ))
                )}
              </div>
              <div style={{ textAlign: "center", fontSize: "10px", fontWeight: 700, color: "#92A1AA", textTransform: "uppercase", letterSpacing: "0.07em", marginTop: "10px", paddingTop: "8px", borderTop: "2px solid #E9EEF3" }}>
                {showAsOnePile ? "96 to divide into 3 groups" :
                 highlightTens ? "Dividing the tens" :
                 highlightOnes ? "Dividing the ones" :
                 isDone ? "3 equal groups of 32" : "3 equal groups"}
              </div>
            </div>

            {/* Numerical: long division bracket */}
            <div style={{ background: "#FAFAFA", border: "2px solid #E9EEF3", borderRadius: "24px", padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "170px" }}>
              <div style={{ display: "flex", alignItems: "stretch", gap: "10px" }}>
                {/* Divisor (3) ── sits to the left of the bracket */}
                <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: "4px" }}>
                  <span style={{ fontSize: "clamp(2.2rem,8vw,3.2rem)", fontWeight: 700, color: "#303030", lineHeight: 1 }}>3</span>
                </div>

                {/* Closing bracket ── the ")" of long division */}
                <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: "2px" }}>
                  <span style={{ fontSize: "clamp(3rem,11vw,4.4rem)", fontWeight: 400, color: "#303030", lineHeight: 0.85 }}>)</span>
                </div>

                {/* Quotient (on top) + dividend (below the bar) */}
                <div>
                  {/* Quotient row, with the bar as its bottom border */}
                  <div style={{
                    display: "flex", gap: "10px",
                    borderBottom: "7px solid #303030",
                    paddingBottom: "6px", marginBottom: "8px",
                  }}>
                    {/* Tens digit of quotient (3) */}
                    <div style={{ minWidth: "50px", textAlign: "center" }}>
                      <div style={{
                        fontSize: "clamp(2.2rem,8vw,3.2rem)", fontWeight: 700, color: "#4A8C3F", lineHeight: 1,
                        opacity: showTensResult ? 1 : 0,
                        transform: showTensResult ? "translateY(0)" : "translateY(-14px)",
                        transition: "all 0.5s ease",
                      }}>3</div>
                    </div>
                    {/* Ones digit of quotient (2) */}
                    <div style={{ minWidth: "50px", textAlign: "center" }}>
                      <div style={{
                        fontSize: "clamp(2.2rem,8vw,3.2rem)", fontWeight: 700, color: "#4A8C3F", lineHeight: 1,
                        opacity: showOnesResult ? 1 : 0,
                        transform: showOnesResult ? "translateY(0)" : "translateY(-14px)",
                        transition: "all 0.5s ease",
                      }}>2</div>
                    </div>
                  </div>

                  {/* Dividend row (9 and 6) */}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ minWidth: "50px", textAlign: "center" }}>
                      <div style={{
                        fontSize: "clamp(2.2rem,8vw,3.2rem)", fontWeight: 700, lineHeight: 1,
                        color: highlightTens ? "#E0712C" : "#303030",
                        transform: highlightTens ? "scale(1.1)" : "scale(1)",
                        transition: "all 0.3s ease",
                      }}>9</div>
                    </div>
                    <div style={{ minWidth: "50px", textAlign: "center" }}>
                      <div style={{
                        fontSize: "clamp(2.2rem,8vw,3.2rem)", fontWeight: 700, lineHeight: 1,
                        color: highlightOnes ? "#E0712C" : "#303030",
                        transform: highlightOnes ? "scale(1.1)" : "scale(1)",
                        transition: "all 0.3s ease",
                      }}>6</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Narration ── */}
          <div style={{ background: "#FAFAFA", border: "2px solid #E9EEF3", borderRadius: "16px", padding: "14px 18px", minHeight: "60px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
            <p style={{ fontSize: "clamp(0.92rem,3.5vw,1.05rem)", color: "#303030", textAlign: "center", margin: 0, lineHeight: 1.6 }}>
              {current.narration}
            </p>
          </div>

          {/* ── Buttons ── */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleNext}
              disabled={isDone}
              style={{
                background: BTN_BG[current.btnColor] ?? "#4A8C3F",
                color: "white", border: "none", borderRadius: "10px",
                padding: "13px 24px", fontSize: "clamp(0.88rem,3vw,1rem)",
                fontWeight: 700, fontFamily: "Andika, sans-serif",
                cursor: isDone ? "default" : "pointer", opacity: isDone ? 0.8 : 1,
                minHeight: "44px", flex: "1 1 160px", maxWidth: "260px",
                transition: "transform 0.15s, filter 0.15s",
              }}
              onMouseEnter={e => { if (!isDone) e.currentTarget.style.filter = "brightness(1.1)" }}
              onMouseLeave={e => { e.currentTarget.style.filter = "" }}
              onMouseDown={e => { e.currentTarget.style.transform = "scale(0.96)" }}
              onMouseUp={e => { e.currentTarget.style.transform = "" }}
            >
              {current.btnLabel}
            </button>

            <button
              onClick={reset}
              style={{
                background: "#E9EEF3", color: "#6E777E", border: "none", borderRadius: "6px",
                padding: "13px 20px", fontSize: "clamp(0.85rem,3vw,0.92rem)",
                fontWeight: 700, fontFamily: "Andika, sans-serif",
                cursor: "pointer", minHeight: "44px",
                flex: "1 1 100px", maxWidth: "150px",
                transition: "filter 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.filter = "brightness(0.95)" }}
              onMouseLeave={e => { e.currentTarget.style.filter = "" }}
            >
              Reset
            </button>
          </div>

          <footer style={{ marginTop: "18px", textAlign: "center" }}>
            <p style={{ fontSize: "10px", color: "#BEC7CD", letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>© 2026 THECENTERBOOK.COM</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
