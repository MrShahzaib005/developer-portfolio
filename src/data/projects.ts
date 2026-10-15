export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  tier: 1 | 2 | 3;
  domain: 'Robotics' | 'Web' | 'AI & Systems' | 'Mobile';
  stack: string[];
  repoUrl?: string;
  demoUrl?: string;
  featuredInProofStrip: boolean;
  isSimulationOnly?: boolean;
  inProgress?: boolean;
  ownershipStatement: string;
  shortSummary: string;
  observableBehavior: string;
  keyDecisions: string[];
  validation: string;
  metricsTruth: string;
  thumbnail: string;
}

export const PROJECTS: Project[] = [
  // ==================== TIER 1: FLAGSHIPS ====================
  {
    slug: 'dodo-bot',
    title: 'Dodo Bot Mobile Teleoperation & ROS Bridge',
    subtitle: 'Cross-platform Flutter control app communicating with a Jetson Orin Nano differential drive robot over WebSockets.',
    tier: 1,
    domain: 'Robotics',
    stack: ['Flutter', 'Dart', 'ROS 2 Humble', 'rosbridge_suite', 'WebSockets', 'Nav2', 'Linux'],
    repoUrl: 'https://github.com/MrShahzaib005/Dodo_Bot',
    featuredInProofStrip: true,
    isSimulationOnly: false,
    ownershipStatement: 'I built the Flutter mobile control application, the WebSocket telemetry layer, and the ROS topic bridge client; Aqil Buzdar built the physical hardware chassis, motor controllers, and the base ROS2 workspace.',
    shortSummary: 'A production-grade mobile control interface that lets operators teleoperate a differential drive robot, inspect real-time sensor topics, and view generated 2D grid maps over local WiFi.',
    observableBehavior: 'Operator drags virtual dual-axis joystick on mobile screen; robot wheels accelerate instantaneously within 45ms latency while live LiDAR scan points and odometry stream back to the UI map layer.',
    keyDecisions: [
      'Chose rosbridge WebSocket JSON protocol over raw TCP sockets to maintain Flutter cross-platform compatibility without native C++ compilation bindings.',
      'Throttled cmd_vel velocity publishing to 20Hz on the client side to avoid saturating local WiFi bandwidth while maintaining smooth motion profiles.',
      'Implemented optimistic UI state with heartbeat timeout to automatically brake the robot if network packets drop for >400ms.'
    ],
    validation: 'Tested under degraded 2.4GHz WiFi conditions with 10% packet drop; emergency stop triggered reliably within 380ms of link degradation.',
    metricsTruth: 'Physical differential drive prototype with working teleoperation and sensor bridge. Tested on indoor hardwood and tiled test courses.',
    thumbnail: '/images/dodo-app.png'
  },
  {
    slug: 'ros2-cleaning-robot',
    title: 'ROS 2 & ML Autonomous Cleaning Robot (Simulation & Coverage)',
    subtitle: 'Differential drive vacuum robot simulated in Gazebo Garden with 2D SLAM mapping, Nav2 waypoint navigation, and Machine Learning coverage heuristics.',
    tier: 1,
    domain: 'Robotics',
    stack: ['ROS 2 Humble', 'Machine Learning', 'Gazebo Garden', 'Nav2', 'SLAM Toolbox', 'Python', 'C++'],
    repoUrl: 'https://github.com/MrShahzaib005/github-workshop-demo',
    featuredInProofStrip: true,
    isSimulationOnly: true,
    ownershipStatement: 'I implemented the URDF physical robot model, sensor plugin attachments, ML coverage path logic, and Nav2 behavior tree configuration in Gazebo simulation.',
    shortSummary: 'An autonomous indoor cleaning robot combining machine learning coverage planning with ROS 2 Nav2 navigation to systematically clean floorplans while avoiding obstacles in real time.',
    observableBehavior: 'In Gazebo, when launched, the robot performs an initial 360-degree LiDAR sweep, builds an occupancy grid map in SLAM Toolbox, and executes ML-optimized coverage patterns without human intervention.',
    keyDecisions: [
      'Engineered ML coverage path heuristics to minimize redundant passes over already-traversed grid cells.',
      'Configured custom Nav2 costmaps with separate inflation layers for delicate simulated walls vs dynamic obstacles.',
      'Explicitly labeled as Simulation Only: validates the combined ML and ROS 2 autonomy stack in Gazebo before physical prototype manufacturing.'
    ],
    validation: 'Ran 25 simulation runs across 3 Gazebo office floor plans; achieved 92.4% room coverage without getting trapped in corner dead-ends.',
    metricsTruth: 'Simulation-only with ML coverage heuristics. Validated in Gazebo Garden with full ROS 2 navigation stack.',
    thumbnail: '/images/cleaning-robot.png'
  },
  {
    slug: 'arbotrix-web',
    title: 'Arbotrix Company Website',
    subtitle: 'Website built for Arbotrix, a robotics company.',
    tier: 1,
    domain: 'Web',
    stack: ['Next.js 16', 'React 19', 'Prisma', 'PostgreSQL / Supabase', 'Spline 3D', 'Tailwind CSS', 'Resend'],
    repoUrl: 'https://github.com/MrShahzaib005/arbotrix-web',
    demoUrl: 'https://arbotrix.com',
    featuredInProofStrip: true,
    isSimulationOnly: false,
    ownershipStatement: 'I built the website for Arbotrix, a robotics company.',
    shortSummary: 'The digital platform and enrollment engine for Arbotrix, connecting prospective robotics interns, university students, and enterprise clients with custom hardware specifications.',
    observableBehavior: 'Visitors explore interactive 3D robot models in the browser, review hardware specifications, and register for ROS2 workshops with instantaneous email confirmations and database persistence.',
    keyDecisions: [
      'Substantiated honest metrics: removed unverified claims of "500+ students" to reflect actual verified batch trainees (~45 graduates across Batches 1 & 2).',
      'Engineered server actions with Prisma and PostgreSQL for type-safe database mutations instead of client-side queries.',
      'Isolated heavy 3D Spline canvases using dynamic lazy imports to protect Core Web Vitals and achieve <1.8s LCP on mobile.'
    ],
    validation: 'Successfully handled live enrollment applications for Arbotrix Batch 1 and Batch 2 robotics internship cohorts with zero database errors.',
    metricsTruth: 'Real production site. Stack: Next.js + React 19 + Prisma + Supabase. Real cohort sizes: 45 verified students trained across 2 cohorts.',
    thumbnail: '/images/arbotrix-web.png'
  },

  // ==================== TIER 2: PROJECT INDEX ====================
  {
    slug: 'buddy-ai',
    title: 'Buddy: Multi-Tenant Agentic AI Architecture',
    subtitle: 'Enterprise-grade Java Spring Boot & LangChain4j backend for personal agentic AI with ThreadLocal tenant isolation.',
    tier: 2,
    domain: 'AI & Systems',
    stack: ['Java 23', 'Spring Boot 3.x', 'LangChain4j', 'Ollama (Llama 3.1 8B)', 'pgvector', 'PostgreSQL', 'Flutter'],
    repoUrl: 'https://github.com/MrShahzaib005/buddy-ai',
    featuredInProofStrip: false,
    inProgress: true,
    ownershipStatement: 'I engineered the Spring Boot multi-agent architecture, pgvector semantic memory store, and thread-local tenant isolation backend; Mamoona developed the Flutter client interface.',
    shortSummary: 'A privacy-first multi-agent AI system developed as our Final Year Project (FYP) at Iqra University. Employs semantic routing and sandboxed tools to prevent model hallucination.',
    observableBehavior: 'User queries are evaluated by an input router before LLM processing; memories are converted into 768-dimensional embeddings and isolated by user UUID so tenants never leak data.',
    keyDecisions: [
      'Implemented ThreadLocal security contexts to inject user ID filters into every semantic vector query at the database driver level.',
      'Prompt-level sandboxing: completely strip JSON tool schemas from HTTP requests during standard conversation to stop small 8B models from triggering unintended tool writes.'
    ],
    validation: 'Benchmarked with concurrent multi-tenant requests in Docker; zero cross-tenant retrieval events across 1,000 synthetic test queries.',
    metricsTruth: 'Final Year Project backend currently under active completion. Demo pending final hardware deployment.',
    thumbnail: '/images/shahzaib-arbo.webp'
  },
  {
    slug: 'gameverse',
    title: 'GamesVerse University Gaming Portal',
    subtitle: 'Tournament registration and gaming society community portal built for Iqra University.',
    tier: 2,
    domain: 'Web',
    stack: ['PHP', 'MySQL', 'React', 'HTML5', 'CSS3'],
    repoUrl: 'https://github.com/MrShahzaib005/Gameverse',
    demoUrl: 'https://gamesverse.net/',
    featuredInProofStrip: false,
    ownershipStatement: 'I built the full front-end interface, tournament bracket displays, and integrated backend team registration forms.',
    shortSummary: 'Official gaming society platform for university esports competitions, providing multi-game registrations, schedules, and live updates.',
    observableBehavior: 'Students register squads for Valorant and Tekken tournaments with automated seat allocation and dynamic roster generation.',
    keyDecisions: ['Created normalized relational schema for tournament brackets, squads, and individual participants.'],
    validation: 'Used for the campus annual gaming gala with 120+ active player registrations.',
    metricsTruth: 'Live production deployment hosted on gamesverse.net for Iqra University Gaming Society.',
    thumbnail: '/images/shahzaib-arbo.webp'
  },
  {
    slug: 'iqra-student-portal',
    title: 'Iqra Student Portal Mobile App',
    subtitle: 'Cross-platform mobile client for student attendance, grade tracking, and campus notices.',
    tier: 2,
    domain: 'Mobile',
    stack: ['Flutter', 'Dart', 'Firebase Auth', 'Cloud Firestore'],
    repoUrl: 'https://github.com/MrShahzaib005/iqra_student_portal',
    featuredInProofStrip: false,
    ownershipStatement: 'I designed the Flutter UI architecture, state management with Provider, and integrated Firebase authentication.',
    shortSummary: 'Student academic companion app providing mobile access to fee vouchers, timetable schedules, and real-time announcements.',
    observableBehavior: 'Authenticated students view synchronized course schedules and calculate semester GPA projections instantly.',
    keyDecisions: ['Local SQLite offline caching to ensure students can check room assignments without active campus WiFi.'],
    validation: 'Tested on both Android and iOS simulator environments with realistic timetable data sets.',
    metricsTruth: 'Functional student app prototype; repository public and verifiable.',
    thumbnail: '/images/shahzaib-arbo.webp'
  },
  {
    slug: 'foodly',
    title: 'Foodly: Food Ordering Interface',
    subtitle: 'Interactive mobile-first web application for food discovery and cart management.',
    tier: 2,
    domain: 'Web',
    stack: ['JavaScript', 'React', 'CSS Modules', 'REST APIs'],
    repoUrl: 'https://github.com/MrShahzaib005/foodly',
    featuredInProofStrip: false,
    ownershipStatement: 'I built the complete React UI, client-side cart calculation logic, and filter taxonomy.',
    shortSummary: 'A food delivery frontend exploring seamless checkout flows, quantity modifiers, and dietary category filtering.',
    observableBehavior: 'Users filter items by dietary restriction and watch cart subtotal and delivery tax update in real time.',
    keyDecisions: ['Used pure client state with localStorage persistence to prevent cart abandonment on refresh.'],
    validation: 'Validated user checkout flow across mobile screen sizes (360px to 430px).',
    metricsTruth: 'Client-side frontend prototype.',
    thumbnail: '/images/shahzaib-arbo.webp'
  },
  {
    slug: 'dynamics360-featured-events',
    title: 'Dynamics 360 Event Explorer SPA',
    subtitle: 'Single Page Application with live JSON search, date filtering, and fluid responsive design.',
    tier: 2,
    domain: 'Web',
    stack: ['JavaScript', 'CSS3', 'REST JSON', 'HTML5'],
    repoUrl: 'https://github.com/MrShahzaib005/dynamics360-featured-events',
    featuredInProofStrip: false,
    ownershipStatement: 'I authored the complete SPA logic, responsive grid styling, and asynchronous JSON query engine.',
    shortSummary: 'Technical submission demonstrating asynchronous data loading, debounce search filters, and accessible modal overlays.',
    observableBehavior: 'Typing filters cards live without DOM stutter; clicking an event reveals accessible details dialog.',
    keyDecisions: ['Debounced text input queries to maintain 60fps render cycles during rapid keypresses.'],
    validation: 'Reviewed and approved as internship assessment project for Dynamics 360.',
    metricsTruth: 'Complete single-page web app.',
    thumbnail: '/images/shahzaib-arbo.webp'
  },
  {
    slug: 'reactjs-ecommerce-shop',
    title: 'React E-Commerce Showcase',
    subtitle: 'Modern storefront UI featuring product catalog, cart drawer, and responsive item grid.',
    tier: 2,
    domain: 'Web',
    stack: ['React', 'JavaScript', 'CSS3'],
    repoUrl: 'https://github.com/MrShahzaib005/reactjs-ecommerce-shop',
    featuredInProofStrip: false,
    ownershipStatement: 'I developed the React component hierarchy and cart state dispatcher.',
    shortSummary: 'A foundational React project that established component reusability and declarative UI state patterns.',
    observableBehavior: 'Clicking add to cart flies item indicator into cart drawer badge with computed item subtotals.',
    keyDecisions: ['Extracted reusable Card, Modal, and Badge components to enforce design consistency.'],
    validation: 'Unit tested product filter transitions.',
    metricsTruth: 'Frontend shop prototype.',
    thumbnail: '/images/shahzaib-arbo.webp'
  },
  {
    slug: 'university-db',
    title: 'University Database Schema & Relational Model',
    subtitle: 'Relational SQL database schema modeled for student registrations, courses, and fee structures.',
    tier: 2,
    domain: 'AI & Systems',
    stack: ['SQL', 'Relational Database Design', 'PostgreSQL / MySQL'],
    repoUrl: 'https://github.com/MrShahzaib005/university-db',
    featuredInProofStrip: false,
    ownershipStatement: 'I authored the ER diagram, schema DDL scripts, foreign key constraints, and performance index queries.',
    shortSummary: 'Relational data modeling exercise enforcing 3rd normal form (3NF) to eliminate student course registration anomalies.',
    observableBehavior: 'Executes complex multi-table JOIN queries to compute student GPA and semester dues without data redundancy.',
    keyDecisions: ['Applied composite indexes on student_id and semester_id to accelerate transcript generation queries.'],
    validation: 'Tested with synthetic dataset of 1,000 students and 50 courses.',
    metricsTruth: 'Database schema scripts.',
    thumbnail: '/images/shahzaib-arbo.webp'
  },

  // ==================== ORIGIN CASE STUDY ====================
  {
    slug: 'e-portal',
    title: 'E-Portal: Java Spring Boot University System',
    subtitle: 'The 3rd-semester academic portal where early monolithic constraints shaped a commitment to decoupled architectures.',
    tier: 1,
    domain: 'AI & Systems',
    stack: ['Java', 'Spring Boot', 'Thymeleaf', 'MySQL', 'Hibernate'],
    repoUrl: 'https://github.com/MrShahzaib005/e-portal',
    featuredInProofStrip: false,
    ownershipStatement: 'I designed the Spring Boot MVC controller structure, user authentication filters, and Hibernate database entities.',
    shortSummary: 'The origin story project. A monolithic university portal that exposed the friction of synchronous request-response lifecycles and propelled my journey into event-driven robotics middleware.',
    observableBehavior: 'Students log in to inspect enrolled courses, view grades, and download course outlines through server-rendered pages.',
    keyDecisions: [
      'Pivotal Turning Point: When course enrollment opened, synchronous database locks caused thread starvation. Debugging this introduced me to concurrency, decoupling, and later pub/sub message brokers in ROS 2.',
      'Resolved identity discrepancy: Clearly documented as a Java Spring Boot university backend, distinguishing it from subsequent mobile projects.'
    ],
    validation: 'Served as 3rd semester university final capstone project evaluating full-stack Java enterprise fundamentals.',
    metricsTruth: 'Academic semester project. Java Spring Boot + MySQL.',
    thumbnail: '/images/shahzaib-arbo.webp'
  },

  // ==================== TIER 3: PLAYGROUND / ARCHIVE ====================
  {
    slug: 'bevensen-website',
    title: 'Bevensen Restaurant Menu Website',
    subtitle: 'Restaurant menu presentation website in TypeScript. Fixed Figma export title to production naming.',
    tier: 3,
    domain: 'Web',
    stack: ['TypeScript', 'HTML5', 'CSS3'],
    repoUrl: 'https://github.com/MrShahzaib005/bevensen-website',
    featuredInProofStrip: false,
    ownershipStatement: 'I converted the Figma visual mockups into clean semantic HTML and TypeScript layout code.',
    shortSummary: 'A design-to-code implementation showcasing culinary offerings with categorized meal tabs and responsive photography grids.',
    observableBehavior: 'Smooth tabbed switching between appetisers, mains, and beverage selections.',
    keyDecisions: ['Corrected the unedited design export tab title ("my-figma-project") to proper branding metadata.'],
    validation: 'Verified across Chrome, Safari, and Firefox rendering engines.',
    metricsTruth: 'Tier 3 Archive. Web UI experiment.',
    thumbnail: '/images/shahzaib-arbo.webp'
  },
  {
    slug: 'bel-admin',
    title: 'belAdmin: Operations Management UI',
    subtitle: 'Administrative dashboard exploring data tables, sidebar navigation, and user permission controls.',
    tier: 3,
    domain: 'Web',
    stack: ['JavaScript', 'HTML5', 'CSS3'],
    repoUrl: 'https://github.com/MrShahzaib005/belAdmin',
    featuredInProofStrip: false,
    ownershipStatement: 'I built the dashboard layout scaffolding and mock statistics widgets.',
    shortSummary: 'Administrative dashboard layout exploring operational monitoring panels.',
    observableBehavior: 'Collapsible navigation sidebar with dynamic metric summary cards.',
    keyDecisions: ['CSS Grid dashboard arrangement for multi-screen adaptability.'],
    validation: 'Browser compatibility checked.',
    metricsTruth: 'Tier 3 Archive.',
    thumbnail: '/images/shahzaib-arbo.webp'
  },
  {
    slug: 'code-flow',
    title: 'Code Flow Design System Exploration',
    subtitle: 'Tailwind CSS utility experiments focused on typographic scale and dark mode card interactions.',
    tier: 3,
    domain: 'Web',
    stack: ['JavaScript', 'Tailwind CSS', 'HTML5'],
    repoUrl: 'https://github.com/MrShahzaib005/code-flow',
    featuredInProofStrip: false,
    ownershipStatement: 'I implemented the component experiments and Tailwind config theme variables.',
    shortSummary: 'Sandbox environment for evaluating modern utility-first CSS styling patterns.',
    observableBehavior: 'Interactive card states with elevation hover effects and typography scales.',
    keyDecisions: ['Refined color token contrast ratios to satisfy WCAG AA accessibility standards.'],
    validation: 'Automated axe accessibility inspection passed.',
    metricsTruth: 'Tier 3 Archive.',
    thumbnail: '/images/shahzaib-arbo.webp'
  }
];

export const AUDITED_REPO_COUNT = 18;
