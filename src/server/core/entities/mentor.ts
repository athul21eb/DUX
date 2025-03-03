

export interface Experience {
  id: string;
  role: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
}





export interface IMentor {
  id: string;
  userId: string;
  skills: Skill[];
  documents: string[];
  aboutMe: string | null;
  expertise: string;
  experiences: Experience[];
  educations: Education[];
  languages: string[];
  hourlyRate: number;
  verified: "pending" | "verified" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

