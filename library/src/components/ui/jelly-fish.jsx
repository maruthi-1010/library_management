import React from "react";

const SANS = "'Inter', 'Helvetica Neue', Arial, system-ui, sans-serif";
const DISPLAY = "'Inter', 'Helvetica Neue', 'Arial Black', sans-serif";
const INK = "#ffffff";

/* Inline film-grain noise overlay */
const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const PHRASES = ["BOOKS", "DISCOVERY", "KNOWLEDGE", "WISDOM"];
const LOOP = 14; // seconds per full 360° orbit
const RING_N = PHRASES.length;
const RING_STEP = 360 / RING_N;
const RING_R = 640;
const PERSP = 2200;

const MANIFESTO =
  "EXPLORE THOUSANDS OF BOOKS, ACADEMIC JOURNALS AND DIGITAL VOLUMES IN OUR SMART CATALOG.";

const TICK_LABELS = ["API", "LMS", "DATA", "AI"];

function SideRuler({ side }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        [side]: "1.4vh",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.1vh",
        height: "56vh",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: 13 }).map((_, i) => (
        <span
          key={i}
          style={{
            width: i % 4 === 0 ? "1.4vh" : "0.7vh",
            height: 1,
            background: "rgba(255, 255, 255, 0.25)",
          }}
        />
      ))}
      <span
        style={{
          position: "absolute",
          [side]: "-2.4vh",
          writingMode: "vertical-rl",
          transform: side === "left" ? "rotate(180deg)" : "none",
          fontFamily: SANS,
          fontSize: "0.95vh",
          fontWeight: 600,
          letterSpacing: "0.35em",
          color: "rgba(255, 255, 255, 0.45)",
          textTransform: "uppercase",
        }}
      >
        {TICK_LABELS.join(" · ")}
      </span>
    </div>
  );
}

export default function BookDriftLoader({ message = "LOADING LIBRARY SYSTEM..." }) {
  return (
    <section
      className="jelly-loop"
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        background:
          "radial-gradient(125% 120% at 50% 28%, #09090b 0%, #0f0f14 46%, #14141d 74%, #09090b 100%)",
        fontFamily: SANS,
        color: "#ffffff"
      }}
    >
      <style>{JELLY_CSS}</style>

      {/* Top Nav */}
      <header
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          padding: "2.4vh 2.6vw",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.4vw" }}>
          <span style={{ fontWeight: 900, fontSize: "1.9vh", letterSpacing: "-0.02em" }}>
            smart
          </span>
          <span style={{ fontStyle: "italic", fontWeight: 500, fontSize: "1.7vh", opacity: 0.85 }}>
            library
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: "1.8vw",
            fontSize: "1.05vh",
            fontWeight: 600,
            letterSpacing: "0.18em",
            opacity: 0.75,
          }}
        >
          <span>[ CATALOG ]</span>
          <span>[ GOOGLE BOOKS API ]</span>
        </div>
      </header>

      {/* Orbiting Word Ring Carousel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          perspective: `${PERSP}px`,
          perspectiveOrigin: "50% 46%",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          className="jelly-stage"
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            animation: `jelly-orbit ${LOOP}s linear infinite`,
            willChange: "transform",
          }}
        >
          {PHRASES.map((p, i) => (
            <span
              key={p}
              className="jelly-phrase"
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                fontFamily: DISPLAY,
                fontWeight: 900,
                fontSize: "26vh",
                lineHeight: 1,
                letterSpacing: "-0.05em",
                whiteSpace: "nowrap",
                color: INK,
                opacity: 0,
                transform: `rotateY(${(i * RING_STEP).toFixed(2)}deg) translateZ(${RING_R}px) rotateY(180deg)`,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                animation: `jelly-fade ${LOOP}s linear ${(
                  (-LOOP * ((RING_N - i) % RING_N)) / RING_N -
                  LOOP / 2
                ).toFixed(3)}s infinite`,
                willChange: "opacity",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  animation: `jelly-rise ${LOOP}s linear ${(
                    (-LOOP * ((RING_N - i) % RING_N)) / RING_N -
                    LOOP / 2
                  ).toFixed(3)}s infinite`,
                  willChange: "transform",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    transform: "scaleX(0.85)",
                    transformOrigin: "center",
                  }}
                >
                  {p}
                </span>
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Floating Ambient Glowing Particles */}
      {[
        { left: "18%", size: "1.2vh", delay: "0s", dur: "13s" },
        { left: "75%", size: "1.6vh", delay: "3s", dur: "15s" },
        { left: "52%", size: "0.9vh", delay: "7s", dur: "11s" },
        { left: "34%", size: "1.4vh", delay: "5s", dur: "14s" },
        { left: "85%", size: "1.0vh", delay: "2s", dur: "12s" },
      ].map((b, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            bottom: "-4vh",
            left: b.left,
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: "rgba(168, 85, 247, 0.4)",
            boxShadow: "0 0 12px rgba(168, 85, 247, 0.6)",
            zIndex: 15,
            animation: `jelly-bubble ${b.dur} linear ${b.delay} infinite`,
            willChange: "transform, opacity",
          }}
        />
      ))}

      {/* Side Manifesto */}
      <div
        style={{
          position: "absolute",
          right: "4vw",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 38,
          width: "min(22vw, 30vh)",
          textAlign: "right",
          pointerEvents: "none",
          animation: `jelly-manifesto ${LOOP}s ease-in-out 0s infinite`,
          willChange: "opacity, transform",
        }}
      >
        <p
          style={{
            margin: "1.2vh 0 0",
            fontFamily: SANS,
            fontSize: "1.35vh",
            fontWeight: 600,
            letterSpacing: "0.1em",
            lineHeight: 1.7,
            color: "rgba(255, 255, 255, 0.75)",
            textTransform: "uppercase",
          }}
        >
          {MANIFESTO}
        </p>
      </div>

      {/* Side Rulers */}
      <SideRuler side="left" />
      <SideRuler side="right" />

      {/* Bottom Rotating Captions */}
      <div
        style={{
          position: "absolute",
          bottom: "3.4vh",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 40,
          width: "60vw",
          textAlign: "center",
          height: "3.4vh",
        }}
      >
        {[
          message.toUpperCase(),
          "BOOKS • DISCOVERY • KNOWLEDGE • WISDOM",
          "POWERED BY GOOGLE BOOKS API & SMART CIRCULATION ENGINE",
        ].map((c, i) => (
          <p
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              margin: 0,
              fontSize: "1.15vh",
              fontWeight: 700,
              letterSpacing: "0.16em",
              lineHeight: 1.5,
              color: "rgba(255, 255, 255, 0.8)",
              opacity: 0,
              animation: `jelly-caption 18s ease-in-out ${i * 6}s infinite`,
              willChange: "opacity",
            }}
          >
            {c}
          </p>
        ))}
      </div>

      {/* Corner Status Pill */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "3vh",
          left: "2.6vw",
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          gap: "0.6vw",
          padding: "0.7vh 1vh",
          borderRadius: "999px",
          background: "#18181b",
          border: "1px solid #27272a",
          color: "#fff",
          fontSize: "0.9vh",
          fontWeight: 700,
          letterSpacing: "0.15em",
        }}
      >
        <span style={{ width: "1vh", height: "1vh", borderRadius: "50%", background: "#a855f7" }} />
        INITIALIZING SYSTEM
      </div>

      {/* Film grain overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 60,
          pointerEvents: "none",
          backgroundImage: `url("${GRAIN}")`,
          backgroundSize: "140px 140px",
          opacity: 0.08,
          mixBlendMode: "overlay",
        }}
      />
    </section>
  );
}

const JELLY_CSS = `
@keyframes jelly-orbit{
  from{transform:rotateY(0deg)}
  to{transform:rotateY(-360deg)}
}

@keyframes jelly-fade{
  0%{opacity:1}
  12%{opacity:1}
  25%{opacity:0}
  75%{opacity:0}
  88%{opacity:1}
  100%{opacity:1}
}

@keyframes jelly-rise{
  0%{transform:translateY(0)}
  25%{transform:translateY(0)}
  50%{transform:translateY(32vh)}
  78%{transform:translateY(32vh);animation-timing-function:ease-out}
  88%{transform:translateY(0)}
  100%{transform:translateY(0)}
}

@keyframes jelly-manifesto{
  0%,74%{opacity:0;transform:translateY(-50%) translateX(2vw)}
  81%{opacity:1;transform:translateY(-50%) translateX(0)}
  92%{opacity:1;transform:translateY(-50%) translateX(0)}
  98%,100%{opacity:0;transform:translateY(-50%) translateX(2vw)}
}

@keyframes jelly-bubble{
  0%{transform:translateY(0) translateX(0);opacity:0}
  12%{opacity:.7}
  80%{opacity:.5}
  100%{transform:translateY(-108vh) translateX(2vh);opacity:0}
}

@keyframes jelly-caption{
  0%{opacity:0}
  4%,28%{opacity:1}
  33%,100%{opacity:0}
}

@media (prefers-reduced-motion: reduce){
  .jelly-loop *{
    animation-duration:.001ms !important;
    animation-iteration-count:1 !important;
  }
  .jelly-loop .jelly-stage{
    animation:none !important;
    transform:rotateY(0deg) !important;
  }
  .jelly-loop .jelly-phrase{
    animation:none !important;
    opacity:0 !important;
  }
  .jelly-loop .jelly-phrase:first-of-type{
    opacity:1 !important;
  }
}
`;
