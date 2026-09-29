export const heroStats = [
  { label: 'Role readiness', value: '82%', accent: 'purple' },
  { label: 'Skill match', value: '74%', accent: 'cyan' },
  { label: 'Growth index', value: '91%', accent: 'lime' },
];

export const features = [
  {
    title: 'AI-driven resume insights',
    description: 'Scan resumes for technical skills, soft strengths, and role readiness in seconds.',
    icon: 'Sparkles',
  },
  {
    title: 'Custom role benchmarking',
    description: 'Compare your profile against top target roles and understand exactly where to improve.',
    icon: 'TrendingUp',
  },
  {
    title: 'Career roadmap builder',
    description: 'Receive a guided 90-day learning path with milestones, projects, and certifications.',
    icon: 'MapPin',
  },
];

export const workflow = [
  {
    step: 'Upload',
    title: 'Drop your resume',
    description: 'Upload any modern resume format and get an instant intelligence summary.',
  },
  {
    step: 'Analyze',
    title: 'Understand your strengths',
    description: 'Review skill gaps, readiness scores, and recommendations tailored to your goals.',
  },
  {
    step: 'Improve',
    title: 'Follow the roadmap',
    description: 'Build skills with curated milestones and monitor your improvement over time.',
  },
];

export const testimonials = [
  {
    name: 'Maya Singh',
    role: 'Product Designer',
    quote: 'Resume Intelligence helped me close the gap between my experience and my dream role. The recommendations felt actionable and precise.',
  },
  {
    name: 'Aaron Patel',
    role: 'Software Engineer',
    quote: 'I loved the skill heatmap and role fit score. It made interview preparation more structured than any other tool.',
  },
];

export const supportedFormats = ['PDF', 'DOCX', 'TXT', 'MD'];

export const initialSkills = [
  { name: 'JavaScript', level: 88 },
  { name: 'React', level: 82 },
  { name: 'TypeScript', level: 77 },
  { name: 'Data Structures', level: 68 },
  { name: 'SQL', level: 70 },
  { name: 'Communication', level: 72 },
];

export const roleOptions = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Data Analyst',
  'Data Scientist',
];

export const roleProfiles = {
  'Software Engineer': {
    detected: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'SQL'],
    missing: ['System Design', 'Cloud Architecture', 'Testing'],
    recommended: ['Docker', 'Microservices', 'CI/CD'],
  },
  'Frontend Developer': {
    detected: ['HTML', 'CSS', 'JavaScript', 'React', 'Figma'],
    missing: ['Performance Optimization', 'Accessibility', 'Animation'],
    recommended: ['Next.js', 'Design Systems', 'Web Vitals'],
  },
  'Backend Developer': {
    detected: ['Node.js', 'Express', 'SQL', 'REST APIs', 'AWS'],
    missing: ['Caching', 'Event-driven systems', 'Security'],
    recommended: ['Kubernetes', 'GraphQL', 'Redis'],
  },
  'Data Analyst': {
    detected: ['Excel', 'SQL', 'Tableau', 'Reporting', 'Statistics'],
    missing: ['Python', 'Data Modeling', 'ETL'],
    recommended: ['Pandas', 'Looker', 'A/B Testing'],
  },
  'Data Scientist': {
    detected: ['Python', 'Pandas', 'Machine Learning', 'Statistics', 'SQL'],
    missing: ['Deep Learning', 'MLOps', 'NLP'],
    recommended: ['TensorFlow', 'Model Explainability', 'PyTorch'],
  },
};

export const roadmapMilestones = [
  {
    month: 'Month 1',
    title: 'Foundation & alignment',
    items: ['Strengthen core skills', 'Audit resume for keywords', 'Set target role narrative'],
  },
  {
    month: 'Month 2',
    title: 'Project momentum',
    items: ['Build portfolio project', 'Practice technical interviews', 'Validate with mock feedback'],
  },
  {
    month: 'Month 3',
    title: 'Placement readiness',
    items: ['Polish resume and LinkedIn', 'Prepare role-specific stories', 'Apply to prioritized companies'],
  },
];

export const historyRecords = [
  {
    id: '2026-04-18',
    title: 'April update',
    score: 72,
    skillGrowth: 9,
    summary: 'Updated resume with new internship and refined skill tags.',
  },
  {
    id: '2026-05-09',
    title: 'May review',
    score: 78,
    skillGrowth: 12,
    summary: 'Added machine learning project and polished technical profile.',
  },
  {
    id: '2026-06-02',
    title: 'June checkpoint',
    score: 82,
    skillGrowth: 16,
    summary: 'Finalized portfolio and started role-specific interview prep.',
  },
];

export const profileData = {
  name: 'Aadesh Sharma',
  email: 'aadesh@example.com',
  targetRole: 'Software Engineer',
  goals: 'Land a product-focused engineering role at a strong startup, with a focus on front-end and architecture.',
  location: 'Bengaluru, India',
  availability: 'Open to roles in the next 2 months',
};

export const dashboardSummary = {
  resumeScore: 82,
  skillMatchScore: 74,
  readinessScore: 68,
  roleFitScore: 81,
  strengths: ['React architecture', 'Technical storytelling', 'Team collaboration'],
  weaknesses: ['System design clarity', 'Cloud tooling', 'Structured testing'],
  recommendations: ['Add a microservices project', 'Document API design decisions', 'Practice system design case studies'],
  radarData: [
    { subject: 'Resume', value: 82 },
    { subject: 'Skills', value: 74 },
    { subject: 'Fit', value: 81 },
    { subject: 'Growth', value: 70 },
    { subject: 'Focus', value: 76 },
  ],
  distribution: [
    { name: 'Communication', value: 72 },
    { name: 'Technical depth', value: 79 },
    { name: 'Impact', value: 68 },
    { name: 'Consistency', value: 86 },
  ],
};
