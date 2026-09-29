import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type { Resume, RoleKey } from '../utils/types';

interface AnalysisContextValue {
  analysisId: number | null;
  role: RoleKey | null;
  latestResume: Resume | null;
  setAnalysisId: Dispatch<SetStateAction<number | null>>;
  setRole: Dispatch<SetStateAction<RoleKey | null>>;
  setLatestResume: Dispatch<SetStateAction<Resume | null>>;
}

const AnalysisContext = createContext<AnalysisContextValue | undefined>(undefined);

interface AnalysisProviderProps {
  children: ReactNode;
}

export function AnalysisProvider({ children }: AnalysisProviderProps) {
  const [analysisId, setAnalysisId] = useState<number | null>(() => {
  const saved = localStorage.getItem('analysisId');
  return saved ? Number(saved) : null;
  });

  const [role, setRole] = useState<RoleKey | null>(() => {
  return (localStorage.getItem('role') as RoleKey) || null;
  });

  const [latestResume, setLatestResume] = useState<Resume | null>(() => {
  const saved = localStorage.getItem('latestResume');
  return saved ? JSON.parse(saved) : null;
  });
  useEffect(() => {
  if (analysisId !== null) {
    localStorage.setItem('analysisId', analysisId.toString());
  }
  }, [analysisId]);

  useEffect(() => {
  if (role) {
    localStorage.setItem('role', role);
  }
  }, [role]);

  useEffect(() => {
  if (latestResume) {
    localStorage.setItem(
      'latestResume',
      JSON.stringify(latestResume)
    );
  }
  }, [latestResume]);
  return (
    <AnalysisContext.Provider
      value={{
        analysisId,
        role,
        latestResume,
        setAnalysisId,
        setRole,
        setLatestResume,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }

  return context;
}
