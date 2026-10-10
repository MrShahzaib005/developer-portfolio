import React, { useState } from 'react';

export default function InteractiveDiagram() {
  const [mode, setMode] = useState<'plain' | 'technical'>('plain');

  return (
    <div className="diagram-container">
      <div className="diagram-header">
        <div className="diagram-title-group">
          <span className="diagram-badge font-mono">Architecture Topology</span>
          <span className="diagram-subtitle">
            {mode === 'plain'
              ? 'Plain English: Observable responsibilities & data channels'
              : 'ROS 2 Topology: Nodes, pub/sub topics & WebSocket bridge'}
          </span>
        </div>

        <div className="diagram-toggle font-mono" role="group" aria-label="Terminology Mode">
          <button
            type="button"
            className={`toggle-btn ${mode === 'plain' ? 'active' : ''}`}
            onClick={() => setMode('plain')}
          >
            Plain English
          </button>
          <button
            type="button"
            className={`toggle-btn ${mode === 'technical' ? 'active' : ''}`}
            onClick={() => setMode('technical')}
          >
            ROS 2 Technical
          </button>
        </div>
      </div>

      <div className="diagram-legend font-mono">
        <div className="legend-item">
          <span className="node-indicator"></span>
          <span>
            {mode === 'plain'
              ? 'Component (Software module with one clear task)'
              : 'ROS 2 Node (Executable process)'}
          </span>
        </div>
        <div className="legend-item">
          <span className="topic-indicator"></span>
          <span>
            {mode === 'plain'
              ? 'Channel (Information pipeline streaming continuous data)'
              : 'ROS 2 Topic (Pub/Sub message bus)'}
          </span>
        </div>
      </div>

      <div className="diagram-stage">
        <svg viewBox="0 0 760 320" className="topology-svg" aria-label="Robotics software flow diagram">
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#FF5500" />
            </marker>
            <marker id="arrowhead-neutral" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#52555A" />
            </marker>
          </defs>

          {/* LAYER 1: CLIENT OPERATOR */}
          <g transform="translate(30, 40)">
            <rect width="180" height="240" rx="8" fill="#FFFFFF" stroke="#E4E1D8" strokeWidth="1.5" />
            <rect x="0" y="0" width="180" height="34" rx="8" fill="var(--bg-subtle)" />
            <text x="90" y="22" textAnchor="middle" fill="#18191B" fontSize="12" fontFamily="var(--font-mono)" fontWeight="600">
              {mode === 'plain' ? 'OPERATOR INTERFACE' : 'CLIENT APPLICATION'}
            </text>

            {/* Block 1 */}
            <rect x="15" y="55" width="150" height="65" rx="4" fill="#F8F7F4" stroke="#CFCBC0" />
            <text x="90" y="80" textAnchor="middle" fill="#18191B" fontSize="12" fontWeight="600">
              {mode === 'plain' ? 'Virtual Joystick UI' : 'Flutter Touch Layer'}
            </text>
            <text x="90" y="100" textAnchor="middle" fill="#7E8289" fontSize="10" fontFamily="var(--font-mono)">
              {mode === 'plain' ? 'Captures finger velocity' : 'Computes vx, wz coordinates'}
            </text>

            {/* Block 2 */}
            <rect x="15" y="145" width="150" height="65" rx="4" fill="#F8F7F4" stroke="#CFCBC0" />
            <text x="90" y="170" textAnchor="middle" fill="#18191B" fontSize="12" fontWeight="600">
              {mode === 'plain' ? 'Map Viewer Display' : 'Occupancy Grid Canvas'}
            </text>
            <text x="90" y="190" textAnchor="middle" fill="#7E8289" fontSize="10" fontFamily="var(--font-mono)">
              {mode === 'plain' ? 'Renders room obstacle map' : 'Subscribes to /map stream'}
            </text>
          </g>

          {/* COMMUNICATIONS BRIDGE */}
          <g transform="translate(230, 110)">
            {/* Forward Channel */}
            <path d="M 0 25 L 90 25" stroke="#FF5500" strokeWidth="2.5" markerEnd="url(#arrowhead)" strokeDasharray="6 3" />
            <rect x="10" y="5" width="70" height="18" rx="3" fill="#FFFFFF" stroke="#FF5500" strokeWidth="1" />
            <text x="45" y="17" textAnchor="middle" fill="#FF5500" fontSize="9" fontFamily="var(--font-mono)" fontWeight="600">
              {mode === 'plain' ? 'Motion Cmd' : 'WS /cmd_vel'}
            </text>

            {/* Return Channel */}
            <path d="M 90 85 L 0 85" stroke="#52555A" strokeWidth="2" markerEnd="url(#arrowhead-neutral)" strokeDasharray="4 2" />
            <rect x="10" y="65" width="70" height="18" rx="3" fill="#FFFFFF" stroke="#CFCBC0" strokeWidth="1" />
            <text x="45" y="77" textAnchor="middle" fill="#52555A" fontSize="9" fontFamily="var(--font-mono)">
              {mode === 'plain' ? 'Telemetry' : 'WS /odom & /map'}
            </text>
          </g>

          {/* LAYER 2: ROBOT ON-BOARD COMPUTATION */}
          <g transform="translate(340, 30)">
            <rect width="390" height="260" rx="8" fill="#FFFFFF" stroke="#18191B" strokeWidth="1.5" />
            <rect x="0" y="0" width="390" height="34" rx="8" fill="rgba(255, 85, 0, 0.08)" />
            <text x="195" y="22" textAnchor="middle" fill="#FF5500" fontSize="12" fontFamily="var(--font-mono)" fontWeight="600">
              {mode === 'plain' ? 'ON-BOARD COMPUTER (JETSON LINUX)' : 'ROS 2 HUMBLE RUNTIME (JETSON ORIN NANO)'}
            </text>

            {/* Node 1: Bridge / Router */}
            <rect x="20" y="55" width="150" height="80" rx="5" fill="#F8F7F4" stroke="#CFCBC0" />
            <circle cx="35" cy="72" r="5" fill="#FF5500" />
            <text x="50" y="76" fill="#18191B" fontSize="11" fontWeight="600" fontFamily="var(--font-mono)">
              {mode === 'plain' ? 'Web Bridge Node' : 'rosbridge_server'}
            </text>
            <text x="30" y="98" fill="#52555A" fontSize="10">
              {mode === 'plain' ? 'Translates network packets into robot signals' : 'JSON ↔ ROS Message Deserializer'}
            </text>
            <text x="30" y="118" fill="#7E8289" fontSize="9" fontFamily="var(--font-mono)">
              Port 9090 · 20Hz Throttling
            </text>

            {/* Node 2: Safety & Arbiter */}
            <rect x="220" y="55" width="150" height="80" rx="5" fill="#F8F7F4" stroke="#FF5500" strokeWidth="1.5" />
            <circle cx="235" cy="72" r="5" fill="#FF5500" />
            <text x="250" y="76" fill="#FF5500" fontSize="11" fontWeight="600" fontFamily="var(--font-mono)">
              {mode === 'plain' ? 'Safety Controller' : 'cmd_vel_mux'}
            </text>
            <text x="230" y="98" fill="#52555A" fontSize="10">
              {mode === 'plain' ? 'Halts wheels if signal drops >400ms' : 'Heartbeat timeout & emergency stop'}
            </text>
            <text x="230" y="118" fill="#10B981" fontSize="9" fontFamily="var(--font-mono)">
              Active Priority Lock
            </text>

            {/* Node 3: Sensor Fusion */}
            <rect x="20" y="160" width="150" height="80" rx="5" fill="#F8F7F4" stroke="#CFCBC0" />
            <circle cx="35" cy="177" r="5" fill="#18191B" />
            <text x="50" y="181" fill="#18191B" fontSize="11" fontWeight="600" fontFamily="var(--font-mono)">
              {mode === 'plain' ? 'Position Estimator' : 'robot_localization'}
            </text>
            <text x="30" y="203" fill="#52555A" fontSize="10">
              {mode === 'plain' ? 'Merges wheel ticks + IMU gyro' : 'EKF Odometry Filter'}
            </text>
            <text x="30" y="223" fill="#7E8289" fontSize="9" fontFamily="var(--font-mono)">
              Publish: /odom (50Hz)
            </text>

            {/* Node 4: Motor Driver */}
            <rect x="220" y="160" width="150" height="80" rx="5" fill="#F8F7F4" stroke="#CFCBC0" />
            <circle cx="235" cy="177" r="5" fill="#18191B" />
            <text x="250" y="181" fill="#18191B" fontSize="11" fontWeight="600" fontFamily="var(--font-mono)">
              {mode === 'plain' ? 'Wheel Motor Node' : 'diff_drive_controller'}
            </text>
            <text x="230" y="203" fill="#52555A" fontSize="10">
              {mode === 'plain' ? 'Sends PWM volts to wheel motors' : 'Hardware Interface Serial Driver'}
            </text>
            <text x="230" y="223" fill="#7E8289" fontSize="9" fontFamily="var(--font-mono)">
              ESP32 Serial @ 115200 bps
            </text>

            {/* Internal arrows */}
            <path d="M 170 95 L 220 95" stroke="#FF5500" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <path d="M 295 135 L 295 160" stroke="#FF5500" strokeWidth="2" markerEnd="url(#arrowhead)" />
          </g>
        </svg>
      </div>

      <div className="diagram-footer font-mono">
        <strong>Mentor Legibility Rule:</strong> Observable behavior is explained first: a <em>node</em> is a software component with a single clear responsibility; a <em>topic</em> is a channel carrying continuous information.
      </div>

      <style>{`
        .diagram-container {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 1.5rem;
          margin: 1.5rem 0;
        }

        .diagram-header {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        @media (min-width: 640px) {
          .diagram-header {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .diagram-badge {
          display: block;
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--accent-orange);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.2rem;
        }

        .diagram-subtitle {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .diagram-toggle {
          display: inline-flex;
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-light);
          border-radius: 4px;
          padding: 2px;
        }

        .toggle-btn {
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.35rem 0.65rem;
          border-radius: 3px;
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .toggle-btn.active {
          background-color: var(--bg-surface);
          color: var(--text-main);
          font-weight: 600;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
        }

        .diagram-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 1.25rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          padding: 0.6rem 0.85rem;
          background-color: var(--bg-primary);
          border-radius: 4px;
          border: 1px solid var(--border-faint);
          margin-bottom: 1rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .node-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--accent-orange);
        }

        .topic-indicator {
          width: 14px;
          height: 2px;
          background-color: #52555A;
        }

        .diagram-stage {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-faint);
          border-radius: 6px;
          padding: 1rem;
          overflow-x: auto;
        }

        .topology-svg {
          width: 100%;
          min-width: 600px;
          height: auto;
          display: block;
        }

        .diagram-footer {
          margin-top: 1rem;
          font-size: 0.75rem;
          color: var(--text-faint);
          line-height: 1.5;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-faint);
        }
      `}</style>
    </div>
  );
}
