
// import { EducationDTO, EducationReturnDTO, ExperienceDTO, ExperienceReturnDTO, MentorDTO, MentorReturnDTO, MentorSkillDTO } from "../dtos/mentorDtos";

import { createMentorDTO, MentorReturnDTO, MentorsWithRelations, updateMentorDTO } from "../dtos/mentorDtos";


export interface IMentorRepository {
  createMentorWithRelationsUsingTransaction(data: createMentorDTO): Promise<MentorReturnDTO>;
  findAll(options:object):Promise<MentorReturnDTO[]>;
  totalCount():Promise<number>;
  getMentorById(id:string):Promise<MentorsWithRelations|null>;
  updateMentor(id:string,data:Partial<updateMentorDTO>):Promise<Omit<MentorsWithRelations,"skills">>
}


// export interface IMentorRepository {
//   create(mentorData: MentorDTO): Promise<MentorReturnDTO>
//   findById(id: string): Promise<any>;
//   findAll(options:object): Promise<any[]>;
//   update(id: string, mentorData: Partial<MentorDTO>): Promise<any>;
//   delete(id: string): Promise<any>;
// }

// export interface ExperienceRepository {
//   create(experienceData: ExperienceDTO): Promise<ExperienceReturnDTO | null>;
//   findById(id: string): Promise<ExperienceReturnDTO | null>;
//   findAll(page?: number, limit?: number): Promise<ExperienceReturnDTO[]>;
//   update(id: string, experienceData: Partial<ExperienceDTO>): Promise<ExperienceReturnDTO | null>;
//   delete(id: string): Promise<any>;
// }


// export interface EducationRepository {
//   create(educationData: EducationDTO): Promise<EducationReturnDTO | null>;
//   findById(id: string): Promise<EducationReturnDTO | null>;
//   findAll(page?: number, limit?: number): Promise<EducationReturnDTO[]>;
//   update(id: string, educationData: Partial<EducationDTO>): Promise<EducationReturnDTO | null>;
//   delete(id: string): Promise<any>;
// }

// export interface MentorSkillRepository {
//   create(mentorSkillData: MentorSkillDTO): Promise<any>;
//   delete(mentorId: string, skillId: string): Promise<any>;
// }