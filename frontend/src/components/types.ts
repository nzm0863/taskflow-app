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
};


export type ProjectCardProps = {
  project: Project;
  currentUserRole: string;
  approveProject: (id: number, status: string,reason?: string) => void;
  updateProgress: (id: number, value: number) => void;
  updateBudget: (id: number, value: number) => void;
  currentDepartmentId: number | null;
  
};

export type DashboardProps = {
  projects: Project[];
};

export type ProgressInputProps = {
  projectId: number;
  onUpdate: (id: number, value: number) => void;
};

export type BudgetInputProps = {
  projectId: number;
  onUpdate: (id: number, value: number) => void;
};
