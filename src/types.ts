export type Stage =
  | "reception"
  | "diagnosis"
  | "execution"
  | "quality"
  | "ready";

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  client: string;
  stage: Stage;
  entryDate: string;
  priority: "low" | "medium" | "high";
  price?: number;
}
