import React, { useState, useRef } from 'react';

type ShowcaseTab = 'web' | 'mobile' | 'robot';

export default function UiRenderShowcase() {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('web');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isDraggingJoy, setIsDraggingJoy] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleJoystickMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingJoy) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = Math.max(-30, Math.min(30, e.clientX - rect.left - cx));
    const dy = Math.max(-30, Math.min(30, e.clientY - rect.top - cy));
    setJoystickPos({ x: dx, y: dy });
  };

  // 3D rotation transform based on cursor
  const tiltStyle = isHovered
    ? {
        transform: `perspective(1000px) rotateY(${mousePos.x * 6}deg) rotateX(${-mousePos.y * 6}deg) scale3d(1.01, 1.01, 1.01)`,
        transition: 'transform 0.1s ease-out'
      }
    : {
        transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.4s ease-out'
      };

  return (
    <div className="ui-render-showcase-wrapper">
      {/* Top Header & Switcher */}
      <div className="showcase-nav-bar font-mono">
        <div className="nav-title-group">
          <span className="live-pill">Interactive UI Renders</span>
          <span className="nav-subtitle">Live interactive preview of deployed platforms & control systems</span>
        </div>

        <div className="tab-pill-group" role="tablist" aria-label="UI Renders">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'web'}
            className={`tab-btn ${activeTab === 'web' ? 'active' : ''}`}
            onClick={() => setActiveTab('web')}
          >
            <span>🌐 Web Platform (Arbotrix)</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'mobile'}
            className={`tab-btn ${activeTab === 'mobile' ? 'active' : ''}`}
            onClick={() => setActiveTab('mobile')}
          >
            <span>📱 Mobile Teleop (Dodo Bot)</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'robot'}
            className={`tab-btn ${activeTab === 'robot' ? 'active' : ''}`}
            onClick={() => setActiveTab('robot')}
          >
            <span>🧹 Autonomous SLAM (Vacuum)</span>
          </button>
        </div>
      </div>

      {/* Main 3D Viewport with Realistic Device Mockup */}
      <div
        className="render-viewport-container"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMousePos({ x: 0, y: 0 });
        }}
        style={tiltStyle}
      >
        {/* Specular sheen layer following cursor */}
        <div
          className="specular-glow-layer"
          style={{
            background: `radial-gradient(circle at ${(mousePos.x + 1) * 50}% ${(mousePos.y + 1) * 50}%, rgba(255, 85, 0, 0.15) 0%, transparent 60%)`
          }}
        />

        {/* ================= 1. WEB PLATFORM RENDER (ARBOTRIX) ================= */}
        {activeTab === 'web' && (
          <div className="render-device-desktop">
            <div className="browser-chrome-bar">
              <div className="window-dots">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
              </div>

              <div className="browser-url-pill font-mono">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>https://arbotrix.com</span>
                <span className="secure-badge">Production Live</span>
              </div>

              <div className="browser-actions font-mono">
                <a href="https://arbotrix.com" target="_blank" rel="noopener noreferrer" className="ext-btn">
                  Open Site ↗
                </a>
              </div>
            </div>

            <div className="browser-content-area">
              <img
                src="/images/arbotrix-web.png"
                alt="Arbotrix Company Website UI Render"
                className="render-img-main"
              />

              {/* Floating Interactive Callouts */}
              <div className="floating-metric-card top-left font-mono">
                <div className="metric-tag">Engineered by Shahzaib</div>
                <div className="metric-headline">Full-Stack Next.js 16 + React 19</div>
                <div className="metric-sub">Prisma ORM · Supabase PostgreSQL · Spline 3D</div>
              </div>

              <div className="floating-metric-card bottom-right font-mono">
                <div className="metric-stat">45 Verified Graduates</div>
                <div className="metric-desc">Trainee pipelines processed across Batches 1 & 2</div>
              </div>
            </div>

            {/* Recruiter Quick Snapshot Footer */}
            <div className="render-hr-dossier">
              <div className="dossier-left">
                <span className="dossier-role-badge font-mono">Recruiter Highlights</span>
                <h4>Commercial Platform for Robotics Training & Hardware</h4>
                <p>
                  Architected the complete company website with interactive 3D model loaders, dynamic course enrollment pipelines, and zero-downtime PostgreSQL persistence.
                </p>
              </div>
              <div className="dossier-right font-mono">
                <div className="dossier-tech-pills">
                  <span>Next.js 16</span>
                  <span>React 19</span>
                  <span>TypeScript</span>
                  <span>Prisma</span>
                  <span>Supabase</span>
                  <span>Tailwind</span>
                </div>
                <a href="/work/arbotrix-web" className="btn-case-study">
                  Read Full Case Study →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. MOBILE TELEOPERATION RENDER (DODO BOT) ================= */}
        {activeTab === 'mobile' && (
          <div className="render-device-mobile-layout">
            {/* Phone Mockup Frame */}
            <div className="phone-mockup-frame">
              <div className="phone-notch">
                <div className="speaker-slot" />
                <div className="front-cam" />
              </div>

              <div className="phone-screen-viewport">
                <img
                  src="/images/dodo-app.png"
                  alt="Dodo Bot Flutter Controller UI"
                  className="phone-screen-img"
                />

                {/* Simulated Interactive Teleoperation Overlay */}
                <div className="simulated-teleop-overlay font-mono">
                  <div className="teleop-header">
                    <span className="conn-status">● WS LINK ACTIVE</span>
                    <span className="teleop-ping">24ms · 20Hz</span>
                  </div>

                  {/* Interactive Virtual Joystick */}
                  <div
                    className="interactive-joystick-base"
                    onMouseDown={() => setIsDraggingJoy(true)}
                    onMouseUp={() => {
                      setIsDraggingJoy(false);
                      setJoystickPos({ x: 0, y: 0 });
                    }}
                    onMouseMove={handleJoystickMove}
                    onMouseLeave={() => {
                      setIsDraggingJoy(false);
                      setJoystickPos({ x: 0, y: 0 });
                    }}
                  >
                    <div
                      className="joystick-stick"
                      style={{
                        transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`
                      }}
                    >
                      <span className="stick-center-dot" />
                    </div>
                    <span className="joy-label">DRAG TO TELEOPERATE</span>
                  </div>

                  <div className="teleop-readouts">
                    <div className="readout-item">
                      <span>Linear (vx):</span>
                      <strong>{(-joystickPos.y / 30).toFixed(2)} m/s</strong>
                    </div>
                    <div className="readout-item">
                      <span>Angular (wz):</span>
                      <strong>{(joystickPos.x / 30).toFixed(2)} rad/s</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recruiter & Technical Dossier alongside Phone */}
            <div className="mobile-dossier-panel">
              <div className="panel-badge-row font-mono">
                <span className="badge-teleop">Cyber-Physical Robotics</span>
                <span className="badge-ownership">Exact Ownership Defined</span>
              </div>
              <h3 className="panel-title">Dodo Bot Mobile Teleoperation Client</h3>
              <p className="panel-desc">
                Cross-platform mobile control application connecting operators directly to a Jetson Orin Nano differential robot over local WebSockets.
              </p>

              <div className="ownership-callout font-mono">
                <strong>Shahzaib's Engineering Scope:</strong>
                <p>
                  "I built the Flutter mobile control application, the WebSocket telemetry layer, and the ROS topic bridge client; Aqil Buzdar built the physical hardware chassis, motor controllers, and the base ROS2 workspace."
                </p>
              </div>

              <div className="key-specs-grid font-mono">
                <div className="spec-item">
                  <span className="spec-label">Latency</span>
                  <span className="spec-val">&lt;45ms round-trip</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Rate Throttle</span>
                  <span className="spec-val">20Hz cmd_vel</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Failsafe</span>
                  <span className="spec-val">380ms E-Brake</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Hardware Core</span>
                  <span className="spec-val">Jetson Orin Nano</span>
                </div>
              </div>

              <div className="panel-actions font-mono">
                <a href="/work/dodo-bot" className="btn-case-study">
                  Explore Dodo Bot Case Study →
                </a>
                <a href="https://github.com/MrShahzaib005/Dodo_Bot" target="_blank" rel="noopener noreferrer" className="btn-code">
                  GitHub Repo ↗
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. AUTONOMOUS CLEANING ROBOT SIMULATION ================= */}
        {activeTab === 'robot' && (
          <div className="render-simulation-layout">
            <div className="sim-viewport-frame">
              <div className="sim-top-bar font-mono">
                <div className="sim-title">
                  <span className="radar-blip" />
                  <span>Gazebo Garden · Nav2 Autonomous SLAM Monitor</span>
                </div>
                <span className="sim-tag">Simulation Only</span>
              </div>

              <div className="sim-body">
                <div className="sim-image-wrapper">
                  <img
                    src="/images/cleaning-robot.png"
                    alt="ROS 2 Autonomous Cleaning Robot Simulation Render"
                    className="sim-main-img"
                  />

                  {/* Simulated SLAM Radar HUD */}
                  <div className="slam-hud-overlay font-mono">
                    <div className="slam-metric-row">
                      <span>Mapping: SLAM Toolbox</span>
                      <span>Coverage: 92.4%</span>
                    </div>
                    <div className="slam-progress-bar">
                      <div className="slam-fill" style={{ width: '92.4%' }} />
                    </div>
                    <div className="slam-metric-sub">
                      <span>Costmap Inflation: Active</span>
                      <span>Obstacle Avoidance: Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recruiter & Systems Dossier */}
            <div className="mobile-dossier-panel">
              <div className="panel-badge-row font-mono">
                <span className="badge-teleop">ROS 2 Humble Autonomy</span>
                <span className="badge-ownership">Simulation Verified</span>
              </div>
              <h3 className="panel-title">ROS 2 & Machine Learning Autonomous Cleaning Robot</h3>
              <p className="panel-desc">
                Differential drive vacuum robot modeled in URDF and simulated in Gazebo Garden with SLAM mapping, Nav2 waypoint navigation, and Machine Learning coverage heuristics.
              </p>

              <div className="ownership-callout font-mono">
                <strong>Shahzaib's Engineering Scope:</strong>
                <p>
                  "I implemented the URDF physical robot model, sensor plugin attachments, ML coverage path logic, and Nav2 behavior tree configuration in Gazebo simulation."
                </p>
              </div>

              <div className="key-specs-grid font-mono">
                <div className="spec-item">
                  <span className="spec-label">Environment</span>
                  <span className="spec-val">Gazebo Garden</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Coverage</span>
                  <span className="spec-val">92.4% Room Area</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Sensors</span>
                  <span className="spec-val">360° Simulated LiDAR</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Runs Tested</span>
                  <span className="spec-val">25 Verified Trials</span>
                </div>
              </div>

              <div className="panel-actions font-mono">
                <a href="/work/ros2-cleaning-robot" className="btn-case-study">
                  Explore Simulation Study →
                </a>
                <a href="https://github.com/MrShahzaib005/github-workshop-demo" target="_blank" rel="noopener noreferrer" className="btn-code">
                  GitHub Demo ↗
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .ui-render-showcase-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          width: 100%;
        }

        .showcase-nav-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          padding-bottom: 0.5rem;
        }

        .nav-title-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .live-pill {
          background: rgba(255, 85, 0, 0.12);
          border: 1px solid var(--accent-orange, #ff5500);
          color: var(--accent-orange, #ff5500);
          font-size: 0.6875rem;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .nav-subtitle {
          font-size: 0.8125rem;
          color: var(--text-muted, #7e8289);
        }

        .tab-pill-group {
          display: flex;
          background: var(--bg-surface, #ffffff);
          border: 1px solid var(--border-light, #e4e1d8);
          border-radius: 6px;
          padding: 0.25rem;
          gap: 0.35rem;
        }

        .tab-btn {
          background: transparent;
          border: none;
          padding: 0.45rem 0.85rem;
          font-family: inherit;
          font-size: 0.75rem;
          color: var(--text-muted, #52555a);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
          font-weight: 500;
        }

        .tab-btn:hover {
          color: var(--text-main, #18191b);
        }

        .tab-btn.active {
          background: var(--accent-orange, #ff5500);
          color: #ffffff;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(255, 85, 0, 0.3);
        }

        .render-viewport-container {
          position: relative;
          background: #0e1117;
          border: 1px solid #282c37;
          border-radius: 12px;
          padding: clamp(1.25rem, 3vw, 2.25rem);
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
          transform-style: preserve-3d;
        }

        .specular-glow-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }

        /* 1. Desktop Browser Render */
        .render-device-desktop {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .browser-chrome-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #171a21;
          border: 1px solid #282c37;
          border-radius: 8px 8px 0 0;
          padding: 0.6rem 1rem;
          gap: 1rem;
        }

        .window-dots {
          display: flex;
          gap: 0.4rem;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .dot-red { background: #ef4444; }
        .dot-yellow { background: #f59e0b; }
        .dot-green { background: #10b981; }

        .browser-url-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #0e1117;
          border: 1px solid #282c37;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
          color: #9eabb8;
          max-width: 480px;
          width: 100%;
        }

        .secure-badge {
          margin-left: auto;
          color: #10b981;
          font-size: 0.625rem;
        }

        .ext-btn {
          color: var(--accent-orange, #ff5500);
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .browser-content-area {
          position: relative;
          border-radius: 0 0 8px 8px;
          overflow: hidden;
          border: 1px solid #282c37;
          border-top: none;
          background: #14171f;
        }

        .render-img-main {
          width: 100%;
          height: auto;
          display: block;
          max-height: 480px;
          object-fit: cover;
          object-position: top center;
        }

        .floating-metric-card {
          position: absolute;
          background: rgba(14, 17, 23, 0.92);
          border: 1px solid rgba(255, 85, 0, 0.5);
          backdrop-filter: blur(10px);
          padding: 0.75rem 1rem;
          border-radius: 6px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
        }

        .floating-metric-card.top-left {
          top: 1.25rem;
          left: 1.25rem;
        }

        .floating-metric-card.bottom-right {
          bottom: 1.25rem;
          right: 1.25rem;
        }

        .metric-tag {
          font-size: 0.625rem;
          color: var(--accent-orange, #ff5500);
          text-transform: uppercase;
          font-weight: 600;
        }

        .metric-headline {
          font-size: 0.875rem;
          color: #ffffff;
          font-weight: 600;
          margin: 0.15rem 0;
        }

        .metric-sub {
          font-size: 0.6875rem;
          color: #9eabb8;
        }

        .metric-stat {
          font-size: 1.1rem;
          font-weight: 700;
          color: #10b981;
        }

        .metric-desc {
          font-size: 0.6875rem;
          color: #cfcbcd;
        }

        .render-hr-dossier {
          background: #171a21;
          border: 1px solid #282c37;
          border-radius: 8px;
          padding: 1.25rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }

        @media (min-width: 820px) {
          .render-hr-dossier {
            grid-template-columns: 1.4fr 1fr;
            align-items: center;
          }
        }

        .dossier-role-badge {
          font-size: 0.625rem;
          color: var(--accent-orange, #ff5500);
          text-transform: uppercase;
          font-weight: 600;
        }

        .dossier-left h4 {
          font-size: 1.15rem;
          color: #ffffff;
          margin: 0.25rem 0 0.5rem;
        }

        .dossier-left p {
          font-size: 0.8125rem;
          color: #9eabb8;
          line-height: 1.5;
        }

        .dossier-tech-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 0.85rem;
        }

        .dossier-tech-pills span {
          background: #0e1117;
          border: 1px solid #282c37;
          color: #cfcbcd;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.6875rem;
        }

        .btn-case-study {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--accent-orange, #ff5500);
          color: #ffffff;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 600;
          transition: background 0.15s ease;
        }

        .btn-case-study:hover {
          background: #e04b00;
        }

        .btn-code {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #171a21;
          border: 1px solid #282c37;
          color: #ffffff;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 600;
        }

        /* 2. Mobile Layout */
        .render-device-mobile-layout,
        .render-simulation-layout {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: center;
        }

        @media (min-width: 860px) {
          .render-device-mobile-layout {
            grid-template-columns: 340px 1fr;
          }
          .render-simulation-layout {
            grid-template-columns: 1.2fr 1fr;
          }
        }

        .phone-mockup-frame {
          position: relative;
          width: 100%;
          max-width: 310px;
          margin: 0 auto;
          background: #0a0c10;
          border: 8px solid #282c37;
          border-radius: 36px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
          overflow: hidden;
        }

        .phone-notch {
          height: 22px;
          background: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .speaker-slot {
          width: 40px;
          height: 3px;
          background: #333333;
          border-radius: 2px;
        }

        .front-cam {
          width: 6px;
          height: 6px;
          background: #1e293b;
          border-radius: 50%;
        }

        .phone-screen-viewport {
          position: relative;
          height: 480px;
          background: #11141c;
          overflow: hidden;
        }

        .phone-screen-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .simulated-teleop-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(14, 17, 23, 0.3) 0%, rgba(14, 17, 23, 0.88) 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1rem;
        }

        .teleop-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.625rem;
          color: #10b981;
          font-weight: 600;
        }

        .teleop-ping {
          color: var(--accent-orange, #ff5500);
        }

        .interactive-joystick-base {
          position: relative;
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: rgba(23, 26, 33, 0.7);
          border: 2px dashed rgba(255, 85, 0, 0.6);
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: grab;
          box-shadow: 0 0 20px rgba(255, 85, 0, 0.2);
        }

        .joystick-stick {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: radial-gradient(circle, #ff5500 0%, #cc4400 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          pointer-events: none;
        }

        .stick-center-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ffffff;
        }

        .joy-label {
          position: absolute;
          bottom: -1.4rem;
          font-size: 0.5625rem;
          color: #9eabb8;
          white-space: nowrap;
        }

        .teleop-readouts {
          display: flex;
          justify-content: space-between;
          background: rgba(14, 17, 23, 0.9);
          border: 1px solid #282c37;
          border-radius: 4px;
          padding: 0.4rem 0.6rem;
          font-size: 0.625rem;
          color: #cfcbcd;
        }

        .teleop-readouts strong {
          color: var(--accent-orange, #ff5500);
          margin-left: 0.25rem;
        }

        /* Dossier Panels */
        .mobile-dossier-panel {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .panel-badge-row {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .badge-teleop {
          background: rgba(255, 85, 0, 0.15);
          color: var(--accent-orange, #ff5500);
          border: 1px solid var(--accent-orange, #ff5500);
          font-size: 0.6875rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
        }

        .badge-ownership {
          background: #171a21;
          color: #10b981;
          border: 1px solid #10b981;
          font-size: 0.6875rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .panel-title {
          font-size: 1.5rem;
          color: #ffffff;
          line-height: 1.25;
        }

        .panel-desc {
          font-size: 0.9375rem;
          color: #9eabb8;
          line-height: 1.6;
        }

        .ownership-callout {
          background: #171a21;
          border-left: 3px solid var(--accent-orange, #ff5500);
          padding: 0.85rem 1rem;
          border-radius: 0 6px 6px 0;
          font-size: 0.75rem;
          color: #cfcbcd;
        }

        .ownership-callout strong {
          color: #ffffff;
          display: block;
          margin-bottom: 0.25rem;
        }

        .ownership-callout p {
          color: #9eabb8;
          line-height: 1.5;
          margin: 0;
        }

        .key-specs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.65rem;
        }

        .spec-item {
          background: #14171f;
          border: 1px solid #282c37;
          border-radius: 6px;
          padding: 0.6rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .spec-label {
          font-size: 0.625rem;
          color: #7e8289;
          text-transform: uppercase;
        }

        .spec-val {
          font-size: 0.8125rem;
          color: #ffffff;
          font-weight: 600;
        }

        .panel-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }

        /* 3. Simulation Layout */
        .sim-viewport-frame {
          background: #171a21;
          border: 1px solid #282c37;
          border-radius: 8px;
          overflow: hidden;
        }

        .sim-top-bar {
          background: #0e1117;
          border-bottom: 1px solid #282c37;
          padding: 0.6rem 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
        }

        .sim-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #ffffff;
          font-weight: 600;
        }

        .radar-blip {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
        }

        .sim-tag {
          color: #f59e0b;
          font-size: 0.6875rem;
        }

        .sim-image-wrapper {
          position: relative;
        }

        .sim-main-img {
          width: 100%;
          height: auto;
          display: block;
          max-height: 400px;
          object-fit: cover;
        }

        .slam-hud-overlay {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          right: 1rem;
          background: rgba(14, 17, 23, 0.9);
          border: 1px solid rgba(16, 185, 129, 0.4);
          border-radius: 6px;
          padding: 0.75rem 1rem;
          backdrop-filter: blur(8px);
        }

        .slam-metric-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.6875rem;
          color: #10b981;
          font-weight: 600;
          margin-bottom: 0.35rem;
        }

        .slam-progress-bar {
          width: 100%;
          height: 6px;
          background: #282c37;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.35rem;
        }

        .slam-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981 0%, #38bdf8 100%);
        }

        .slam-metric-sub {
          display: flex;
          justify-content: space-between;
          font-size: 0.625rem;
          color: #9eabb8;
        }
      `}</style>
    </div>
  );
}
