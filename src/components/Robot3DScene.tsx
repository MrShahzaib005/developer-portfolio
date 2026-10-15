import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Hotspot {
  id: string;
  name: string;
  role: string;
  tech: string;
  position: [number, number, number];
  description: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'lidar',
    name: '360° Laser LiDAR',
    role: 'Perception & SLAM',
    tech: 'SLAM Toolbox · ROS 2 · 12m Range',
    position: [0, 1.45, 0],
    description: 'Generates 2D occupancy grid maps and scans room obstacles at 15Hz for real-time obstacle avoidance.'
  },
  {
    id: 'jetson',
    name: 'NVIDIA Jetson Orin Nano',
    role: 'Edge Compute Core',
    tech: 'ARM Cortex · 1024-core Ampere · Ubuntu 22.04',
    position: [0, 0.75, 0.2],
    description: 'Runs headless Linux, Nav2 behavior trees, and the rosbridge WebSocket telemetry server.'
  },
  {
    id: 'motors',
    name: 'Differential Drive Base',
    role: 'Kinematics & Motion',
    tech: 'Dual DC Motors · Encoders · 20Hz cmd_vel',
    position: [1.2, 0.1, 0],
    description: 'Converts twist velocity commands (vx, wz) into differential wheel velocities with hardware watchdog failsafes.'
  },
  {
    id: 'comms',
    name: 'Telemetry Radio Bridge',
    role: 'Wireless Communications',
    tech: 'rosbridge_suite · JSON WebSockets · <45ms Latency',
    position: [-0.6, 1.35, -0.6],
    description: 'Streams odometry, battery status, and map updates directly to Flutter mobile apps and web platforms.'
  }
];

export default function Robot3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [isWireframe, setIsWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [scanActive, setScanActive] = useState(true);

  // References to update dynamically
  const sceneRef = useRef<THREE.Scene | null>(null);
  const robotGroupRef = useRef<THREE.Group | null>(null);
  const lidarTurretRef = useRef<THREE.Group | null>(null);
  const scanBeamRef = useRef<THREE.Mesh | null>(null);
  const leftWheelRef = useRef<THREE.Mesh | null>(null);
  const rightWheelRef = useRef<THREE.Mesh | null>(null);
  const materialsRef = useRef<THREE.Material[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(3.8, 2.8, 4.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const orangeAccentLight = new THREE.PointLight(0xff5500, 3, 8);
    orangeAccentLight.position.set(0, 1.8, 0);
    scene.add(orangeAccentLight);

    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    blueRimLight.position.set(-5, -2, -5);
    scene.add(blueRimLight);

    // Materials tracker for wireframe toggling
    const materials: THREE.Material[] = [];
    materialsRef.current = materials;

    const createMat = (options: THREE.MeshStandardMaterialParameters) => {
      const mat = new THREE.MeshStandardMaterial(options);
      materials.push(mat);
      return mat;
    };

    const metalDark = createMat({
      color: 0x181a20,
      metalness: 0.85,
      roughness: 0.25
    });

    const metalPlate = createMat({
      color: 0x2b303c,
      metalness: 0.7,
      roughness: 0.35
    });

    const orangeMat = createMat({
      color: 0xff5500,
      metalness: 0.5,
      roughness: 0.2,
      emissive: 0xff3300,
      emissiveIntensity: 0.35
    });

    const glowingCoreMat = createMat({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.85,
      roughness: 0.1
    });

    const rubberMat = createMat({
      color: 0x0f1115,
      roughness: 0.9,
      metalness: 0.1
    });

    // Robot Master Group
    const robotGroup = new THREE.Group();
    robotGroupRef.current = robotGroup;
    scene.add(robotGroup);

    // 1. Lower Chassis
    const lowerBodyGeo = new THREE.BoxGeometry(1.8, 0.45, 2.2);
    const lowerBody = new THREE.Mesh(lowerBodyGeo, metalDark);
    lowerBody.position.y = 0.45;
    lowerBody.castShadow = true;
    lowerBody.receiveShadow = true;
    robotGroup.add(lowerBody);

    // Accent side armor plates
    const sidePlateGeo = new THREE.BoxGeometry(0.08, 0.3, 2.0);
    const leftPlate = new THREE.Mesh(sidePlateGeo, orangeMat);
    leftPlate.position.set(0.92, 0.45, 0);
    robotGroup.add(leftPlate);

    const rightPlate = new THREE.Mesh(sidePlateGeo, orangeMat);
    rightPlate.position.set(-0.92, 0.45, 0);
    robotGroup.add(rightPlate);

    // 2. Upper Deck / Electronics Enclosure
    const upperDeckGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.35, 32);
    const upperDeck = new THREE.Mesh(upperDeckGeo, metalPlate);
    upperDeck.position.y = 0.8;
    upperDeck.castShadow = true;
    robotGroup.add(upperDeck);

    // Jetson Compute Module (Heatsink fins)
    const jetsonBaseGeo = new THREE.BoxGeometry(0.65, 0.15, 0.5);
    const jetsonBase = new THREE.Mesh(jetsonBaseGeo, metalDark);
    jetsonBase.position.set(0, 1.02, 0.2);
    robotGroup.add(jetsonBase);

    // Jetson Glowing Status LED
    const jetsonLedGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const jetsonLed = new THREE.Mesh(jetsonLedGeo, glowingCoreMat);
    jetsonLed.position.set(0.25, 1.12, 0.4);
    robotGroup.add(jetsonLed);

    // 3. LiDAR Turret (Top Rotator)
    const lidarTurret = new THREE.Group();
    lidarTurretRef.current = lidarTurret;
    lidarTurret.position.set(0, 1.15, 0);
    robotGroup.add(lidarTurret);

    // Turret pedestal
    const lidarBaseGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.2, 24);
    const lidarBase = new THREE.Mesh(lidarBaseGeo, metalPlate);
    lidarTurret.add(lidarBase);

    // Turret Rotating Head
    const lidarHeadGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.25, 24);
    const lidarHead = new THREE.Mesh(lidarHeadGeo, metalDark);
    lidarHead.position.y = 0.2;
    lidarTurret.add(lidarHead);

    // Turret Glowing Aperture
    const lidarEyeGeo = new THREE.BoxGeometry(0.1, 0.08, 0.26);
    const lidarEye = new THREE.Mesh(lidarEyeGeo, orangeMat);
    lidarEye.position.set(0, 0.2, 0.05);
    lidarTurret.add(lidarEye);

    // LiDAR Laser Scan Fan (translucent cone)
    const scanGeo = new THREE.ConeGeometry(2.4, 1.2, 32, 1, true, 0, Math.PI * 0.45);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0xff5500,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    const scanBeam = new THREE.Mesh(scanGeo, scanMat);
    scanBeam.rotation.x = Math.PI / 2;
    scanBeam.position.set(0, 0.18, 1.3);
    scanBeamRef.current = scanBeam;
    lidarTurret.add(scanBeam);

    // 4. Wheels (Left and Right)
    const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.28, 32);
    wheelGeo.rotateZ(Math.PI / 2);

    const leftWheel = new THREE.Mesh(wheelGeo, rubberMat);
    leftWheel.position.set(1.05, 0.42, 0);
    leftWheel.castShadow = true;
    leftWheelRef.current = leftWheel;
    robotGroup.add(leftWheel);

    const leftWheelCap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16), orangeMat);
    leftWheelCap.rotation.z = Math.PI / 2;
    leftWheel.add(leftWheelCap);

    const rightWheel = new THREE.Mesh(wheelGeo, rubberMat);
    rightWheel.position.set(-1.05, 0.42, 0);
    rightWheel.castShadow = true;
    rightWheelRef.current = rightWheel;
    robotGroup.add(rightWheel);

    const rightWheelCap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16), orangeMat);
    rightWheelCap.rotation.z = Math.PI / 2;
    rightWheel.add(rightWheelCap);

    // Casters (Front & Back)
    const casterGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const frontCaster = new THREE.Mesh(casterGeo, metalPlate);
    frontCaster.position.set(0, 0.18, 0.85);
    robotGroup.add(frontCaster);

    const rearCaster = new THREE.Mesh(casterGeo, metalPlate);
    rearCaster.position.set(0, 0.18, -0.85);
    robotGroup.add(rearCaster);

    // 5. Antenna Mast & Telemetry Beacon
    const mastGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.7, 12);
    const mast = new THREE.Mesh(mastGeo, metalDark);
    mast.position.set(-0.6, 1.05, -0.6);
    robotGroup.add(mast);

    const beaconGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const beaconMat = createMat({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 1
    });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(-0.6, 1.42, -0.6);
    robotGroup.add(beacon);

    // 6. Holographic Ground Grid & Coordinate Axis (ROS World Frame)
    const gridHelper = new THREE.GridHelper(7, 14, 0xff5500, 0xe4e1d8);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Concentric SLAM Range Rings
    const ringGeo = new THREE.RingGeometry(1.5, 1.54, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff5500,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const rangeRing1 = new THREE.Mesh(ringGeo, ringMat);
    rangeRing1.rotation.x = Math.PI / 2;
    rangeRing1.position.y = 0.01;
    scene.add(rangeRing1);

    const rangeRing2 = new THREE.Mesh(new THREE.RingGeometry(2.6, 2.64, 48), ringMat);
    rangeRing2.rotation.x = Math.PI / 2;
    rangeRing2.position.y = 0.01;
    scene.add(rangeRing2);

    // Coordinate Frame Arrows (TF2: X=Red, Y=Green, Z=Blue)
    const axesHelper = new THREE.AxesHelper(0.9);
    axesHelper.position.set(0, 0.02, 0);
    scene.add(axesHelper);

    // Hotspot 3D Beacons
    const hotspotMeshes: { mesh: THREE.Mesh; hotspot: Hotspot }[] = [];
    HOTSPOTS.forEach(hs => {
      const pingGeo = new THREE.SphereGeometry(0.09, 16, 16);
      const pingMat = new THREE.MeshBasicMaterial({
        color: 0xff5500,
        wireframe: true
      });
      const pingMesh = new THREE.Mesh(pingGeo, pingMat);
      pingMesh.position.set(...hs.position);
      robotGroup.add(pingMesh);
      hotspotMeshes.push({ mesh: pingMesh, hotspot: hs });
    });

    // Mouse Interaction / Camera Drag
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let cameraAngle = 0.75;
    let cameraElevation = 0.55;
    const cameraRadius = 5.2;

    const updateCameraPos = () => {
      camera.position.x = cameraRadius * Math.sin(cameraAngle) * Math.cos(cameraElevation);
      camera.position.z = cameraRadius * Math.cos(cameraAngle) * Math.cos(cameraElevation);
      camera.position.y = cameraRadius * Math.sin(cameraElevation);
      camera.lookAt(0, 0.65, 0);
    };
    updateCameraPos();

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      cameraAngle += deltaX * 0.008;
      cameraElevation = Math.max(0.15, Math.min(1.3, cameraElevation + deltaY * 0.006));

      updateCameraPos();
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Touch support for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;
        cameraAngle += deltaX * 0.008;
        cameraElevation = Math.max(0.15, Math.min(1.3, cameraElevation + deltaY * 0.006));
        updateCameraPos();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    domElement.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous LiDAR rotation
      if (lidarTurretRef.current) {
        lidarTurretRef.current.rotation.y += 0.035;
      }

      // Wheels rotation simulating forward motion
      if (leftWheelRef.current && rightWheelRef.current) {
        leftWheelRef.current.rotation.x += 0.02;
        rightWheelRef.current.rotation.x += 0.02;
      }

      // Hotspot pulse
      hotspotMeshes.forEach(({ mesh }, idx) => {
        const scale = 1 + Math.sin(elapsedTime * 3 + idx) * 0.25;
        mesh.scale.set(scale, scale, scale);
      });

      // Subtle chassis suspension breathing
      if (robotGroupRef.current) {
        robotGroupRef.current.position.y = Math.sin(elapsedTime * 2) * 0.02;
      }

      // Auto rotation if not dragged
      if (autoRotate && !isDragging) {
        cameraAngle += 0.004;
        updateCameraPos();
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('touchstart', handleTouchStart);
      domElement.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
      renderer.dispose();
    };
  }, [autoRotate]);

  // Handle wireframe toggle
  useEffect(() => {
    materialsRef.current.forEach(mat => {
      mat.wireframe = isWireframe;
    });
  }, [isWireframe]);

  // Handle scan beam toggle
  useEffect(() => {
    if (scanBeamRef.current) {
      scanBeamRef.current.visible = scanActive;
    }
  }, [scanActive]);

  return (
    <div className="robot-3d-wrapper">
      {/* 3D WebGL Canvas Viewport */}
      <div className="robot-canvas-container" ref={containerRef}>
        {/* Floating Cyber HUD Overlay */}
        <div className="canvas-hud-top font-mono">
          <div className="hud-badge">
            <span className="live-dot" />
            <span>ROS 2 Humble / Gazebo Physical Twin</span>
          </div>
          <div className="hud-metric">
            <span className="metric-label">Telemetry:</span>
            <span className="metric-val">20Hz · OK</span>
          </div>
        </div>

        {/* Floating Quick Interactive Hotspot Triggers */}
        <div className="hotspots-quick-bar font-mono">
          <span className="hotspot-prompt">Explore Subsystems:</span>
          {HOTSPOTS.map(hs => (
            <button
              key={hs.id}
              type="button"
              className={`hotspot-chip ${activeHotspot?.id === hs.id ? 'active' : ''}`}
              onClick={() => setActiveHotspot(activeHotspot?.id === hs.id ? null : hs)}
            >
              <span>{hs.name}</span>
            </button>
          ))}
        </div>

        {/* Active Hotspot Inspector Card */}
        {activeHotspot && (
          <div className="hotspot-card surface-card font-mono animate-fade-in">
            <div className="hotspot-card-header">
              <div className="hotspot-badge">{activeHotspot.role}</div>
              <button
                type="button"
                className="close-btn"
                onClick={() => setActiveHotspot(null)}
                aria-label="Close details"
              >
                ✕
              </button>
            </div>
            <h4 className="hotspot-title">{activeHotspot.name}</h4>
            <div className="hotspot-tech">{activeHotspot.tech}</div>
            <p className="hotspot-desc">{activeHotspot.description}</p>
          </div>
        )}

        {/* Viewport Action Controls */}
        <div className="viewport-controls font-mono">
          <button
            type="button"
            className={`ctrl-btn ${autoRotate ? 'active' : ''}`}
            onClick={() => setAutoRotate(!autoRotate)}
            title="Toggle 360 Orbit"
          >
            {autoRotate ? '⏸ Stop Orbit' : '▶ 360° Orbit'}
          </button>

          <button
            type="button"
            className={`ctrl-btn ${isWireframe ? 'active' : ''}`}
            onClick={() => setIsWireframe(!isWireframe)}
            title="Toggle Wireframe CAD Mode"
          >
            {isWireframe ? 'Solid CAD' : 'Wireframe'}
          </button>

          <button
            type="button"
            className={`ctrl-btn ${scanActive ? 'active' : ''}`}
            onClick={() => setScanActive(!scanActive)}
            title="Toggle LiDAR Laser Sweep"
          >
            {scanActive ? 'LiDAR: On' : 'LiDAR: Off'}
          </button>
        </div>

        <div className="drag-hint font-mono">
          <span>⤹ Drag to rotate 3D robot · Scroll to explore</span>
        </div>
      </div>

      <style>{`
        .robot-3d-wrapper {
          position: relative;
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          background: radial-gradient(circle at 50% 30%, #1e2430 0%, #0d1017 100%);
          border: 1px solid rgba(255, 85, 0, 0.25);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
        }

        .robot-canvas-container {
          position: relative;
          width: 100%;
          height: 380px;
          cursor: grab;
        }

        .robot-canvas-container:active {
          cursor: grabbing;
        }

        @media (min-width: 768px) {
          .robot-canvas-container {
            height: 440px;
          }
        }

        .canvas-hud-top {
          position: absolute;
          top: 1rem;
          left: 1rem;
          right: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          pointer-events: none;
          z-index: 10;
        }

        .hud-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(14, 16, 21, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          padding: 0.35rem 0.65rem;
          border-radius: 4px;
          font-size: 0.6875rem;
          color: #f4f4f5;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
        }

        .hud-metric {
          background: rgba(14, 16, 21, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          padding: 0.35rem 0.65rem;
          border-radius: 4px;
          font-size: 0.6875rem;
          display: flex;
          gap: 0.35rem;
        }

        .metric-label {
          color: #9eabb8;
        }

        .metric-val {
          color: #ff5500;
          font-weight: 600;
        }

        .hotspots-quick-bar {
          position: absolute;
          bottom: 3.5rem;
          left: 1rem;
          right: 1rem;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-wrap: wrap;
          z-index: 10;
        }

        .hotspot-prompt {
          font-size: 0.6875rem;
          color: #9eabb8;
          font-weight: 600;
          text-transform: uppercase;
        }

        .hotspot-chip {
          background: rgba(23, 26, 33, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #e4e1d8;
          font-family: inherit;
          font-size: 0.6875rem;
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .hotspot-chip:hover,
        .hotspot-chip.active {
          background: var(--accent-orange, #ff5500);
          border-color: var(--accent-orange, #ff5500);
          color: #ffffff;
          font-weight: 600;
          box-shadow: 0 0 10px rgba(255, 85, 0, 0.4);
        }

        .hotspot-card {
          position: absolute;
          bottom: 6.5rem;
          left: 1rem;
          max-width: 320px;
          background: rgba(14, 16, 21, 0.95);
          border: 1px solid var(--accent-orange, #ff5500);
          border-radius: 8px;
          padding: 1rem;
          z-index: 15;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(12px);
        }

        .hotspot-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.35rem;
        }

        .hotspot-badge {
          font-size: 0.625rem;
          color: var(--accent-orange, #ff5500);
          text-transform: uppercase;
          font-weight: 600;
        }

        .close-btn {
          background: none;
          border: none;
          color: #9eabb8;
          font-size: 0.875rem;
          cursor: pointer;
          line-height: 1;
        }

        .close-btn:hover {
          color: #ffffff;
        }

        .hotspot-title {
          font-size: 0.9375rem;
          color: #ffffff;
          margin-bottom: 0.2rem;
        }

        .hotspot-tech {
          font-size: 0.6875rem;
          color: #10b981;
          margin-bottom: 0.5rem;
        }

        .hotspot-desc {
          font-size: 0.75rem;
          line-height: 1.5;
          color: #cfcbcd;
        }

        .viewport-controls {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          display: flex;
          gap: 0.4rem;
          z-index: 10;
        }

        .ctrl-btn {
          background: rgba(14, 16, 21, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #cfcbcd;
          font-family: inherit;
          font-size: 0.6875rem;
          padding: 0.35rem 0.65rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .ctrl-btn:hover,
        .ctrl-btn.active {
          background: rgba(255, 85, 0, 0.2);
          border-color: var(--accent-orange, #ff5500);
          color: #ffffff;
        }

        .drag-hint {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          font-size: 0.6875rem;
          color: rgba(255, 255, 255, 0.4);
          pointer-events: none;
          z-index: 5;
        }
      `}</style>
    </div>
  );
}
