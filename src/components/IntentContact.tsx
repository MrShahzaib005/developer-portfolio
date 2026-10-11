import React, { useState, useEffect } from 'react';

type Intent = 'recruiter' | 'client' | 'robotics' | 'opensource';

export default function IntentContact() {
  const [activeIntent, setActiveIntent] = useState<Intent>('recruiter');

  // Client form state
  const [clientProblem, setClientProblem] = useState('');
  const [clientScope, setClientScope] = useState('Full-Stack Web & API');
  const [clientTimeline, setClientTimeline] = useState('1–2 months');
  const [clientBudget, setClientBudget] = useState('$2,000–$5,000');

  // Robotics form state
  const [roboticsPlatform, setRoboticsPlatform] = useState('NVIDIA Jetson Orin / Nano');
  const [roboticsEnv, setRoboticsEnv] = useState('Physical Hardware');
  const [roboticsChallenge, setRoboticsChallenge] = useState('ROS 2 Navigation & Sensor Fusion');
  const [roboticsNotes, setRoboticsNotes] = useState('');

  const [copiedEmail, setCopiedEmail] = useState(false);
  const personalEmail = 'mirzashahzaibsami123456789@gmail.com';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const intentParam = params.get('intent') as Intent;
      if (['recruiter', 'client', 'robotics', 'opensource'].includes(intentParam)) {
        setActiveIntent(intentParam);
      }
    }
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const getClientMailto = () => {
    const subject = encodeURIComponent(`Project Inquiry: ${clientScope}`);
    const body = encodeURIComponent(
      `Hi Shahzaib,\n\nI want to discuss a project:\n\n` +
      `Problem & Overview:\n${clientProblem || '[Brief project description]'}\n\n` +
      `Primary Scope: ${clientScope}\n` +
      `Estimated Timeline: ${clientTimeline}\n` +
      `Budget Tier: ${clientBudget}\n\n` +
      `Looking forward to hearing from you.`
    );
    return `mailto:${personalEmail}?subject=${subject}&body=${body}`;
  };

  const getRoboticsMailto = () => {
    const subject = encodeURIComponent(`Robotics Collaboration: ${roboticsPlatform}`);
    const body = encodeURIComponent(
      `Hi Shahzaib,\n\nI want to discuss robotics development:\n\n` +
      `Platform: ${roboticsPlatform}\n` +
      `Environment: ${roboticsEnv}\n` +
      `Technical Challenge: ${roboticsChallenge}\n\n` +
      `Details / Context:\n${roboticsNotes || '[Describe your platform requirements and challenge]'}\n\n` +
      `Best regards.`
    );
    return `mailto:${personalEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="intent-contact-wrapper">
      {/* Intent Navigation Tabs */}
      <div className="intent-tabs-nav font-mono" role="tablist" aria-label="Contact Intents">
        <button
          type="button"
          role="tab"
          aria-selected={activeIntent === 'recruiter'}
          className={`intent-tab ${activeIntent === 'recruiter' ? 'active' : ''}`}
          onClick={() => setActiveIntent('recruiter')}
        >
          <span className="tab-num">01</span>
          <span>Recruiters: Discuss a Role</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeIntent === 'client'}
          className={`intent-tab ${activeIntent === 'client' ? 'active' : ''}`}
          onClick={() => setActiveIntent('client')}
        >
          <span className="tab-num">02</span>
          <span>Clients: Discuss a Project</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeIntent === 'robotics'}
          className={`intent-tab ${activeIntent === 'robotics' ? 'active' : ''}`}
          onClick={() => setActiveIntent('robotics')}
        >
          <span className="tab-num">03</span>
          <span>Robotics Collaborators</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeIntent === 'opensource'}
          className={`intent-tab ${activeIntent === 'opensource' ? 'active' : ''}`}
          onClick={() => setActiveIntent('opensource')}
        >
          <span className="tab-num">04</span>
          <span>Open Source & Audit</span>
        </button>
      </div>

      {/* ================= ROUTE 1: RECRUITERS ================= */}
      {activeIntent === 'recruiter' && (
        <div className="intent-panel recruiter-panel">
          <div className="panel-header">
            <span className="channel-tag font-mono">Channel: Hiring & Full-Time Roles</span>
            <h2>Direct Fast-Track for Hiring Teams</h2>
            <p>
              I am seeking full-stack and robotics software roles where software directly coordinates motion, telemetry, or distributed web systems.
            </p>
          </div>

          <div className="recruiter-grid">
            <div className="info-box font-mono">
              <span className="box-title">Availability & Logistics</span>
              <ul className="info-list">
                <li><strong>Status:</strong> Immediate availability for full-time roles (2026–2027)</li>
                <li><strong>Location:</strong> Islamabad (PK) · Fully equipped for remote global teams</li>
                <li><strong>Target Roles:</strong> Robotics Software Engineer, Full-Stack Engineer, Embedded AI / Middleware Developer</li>
                <li><strong>Notice Period:</strong> Immediate</li>
              </ul>
            </div>

            <div className="action-box">
              <span className="box-title font-mono">Verified Credentials</span>
              <div className="action-buttons">
                <a
                  href="/about#resume"
                  className="btn btn-primary"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <span>View Curriculum Vitae (PDF)</span>
                </a>

                <a
                  href={`mailto:${personalEmail}?subject=Engineering%20Role%20Inquiry%20%7C%20Muhammad%20Shahzaib&body=Hi%20Shahzaib%2C%0A%0AWe%20are%20reaching%20out%20regarding%20an%20engineering%20opportunity...`}
                  className="btn btn-accent"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  <span>Open Pre-Filled Role Email</span>
                </a>
              </div>

              <div className="email-copy-bar font-mono">
                <span className="email-display">{personalEmail}</span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="copy-btn"
                >
                  {copiedEmail ? 'Copied to Clipboard ✓' : 'Copy Email'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ROUTE 2: FREELANCE CLIENTS ================= */}
      {activeIntent === 'client' && (
        <div className="intent-panel client-panel">
          <div className="panel-header">
            <span className="channel-tag font-mono">Channel: Client Engagements</span>
            <h2>Discuss a Project</h2>
            <p>
              Scoping for web platforms, real-time dashboard teleoperation, or full-stack applications.
            </p>
          </div>

          <form
            className="intake-form"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = getClientMailto();
            }}
          >
            <div className="form-field">
              <label htmlFor="client-problem" className="field-label font-mono">
                1. Core Problem & Objective
              </label>
              <textarea
                id="client-problem"
                rows={3}
                placeholder="What does your project need to solve or deliver? (e.g. 'Build a real-time web telemetry dashboard for autonomous mobile units')..."
                value={clientProblem}
                onChange={(e) => setClientProblem(e.target.value)}
                required
              />
            </div>

            <div className="form-row-grid">
              <div className="form-field">
                <label htmlFor="client-scope" className="field-label font-mono">
                  2. Primary Scope
                </label>
                <select
                  id="client-scope"
                  value={clientScope}
                  onChange={(e) => setClientScope(e.target.value)}
                >
                  <option value="Full-Stack Web & Next.js/React">Full-Stack Web (Next.js / React / Prisma)</option>
                  <option value="Robotics Web Bridge & Dashboard">Robotics Web Bridge & Telemetry Dashboard</option>
                  <option value="Mobile App (Flutter / WebSockets)">Mobile Teleop Application (Flutter)</option>
                  <option value="Agentic AI Backend (Spring Boot / pgvector)">Agentic AI Backend (Spring Boot / pgvector)</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="client-timeline" className="field-label font-mono">
                  3. Expected Timeline
                </label>
                <select
                  id="client-timeline"
                  value={clientTimeline}
                  onChange={(e) => setClientTimeline(e.target.value)}
                >
                  <option value="Under 4 weeks">Under 4 weeks</option>
                  <option value="1–2 months">1–2 months</option>
                  <option value="3+ months">3+ months</option>
                  <option value="Flexible / Discovery">Flexible / Discovery</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="client-budget" className="field-label font-mono">
                  4. Budget Tier
                </label>
                <select
                  id="client-budget"
                  value={clientBudget}
                  onChange={(e) => setClientBudget(e.target.value)}
                >
                  <option value="$1,500–$3,000">$1,500 – $3,000</option>
                  <option value="$3,000–$6,000">$3,000 – $6,000</option>
                  <option value="$6,000+">$6,000+</option>
                  <option value="Equity / Milestone-based">Equity / Milestone-based</option>
                </select>
              </div>
            </div>

            <div className="form-submit-row">
              <button type="submit" className="btn btn-accent font-mono">
                <span>Dispatch Scoped Project Email</span>
                <span aria-hidden="true">→</span>
              </button>
              <span className="submit-hint font-mono">
                Generates a pre-formatted draft to {personalEmail}
              </span>
            </div>
          </form>
        </div>
      )}

      {/* ================= ROUTE 3: ROBOTICS COLLABORATORS ================= */}
      {activeIntent === 'robotics' && (
        <div className="intent-panel robotics-panel">
          <div className="panel-header">
            <span className="channel-tag font-mono">Channel: Robotics Engineering</span>
            <h2>Discuss Robotics Architecture</h2>
            <p>
              Partnering on differential drive kinematics, Nav2 costmaps, Gazebo simulation environments, or rosbridge interfaces.
            </p>
          </div>

          <form
            className="intake-form"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = getRoboticsMailto();
            }}
          >
            <div className="form-row-grid">
              <div className="form-field">
                <label htmlFor="robotics-platform" className="field-label font-mono">
                  Hardware Platform
                </label>
                <select
                  id="robotics-platform"
                  value={roboticsPlatform}
                  onChange={(e) => setRoboticsPlatform(e.target.value)}
                >
                  <option value="NVIDIA Jetson Orin Nano / Nano">NVIDIA Jetson Orin Nano / Nano</option>
                  <option value="Raspberry Pi 4/5 (Ubuntu Server)">Raspberry Pi 4 / 5 (Headless Linux)</option>
                  <option value="x86 IPC Linux Workstation">x86 Industrial PC / Laptop</option>
                  <option value="ESP32 / Micro-ROS Microcontroller">ESP32 / STM32 Micro-ROS Controller</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="robotics-env" className="field-label font-mono">
                  Deployment Environment
                </label>
                <select
                  id="robotics-env"
                  value={roboticsEnv}
                  onChange={(e) => setRoboticsEnv(e.target.value)}
                >
                  <option value="Physical Hardware Robot">Physical Hardware Robot</option>
                  <option value="Gazebo Simulation Only">Gazebo Garden / Classic Simulation Only</option>
                  <option value="Hybrid (Sim to Physical Migration)">Hybrid (Sim to Physical Migration)</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="robotics-challenge" className="field-label font-mono">
                  Primary Challenge
                </label>
                <select
                  id="robotics-challenge"
                  value={roboticsChallenge}
                  onChange={(e) => setRoboticsChallenge(e.target.value)}
                >
                  <option value="ROS 2 Nav2 Behavior Trees & SLAM">ROS 2 Nav2 Behavior Trees & SLAM</option>
                  <option value="Mobile App & WebSocket Teleop Bridge">Mobile App & WebSocket Teleop Bridge</option>
                  <option value="URDF Simulation & Gazebo Plugins">URDF Simulation & Gazebo Plugins</option>
                  <option value="Motor Driver Serial Communication">Motor Driver Serial Communication</option>
                </select>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="robotics-notes" className="field-label font-mono">
                Platform Specifics & Challenge Details
              </label>
              <textarea
                id="robotics-notes"
                rows={3}
                placeholder="Describe your sensor array (LiDAR, IMU, encoders), current ROS distro, or obstacle avoidance bottlenecks..."
                value={roboticsNotes}
                onChange={(e) => setRoboticsNotes(e.target.value)}
              />
            </div>

            <div className="form-submit-row">
              <button type="submit" className="btn btn-accent font-mono">
                <span>Dispatch Robotics Engineering Brief</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= ROUTE 4: OPEN SOURCE & AUDIT ================= */}
      {activeIntent === 'opensource' && (
        <div className="intent-panel opensource-panel">
          <div className="panel-header">
            <span className="channel-tag font-mono">Channel: Open Source & Code Audit</span>
            <h2>Verified Code Repositories</h2>
            <p>
              Transparent public code audit: exactly 18 repositories publicly available under the <a href="https://github.com/MrShahzaib005" target="_blank" rel="noopener noreferrer" className="link-inline">@MrShahzaib005</a> account.
            </p>
          </div>

          <div className="audit-cards-grid">
            <div className="audit-card font-mono">
              <span className="audit-card-title">GitHub Profile</span>
              <p>Explore codebases, commit histories, and pull requests.</p>
              <a href="https://github.com/MrShahzaib005" target="_blank" rel="noopener noreferrer" className="audit-link">
                github.com/MrShahzaib005 →
              </a>
            </div>

            <div className="audit-card font-mono">
              <span className="audit-card-title">Dodo Bot Mobile</span>
              <p>Flutter teleop app repo with WebSocket rosbridge client.</p>
              <a href="https://github.com/MrShahzaib005/Dodo_Bot" target="_blank" rel="noopener noreferrer" className="audit-link">
                github.com/MrShahzaib005/Dodo_Bot →
              </a>
            </div>

            <div className="audit-card font-mono">
              <span className="audit-card-title">Arbotrix Web</span>
              <p>Next.js 16 + React 19 + Prisma + Supabase platform.</p>
              <a href="https://github.com/MrShahzaib005/arbotrix-web" target="_blank" rel="noopener noreferrer" className="audit-link">
                github.com/MrShahzaib005/arbotrix-web →
              </a>
            </div>

            <div className="audit-card font-mono">
              <span className="audit-card-title">Origin: E-Portal</span>
              <p>Java Spring Boot university portal repository.</p>
              <a href="https://github.com/MrShahzaib005/e-portal" target="_blank" rel="noopener noreferrer" className="audit-link">
                github.com/MrShahzaib005/e-portal →
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .intent-contact-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .intent-tabs-nav {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          background-color: var(--bg-subtle);
          padding: 0.5rem;
          border-radius: 8px;
          border: 1px solid var(--border-light);
        }

        @media (min-width: 860px) {
          .intent-tabs-nav {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .intent-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          border: 1px solid transparent;
          background: transparent;
          font-family: inherit;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
        }

        .intent-tab:hover {
          color: var(--text-main);
          background-color: var(--bg-surface);
        }

        .intent-tab.active {
          background-color: var(--bg-surface);
          border-color: var(--border-light);
          color: var(--text-main);
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .tab-num {
          font-size: 0.6875rem;
          color: var(--accent-orange);
          font-weight: 600;
        }

        .intent-panel {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: clamp(1.5rem, 4vw, 2.5rem);
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          overflow: hidden;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .channel-tag {
          font-size: 0.75rem;
          color: var(--accent-orange);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 0.35rem;
        }

        .panel-header h2 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }

        .recruiter-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 860px) {
          .recruiter-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .info-box {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-faint);
          border-radius: 6px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .box-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-faint);
          text-transform: uppercase;
        }

        .info-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        .info-list strong {
          color: var(--text-main);
        }

        .action-box {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .email-copy-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0.85rem;
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-light);
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .email-display {
          color: var(--text-muted);
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .copy-btn {
          background: none;
          border: none;
          color: var(--accent-orange);
          cursor: pointer;
          font-family: inherit;
          font-weight: 600;
        }

        /* Intake Form */
        .intake-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .form-row-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        @media (min-width: 768px) {
          .form-row-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          min-width: 0;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .form-field select,
        .form-field input,
        .form-field textarea {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .field-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-faint);
          text-transform: uppercase;
        }

        .form-submit-row {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        @media (min-width: 640px) {
          .form-submit-row {
            flex-direction: row;
            align-items: center;
          }
        }

        .submit-hint {
          font-size: 0.75rem;
          color: var(--text-faint);
        }

        /* Audit Grid */
        .audit-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }

        .audit-card {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-faint);
          border-radius: 6px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .audit-card-title {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .audit-card p {
          font-size: 0.75rem;
          color: var(--text-faint);
          margin-bottom: 0.5rem;
        }

        .audit-link {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent-orange);
          margin-top: auto;
        }
      `}</style>
    </div>
  );
}
