import React, { useState, useEffect, useMemo } from 'react';
import type { Project } from '../data/projects';

interface Props {
  projects: Project[];
}

export default function FilterableWork({ projects }: Props) {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Hydrate filters from URL search params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const domainParam = params.get('domain');
      const tierParam = params.get('tier');
      const qParam = params.get('q');

      if (domainParam) setSelectedDomain(domainParam);
      if (tierParam) setSelectedTier(tierParam);
      if (qParam) setSearchQuery(qParam);
    }
  }, []);

  // Sync state changes back to URL search params
  const updateUrl = (domain: string, tier: string, query: string) => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();
      if (domain !== 'All') params.set('domain', domain);
      if (tier !== 'All') params.set('tier', tier);
      if (query.trim()) params.set('q', query.trim());

      const newRelativePathQuery = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.replaceState(null, '', newRelativePathQuery);
    }
  };

  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain);
    updateUrl(domain, selectedTier, searchQuery);
  };

  const handleTierChange = (tier: string) => {
    setSelectedTier(tier);
    updateUrl(selectedDomain, tier, searchQuery);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    updateUrl(selectedDomain, selectedTier, q);
  };

  const handleReset = () => {
    setSelectedDomain('All');
    setSelectedTier('All');
    setSearchQuery('');
    updateUrl('All', 'All', '');
  };

  // Filter computation
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Domain filter
      if (selectedDomain !== 'All' && project.domain !== selectedDomain) {
        return false;
      }
      // Tier filter
      if (selectedTier !== 'All') {
        const tierNum = parseInt(selectedTier.replace('Tier ', ''));
        if (project.tier !== tierNum) return false;
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
  }, [projects, selectedDomain, selectedTier, searchQuery]);

  const domains = ['All', 'Robotics', 'Web', 'AI & Systems', 'Mobile'];
  const tiers = ['All', 'Tier 1', 'Tier 2', 'Tier 3'];

  return (
    <div className="work-index-wrapper">
      {/* Search & Filter Header Bar */}
      <div className="filter-controls-surface">
        <div className="controls-row-top">
          <div className="search-input-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon" aria-hidden="true">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search by tool, library, domain, or concept (e.g. Nav2, ROS, Next.js, pgvector)..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="search-field"
              aria-label="Search projects"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="clear-search-btn"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="audit-note font-mono">
            <span>Verified Public Systems & Source Repos</span>
          </div>
        </div>

        <div className="filter-pill-groups">
          <div className="filter-group">
            <span className="filter-group-label font-mono">Domain:</span>
            <div className="pill-row">
              {domains.map((dom) => (
                <button
                  key={dom}
                  type="button"
                  onClick={() => handleDomainChange(dom)}
                  className={`filter-pill font-mono ${selectedDomain === dom ? 'is-active' : ''}`}
                >
                  {dom}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-group-label font-mono">Tier:</span>
            <div className="pill-row">
              {tiers.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTierChange(t)}
                  className={`filter-pill font-mono ${selectedTier === t ? 'is-active' : ''}`}
                >
                  {t === 'All' ? 'All Tiers' : t === 'Tier 1' ? 'Tier 1: Flagships' : t === 'Tier 2' ? 'Tier 2: Index' : 'Tier 3: Archive'}
                </button>
              ))}
            </div>
          </div>

          {(selectedDomain !== 'All' || selectedTier !== 'All' || searchQuery) && (
            <button
              type="button"
              onClick={handleReset}
              className="reset-filters-btn font-mono"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Meta */}
      <div className="results-count-bar font-mono">
        <span>Showing {filteredProjects.length} of {projects.length} recorded projects</span>
        <span className="url-sync-hint">Filters synchronized in URL query</span>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="empty-state font-mono">
          <p>No projects match your current filter combination.</p>
          <button type="button" onClick={handleReset} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <article key={project.slug} className={`project-card tier-${project.tier}`}>
              <div className="card-header">
                <div className="card-badge-row">
                  <span className={`mono-tag ${project.domain === 'Robotics' ? 'active' : ''}`}>
                    {project.domain}
                  </span>
                  <span className="tier-tag font-mono">
                    Tier {project.tier}
                  </span>
                  {project.isSimulationOnly && (
                    <span className="mono-tag sim-tag">
                      Simulation Only
                    </span>
                  )}
                  {project.inProgress && (
                    <span className="mono-tag font-mono" style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>
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
                {/* Observable behavior */}
                <div className="behavior-box font-mono">
                  <span className="box-label">Observable Behavior:</span>
                  <p className="behavior-text">{project.observableBehavior}</p>
                </div>

                {/* Ownership statement */}
                <div className="ownership-statement font-mono">
                  <span className="box-label">Exact Ownership:</span>
                  <p className="ownership-text">{project.ownershipStatement}</p>
                </div>
              </div>

              <div className="card-footer">
                <div className="stack-wrap">
                  {project.stack.map(tech => (
                    <span key={tech} className="tech-badge font-mono">{tech}</span>
                  ))}
                </div>

                <div className="links-row">
                  <a href={`/work/${project.slug}`} className="view-case-link font-mono">
                    <span>Read Case Study</span>
                    <span aria-hidden="true">→</span>
                  </a>

                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="github-repo-link font-mono"
                      title="Inspect GitHub repository"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                      <span>Repository</span>
                    </a>
                  )}

                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="demo-link font-mono"
                      title="Open live deployment"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <style>{`
        .work-index-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .filter-controls-surface {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .controls-row-top {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        @media (min-width: 768px) {
          .controls-row-top {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .search-input-wrap {
          position: relative;
          flex: 1;
          max-width: 640px;
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
          padding: 0.65rem 2.2rem 0.65rem 2.4rem;
          font-size: 0.875rem;
          border-radius: 6px;
          border: 1px solid var(--border-light);
          background-color: var(--bg-primary);
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

        .audit-note {
          font-size: 0.75rem;
          color: var(--text-faint);
          background-color: var(--bg-subtle);
          padding: 0.35rem 0.65rem;
          border-radius: 4px;
          border: 1px solid var(--border-faint);
          white-space: nowrap;
        }

        .filter-pill-groups {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-faint);
        }

        @media (min-width: 900px) {
          .filter-pill-groups {
            flex-direction: row;
            align-items: center;
          }
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .filter-group-label {
          font-size: 0.75rem;
          color: var(--text-faint);
          font-weight: 600;
          text-transform: uppercase;
        }

        .pill-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .filter-pill {
          font-size: 0.75rem;
          padding: 0.3rem 0.65rem;
          border-radius: 4px;
          border: 1px solid var(--border-light);
          background-color: var(--bg-subtle);
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .filter-pill:hover {
          color: var(--text-main);
          border-color: var(--border-strong);
        }

        .filter-pill.is-active {
          background-color: var(--text-main);
          color: var(--bg-surface);
          border-color: var(--text-main);
          font-weight: 600;
        }

        .reset-filters-btn {
          font-size: 0.75rem;
          color: var(--accent-orange);
          background: none;
          border: none;
          text-decoration: underline;
          cursor: pointer;
          margin-left: auto;
        }

        .results-count-bar {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-faint);
          padding: 0 0.25rem;
        }

        .url-sync-hint {
          display: none;
        }

        @media (min-width: 640px) {
          .url-sync-hint {
            display: inline;
          }
        }

        .projects-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 860px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .project-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 6px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1.25rem;
          transition: all var(--transition-fast);
        }

        .project-card:hover {
          border-color: var(--border-strong);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
        }

        .project-card.tier-1 {
          border-left: 3px solid var(--accent-orange);
        }

        .card-badge-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.75rem;
        }

        .tier-tag {
          font-size: 0.6875rem;
          color: var(--text-faint);
          padding: 0.15rem 0.45rem;
          background-color: var(--bg-subtle);
          border-radius: 3px;
        }

        .project-title {
          font-size: 1.25rem;
          line-height: 1.35;
          margin-bottom: 0.5rem;
        }

        .project-title a:hover {
          color: var(--accent-orange);
        }

        .project-subtitle {
          font-size: 0.9375rem;
          line-height: 1.6;
          color: var(--text-muted);
        }

        .behavior-box {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-faint);
          border-radius: 4px;
          padding: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .box-label {
          display: block;
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--text-faint);
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }

        .behavior-text, .ownership-text {
          font-size: 0.8125rem;
          color: var(--text-main);
          line-height: 1.5;
        }

        .ownership-statement {
          background-color: rgba(255, 85, 0, 0.04);
          border-left: 2px solid var(--accent-orange);
          padding: 0.6rem 0.75rem;
          border-radius: 0 4px 4px 0;
        }

        .stack-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-bottom: 1.25rem;
        }

        .tech-badge {
          font-size: 0.6875rem;
          padding: 0.2rem 0.5rem;
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-light);
          border-radius: 3px;
          color: var(--text-muted);
        }

        .links-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: wrap;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-faint);
        }

        .view-case-link {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-main);
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          border-bottom: 1px solid var(--border-strong);
        }

        .view-case-link:hover {
          color: var(--accent-orange);
          border-color: var(--accent-orange);
        }

        .github-repo-link, .demo-link {
          font-size: 0.75rem;
          color: var(--text-muted);
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .github-repo-link:hover, .demo-link:hover {
          color: var(--text-main);
        }

        .empty-state {
          padding: 3rem;
          text-align: center;
          background-color: var(--bg-surface);
          border: 1px dashed var(--border-light);
          border-radius: 8px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
