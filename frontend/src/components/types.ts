export type Project = {
  project_id: number;
  project_name: string;
  description: string;
  status: string;
  department_id: number;
  progress_rate?: number;
  planned_amount?: number;
  actual_amount?: number;
  remains?: number;
  requested_amount: number;
  applicant_id: number | null;
  user_name: string;
  department_name: string;
  progress_updated_at: string | null;
  budget_updated_at: string | null;
  created_at: string | null;
};

export type Department = {
  department_id: number;
  department_name: string;
};

export type ProjectCardProps = {
  project: Project;
  currentUserRole: string;
  approveProject: (id: number, status: string, reason?: string) => void;
  updateProgress: (id: number, value: number) => void;

  updateBudget: (
    projectId: number,
    amount: number,
    category: string,
    note: string
  ) => void;

  currentDepartmentId: number | null;
  currentUserId: number | null;

  onRefresh: () => void;
};

export type DashboardProps = {
  projects: Project[];      
  allProjects: Project[];   
};

export type ProgressInputProps = {
  projectId: number;
  onUpdate: (id: number, value: number) => void;
};

export type BudgetInputProps = {
  projectId: number;
  onUpdate: (
    projectId: number,
    amount: number,
    category: string,
    note: string
  ) => void;
  onAdded: () => void;
};

export type BudgetHistory = {
  id: number;
  amount: number;
  category: string;
  note: string;
  created_at: string;
};
