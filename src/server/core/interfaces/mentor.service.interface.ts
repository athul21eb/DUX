import { createMentorDTO, getAllApprovalsDTO, getAllMentorsDTO, MentorDTO, MentorReturnDTO, MentorsWithRelations } from "../dtos/mentorDtos";

export interface IMentorService {
  createMentor(mentorData: createMentorDTO): Promise<MentorReturnDTO>
   getAllMentorApprovalsWithPagination(skip:number,limit:number): Promise<getAllApprovalsDTO>;
   getMentorDetailsById(id:string):Promise<MentorsWithRelations>;
   approveOrRejectMentorApproval(id:string,status:string):Promise<MentorReturnDTO>;
   getAllMentorsWithPagination(skip:number,limit:number): Promise<getAllMentorsDTO>
  // getMentorById(id: string): Promise<any>;
  // getAllMentors(): Promise<any[]>;
  // updateMentor(id: string, mentorData: Partial<MentorDTO>): Promise<any>;
  // deleteMentor(id: string): Promise<any>;
}