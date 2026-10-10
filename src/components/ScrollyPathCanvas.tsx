import React, { useState, useEffect, useRef } from 'react';

type Stage = 'point' | 'logic' | 'interface' | 'motion';

export default function ScrollyPathCanvas() {
  const [activeStage, setActiveStage] = useState<Stage>('logic');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      
      const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    // Scroll listener to update visual stage as user scrolls past sections
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const progress = scrollY / docHeight;

      if (progress < 0.20) {
        setActiveStage('point');
      } else if (progress < 0.45) {
        setActiveStage('logic');
      } else if (progress < 0.70) {
        setActiveStage('interface');
      } else {
        setActiveStage('motion');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  const stages = [
    { id: 'point', label: '01 / Initial Point', desc: 'A discrete instruction' },
    { id: 'logic', label: '02 / Branching Logic', desc: 'Software state tree' },
    { id: 'interface', label: '03 / Interface Interaction', desc: 'WebSocket telemetry' },
    { id: 'motion', label: '04 / Physical Motion', desc: 'Spatial trajectory path' },
  ];

  return (
    <div className="scrolly-canvas-wrapper" ref={containerRef}>
      <div className="scrolly-controls-bar">
        <div className="controls-label font-mono">
          <span className="accent-bullet" aria-hidden="true"></span>
          <span>Theme Visualizer: "From logic to motion"</span>
        </div>

        <div className="stage-pills" role="tablist" aria-label="Visual stages">
          {stages.map((st) => (
            <button
              key={st.id}
              role="tab"
              aria-selected={activeStage === st.id}
              onClick={() => setActiveStage(st.id as Stage)}
              className={`stage-pill font-mono ${activeStage === st.id ? 'is-active' : ''}`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      <div className="canvas-frame">
        <svg
          viewBox="0 0 600 340"
          className="stage-svg"
          aria-label={`Visual diagram depicting ${activeStage}`}
        >
          <defs>
            <linearGradient id="orangeGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF5500" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FF8844" stopOpacity="0.4" />
            </linearGradient>
            <pattern id="dotGrid" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="1" fill="#E4E1D8" />
            </pattern>
          </defs>

          {/* Grid Background */}
          <rect width="600" height="340" fill="url(#dotGrid)" />

          {/* ================= STAGE 1: THE INITIAL POINT ================= */}
          {activeStage === 'point' && (
            <g className="point-stage">
              <circle cx="300" cy="170" r="28" fill="rgba(255, 85, 0, 0.08)" />
              <circle cx="300" cy="170" r="14" fill="rgba(255, 85, 0, 0.2)" />
              <circle cx="300" cy="170" r="6" fill="#FF5500" />
              <text x="300" y="225" textAnchor="middle" fill="#18191B" fontSize="13" fontFamily="var(--font-sans)" fontWeight="600">
                Discrete Input: seed_state(x₀)
              </text>
              <text x="300" y="246" textAnchor="middle" fill="#7E8289" fontSize="11" fontFamily="var(--font-mono)">
                Single thread of execution at origin [0.0, 0.0]
              </text>
            </g>
          )}

          {/* ================= STAGE 2: BRANCHING LOGIC TREE ================= */}
          {activeStage === 'logic' && (
            <g className="logic-stage">
              {/* Root Node */}
              <circle cx="120" cy="170" r="7" fill="#FF5500" />
              <text x="120" y="150" textAnchor="middle" fill="#18191B" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">
                Input Node
              </text>

              {/* Branch 1 */}
              <path d="M127 170 C 180 170, 200 90, 270 90" fill="none" stroke="#CFCBC0" strokeWidth="2" />
              <circle cx="270" cy="90" r="5" fill="#18191B" />
              <text x="282" y="94" fill="#18191B" fontSize="11" fontFamily="var(--font-mono)">
                /scan (LiDAR Filter)
              </text>

              {/* Branch 2 - Active Topic */}
              <path d="M127 170 C 180 170, 200 170, 270 170" fill="none" stroke="#FF5500" strokeWidth="2.5" strokeDasharray="6 4" />
              <circle cx="270" cy="170" r="6" fill="#FF5500" />
              <text x="282" y="174" fill="#FF5500" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">
                /cmd_vel (Active Topic)
              </text>

              {/* Branch 3 */}
              <path d="M127 170 C 180 170, 200 250, 270 250" fill="none" stroke="#CFCBC0" strokeWidth="2" />
              <circle cx="270" cy="250" r="5" fill="#18191B" />
              <text x="282" y="254" fill="#18191B" fontSize="11" fontFamily="var(--font-mono)">
                /odom (State Estimator)
              </text>

              {/* Convergence to Controller */}
              <path d="M390 90 C 440 90, 440 160, 470 170" fill="none" stroke="#CFCBC0" strokeWidth="1.5" />
              <path d="M410 170 C 440 170, 450 170, 470 170" fill="none" stroke="#FF5500" strokeWidth="2" />
              <path d="M390 250 C 440 250, 440 180, 470 170" fill="none" stroke="#CFCBC0" strokeWidth="1.5" />

              <rect x="470" y="152" width="105" height="36" rx="4" fill="#FFFFFF" stroke="#FF5500" strokeWidth="1.5" />
              <text x="522" y="174" textAnchor="middle" fill="#FF5500" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">
                Costmap Nav2
              </text>
            </g>
          )}

          {/* ================= STAGE 3: INTERFACE TELEMETRY ================= */}
          {activeStage === 'interface' && (
            <g className="interface-stage">
              {/* Phone / Mobile Frame */}
              <rect x="80" y="60" width="140" height="220" rx="12" fill="#FFFFFF" stroke="#18191B" strokeWidth="2" />
              <rect x="135" y="72" width="30" height="4" rx="2" fill="#E4E1D8" />
              {/* Virtual Joystick */}
              <circle cx="150" cy="180" r="42" fill="none" stroke="#E4E1D8" strokeWidth="2" />
              <line x1="150" y1="138" x2="150" y2="222" stroke="#ECEAE3" strokeWidth="1" />
              <line x1="108" y1="180" x2="192" y2="180" stroke="#ECEAE3" strokeWidth="1" />
              <circle cx="162" cy="165" r="14" fill="#FF5500" opacity="0.9" />
              <text x="150" y="245" textAnchor="middle" fill="#7E8289" fontSize="9" fontFamily="var(--font-mono)">
                Flutter Touch Pad
              </text>

              {/* WebSocket Bridge Channel */}
              <path d="M225 170 L 375 170" fill="none" stroke="#FF5500" strokeWidth="2.5" strokeDasharray="8 4" />
              <rect x="250" y="148" width="100" height="24" rx="3" fill="#FFFFFF" stroke="#E4E1D8" />
              <text x="300" y="164" textAnchor="middle" fill="#FF5500" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">
                WS 9090 (45ms)
              </text>

              {/* Jetson / Robot Receiver Node */}
              <rect x="380" y="90" width="160" height="160" rx="6" fill="#FFFFFF" stroke="#18191B" strokeWidth="1.5" />
              <rect x="390" y="100" width="140" height="26" rx="3" fill="rgba(255, 85, 0, 0.08)" />
              <text x="460" y="117" textAnchor="middle" fill="#FF5500" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">
                Jetson Orin Nano
              </text>
              <text x="400" y="150" fill="#52555A" fontSize="10" fontFamily="var(--font-mono)">
                linear.x: 0.35 m/s
              </text>
              <text x="400" y="172" fill="#52555A" fontSize="10" fontFamily="var(--font-mono)">
                angular.z: -0.12 r/s
              </text>
              <text x="400" y="194" fill="#52555A" fontSize="10" fontFamily="var(--font-mono)">
                status: ARMED
              </text>
              <text x="400" y="216" fill="#10B981" fontSize="10" fontFamily="var(--font-mono)">
                heartbeat: OK (20Hz)
              </text>
            </g>
          )}

          {/* ================= STAGE 4: PHYSICAL MOTION IN SPACE ================= */}
          {activeStage === 'motion' && (
            <g className="motion-stage">
              {/* Floor Plan / Boundary */}
              <rect x="60" y="40" width="480" height="260" rx="4" fill="none" stroke="#CFCBC0" strokeWidth="1.5" strokeDasharray="4 4" />
              
              {/* Obstacles */}
              <rect x="180" y="90" width="60" height="60" rx="2" fill="#E4E1D8" stroke="#CFCBC0" />
              <text x="210" y="125" textAnchor="middle" fill="#7E8289" fontSize="10" fontFamily="var(--font-mono)">Desk</text>

              <rect x="360" y="180" width="80" height="50" rx="2" fill="#E4E1D8" stroke="#CFCBC0" />
              <text x="400" y="210" textAnchor="middle" fill="#7E8289" fontSize="10" fontFamily="var(--font-mono)">Pillar</text>

              {/* Waypoints */}
              <circle cx="110" cy="240" r="4" fill="#7E8289" />
              <text x="110" y="260" textAnchor="middle" fill="#7E8289" fontSize="9" fontFamily="var(--font-mono)">WP-1</text>

              <circle cx="140" cy="90" r="4" fill="#7E8289" />
              <text x="140" y="78" textAnchor="middle" fill="#7E8289" fontSize="9" fontFamily="var(--font-mono)">WP-2</text>

              <circle cx="320" cy="110" r="4" fill="#7E8289" />
              <text x="320" y="98" textAnchor="middle" fill="#7E8289" fontSize="9" fontFamily="var(--font-mono)">WP-3</text>

              <circle cx="470" cy="130" r="4" fill="#7E8289" />
              <text x="470" y="118" textAnchor="middle" fill="#7E8289" fontSize="9" fontFamily="var(--font-mono)">Goal</text>

              {/* Smooth Spline Trajectory */}
              <path
                d="M 110 240 Q 110 130, 140 90 T 320 110 T 470 130"
                fill="none"
                stroke="#FF5500"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Differential Drive Robot Body at current position */}
              <g transform="translate(320, 110) rotate(-15)">
                <rect x="-16" y="-12" width="32" height="24" rx="4" fill="#18191B" />
                <rect x="-18" y="-15" width="8" height="5" rx="1" fill="#FF5500" />
                <rect x="-18" y="10" width="8" height="5" rx="1" fill="#FF5500" />
                <circle cx="6" cy="0" r="4" fill="#FF5500" />
                {/* LiDAR Scan Rays */}
                <path d="M 6 0 L 35 -20" stroke="rgba(255, 85, 0, 0.4)" strokeWidth="1" strokeDasharray="2 2" />
                <path d="M 6 0 L 40 0" stroke="rgba(255, 85, 0, 0.4)" strokeWidth="1" strokeDasharray="2 2" />
                <path d="M 6 0 L 35 20" stroke="rgba(255, 85, 0, 0.4)" strokeWidth="1" strokeDasharray="2 2" />
              </g>

              <text x="345" y="145" fill="#FF5500" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">
                Robot (Nav2 Controller)
              </text>
            </g>
          )}
        </svg>

        <div className="stage-caption font-mono">
          <span className="caption-tag">Current Transformation:</span>
          <span className="caption-text">
            {stages.find(s => s.id === activeStage)?.desc}
          </span>
        </div>
      </div>

      <style>{`
        .scrolly-canvas-wrapper {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 1.25rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }

        .scrolly-controls-bar {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-faint);
        }

        @media (min-width: 640px) {
          .scrolly-controls-bar {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .controls-label {
          font-size: 0.75rem;
          color: var(--text-faint);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .accent-bullet {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--accent-orange);
          display: inline-block;
        }

        .stage-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .stage-pill {
          font-size: 0.6875rem;
          padding: 0.25rem 0.55rem;
          border-radius: 4px;
          border: 1px solid var(--border-light);
          background-color: var(--bg-subtle);
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .stage-pill:hover {
          color: var(--text-main);
          border-color: var(--border-strong);
        }

        .stage-pill.is-active {
          background-color: var(--accent-orange-tint);
          border-color: var(--accent-orange);
          color: var(--accent-orange);
          font-weight: 600;
        }

        .canvas-frame {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-faint);
          border-radius: 6px;
          overflow: hidden;
          padding: 0.75rem;
        }

        .stage-svg {
          width: 100%;
          height: auto;
          display: block;
        }

        .stage-caption {
          margin-top: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-muted);
          border-top: 1px solid var(--border-faint);
          padding-top: 0.5rem;
        }

        .caption-tag {
          color: var(--text-faint);
          text-transform: uppercase;
          font-size: 0.6875rem;
        }

        .caption-text {
          color: var(--text-main);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
