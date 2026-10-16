import React, { useState, useMemo } from 'react';
import type { Project } from '../data/projects';

interface Props {
  projects: Project[];
  limit?: number;
  showViewMore?: boolean;
}

type ProfessionalField = 'All' | 'Robotics & Embedded' | 'Full-Stack Web' | 'AI & Systems';

const FIELDS: { label: ProfessionalField; icon: string }[] = [
  { label: 'All', icon: '✦' },
  { label: 'Robotics & Embedded', icon: '🤖' },
  { label: 'Full-Stack Web', icon: '🌐' },
  { label: 'AI & Systems', icon: '🧠' }
];

export default function FilterableWork({ projects, limit, showViewMore }: Props) {
  const [selectedField, setSelectedField] = useState<ProfessionalField>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter computation
  const filteredProjects = useMemo(() => {
    let result = projects.filter((project) => {
      // Professional field filter
      if (selectedField === 'Robotics & Embedded') {
        if (project.domain !== 'Robotics' && project.domain !== 'Mobile') return false;
      } else if (selectedField === 'Full-Stack Web') {
        if (project.domain !== 'Web') return false;
      } else if (selectedField === 'AI & Systems') {
        if (project.domain !== 'AI & Systems') return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(q);
        const matchesSub = project.subtitle.toLowerCase().includes(q);
        const matchesSummary = project.shortSummary.toLowerCase().includes(q);
        const matchesStack = project.stack.some(tech => tech.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSub && !matchesSummary && !matchesStack) {
          return false;
        }
      }

      return true;
    });

    if (limit && limit > 0) {
      result = result.slice(0, limit);
    }

    return result;
  }, [projects, selectedField, searchQuery, limit]);

  return (
    <div className="work-index-wrapper">
      {/* Simplified Professional Fields Filter Bar */}
      <div className="filter-controls-surface">
        <div className="fields-pills-row">
          {FIELDS.map((field) => (
            <button
              key={field.label}
              type="button"
              onClick={() => setSelectedField(field.label)}
              className={`field-pill font-mono ${selectedField === field.label ? 'is-active' : ''}`}
            >
              <span className="field-icon" aria-hidden="true">{field.icon}</span>
              <span>{field.label}</span>
            </button>
          ))}
        </div>

        <div className="search-input-wrap">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search by tech or keyword (e.g. ROS 2, Next.js, Jetson, pgvector)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-field font-mono"
            aria-label="Filter projects by keyword"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="clear-search-btn font-mono"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="empty-state font-mono">
          <p>No projects match the selected field.</p>
          <button 
            type="button" 
            onClick={() => { setSelectedField('All'); setSearchQuery(''); }} 
            className="btn btn-secondary font-mono" 
            style={{ marginTop: '1rem' }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <article key={project.slug} className="project-card">
              {project.thumbnail && (
                <div className="work-card-thumb-wrap">
                  <a href={`/work/${project.slug}`} tabIndex={-1} aria-hidden="true">
                    <img
                      src={project.thumbnail}
                      alt={`${project.title} preview`}
                      className="work-card-img"
                      loading="lazy"
                    />
                  </a>
                </div>
              )}

              <div className="card-header">
                <div className="card-badge-row font-mono">
                  <span className="domain-pill">
                    {project.domain === 'Robotics' || project.domain === 'Mobile' ? '🤖 Robotics & Embedded' : project.domain === 'Web' ? '🌐 Full-Stack Web' : '🧠 AI & Systems'}
                  </span>
                  {project.isSimulationOnly && (
                    <span className="mono-tag sim-tag">
                      Simulation Only
                    </span>
                  )}
                  {project.inProgress && (
                    <span className="mono-tag font-mono" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                      In Progress (FYP)
                    </span>
                  )}
                </div>

                <h3 className="project-title">
                  <a href={`/work/${project.slug}`}>
                    {project.title}
                  </a>
                </h3>

                <p className="project-subtitle">
                  {project.subtitle}
                </p>
              </div>

              <div className="card-body">
                {/* Specific 1-Sentence Scope for hiring team & recruiters */}
                <div className="ownership-quick-box font-mono">
                  <strong className="ownership-badge">Scope:</strong>
                  <span>{project.ownershipStatement}</span>
                </div>
              </div>

              <div className="card-footer">
                <div className="stack-wrap">
                  {project.stack.map((tech) => (
                    <span key={tech} className="tech-badge font-mono">{tech}</span>
                  ))}
                </div>

                <div className="links-row font-mono">
                  <a href={`/work/${project.slug}`} className="view-case-link">
                    <span>Read Case Study</span>
                    <span aria-hidden="true">→</span>
                  </a>

                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="repo-link"
                      title="Inspect GitHub repository"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                      <span>Repository ↗</span>
                    </a>
                  )}

                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="demo-link"
                      title="Open live deployment"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      <span>Live Demo ↗</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Button below to show more projects if limited on homepage */}
      {showViewMore && (
        <div className="view-more-container">
          <a href="/work" className="btn btn-secondary font-mono view-more-btn">
            <span>Show More Projects & Full Index →</span>
          </a>
        </div>
      )}

      <style>{`
        .work-index-wrapper {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          width: 100%;
        }

        .filter-controls-surface {
          background: rgba(18, 12, 34, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        }

        @media (min-width: 860px) {
          .filter-controls-surface {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .fields-pills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }

        .field-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8125rem;
          padding: 0.45rem 1rem;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background-color: rgba(11, 8, 19, 0.8);
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .field-pill:hover {
          color: #FFFFFF;
          border-color: rgba(168, 85, 247, 0.5);
          transform: translateY(-1px);
        }

        .field-pill.is-active {
          background: var(--accent-gradient);
          color: #FFFFFF;
          border-color: transparent;
          font-weight: 600;
          box-shadow: 0 4px 16px rgba(168, 85, 247, 0.4);
        }

        .search-input-wrap {
          position: relative;
          width: 100%;
          max-width: 380px;
        }

        .search-icon {
          position: absolute;
          left: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-faint);
          pointer-events: none;
        }

        .search-field {
          width: 100%;
          padding: 0.55rem 2.2rem 0.55rem 2.4rem;
          font-size: 0.8125rem;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background-color: rgba(11, 8, 19, 0.9);
          color: #FFFFFF;
          outline: none;
          transition: all 0.2s ease;
        }

        .search-field:focus {
          border-color: var(--accent-purple);
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
        }

        .search-field::placeholder {
          color: var(--text-faint);
          font-size: 0.75rem;
        }

        .clear-search-btn {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-faint);
          cursor: pointer;
          font-size: 0.875rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          background: rgba(18, 12, 34, 0.6);
          border-radius: 12px;
          border: 1px dashed rgba(255, 255, 255, 0.1);
          color: var(--text-muted);
        }

        .projects-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.75rem;
        }

        @media (min-width: 860px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .project-card {
          background-color: rgba(18, 12, 34, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1.25rem;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        }

        .project-card:hover {
          border-color: rgba(168, 85, 247, 0.4);
          box-shadow: 0 14px 36px rgba(168, 85, 247, 0.15);
          transform: translateY(-3px);
        }

        .work-card-thumb-wrap {
          margin: -1.5rem -1.5rem 1rem -1.5rem;
          height: 190px;
          overflow: hidden;
          background: #0B0813;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .work-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          transition: transform 0.4s ease;
        }

        .project-card:hover .work-card-img {
          transform: scale(1.04);
        }

        .card-header {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .card-badge-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .domain-pill {
          font-size: 0.6875rem;
          color: #D8B4FE;
          background: rgba(168, 85, 247, 0.12);
          border: 1px solid rgba(168, 85, 247, 0.25);
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          font-weight: 600;
        }

        .project-title {
          font-size: 1.2rem;
          line-height: 1.35;
          font-weight: 700;
          color: #FFFFFF;
          margin-top: 0.25rem;
        }

        .project-title a {
          color: #FFFFFF;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .project-title a:hover {
          color: #D8B4FE;
        }

        .project-subtitle {
          font-size: 0.875rem;
          line-height: 1.55;
          color: var(--text-muted);
          margin: 0;
        }

        .ownership-quick-box {
          background-color: rgba(11, 8, 19, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 0.65rem 0.85rem;
          border-radius: 8px;
          font-size: 0.75rem;
          line-height: 1.45;
          color: #E2E8F0;
        }

        .ownership-badge {
          color: #D8B4FE;
          margin-right: 0.4rem;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .card-footer {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: auto;
          padding-top: 0.5rem;
        }

        .stack-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .tech-badge {
          font-size: 0.6875rem;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-muted);
        }

        .links-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 0.8125rem;
        }

        .view-case-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: #FFFFFF;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .view-case-link:hover {
          color: #D8B4FE;
          transform: translateX(2px);
        }

        .repo-link, .demo-link {
          color: var(--text-muted);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          transition: color 0.15s ease;
        }

        .repo-link:hover, .demo-link:hover {
          color: #FFFFFF;
        }

        /* View more button below homepage grid */
        .view-more-container {
          text-align: center;
          margin-top: 1rem;
        }

        .view-more-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 2rem;
          border-radius: 9999px;
        }
      `}</style>
    </div>
  );
}
