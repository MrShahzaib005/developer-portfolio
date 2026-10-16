import React from 'react';

interface SkillItem {
  name: string;
  level: number;
  icon: string;
}

interface SkillCategory {
  title: string;
  skills: SkillItem[];
}

const CATEGORIES: SkillCategory[] = [
  {
    title: 'Frontend',
    skills: [
      { name: 'React 19 / Next.js', level: 83, icon: '⚛️' },
      { name: 'TypeScript', level: 81, icon: 'TS' },
      { name: 'Tailwind CSS', level: 80, icon: '🎨' },
      { name: 'Flutter & Dart', level: 71, icon: '📱' },
    ]
  },
  {
    title: 'Backend & Systems',
    skills: [
      { name: 'Python 3.11', level: 81, icon: '🐍' },
      { name: 'PostgreSQL & Supabase', level: 77, icon: '🐘' },
      { name: 'Docker & Linux Server', level: 76, icon: '🐳' },
      { name: 'Prisma ORM', level: 75, icon: '💎' },
      { name: 'Spring Boot 3.x', level: 74, icon: '🍃' },
    ]
  },
  {
    title: 'Robotics & Cyber-Physical',
    skills: [
      { name: 'ROS 2 Humble', level: 82, icon: '🤖' },
      { name: 'Differential Drive Kinematics', level: 80, icon: '🏎️' },
      { name: 'rosbridge_suite & WebSockets', level: 78, icon: '⚡' },
      { name: 'Nav2 Navigation Stack', level: 74, icon: '🧭' },
      { name: 'URDF / Xacro', level: 73, icon: '📐' },
      { name: 'SLAM Toolbox', level: 70, icon: '🗺️' },
      { name: 'Gazebo Garden', level: 67, icon: '🌐' },
    ]
  },
  {
    title: 'AI & Embedded Systems',
    skills: [
      { name: 'NVIDIA Jetson Orin Nano', level: 73, icon: '⚡' },
      { name: 'pgvector & Semantic Memory', level: 72, icon: '🧠' },
      { name: 'LangChain4j & Edge LLMs', level: 68, icon: '🦜' },
      { name: 'UART & Serial Protocols', level: 66, icon: '📡' },
      { name: 'ML Coverage Heuristics', level: 65, icon: '📊' },
    ]
  }
];

const TECH_STACK: string[] = [
  'React',
  'Next.js',
  'TypeScript',
  'ROS 2 Humble',
  'Python',
  'Spring Boot',
  'Nav2',
  'Tailwind CSS',
  'PostgreSQL',
  'Supabase',
  'Prisma ORM',
  'Docker',
  'NVIDIA Jetson',
  'Flutter',
  'Gazebo',
  'SLAM Toolbox',
  'LangChain4j',
  'pgvector',
  'WebSockets',
  'FreeRTOS',
  'Git',
  'Linux Server',
  'FastAPI',
  'REST APIs'
];

export default function InteractiveSkills() {
  return (
    <div className="skills-showcase-container">
      {/* 2x2 Category Cards Grid */}
      <div className="skills-cards-grid">
        {CATEGORIES.map((category) => (
          <div key={category.title} className="skill-category-card">
            <h3 className="category-title">{category.title}</h3>
            <div className="category-skills-list">
              {category.skills.map((skill) => (
                <div key={skill.name} className="skill-progress-item">
                  <div className="skill-meta-row">
                    <span className="skill-identity">
                      <span className="skill-icon-badge" aria-hidden="true">{skill.icon}</span>
                      <span className="skill-name">{skill.name}</span>
                    </span>
                    <span className="skill-percent font-mono">{skill.level}%</span>
                  </div>
                  <div className="skill-track" role="progressbar" aria-valuenow={skill.level} aria-valuemin={0} aria-valuemax={100} aria-label={`${skill.name} proficiency`}>
                    <div 
                      className="skill-fill" 
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Technology Stack Pill Cloud */}
      <div className="tech-stack-section">
        <h3 className="tech-stack-title">Technology Stack</h3>
        <div className="tech-stack-cloud">
          {TECH_STACK.map((tech) => (
            <span key={tech} className="tech-stack-pill font-mono">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .skills-showcase-container {
          display: flex;
          flex-direction: column;
          gap: 3.5rem;
          width: 100%;
        }

        .skills-cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 860px) {
          .skills-cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.75rem;
          }
        }

        .skill-category-card {
          background: rgba(18, 12, 34, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 1.75rem clamp(1.25rem, 3vw, 2rem);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .skill-category-card:hover {
          border-color: rgba(168, 85, 247, 0.35);
          box-shadow: 0 14px 36px rgba(168, 85, 247, 0.12);
          transform: translateY(-2px);
        }

        .category-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 1.5rem;
          letter-spacing: -0.01em;
        }

        .category-skills-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .skill-progress-item {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .skill-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .skill-identity {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
        }

        .skill-icon-badge {
          font-size: 0.95rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .skill-name {
          font-size: 0.9375rem;
          font-weight: 500;
          color: #FFFFFF;
          letter-spacing: -0.01em;
        }

        .skill-percent {
          font-size: 0.875rem;
          font-weight: 600;
          color: #FFFFFF;
        }

        .skill-track {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 9999px;
          overflow: hidden;
        }

        .skill-fill {
          height: 100%;
          background: #FFFFFF;
          border-radius: 9999px;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
          transition: width 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Technology Stack Pill Cloud */
        .tech-stack-section {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.75rem;
        }

        .tech-stack-title {
          font-size: clamp(1.4rem, 2.5vw, 1.85rem);
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: -0.015em;
        }

        .tech-stack-cloud {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem 0.65rem;
          max-width: 920px;
          margin: 0 auto;
        }

        .tech-stack-pill {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1.15rem;
          border-radius: 9999px;
          background: rgba(12, 8, 22, 0.9);
          border: 1px solid rgba(59, 130, 246, 0.5);
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.2);
          color: #FFFFFF;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
          user-select: none;
        }

        .tech-stack-pill:hover {
          border-color: #38BDF8;
          box-shadow: 0 0 18px rgba(56, 189, 248, 0.45);
          transform: translateY(-2px);
          color: #FFFFFF;
        }
      `}</style>
    </div>
  );
}
