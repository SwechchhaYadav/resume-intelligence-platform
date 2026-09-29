import {
  historyRecords,
  initialSkills,
  profileData,
  roleProfiles,
  roleOptions,
  roadmapMilestones,
} from '../utils/data';
import { apiRequest } from './apiClient';
import type {
  AvailableRolesResponse,
  DashboardSummary,
  HistoryRecord,
  MatchRoleResponse,
  ProfileData,
  Resume,
  RoadmapMilestone,
  RoleKey,
  RoleProfile,
} from '../utils/types';

interface UploadResumeResponse {
  message: string;
  resume: {
    id: number;
    user_id: number;
    filename: string;
    uploaded_at: string;
  };
  extracted_text: string;
  detected_skills: string[];
  skill_count: number;
}

interface DashboardRecommendation {
  category: string;
  skills: string[];
  reason: string;
  estimated_duration: string;
  priority: string;
}

interface DashboardApiResponse {
  resume_score: number;
  role_fit: number;
  skills_found: number;
  missing_skills: number;
  target_role?: string | null;
  recommendations: DashboardRecommendation[];
  recent_analyses: Array<{
    id: number;
    target_role: string;
    score: number;
    created_at: string;
  }>;
  skill_distribution?: Record<string, string[]>;
}

const mapDashboardResponse = (data: DashboardApiResponse): DashboardSummary => {
  const distributionEntries = Object.entries(data.skill_distribution || {});
  const totalCategorizedSkills = distributionEntries.reduce((total, [, skills]) => total + skills.length, 0);
  const roleFitScore = data.role_fit || 0;
  const readinessScore = roleFitScore > 0
    ? Math.round((data.resume_score + roleFitScore) / 2)
    : data.resume_score;

  return {
    resumeScore: data.resume_score,
    skillMatchScore: roleFitScore,
    readinessScore,
    roleFitScore,
    strengths: distributionEntries.length
      ? distributionEntries.map(([category, skills]) => `${category}: ${skills.slice(0, 3).join(', ')}`)
      : ['Upload a resume to detect your strongest skill areas.'],
    weaknesses: data.missing_skills > 0
      ? [`${data.missing_skills} missing skills identified for ${data.target_role || 'your target role'}.`]
      : ['No role gaps detected yet. Run a role match to populate this section.'],
    recommendations: data.recommendations.length
      ? data.recommendations.map((item) => item.reason)
      : ['Run a role match to receive targeted recommendations.'],
    radarData: [
      { subject: 'Resume', value: data.resume_score },
      { subject: 'Skills', value: Math.min(data.skills_found * 5, 100) },
      { subject: 'Fit', value: roleFitScore },
      { subject: 'Readiness', value: readinessScore },
      { subject: 'Focus', value: data.missing_skills > 0 ? Math.max(100 - data.missing_skills * 10, 0) : 100 },
    ],
    distribution: distributionEntries.map(([name, skills]) => ({
      name,
      value: totalCategorizedSkills > 0 ? Math.round((skills.length / totalCategorizedSkills) * 100) : 0,
    })),
  };
};

export const getLatestResume = async (): Promise<Resume | null> => {
  const response = await apiRequest<{ resumes: Resume[]; total: number }>('/api/resume', {
    method: 'GET',
    auth: true,
  });

  return response.resumes?.[0] ?? null;
};

export const fetchAvailableRoles = async (): Promise<RoleKey[]> => {
  const response = await apiRequest<AvailableRolesResponse>('/api/analysis/roles', {
    method: 'GET',
    auth: true,
  });

  return Object.keys(response.roles) as RoleKey[];
};

export const matchRoleWithResume = async (resumeId: number, role: RoleKey): Promise<MatchRoleResponse> => {
  return apiRequest<MatchRoleResponse>('/api/analysis/match-role', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ resume_id: resumeId, role }),
  });
};

export const uploadResume = async (file: File): Promise<UploadResumeResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return apiRequest('/api/resume/upload', {
    method: 'POST',
    body: formData,
    auth: true,
  });
};

export const fetchDashboard = async (): Promise<DashboardSummary> => {
  const response = await apiRequest<DashboardApiResponse>('/api/dashboard', {
    method: 'GET',
    auth: true,
  });

  return mapDashboardResponse(response);
};

export const fetchSkills = async () => {
  await new Promise((resolve) => setTimeout(resolve, 260));
  return initialSkills;
};

export const fetchRoleOptions = async (): Promise<RoleKey[]> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return roleOptions as RoleKey[];
};

export const fetchRoleProfile = async (role: RoleKey): Promise<RoleProfile> => {
  await new Promise((resolve) => setTimeout(resolve, 180));
  return roleProfiles[role] || roleProfiles['Software Engineer'];
};

export const fetchRoadmap = async (): Promise<RoadmapMilestone[]> => {
  await new Promise((resolve) => setTimeout(resolve, 240));
  return roadmapMilestones;
};

export interface RoadmapMonth {
  month: string;
  title: string;
  goals: string[];
  milestones: string[];
  resources: string[];
}

export interface RoadmapPayload {
  id: number;
  analysis_id: number;
  roadmap_data: {
    months: RoadmapMonth[];
  };
  created_at: string;
}

export interface GenerateRoadmapResponse {
  message: string;
  roadmap: RoadmapPayload;
}

export const generateRoadmap = async (
  analysisId: number
): Promise<GenerateRoadmapResponse> => {
  return apiRequest<GenerateRoadmapResponse>('/api/roadmap/generate', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ analysis_id: analysisId }),
  });
};

export const fetchHistory = async (): Promise<HistoryRecord[]> => {
  await new Promise((resolve) => setTimeout(resolve, 260));
  return historyRecords;
};

export const fetchProfile = async (): Promise<ProfileData> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return profileData;
};
