import React, { useState, useEffect, useRef } from 'react';

interface TopicConfig {
  id: string;
  name: string;
  type: string;
  publisher: string;
  subscribers: string[];
  defaultHz: number;
  qos: {
    reliability: 'RELIABLE' | 'BEST_EFFORT';
    durability: 'VOLATILE' | 'TRANSIENT_LOCAL';
    historyDepth: number;
  };
  samplePayload: Record<string, any>;
  description: string;
}

const TOPICS: TopicConfig[] = [
  {
    id: 'cmd_vel',
    name: '/cmd_vel',
    type: 'geometry_msgs/msg/Twist',
    publisher: 'teleop_twist_joy (Flutter Mobile / ROS Bridge)',
    subscribers: ['diff_drive_controller', 'heartbeat_safety_node', 'rviz2_display'],
    defaultHz: 20,
    qos: {
      reliability: 'RELIABLE',
      durability: 'VOLATILE',
      historyDepth: 10,
    },
    samplePayload: {
      linear: { x: 0.35, y: 0.0, z: 0.0 },
      angular: { x: 0.0, y: 0.0, z: -0.18 },
    },
    description: 'Throttled velocity commands sent from mobile virtual joystick to motor controllers at 20Hz.',
  },
  {
    id: 'scan',
    name: '/scan',
    type: 'sensor_msgs/msg/LaserScan',
    publisher: 'rplidar_node (2D 360° LiDAR)',
    subscribers: ['slam_toolbox', 'nav2_costmap_2d', 'collision_monitor'],
    defaultHz: 15,
    qos: {
      reliability: 'BEST_EFFORT',
      durability: 'VOLATILE',
      historyDepth: 5,
    },
    samplePayload: {
      angle_min: -3.14159,
      angle_max: 3.14159,
      angle_increment: 0.01745,
      range_min: 0.15,
      range_max: 12.0,
      ranges_sample: [1.42, 1.38, 1.35, 1.31, 0.95, 0.42, 0.45],
    },
    description: 'Continuous laser distance measurements used to generate 2D occupancy grid maps and detect obstacles.',
  },
  {
    id: 'odom',
    name: '/odom',
    type: 'nav_msgs/msg/Odometry',
    publisher: 'diff_drive_controller (Wheel Encoders)',
    subscribers: ['robot_localization (EKF)', 'nav2_controller', 'telemetry_bridge'],
    defaultHz: 30,
    qos: {
      reliability: 'BEST_EFFORT',
      durability: 'VOLATILE',
      historyDepth: 10,
    },
    samplePayload: {
      pose: {
        position: { x: 2.14, y: 1.08, z: 0.0 },
        orientation: { x: 0.0, y: 0.0, z: 0.38, w: 0.92 },
      },
      twist: {
        linear: { x: 0.32, y: 0.0, z: 0.0 },
        angular: { x: 0.0, y: 0.0, z: -0.15 },
      },
    },
    description: 'Dead-reckoning position calculated from wheel encoder ticks and forward kinematics.',
  },
  {
    id: 'battery_state',
    name: '/battery_state',
    type: 'sensor_msgs/msg/BatteryState',
    publisher: 'power_management_node (INA219 / ESP32)',
    subscribers: ['low_battery_watchdog', 'teleop_dashboard_ui'],
    defaultHz: 2,
    qos: {
      reliability: 'RELIABLE',
      durability: 'TRANSIENT_LOCAL',
      historyDepth: 1,
    },
    samplePayload: {
      voltage: 12.45,
      current: -1.35,
      percentage: 0.84,
      power_supply_status: 'DISCHARGING',
    },
    description: 'Live bus voltage and battery capacity polled to prevent brownouts on the Jetson Orin Nano.',
  },
];

export default function RosTopicBusSimulator() {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('cmd_vel');
  const [hz, setHz] = useState<number>(20);
  const [isPublishing, setIsPublishing] = useState<boolean>(true);
  const [packetCount, setPacketCount] = useState<number>(142);
  const [lastLatency, setLastLatency] = useState<number>(3.8);
  const [pulseActive, setPulseActive] = useState<boolean>(false);
  const [reliability, setReliability] = useState<'RELIABLE' | 'BEST_EFFORT'>('RELIABLE');

  const topic = TOPICS.find((t) => t.id === selectedTopicId) || TOPICS[0];

  // When switching topic, reset defaults
  const handleSelectTopic = (id: string) => {
    setSelectedTopicId(id);
    const target = TOPICS.find((t) => t.id === id);
    if (target) {
      setHz(target.defaultHz);
      setReliability(target.qos.reliability);
    }
  };

  // Live packet count ticker
  useEffect(() => {
    if (!isPublishing) return;
    const intervalMs = Math.max(20, Math.round(1000 / hz));
    const timer = setInterval(() => {
      setPacketCount((prev) => prev + 1);
      // Realistic jitter between 1.8ms and 5.2ms
      setLastLatency(Number((2.4 + Math.random() * 2.5).toFixed(1)));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPublishing, hz]);

  const handleTriggerPulse = () => {
    setPulseActive(true);
    setPacketCount((prev) => prev + 1);
    setTimeout(() => setPulseActive(false), 600);
  };

  return (
    <div className="topic-simulator-container surface-card">
      <div className="sim-header">
        <div>
          <span className="mono-tag" style={{ marginBottom: '0.4rem' }}>
            Interactive Experiment 02 · DDS Middleware Bus
          </span>
          <h3 style={{ fontSize: '1.45rem', marginTop: '0.25rem' }}>
            ROS 2 Pub/Sub Message Bus Visualizer
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Inspect how deterministic nodes communicate asynchronously over DDS channels without direct dependencies.
          </p>
        </div>

        <div className="topic-selector-tabs font-mono">
          {TOPICS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`topic-tab ${selectedTopicId === t.id ? 'active' : ''}`}
              onClick={() => handleSelectTopic(t.id)}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Bus Visualization Stage */}
      <div className="bus-visualizer-stage">
        {/* Publisher Node */}
        <div className="node-box publisher-node">
          <div className="node-role-badge font-mono">Publisher Node</div>
          <div className="node-name">{topic.publisher}</div>
          <div className="node-meta font-mono">
            Rate: {hz} Hz · Status: {isPublishing ? 'Active' : 'Paused'}
          </div>
        </div>

        {/* The ROS 2 Topic Channel */}
        <div className="topic-pipeline">
          <div className="channel-line">
            <div className={`packet-flow ${isPublishing ? 'animate' : ''} ${pulseActive ? 'pulse' : ''}`} />
          </div>
          <div className="channel-pill font-mono">
            <span className="channel-dot" />
            <span className="channel-name">{topic.name}</span>
            <span className="channel-type">[{topic.type}]</span>
          </div>
        </div>

        {/* Subscribers Group */}
        <div className="subscribers-group">
          <div className="group-label font-mono">Subscriber Nodes ({topic.subscribers.length})</div>
          {topic.subscribers.map((sub, idx) => (
            <div key={idx} className="node-box subscriber-node">
              <span className="node-name">{sub}</span>
              <span className="node-meta font-mono">Latched · Buffer Depth: {topic.qos.historyDepth}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Controls & Metrics Grid */}
      <div className="sim-controls-grid">
        {/* Left: Controls */}
        <div className="control-panel font-mono">
          <span className="panel-title">QoS & Distribution Controls</span>

          <div className="control-row">
            <label htmlFor="hz-range">Publish Rate: {hz} Hz</label>
            <input
              id="hz-range"
              type="range"
              min="1"
              max="50"
              value={hz}
              onChange={(e) => setHz(Number(e.target.value))}
              className="range-input"
            />
          </div>

          <div className="control-row">
            <span className="control-label">QoS Reliability:</span>
            <div className="qos-toggle-buttons">
              <button
                type="button"
                className={`qos-btn ${reliability === 'RELIABLE' ? 'active' : ''}`}
                onClick={() => setReliability('RELIABLE')}
              >
                RELIABLE
              </button>
              <button
                type="button"
                className={`qos-btn ${reliability === 'BEST_EFFORT' ? 'active' : ''}`}
                onClick={() => setReliability('BEST_EFFORT')}
              >
                BEST_EFFORT
              </button>
            </div>
          </div>

          <div className="action-buttons-row">
            <button
              type="button"
              className="btn btn-secondary font-mono btn-sm"
              onClick={() => setIsPublishing(!isPublishing)}
            >
              {isPublishing ? 'Pause Stream' : 'Resume Stream'}
            </button>
            <button
              type="button"
              className="btn btn-primary font-mono btn-sm"
              onClick={handleTriggerPulse}
            >
              Publish Test Pulse ⚡
            </button>
          </div>
        </div>

        {/* Right: Live Telemetry & Payload */}
        <div className="telemetry-panel font-mono">
          <div className="telemetry-stats-bar">
            <div>
              <span className="stat-label">Messages Streamed:</span>
              <span className="stat-value">{packetCount.toLocaleString()}</span>
            </div>
            <div>
              <span className="stat-label">DDS Latency:</span>
              <span className="stat-value" style={{ color: '#10B981' }}>{lastLatency} ms</span>
            </div>
            <div>
              <span className="stat-label">Durability:</span>
              <span className="stat-value">{topic.qos.durability}</span>
            </div>
          </div>

          <div className="payload-preview">
            <span className="preview-label">Live Message Payload ({topic.type}):</span>
            <pre className="payload-json">
              {JSON.stringify(topic.samplePayload, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      <div className="educational-footer font-mono">
        <strong>The Robotics Architecture Rule:</strong> ROS 2 nodes communicate anonymously over topics carried by the Data Distribution Service (DDS) middleware. A publisher never knows who or how many nodes are subscribing—allowing us to add safety monitors or mobile teleoperation bridges without altering low-level motor drivers.
      </div>

      <style>{`
        .topic-simulator-container {
          padding: clamp(1.5rem, 4vw, 2.25rem);
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 8px;
        }

        .sim-header {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 1.5rem;
        }

        @media (min-width: 860px) {
          .sim-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
          }
        }

        .topic-selector-tabs {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .topic-tab {
          font-family: inherit;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.45rem 0.85rem;
          border-radius: 4px;
          border: 1px solid var(--border-light);
          background-color: var(--bg-subtle);
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .topic-tab:hover {
          color: var(--text-main);
          border-color: var(--border-strong);
        }

        .topic-tab.active {
          background-color: var(--text-main);
          color: #FFFFFF;
          border-color: var(--text-main);
        }

        /* Bus Visualizer Stage */
        .bus-visualizer-stage {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          align-items: center;
          padding: 1.5rem;
          background-color: var(--bg-primary);
          border-radius: 6px;
          border: 1px solid var(--border-faint);
          margin-bottom: 1.75rem;
        }

        @media (min-width: 860px) {
          .bus-visualizer-stage {
            grid-template-columns: 1.2fr 1fr 1.2fr;
          }
        }

        .node-box {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 6px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
        }

        .publisher-node {
          border-left: 3px solid var(--accent-orange);
        }

        .node-role-badge {
          font-size: 0.6875rem;
          color: var(--accent-orange);
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .node-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .node-meta {
          font-size: 0.6875rem;
          color: var(--text-faint);
        }

        .topic-pipeline {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          position: relative;
        }

        .channel-line {
          width: 100%;
          height: 3px;
          background-color: var(--border-strong);
          position: relative;
          border-radius: 2px;
          overflow: hidden;
        }

        .packet-flow {
          position: absolute;
          top: 0;
          left: -40px;
          width: 30px;
          height: 100%;
          background: linear-gradient(90deg, transparent, var(--accent-orange), #FFA500);
          border-radius: 2px;
        }

        .packet-flow.animate {
          animation: streamPacket 1.2s infinite linear;
        }

        .packet-flow.pulse {
          background: #FF5500;
          box-shadow: 0 0 10px #FF5500;
          animation: fastPulse 0.4s ease-out;
        }

        @keyframes streamPacket {
          0% { left: -30px; }
          100% { left: 100%; }
        }

        @keyframes fastPulse {
          0% { left: 0%; width: 40px; }
          100% { left: 100%; width: 40px; }
        }

        .channel-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
          font-size: 0.75rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
        }

        .channel-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--accent-orange);
        }

        .channel-name {
          font-weight: 600;
          color: var(--text-main);
        }

        .channel-type {
          font-size: 0.6875rem;
          color: var(--text-faint);
        }

        .subscribers-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .group-label {
          font-size: 0.6875rem;
          color: var(--text-faint);
          text-transform: uppercase;
        }

        .subscriber-node {
          border-right: 3px solid #10B981;
          padding: 0.65rem 0.85rem;
        }

        /* Controls & Telemetry Grid */
        .sim-controls-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 860px) {
          .sim-controls-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .control-panel, .telemetry-panel {
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-light);
          border-radius: 6px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .panel-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-faint);
          text-transform: uppercase;
        }

        .control-row {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .range-input {
          accent-color: var(--accent-orange);
          cursor: pointer;
        }

        .qos-toggle-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .qos-btn {
          flex: 1;
          font-family: inherit;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.4rem;
          border-radius: 4px;
          border: 1px solid var(--border-light);
          background-color: var(--bg-surface);
          color: var(--text-muted);
          cursor: pointer;
        }

        .qos-btn.active {
          background-color: var(--text-main);
          color: #FFFFFF;
          border-color: var(--text-main);
        }

        .action-buttons-row {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .btn-sm {
          padding: 0.45rem 0.85rem;
          font-size: 0.75rem;
        }

        .telemetry-stats-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 0.75rem;
        }

        .stat-label {
          display: block;
          font-size: 0.6875rem;
          color: var(--text-faint);
        }

        .stat-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .payload-preview {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .preview-label {
          font-size: 0.6875rem;
          color: var(--text-faint);
        }

        .payload-json {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-faint);
          border-radius: 4px;
          padding: 0.75rem;
          font-size: 0.6875rem;
          color: var(--text-main);
          overflow-x: auto;
          max-height: 140px;
        }

        .educational-footer {
          font-size: 0.75rem;
          color: var(--text-muted);
          background-color: var(--bg-primary);
          padding: 0.85rem 1.15rem;
          border-radius: 4px;
          border-left: 3px solid var(--accent-orange);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
