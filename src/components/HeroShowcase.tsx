import React, { useState } from 'react';
import ScrollyPathCanvas from './ScrollyPathCanvas';

export default function HeroShowcase() {
  const [activeTab, setActiveTab] = useState<'profile' | 'canvas'>('profile');

  return (
    <div className="hero-showcase-island">
      {/* Tab Switcher Header */}
      <div className="showcase-tabs font-mono" role="tablist" aria-label="Hero Showcase View">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'profile'}
          className={`showcase-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="tab-indicator" aria-hidden="true" />
          <span>Profile Showcase</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'canvas'}
          className={`showcase-tab ${activeTab === 'canvas' ? 'active' : ''}`}
          onClick={() => setActiveTab('canvas')}
        >
          <span className="tab-indicator" aria-hidden="true" />
          <span>Theme Canvas: Logic → Motion</span>
        </button>
      </div>

      {/* Tab 1: Profile & Credentials Card */}
      {activeTab === 'profile' ? (
        <div className="profile-showcase-card surface-card">
          <div className="profile-card-top">
            <div className="portrait-container">
              <img
                src="/images/shahzaib-arbo.webp"
                alt="Muhammad Shahzaib - Co-Founder & CTO @ Arbotrix"
                className="showcase-portrait"
                loading="eager"
              />
              <span className="status-live-pulse" title="Active & Open for Roles" />
            </div>

            <div className="portrait-meta">
              <div className="role-chip font-mono">Co-Founder & CTO @ Arbotrix</div>
              <h3 className="showcase-name">Muhammad Shahzaib</h3>
              <p className="showcase-role-desc">
                Lead Full-Stack Web & Robotics Software Engineer
              </p>
              <div className="location-pill font-mono">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Islamabad, PK · Global Remote Ready</span>
              </div>
            </div>
          </div>

          <div className="competency-matrix font-mono">
            <div className="comp-row">
              <span className="comp-label">Robotics Middleware:</span>
              <span className="comp-val">ROS 2 Humble · Jetson Orin Nano · Nav2 · WebSockets</span>
            </div>
            <div className="comp-row">
              <span className="comp-label">Full-Stack Web:</span>
              <span className="comp-val">Next.js 16 · React 19 · Prisma · Supabase · Spring Boot</span>
            </div>
            <div className="comp-row">
              <span className="comp-label">Applied AI:</span>
              <span className="comp-val">LangChain4j · pgvector · ML Coverage Heuristics</span>
            </div>
          </div>

          <div className="showcase-footer font-mono">
            <div className="availability-tag">
              <span className="avail-dot" />
              <span>Available for Full-Time Roles & High-Impact Contracts</span>
            </div>
            <div className="quick-links">
              <a href="/work" className="link-inline">
                View Flagships →
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Logic to Motion Canvas */
        <div className="canvas-wrapper-container">
          <ScrollyPathCanvas />
        </div>
      )}

      <style>{`
        .hero-showcase-island {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
          max-width: 100%;
        }

        .showcase-tabs {
          display: flex;
          gap: 0.5rem;
          background-color: var(--bg-subtle);
          padding: 0.25rem;
          border-radius: 6px;
          border: 1px solid var(--border-light);
        }

        .showcase-tab {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          padding: 0.5rem 0.75rem;
          font-family: inherit;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-muted);
          background: transparent;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .showcase-tab:hover {
          color: var(--text-main);
        }

        .showcase-tab.active {
          background-color: var(--bg-surface);
          color: var(--text-main);
          font-weight: 600;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
        }

        .showcase-tab.active .tab-indicator {
          background-color: var(--accent-orange);
        }

        .tab-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: transparent;
          transition: background-color 0.15s ease;
        }

        .profile-showcase-card {
          padding: clamp(1.25rem, 3vw, 1.75rem);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }

        .profile-card-top {
          display: flex;
          gap: 1.25rem;
          align-items: center;
        }

        .portrait-container {
          position: relative;
          width: 100px;
          height: 100px;
          flex-shrink: 0;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid var(--border-light);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .showcase-portrait {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 18%;
          display: block;
        }

        .status-live-pulse {
          position: absolute;
          bottom: 6px;
          right: 6px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #10B981;
          border: 2px solid #FFFFFF;
          box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
        }

        .portrait-meta {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .role-chip {
          display: inline-block;
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--accent-orange);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .showcase-name {
          font-size: 1.3rem;
          line-height: 1.2;
          color: var(--text-main);
        }

        .showcase-role-desc {
          font-size: 0.8125rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .location-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.6875rem;
          color: var(--text-faint);
          margin-top: 0.2rem;
        }

        .competency-matrix {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background-color: var(--bg-primary);
          padding: 0.85rem 1rem;
          border-radius: 6px;
          border: 1px solid var(--border-faint);
          font-size: 0.75rem;
        }

        .comp-row {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        @media (min-width: 480px) {
          .comp-row {
            flex-direction: row;
            gap: 0.5rem;
          }
        }

        .comp-label {
          color: var(--text-faint);
          font-weight: 600;
          min-width: 130px;
        }

        .comp-val {
          color: var(--text-main);
        }

        .showcase-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-faint);
          font-size: 0.6875rem;
          flex-wrap: wrap;
        }

        .availability-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: #10B981;
          font-weight: 500;
        }

        .avail-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #10B981;
        }

        .canvas-wrapper-container {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
