import React, { useState, useMemo } from 'react';

interface Skill {
  name: string;
  category: 'web' | 'robotics' | 'ai' | 'embedded';
  level: number; // 1-100
  badge: string;
  icon: string;
  highlight: string;
  usedIn: string;
}

const SKILLS: Skill[] = [
  // Full-Stack Web
  { name: 'Next.js 16 (App Router)', category: 'web', level: 95, badge: 'Production', icon: '▲', highlight: 'Server Actions, SSR, dynamic caching', usedIn: 'Arbotrix Company Website' },
  { name: 'React 19', category: 'web', level: 94, badge: 'Advanced', icon: '⚛️', highlight: 'Concurrent features, custom hooks, state optimization', usedIn: 'Arbotrix Web & Portfolio' },
  { name: 'TypeScript', category: 'web', level: 92, badge: 'Core', icon: 'TS', highlight: 'Strict typing, generic schemas, type-safe APIs', usedIn: 'All Web & Middleware projects' },
  { name: 'Tailwind CSS', category: 'web', level: 90, badge: 'Design', icon: '🎨', highlight: 'Responsive UI, design systems, micro-interactions', usedIn: 'Arbotrix Web' },
  { name: 'Spring Boot 3.x', category: 'web', level: 88, badge: 'Enterprise', icon: '🍃', highlight: 'MVC, ThreadLocal tenant isolation, Hibernate ORM', usedIn: 'Buddy AI & E-Portal' },
  { name: 'PostgreSQL & Supabase', category: 'web', level: 90, badge: 'Database', icon: '🐘', highlight: 'Relational schemas, ACID transactions, migrations', usedIn: 'Arbotrix Web & Buddy' },
  { name: 'Prisma ORM', category: 'web', level: 92, badge: 'Data Layer', icon: '💎', highlight: 'Type-safe queries, relation joins, connection pooling', usedIn: 'Arbotrix Web' },

  // Robotics & Cyber-Physical
  { name: 'ROS 2 Humble', category: 'robotics', level: 92, badge: 'Core Middleware', icon: '🤖', highlight: 'Nodes, pub/sub topics, QoS profiles, launch files', usedIn: 'Dodo Bot & Cleaning Robot' },
  { name: 'Nav2 Navigation Stack', category: 'robotics', level: 88, badge: 'Autonomy', icon: '🧭', highlight: 'Costmap layers, behavior trees, waypoint following', usedIn: 'ROS 2 Cleaning Robot' },
  { name: 'Gazebo Garden', category: 'robotics', level: 86, badge: 'Simulation', icon: '🌐', highlight: 'Physics simulation, sensor plugins, world modeling', usedIn: 'Cleaning Robot Simulation' },
  { name: 'SLAM Toolbox', category: 'robotics', level: 85, badge: 'Mapping', icon: '🗺️', highlight: '2D LiDAR mapping, loop closure, occupancy grids', usedIn: 'Cleaning Robot & Dodo' },
  { name: 'rosbridge_suite & WebSockets', category: 'robotics', level: 94, badge: 'Telemetry', icon: '⚡', highlight: 'JSON protocol, 20Hz cmd_vel throttle, <45ms latency', usedIn: 'Dodo Bot Teleoperation' },
  { name: 'URDF / Xacro', category: 'robotics', level: 88, badge: 'Kinematics', icon: '📐', highlight: 'Joint limits, inertial matrices, link hierarchies', usedIn: 'Cleaning Robot URDF' },
  { name: 'Differential Drive Kinematics', category: 'robotics', level: 90, badge: 'Motion', icon: '🏎️', highlight: 'Twist (vx, wz) conversion to wheel RPM', usedIn: 'Dodo Bot & Cleaning Robot' },

  // AI & Systems
  { name: 'LangChain4j & Edge LLMs', category: 'ai', level: 85, badge: 'Agentic AI', icon: '🦜', highlight: 'Multi-agent orchestration, Ollama Llama 3.1 8B', usedIn: 'Buddy Agentic Architecture' },
  { name: 'pgvector & Embeddings', category: 'ai', level: 86, badge: 'Vector Search', icon: '🧠', highlight: 'HNSW indexing, cosine similarity, long-term memory', usedIn: 'Buddy Agentic Memory' },
  { name: 'ML Coverage Heuristics', category: 'ai', level: 84, badge: 'Algorithms', icon: '📊', highlight: 'Path optimization, redundant pass reduction', usedIn: 'Cleaning Robot Autonomy' },
  { name: 'Python 3.11', category: 'ai', level: 90, badge: 'Language', icon: '🐍', highlight: 'ROS nodes, ML scripts, data serialization', usedIn: 'Robotics & ML Pipelines' },

  // Embedded & Tools
  { name: 'NVIDIA Jetson Orin Nano', category: 'embedded', level: 88, badge: 'Edge Hardware', icon: '⚡', highlight: 'Headless Ubuntu Linux, GPU acceleration, thermal tuning', usedIn: 'Dodo Bot Hardware' },
  { name: 'Flutter & Dart', category: 'embedded', level: 88, badge: 'Mobile UI', icon: '📱', highlight: 'Cross-platform app, real-time reactive streams', usedIn: 'Dodo Bot Teleoperation App' },
  { name: 'Docker & Linux Server', category: 'embedded', level: 88, badge: 'DevOps', icon: '🐳', highlight: 'Containerization, systemd daemons, environment parity', usedIn: 'Buddy & Web Platforms' },
  { name: 'UART & Serial Protocols', category: 'embedded', level: 85, badge: 'Protocols', icon: '📡', highlight: '115200 baud deterministic byte stream, checksums', usedIn: 'Microcontroller bridges' }
];

type CategoryFilter = 'all' | 'web' | 'robotics' | 'ai' | 'embedded';

export default function InteractiveSkills() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);

  const filteredSkills = useMemo(() => {
    return SKILLS.filter(skill => {
      if (selectedCategory !== 'all' && skill.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          skill.name.toLowerCase().includes(q) ||
          skill.highlight.toLowerCase().includes(q) ||
          skill.usedIn.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="interactive-skills-wrapper">
      {/* Search & Category Filter Bar */}
      <div className="skills-filter-bar font-mono">
        <div className="category-tabs" role="tablist" aria-label="Skill Categories">
          <button
            type="button"
            className={`cat-pill ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Skills ({SKILLS.length})
          </button>
          <button
            type="button"
            className={`cat-pill ${selectedCategory === 'web' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('web')}
          >
            🌐 Web & Full-Stack
          </button>
          <button
            type="button"
            className={`cat-pill ${selectedCategory === 'robotics' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('robotics')}
          >
            🤖 Robotics & ROS 2
          </button>
          <button
            type="button"
            className={`cat-pill ${selectedCategory === 'ai' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('ai')}
          >
            🧠 AI & Vector Memory
          </button>
          <button
            type="button"
            className={`cat-pill ${selectedCategory === 'embedded' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('embedded')}
          >
            ⚡ Edge & Embedded
          </button>
        </div>

        <div className="skills-search-box">
          <input
            type="text"
            placeholder="Filter skills (e.g. Next.js, ROS 2, Jetson)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input font-mono"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search font-mono"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="skills-interactive-grid">
        {filteredSkills.map((skill) => {
          const isSelected = activeSkill?.name === skill.name;
          return (
            <div
              key={skill.name}
              className={`skill-card surface-card ${isSelected ? 'is-selected' : ''}`}
              onClick={() => setActiveSkill(isSelected ? null : skill)}
            >
              <div className="skill-card-top">
                <span className="skill-icon-box" aria-hidden="true">{skill.icon}</span>
                <div className="skill-meta-header">
                  <span className="skill-badge font-mono">{skill.badge}</span>
                  <h4 className="skill-name">{skill.name}</h4>
                </div>
              </div>

              {/* Visual Proficiency Meter */}
              <div className="skill-level-meter">
                <div className="meter-header font-mono">
                  <span className="meter-label">Proficiency</span>
                  <span className="meter-val">{skill.level}%</span>
                </div>
                <div className="meter-bar">
                  <div
                    className="meter-fill"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>

              <p className="skill-highlight font-mono">{skill.highlight}</p>

              <div className="skill-proof-chip font-mono">
                <span className="proof-label">Proven In:</span>
                <span className="proof-project">{skill.usedIn}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Skill Detail Modal / Callout if selected */}
      {activeSkill && (
        <div className="skill-active-callout surface-card font-mono">
          <div className="callout-header">
            <div className="callout-title-row">
              <span className="callout-icon">{activeSkill.icon}</span>
              <div>
                <h4 className="callout-name">{activeSkill.name}</h4>
                <span className="callout-badge">{activeSkill.badge} · {activeSkill.level}% Proficiency</span>
              </div>
            </div>
            <button
              type="button"
              className="callout-close"
              onClick={() => setActiveSkill(null)}
            >
              ✕
            </button>
          </div>
          <div className="callout-body">
            <p className="callout-text"><strong>Technical Focus:</strong> {activeSkill.highlight}</p>
            <p className="callout-text"><strong>Project Implementation:</strong> {activeSkill.usedIn}</p>
          </div>
        </div>
      )}

      <style>{`
        .interactive-skills-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
        }

        .skills-filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .category-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          background: var(--bg-surface, #ffffff);
          border: 1px solid var(--border-light, #e4e1d8);
          padding: 0.3rem;
          border-radius: 6px;
        }

        .cat-pill {
          background: transparent;
          border: none;
          padding: 0.45rem 0.8rem;
          font-family: inherit;
          font-size: 0.75rem;
          color: var(--text-muted, #52555a);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
          font-weight: 500;
        }

        .cat-pill:hover {
          color: var(--text-main, #18191b);
        }

        .cat-pill.active {
          background: var(--accent-orange, #ff5500);
          color: #ffffff;
          font-weight: 600;
          box-shadow: 0 2px 6px rgba(255, 85, 0, 0.25);
        }

        .skills-search-box {
          position: relative;
          min-width: 260px;
          flex-grow: 1;
          max-width: 380px;
        }

        .search-input {
          width: 100%;
          padding: 0.5rem 2rem 0.5rem 0.75rem;
          background: var(--bg-surface, #ffffff);
          border: 1px solid var(--border-light, #e4e1d8);
          border-radius: 6px;
          font-size: 0.75rem;
          color: var(--text-main, #18191b);
          outline: none;
          transition: border-color 0.15s ease;
        }

        .search-input:focus {
          border-color: var(--accent-orange, #ff5500);
        }

        .clear-search {
          position: absolute;
          right: 0.6rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-faint, #7e8289);
          cursor: pointer;
          font-size: 0.75rem;
        }

        .skills-interactive-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 1.25rem;
        }

        .skill-card {
          background: var(--bg-surface, #ffffff);
          border: 1px solid var(--border-light, #e4e1d8);
          border-radius: 8px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
          position: relative;
        }

        .skill-card:hover {
          transform: translateY(-3px);
          border-color: var(--accent-orange, #ff5500);
          box-shadow: 0 8px 24px rgba(255, 85, 0, 0.08);
        }

        .skill-card.is-selected {
          border-color: var(--accent-orange, #ff5500);
          box-shadow: 0 0 0 2px var(--accent-orange, #ff5500);
        }

        .skill-card-top {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .skill-icon-box {
          font-size: 1.5rem;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: var(--bg-primary, #f8f7f4);
          border-radius: 6px;
          border: 1px solid var(--border-faint, #eceae3);
          flex-shrink: 0;
        }

        .skill-meta-header {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .skill-badge {
          font-size: 0.625rem;
          color: var(--accent-orange, #ff5500);
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        .skill-name {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-main, #18191b);
          line-height: 1.25;
        }

        .skill-level-meter {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .meter-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.625rem;
          color: var(--text-faint, #7e8289);
        }

        .meter-val {
          color: var(--text-main, #18191b);
          font-weight: 600;
        }

        .meter-bar {
          width: 100%;
          height: 5px;
          background: var(--bg-subtle, #f1efeb);
          border-radius: 3px;
          overflow: hidden;
        }

        .meter-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff5500 0%, #ff8844 100%);
          border-radius: 3px;
          transition: width 0.6s ease-out;
        }

        .skill-highlight {
          font-size: 0.6875rem;
          color: var(--text-muted, #52555a);
          line-height: 1.45;
          margin: 0;
        }

        .skill-proof-chip {
          margin-top: auto;
          display: flex;
          gap: 0.35rem;
          font-size: 0.625rem;
          background: var(--bg-primary, #f8f7f4);
          border: 1px solid var(--border-faint, #eceae3);
          padding: 0.35rem 0.5rem;
          border-radius: 4px;
          align-items: center;
        }

        .proof-label {
          color: var(--text-faint, #7e8289);
          text-transform: uppercase;
        }

        .proof-project {
          color: var(--accent-orange, #ff5500);
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .skill-active-callout {
          background: var(--bg-dark-surface, #171a21);
          border: 1px solid var(--accent-orange, #ff5500);
          color: #ffffff;
          padding: 1.25rem;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .callout-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .callout-title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .callout-icon {
          font-size: 1.75rem;
        }

        .callout-name {
          font-size: 1.15rem;
          color: #ffffff;
          margin: 0;
        }

        .callout-badge {
          font-size: 0.6875rem;
          color: var(--accent-orange, #ff5500);
        }

        .callout-close {
          background: none;
          border: none;
          color: #9eabb8;
          cursor: pointer;
          font-size: 1rem;
        }

        .callout-body {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-size: 0.8125rem;
          color: #cfcbcd;
        }

        .callout-body strong {
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
