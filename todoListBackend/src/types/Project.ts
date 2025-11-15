export interface IProject {
  id: string;
  name: string;
  description?: string;
  color: string;
  viewType: "list" | "board";
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectDTO {
  name: string;
  description?: string;
  viewType?: "list" | "board";
  color?: string;
}
