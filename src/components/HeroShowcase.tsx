import React, { useState } from 'react';
import Robot3DScene from './Robot3DScene';
import ScrollyPathCanvas from './ScrollyPathCanvas';

export default function HeroShowcase() {
  const [activeTab, setActiveTab] = useState<'3d-robot' | 'profile' | 'canvas'>('3d-robot');

  return (
    <div className="hero-showcase-island">
      {/* Tab Switcher Header */}
      <div className="showcase-tabs font-mono" role="tablist" aria-label="Hero Showcase View">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === '3d-robot'}
          className={`showcase-tab ${activeTab === '3d-robot' ? 'active' : ''}`}
          onClick={() => setActiveTab('3d-robot')}
        >
          <span className="tab-indicator 3d-indicator" aria-hidden="true" />
          <span>🤖 3D Interactive Robot</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'profile'}
          className={`showcase-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="tab-indicator" aria-hidden="true" />
          <span>👤 HR Snapshot</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'canvas'}
          className={`showcase-tab ${activeTab === 'canvas' ? 'active' : ''}`}
          onClick={() => setActiveTab('canvas')}
        >
          <span className="tab-indicator" aria-hidden="true" />
          <span>⚡ Logic → Motion</span>
        </button>
      </div>

      {/* Tab 1: 3D Interactive Robot Scene (WebGL / Three.js) */}
      {activeTab === '3d-robot' && (
        <div className="showcase-tab-content animate-fade-in">
          <Robot3DScene />
        </div>
      )}

      {/* Tab 2: Profile & Credentials Card */}
      {activeTab === 'profile' && (
        <div className="profile-showcase-card surface-card animate-fade-in">
          <div className="profile-card-top">
            <div className="portrait-container">
              <img
                src="/images/shahzaib-arbo.webp"
                alt="Muhammad Shahzaib"
                className="showcase-portrait"
                loading="eager"
              />
              <span className="status-live-pulse" title="Active & Open for Roles" />
            </div>

            <div className="portrait-meta">
              <div className="role-chip font-mono">Built the Arbotrix website</div>
              <h3 className="showcase-name">Muhammad Shahzaib</h3>
              <p className="showcase-role-desc">
                Full-Stack Web & Robotics Software Engineer
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
              <span className="comp-label">Flagship Web:</span>
              <span className="comp-val">Arbotrix Production Platform (Next.js 16 + React 19)</span>
            </div>
            <div className="comp-row">
              <span className="comp-label">Robotics Middleware:</span>
              <span className="comp-val">ROS 2 Humble · Jetson Orin Nano · Nav2 · WebSockets</span>
            </div>
            <div className="comp-row">
              <span className="comp-label">Backend & AI:</span>
              <span className="comp-val">Spring Boot 3.x · PostgreSQL · LangChain4j · pgvector</span>
            </div>
          </div>

          <div className="showcase-footer font-mono">
            <div className="availability-tag">
              <span className="avail-dot" />
              <span>Immediate Availability for Global Engineering Roles</span>
            </div>
            <div className="quick-links">
              <a href="/Shahzaib_Resume.pdf" download="Shahzaib_Resume.pdf" className="link-inline">
                Download Résumé PDF ↓
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Logic to Motion Canvas */}
      {activeTab === 'canvas' && (
        <div className="canvas-wrapper-container animate-fade-in">
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
          gap: 0.4rem;
          background-color: var(--bg-surface, #ffffff);
          padding: 0.3rem;
          border-radius: 8px;
          border: 1px solid var(--border-light, #e4e1d8);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
        }

        .showcase-tab {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          padding: 0.5rem 0.65rem;
          font-family: inherit;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-muted, #52555a);
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .showcase-tab:hover {
          color: var(--text-main, #18191b);
        }

        .showcase-tab.active {
          background-color: var(--accent-orange, #ff5500);
          color: #ffffff;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(255, 85, 0, 0.3);
        }

        .showcase-tab.active .tab-indicator {
          background-color: #ffffff;
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
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
        }

        .profile-card-top {
          display: flex;
          gap: 1.25rem;
          align-items: center;
        }

        .portrait-container {
          position: relative;
          width: 95px;
          height: 95px;
          flex-shrink: 0;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid var(--border-light);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
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
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.7);
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
          min-width: 140px;
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

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
