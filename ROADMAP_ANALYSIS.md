# CareerRoadmapPage Analysis: Static vs. Dynamic Data

## Executive Summary
**RoadmapPage.tsx is currently using static hardcoded data** that is not connected to the backend API. However, **a fully functional backend roadmap generation service exists** and can be integrated to make roadmaps dynamic based on the selected role and missing skills.

---

## Current State: Hardcoded Data

### 1. **Roadmap Milestones (STATIC)**

**Location:** [frontend/src/utils/data.ts](frontend/src/utils/data.ts#L89-L101)

```typescript
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
```

**Problem:** Same 3-month roadmap for all roles, regardless of actual missing skills or target role.

---

### 2. **Milestone Guide (STATIC)**

**Location:** [frontend/src/pages/RoadmapPage.tsx](frontend/src/pages/RoadmapPage.tsx#L54-L70)

Hardcoded monthly success criteria:
```tsx
<div className="rounded-3xl bg-white/5 p-4 text-slate-300">
  <p className="font-semibold text-white">Month 1</p>
  <p className="mt-2 text-sm">Build clarity on target role, improve your resume content, and validate core tech skills.</p>
</div>
<div className="rounded-3xl bg-white/5 p-4 text-slate-300">
  <p className="font-semibold text-white">Month 2</p>
  <p className="mt-2 text-sm">Grow portfolio impact through a project and prepare technical narratives that land interviews.</p>
</div>
<div className="rounded-3xl bg-white/5 p-4 text-slate-300">
  <p className="font-semibold text-white">Month 3</p>
  <p className="mt-2 text-sm">Close the loop with targeted applications, mock interviews, and documented success metrics.</p>
</div>
```

**Problem:** Generic guidance regardless of actual career goals or skill level.

---

### 3. **Target Role (STATIC)**

**Location:** [frontend/src/pages/RoadmapPage.tsx](frontend/src/pages/RoadmapPage.tsx#L77-L81)

```tsx
<p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Target role</p>
<h3 className="mt-3 text-2xl font-semibold text-white">Software Engineer</h3>
<p className="mt-4 text-slate-300">A tailored plan that centers your resume, technical growth, and interview readiness across 90 days.</p>
```

**Problem:** Always shows "Software Engineer" regardless of the role selected in SkillGapPage.

---

### 4. **Recommended Projects (STATIC)**

**Location:** [frontend/src/pages/RoadmapPage.tsx](frontend/src/pages/RoadmapPage.tsx#L88-L104)

```tsx
<li className="rounded-3xl bg-white/5 px-4 py-4">
  <p className="font-semibold text-white">Design system dashboard</p>
  <p className="mt-2 text-sm">Build a modular UI system with reusable components and accessibility documentation.</p>
</li>
<li className="rounded-3xl bg-white/5 px-4 py-4">
  <p className="font-semibold text-white">API-backed portfolio</p>
  <p className="mt-2 text-sm">Create a full-stack case study demonstrating your architecture and deployment workflow.</p>
</li>
```

**Problem:** Same 2 projects for all roles; not tailored to missing skills or target position.

---

## Backend API: Available but Unused

### Roadmap API Endpoints

**File:** [backend/app/routes/api_routes.py](backend/app/routes/api_routes.py#L104-L120)

```python
# Roadmap routes
@roadmap_bp.route('/generate', methods=['POST'])
def generate_roadmap():
    return RoadmapController.generate_roadmap()

@roadmap_bp.route('/<int:roadmap_id>', methods=['GET'])
def get_roadmap(roadmap_id):
    return RoadmapController.get_roadmap(roadmap_id)

@roadmap_bp.route('', methods=['GET'])
def get_all_roadmaps():
    return RoadmapController.get_all_roadmaps()
```

### RoadmapController Implementation

**File:** [backend/app/controllers/dashboard_controller.py](backend/app/controllers/dashboard_controller.py#L103-L180)

#### `generate_roadmap()` - POST /api/roadmap/generate

**Request:**
```json
{
  "analysis_id": 1
}
```

**Returns:** Career roadmap customized to:
- Missing skills from the analysis
- Target role from the analysis
- 6-month roadmap with monthly goals, milestones, and resources

**Implementation:** The controller calls `CareerRoadmapService.generate_roadmap(missing_skills, target_role)`

#### `get_roadmap(roadmap_id)` - GET /api/roadmap/:id

Returns a previously generated roadmap for a specific user's analysis.

#### `get_all_roadmaps()` - GET /api/roadmap

Returns all roadmaps for the current user.

---

## Backend Roadmap Generation Service

**File:** [backend/app/services/career_roadmap_service.py](backend/app/services/career_roadmap_service.py)

### Smart Skill Categorization

The service has **70+ skills** in a learning paths database with:
- Estimated learning duration
- Recommended learning resources

```python
SKILL_LEARNING_PATHS = {
    'Python': {'duration': '3 months', 'resources': ['Udemy', 'Codecademy', 'Real Python']},
    'React': {'duration': '3 months', 'resources': ['React Docs', 'Frontend Masters', 'Udemy']},
    'Docker': {'duration': '2 months', 'resources': ['Docker Docs', 'Udemy', 'Play with Docker']},
    'System Design': {'duration': '3 months', 'resources': ['Grokking', 'YouTube', 'Interview Bit']},
    # ... 70+ skills with learning paths
}
```

### Generated Roadmap Output Structure

```json
{
  "months": [
    {
      "month": 1,
      "title": "Foundation Building",
      "goals": ["Master Skill1", "Master Skill2"],
      "milestones": ["Complete Skill1 course", "Complete Skill2 course"],
      "resources": ["Udemy", "Codecademy"]
    },
    {
      "month": 2,
      "title": "Core Skills Development",
      "goals": ["Learn Skill3", "Learn Skill4"],
      "milestones": ["Build project with Skill3", "Build project with Skill4"],
      "resources": ["React Docs", "Frontend Masters"]
    },
    // ... months 3-6
  ]
}
```

The roadmap intelligently organizes skills by:
1. **Short-term skills** (<2 months) → Months 1-2
2. **Medium-term skills** (2-3 months) → Months 2-3
3. **Long-term skills** (>3 months) → Months 4+
4. **Integration phase** (Month 5) → Project-based learning
5. **Specialization** (Month 6) → Role-specific interview prep

---

## Current Frontend: Hardcoded Fetching

**Location:** [frontend/src/services/resumeService.ts](frontend/src/services/resumeService.ts#L187-L191)

```typescript
export const fetchRoadmap = async (): Promise<RoadmapMilestone[]> => {
  await new Promise((resolve) => setTimeout(resolve, 240));  // Mock delay
  return roadmapMilestones;  // Returns static data
};
```

**Type:** [frontend/src/utils/types.ts](frontend/src/utils/types.ts#L40-L44)

```typescript
export interface RoadmapMilestone {
  month: string;
  title: string;
  items: string[];
}
```

---

## How RoadmapPage Currently Works

**File:** [frontend/src/pages/RoadmapPage.tsx](frontend/src/pages/RoadmapPage.tsx#L1-L50)

```typescript
export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<RoadmapMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoadmap().then((result) => {
      setRoadmap(result);
      setLoading(false);
    });
  }, []);
  // ... renders static roadmap
}
```

**Issues:**
1. No connection to selected role from SkillGapPage
2. No dependency on missing skills
3. No user interaction to regenerate based on new analysis
4. No state sharing with SkillGapPage analysis

---

## Recommended Integration Plan

### Phase 1: Connect Frontend to Backend API

#### 1.1 Update `resumeService.ts`

**Current:**
```typescript
export const fetchRoadmap = async (): Promise<RoadmapMilestone[]> => {
  await new Promise((resolve) => setTimeout(resolve, 240));
  return roadmapMilestones;
};
```

**Updated (Real Backend):**
```typescript
export const fetchRoadmap = async (analysisId: number): Promise<RoadmapResponse> => {
  return apiRequest('/api/roadmap/generate', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ analysis_id: analysisId }),
  });
};

export const getRoadmapById = async (roadmapId: number): Promise<RoadmapResponse> => {
  return apiRequest(`/api/roadmap/${roadmapId}`, {
    method: 'GET',
    auth: true,
  });
};
```

#### 1.2 Update Types

**Add to `utils/types.ts`:**
```typescript
export interface RoadmapMonth {
  month: number;
  title: string;
  goals: string[];
  milestones: string[];
  resources: string[];
}

export interface RoadmapResponse {
  id?: number;
  analysis_id?: number;
  roadmap_data: {
    months: RoadmapMonth[];
  };
  created_at?: string;
}
```

#### 1.3 Update RoadmapPage Component

**Pass analysis data and regenerate dynamically:**
```typescript
export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<RoadmapMonth[] | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleKey>('Software Engineer');
  const [analysisId, setAnalysisId] = useState<number | null>(null);
  const [latestResume, setLatestResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    Promise.all([getLatestResume(), fetchAvailableRoles()])
      .then(([resume, roles]) => {
        setLatestResume(resume);
        if (roles.length) setSelectedRole(roles[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Generate roadmap when role changes
  useEffect(() => {
    if (!latestResume) return;

    setLoading(true);
    matchRoleWithResume(latestResume.id, selectedRole)
      .then((result) => {
        setAnalysisId(result.analysis_id);
        return fetchRoadmap(result.analysis_id);
      })
      .then((roadmapResponse) => {
        setRoadmap(roadmapResponse.roadmap_data.months);
      })
      .finally(() => setLoading(false));
  }, [latestResume, selectedRole]);

  // ... render using roadmap.months instead of static data
}
```

### Phase 2: Render Dynamic Data

#### 2.1 Render Roadmap Months Dynamically

**Replace static map with:**
```tsx
<div className="mt-8 space-y-6">
  {roadmap?.map((month) => (
    <RoadmapStep
      key={month.month}
      month={`Month ${month.month}`}
      title={month.title}
      items={month.goals}  // or could be milestones
      highlighted={month.month === 1}
    />
  ))}
</div>
```

#### 2.2 Update Target Role Display

**Replace hardcoded:**
```tsx
<h3 className="mt-3 text-2xl font-semibold text-white">{selectedRole}</h3>
```

#### 2.3 Render Milestone Guide from Backend

**Replace static cards with:**
```tsx
<div className="mt-6 grid gap-4">
  {roadmap?.map((month) => (
    <div key={month.month} className="rounded-3xl bg-white/5 p-4 text-slate-300">
      <p className="font-semibold text-white">Month {month.month}</p>
      <p className="mt-2 text-sm">{month.goals.join(', ')}</p>
    </div>
  ))}
</div>
```

#### 2.4 Recommended Projects from Missing Skills

**Generate from analysis recommendations:**
```tsx
{recommendations.map((rec) => (
  <li key={rec.category} className="rounded-3xl bg-white/5 px-4 py-4">
    <p className="font-semibold text-white">{rec.category} Project</p>
    <p className="mt-2 text-sm">{rec.reason}</p>
  </li>
))}
```

### Phase 3: Add Role Selection Control

Add dropdown to sync with SkillGapPage selection:

```tsx
<div className="flex flex-col gap-4 sm:flex-row">
  <select
    value={selectedRole}
    onChange={(e) => setSelectedRole(e.target.value as RoleKey)}
    className="rounded-3xl border border-white/10 bg-surface/90 px-4 py-3 text-sm text-white"
  >
    {options.map((role) => (
      <option key={role} value={role}>{role}</option>
    ))}
  </select>
  <button
    onClick={() => selectedRole && analysisId && fetchRoadmap(analysisId)}
    className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 text-sm font-semibold"
  >
    Regenerate Roadmap <ArrowRight className="h-4 w-4" />
  </button>
</div>
```

---

## Benefits of Backend Integration

| Aspect | Current (Static) | With Backend API |
|--------|------------------|------------------|
| **Roadmap Customization** | Same 3 months for all | 6 months, tailored to missing skills |
| **Skill-Based Planning** | Generic guidance | Organized by learning duration |
| **Resource Recommendations** | None | 70+ skills with curated resources |
| **Role Awareness** | Hardcoded "Software Engineer" | Responds to selected role |
| **Target Responsiveness** | No | Changes with new analysis |
| **Project Suggestions** | Same 2 projects always | Generated based on skill gaps |
| **Persistence** | Lost on page reload | Saved in database |
| **User-Specific** | Global data | Per-user, per-analysis |

---

## Summary

**Current State:** RoadmapPage is completely disconnected from the backend and displays static data that doesn't adapt to user needs.

**Available Backend:** A sophisticated career roadmap generation service exists and is ready to use.

**Quick Wins:**
1. Replace `fetchRoadmap()` to call `/api/roadmap/generate` with `analysisId`
2. Update types to match backend response structure
3. Pass `analysisId` from analysis result
4. Map backend months to existing RoadmapStep component
5. Make target role and projects dynamic

**Effort:** ~4-6 hours for full integration (API calls, state management, component updates, testing)

**Impact:** Personalized 6-month career roadmaps that evolve with user analysis and skill gaps.
