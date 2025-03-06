import { Skill } from "../entities/mentor";
import { IUser } from "../entities/user";

export interface MentorDTO {
  userId: string;
  aboutMe?: string;
  expertise: string;
  documents: string[];
  languages: string[];
  hourlyRate: number;
  verified?: 'pending' | 'verified' | 'rejected';
}

export interface updateMentorDTO {

  aboutMe?: string;
  expertise: string;
  documents: string[];
  languages: string[];
  hourlyRate: number;
  verified?: 'pending' | 'verified' | 'rejected';
}
export interface createMentorDTO extends MentorDTO{

  experiences:ExperienceDTO[];
  educations:EducationDTO[];
  skills:Skill[]


}

export interface getAllMentorsDTO{


  mentors:MentorReturnDTO[]
  totalPages:number

  totalCount:number

}
export interface getAllApprovalsDTO{

  approvals:MentorReturnDTO[]
  totalPages:number

  totalCount:number

}

export type MentorVerifiedStatus ='pending' | 'verified' | 'rejected'

export interface MentorReturnDTO {
  id:string
  userId: string;
  aboutMe?: string|null;
  profile?:IUser
  expertise: string;
  documents: string[];
  languages: string[];
  hourlyRate: number;
  verified?: MentorVerifiedStatus ;
  createdAt:Date;
  updatedAt:Date;
}


export interface MentorsWithRelations extends MentorReturnDTO{

  experiences:ExperienceDTO[];
  educations:EducationDTO[];
  skills:Skill[]
}

export interface ExperienceDTO {
  mentorId?: string;
  role: string;
  company: string;
  startDate: Date;
  endDate?: Date|null;
  description?: string|null;
}

export interface ExperienceReturnDTO {
  id: string;
  mentorId: string;
  role: string;
  company: string;
  startDate: Date;
  endDate?: Date|null;
  description?: string|null;
}

export interface EducationDTO {
  mentorId?: string;
  degree: string;
  institution: string;
  startDate: Date;
  endDate?: Date|null;
  description?: string|null;
}

export interface EducationReturnDTO {
  id: string;
  mentorId: string;
  degree: string;
  institution: string;
  startDate: Date;
  endDate?: Date|null;
  description?: string|null;
}

export interface MentorSkillDTO {
  mentorId: string;
  skillId: string;
}