export interface DashboardDataPoint {
  subject: string;
  value: number;
}

export interface DashboardDistributionPoint {
  name: string;
  value: number;
}

export interface DashboardSummary {
  resumeScore: number;
  skillMatchScore: number;
  readinessScore: number;
  roleFitScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  radarData: DashboardDataPoint[];
  distribution: DashboardDistributionPoint[];
}

export interface HistoryRecord {
  id: string;
  title: string;
  score: number;
  skillGrowth: number;
  summary: string;
}

export interface ProfileData {
  name: string;
  email: string;
  targetRole: string;
  goals: string;
  location: string;
  availability: string;
}

export interface RoadmapMilestone {
  month: string;
  title: string;
  items: string[];
}

export interface RoleProfile {
  detected: string[];
  missing: string[];
  recommended: string[];
}

export interface Resume {
  id: number;
  user_id: number;
  filename: string;
  uploaded_at: string;
}

export interface AvailableRolesResponse {
  roles: Record<
    RoleKey,
    {
      description: string;
      required_skills: string[];
      skill_count: number;
    }
  >;
  total: number;
}

export interface MatchRoleResponse {
  analysis_id: number;
  target_role: RoleKey;
  score: number;
  match_percentage: string;
  matched_skills: string[];
  missing_skills: string[];
  matched_count: number;
  missing_count: number;
  recommendations: Array<{
    category: string;
    skills: string[];
    reason: string;
    estimated_duration: string;
    priority: string;
  }>;
}

export type RoleKey = 'Software Engineer' | 'Frontend Developer' | 'Backend Developer' | 'Data Analyst' | 'Data Scientist';
