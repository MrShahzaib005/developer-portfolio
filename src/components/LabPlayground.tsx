import React, { useState, useEffect, useRef } from 'react';

export default function LabPlayground() {
  const [kp, setKp] = useState(1.8);
  const [kd, setKd] = useState(0.4);
  const [maxLinear, setMaxLinear] = useState(1.2);
  const [isRunning, setIsRunning] = useState(true);

  // Robot State: [x, y, theta]
  const [robotPos, setRobotPos] = useState({ x: 80, y: 160, theta: 0 });
  const [targetPos, setTargetPos] = useState({ x: 380, y: 160 });
  const [telemetry, setTelemetry] = useState({
    distError: 0,
    angleError: 0,
    v: 0,
    w: 0
  });

  const pathHistoryRef = useRef<{ x: number; y: number }[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let currentX = robotPos.x;
    let currentY = robotPos.y;
    let currentTheta = robotPos.theta;
    let prevAngleError = 0;

    const loop = () => {
      if (isRunning) {
        const dx = targetPos.x - currentX;
        const dy = targetPos.y - currentY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const desiredTheta = Math.atan2(dy, dx);

        let angleDiff = desiredTheta - currentTheta;
        // Normalize angle to [-PI, PI]
        while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

        const dAngle = angleDiff - prevAngleError;
        prevAngleError = angleDiff;

        // PD Controller for angular velocity
        let w = kp * angleDiff + kd * dAngle;
        w = Math.max(-2.5, Math.min(2.5, w));

        // Linear velocity throttled by alignment error
        let v = distance > 10 ? Math.max(0, maxLinear * Math.cos(angleDiff)) : 0;
        if (Math.abs(angleDiff) > Math.PI / 3) {
          v *= 0.2; // slow down when sharply misaligned
        }

        const dt = 0.05;
        currentTheta += w * dt;
        currentX += v * Math.cos(currentTheta) * dt * 25;
        currentY += v * Math.sin(currentTheta) * dt * 25;

        // Update path history
        pathHistoryRef.current.push({ x: currentX, y: currentY });
        if (pathHistoryRef.current.length > 180) {
          pathHistoryRef.current.shift();
        }

        setRobotPos({ x: currentX, y: currentY, theta: currentTheta });
        setTelemetry({
          distError: parseFloat(distance.toFixed(1)),
          angleError: parseFloat((angleDiff * 180 / Math.PI).toFixed(1)),
          v: parseFloat(v.toFixed(2)),
          w: parseFloat(w.toFixed(2))
        });
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [targetPos, kp, kd, maxLinear, isRunning]);

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 540;
    const clickY = ((e.clientY - rect.top) / rect.height) * 320;
    setTargetPos({ x: clickX, y: clickY });
  };

  const resetPosition = () => {
    pathHistoryRef.current = [];
    setRobotPos({ x: 80, y: 160, theta: 0 });
    setTargetPos({ x: 380, y: 160 });
  };

  return (
    <div className="lab-playground-wrapper">
      <div className="playground-header">
        <div>
          <span className="playground-badge font-mono">Interactive Experiment 01</span>
          <h2>Differential Drive Kinematics & PD Steering Simulator</h2>
          <p>
            Click anywhere inside the 2D arena to deploy a spatial waypoint. Adjust the proportional (Kp) and derivative (Kd) controller gains to observe trajectory oscillations, settling times, and velocity damping.
          </p>
        </div>

        <div className="playground-actions font-mono">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? 'Pause Sim' : 'Resume Sim'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={resetPosition}
          >
            Reset Arena
          </button>
        </div>
      </div>

      <div className="playground-content-grid">
        {/* SVG Interactive Sim Arena */}
        <div className="sim-arena-card">
          <div className="arena-meta-bar font-mono">
            <span>Click arena to set waypoint [Target: {Math.round(targetPos.x)}, {Math.round(targetPos.y)}]</span>
            <span className="live-pill">
              <span className="pulse-dot"></span> Live Kinematics Loop (50Hz)
            </span>
          </div>

          <svg
            viewBox="0 0 540 320"
            className="sim-svg-canvas"
            onClick={handleCanvasClick}
            aria-label="Interactive 2D robotics arena"
          >
            <defs>
              <pattern id="arenaGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="#E4E1D8" />
              </pattern>
            </defs>

            <rect width="540" height="320" fill="url(#arenaGrid)" />

            {/* Target waypoint marker */}
            <circle cx={targetPos.x} cy={targetPos.y} r="18" fill="rgba(255, 85, 0, 0.12)" />
            <circle cx={targetPos.x} cy={targetPos.y} r="8" fill="none" stroke="#FF5500" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx={targetPos.x} cy={targetPos.y} r="3" fill="#FF5500" />
            <text x={targetPos.x} y={targetPos.y - 14} textAnchor="middle" fill="#FF5500" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">
              TARGET GOAL
            </text>

            {/* Trajectory Trail */}
            {pathHistoryRef.current.length > 1 && (
              <polyline
                points={pathHistoryRef.current.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#FF5500"
                strokeWidth="2.5"
                strokeOpacity="0.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Robot Chassis */}
            <g transform={`translate(${robotPos.x}, ${robotPos.y}) rotate(${robotPos.theta * 180 / Math.PI})`}>
              {/* Main Body */}
              <rect x="-18" y="-14" width="36" height="28" rx="5" fill="#18191B" stroke="#282C37" strokeWidth="1.5" />
              {/* Left & Right Drive Wheels */}
              <rect x="-10" y="-18" width="20" height="5" rx="1.5" fill="#FF5500" />
              <rect x="-10" y="13" width="20" height="5" rx="1.5" fill="#FF5500" />
              {/* Caster Wheel */}
              <circle cx="-12" cy="0" r="3" fill="#7E8289" />
              {/* Forward Sensor Eye */}
              <circle cx="10" cy="0" r="4" fill="#FF5500" />
              {/* Heading Indicator Vector */}
              <line x1="10" y1="0" x2="26" y2="0" stroke="#FF5500" strokeWidth="2" />
            </g>
          </svg>

          {/* Telemetry Bar */}
          <div className="telemetry-readout font-mono">
            <div className="telemetry-cell">
              <span className="t-label">Distance Error:</span>
              <span className="t-val">{telemetry.distError} px</span>
            </div>
            <div className="telemetry-cell">
              <span className="t-label">Heading Error:</span>
              <span className="t-val">{telemetry.angleError}°</span>
            </div>
            <div className="telemetry-cell">
              <span className="t-label">Linear Velocity (v):</span>
              <span className="t-val">{telemetry.v} m/s</span>
            </div>
            <div className="telemetry-cell">
              <span className="t-label">Angular Velocity (w):</span>
              <span className="t-val">{telemetry.w} rad/s</span>
            </div>
          </div>
        </div>

        {/* Tuning Controls */}
        <div className="sim-controls-panel font-mono">
          <span className="controls-panel-title">Controller Gain Calibration</span>

          <div className="control-slider-group">
            <div className="slider-label-row">
              <span>Kp (Proportional Gain):</span>
              <span className="val-badge">{kp.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.1"
              value={kp}
              onChange={(e) => setKp(parseFloat(e.target.value))}
            />
            <p className="slider-hint">Drives angular steering velocity proportionally to heading error.</p>
          </div>

          <div className="control-slider-group">
            <div className="slider-label-row">
              <span>Kd (Derivative Damping):</span>
              <span className="val-badge">{kd.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.5"
              step="0.05"
              value={kd}
              onChange={(e) => setKd(parseFloat(e.target.value))}
            />
            <p className="slider-hint">Dampens overshoot and suppresses rotational oscillations.</p>
          </div>

          <div className="control-slider-group">
            <div className="slider-label-row">
              <span>v_max (Linear Speed Limit):</span>
              <span className="val-badge">{maxLinear.toFixed(1)} m/s</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={maxLinear}
              onChange={(e) => setMaxLinear(parseFloat(e.target.value))}
            />
            <p className="slider-hint">Maximum forward wheel speed along path tangents.</p>
          </div>

          <div className="hardware-specs-card">
            <span className="hw-title">Hardware Mapping Context</span>
            <p className="hw-desc">
              On Dodo Bot, this calculated command tuple <code>(v, w)</code> is published as a <code>geometry_msgs/msg/Twist</code> over WebSockets (port 9090) to the Jetson Orin Nano, where the <code>diff_drive_controller</code> converts it to wheel RPMs for the dual DC motor drivers.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .lab-playground-wrapper {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-top: 1rem;
        }

        .playground-header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @media (min-width: 860px) {
          .playground-header {
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
          }
        }

        .playground-badge {
          font-size: 0.75rem;
          color: var(--accent-orange);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 0.35rem;
        }

        .playground-header h2 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }

        .playground-header p {
          max-width: 680px;
          font-size: 0.9375rem;
        }

        .playground-actions {
          display: flex;
          gap: 0.5rem;
          white-space: nowrap;
        }

        .playground-content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 900px) {
          .playground-content-grid {
            grid-template-columns: 7fr 5fr;
            align-items: start;
          }
        }

        .sim-arena-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }

        .arena-meta-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background-color: var(--bg-subtle);
          border-bottom: 1px solid var(--border-light);
          font-size: 0.75rem;
          color: var(--text-faint);
        }

        .live-pill {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: #10B981;
          font-weight: 500;
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #10B981;
          display: inline-block;
        }

        .sim-svg-canvas {
          width: 100%;
          height: auto;
          display: block;
          background-color: var(--bg-primary);
          cursor: crosshair;
        }

        .telemetry-readout {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          padding: 0.85rem 1rem;
          background-color: var(--bg-surface);
          border-top: 1px solid var(--border-light);
          font-size: 0.75rem;
        }

        @media (min-width: 600px) {
          .telemetry-readout {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .telemetry-cell {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .t-label {
          color: var(--text-faint);
          font-size: 0.6875rem;
        }

        .t-val {
          color: var(--text-main);
          font-weight: 600;
        }

        .sim-controls-panel {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .controls-panel-title {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-main);
          text-transform: uppercase;
          border-bottom: 1px solid var(--border-faint);
          padding-bottom: 0.5rem;
        }

        .control-slider-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .slider-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .val-badge {
          color: var(--accent-orange);
          font-weight: 600;
        }

        .slider-hint {
          font-size: 0.6875rem;
          color: var(--text-faint);
          line-height: 1.4;
        }

        input[type="range"] {
          width: 100%;
          accent-color: var(--accent-orange);
          cursor: pointer;
        }

        .hardware-specs-card {
          margin-top: 0.5rem;
          padding: 1rem;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-faint);
          border-radius: 6px;
        }

        .hw-title {
          display: block;
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--text-faint);
          text-transform: uppercase;
          margin-bottom: 0.4rem;
        }

        .hw-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.55;
        }

        .hw-desc code {
          background-color: var(--bg-subtle);
          padding: 0.1rem 0.3rem;
          border-radius: 3px;
          color: var(--text-main);
        }
      `}</style>
    </div>
  );
}
