export interface StepData {
  gender: string;
  interestedIn: string;
  branch: string;
  year: string;
  isHosteler: boolean | null;
  age: number;
  hometown: string;
  height: number;
  prompts: { question: string; answer: string }[];
  photos: string[];
}
