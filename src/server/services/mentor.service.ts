import { createMentorDTO, getAllApprovalsDTO, getAllMentorsDTO, MentorReturnDTO, MentorsWithRelations, MentorVerifiedStatus } from "../core/dtos/mentorDtos";
import { ValidationError } from "../core/errors/errors";
import { IMentorRepository } from "../core/interfaces/mentor.repository.interface";

import { IMentorService } from "../core/interfaces/mentor.service.interface";
import { prismaMentorRepositoryInstance } from "../repositories/prisma.mentor.respositorys";

export class MentorServiceImplementation implements IMentorService {
  constructor(private mentorRepository: IMentorRepository) {}

  async createMentor(mentorData:createMentorDTO): Promise<MentorReturnDTO> {
    try {


      return await this.mentorRepository.createMentorWithRelationsUsingTransaction(
        mentorData
      );
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in mentor service create func:", error);
      throw new Error("Failed to create mentor");
    }
  }

  async  getAllMentorApprovalsWithPagination(skip:number,limit:number): Promise<getAllApprovalsDTO>{
    try {

      const approvals = await this.mentorRepository.findAll({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        where: { verified: 'pending' }, // Adjust conditions if needed
        include: {
          profile: true,
        },

      });
      const totalCount = await this.mentorRepository.totalCount();

      const data = {
        approvals,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      };
      return data;

    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in mentor service gett all func:", error);
      throw new Error("Failed to gett all  mentor");
    }
  }

  async  getAllMentorsWithPagination(skip:number,limit:number): Promise<getAllMentorsDTO>{
    try {

      const mentors = await this.mentorRepository.findAll({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        where: { verified: 'verified' },
        include: {
          profile: true,
        },

      });
      const totalCount = await this.mentorRepository.totalCount();

      const data = {
        mentors,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      };
      return data;

    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in mentor service gett all func:", error);
      throw new Error("Failed to get all  mentor");
    }
  }

  async getMentorDetailsById(id:string): Promise<MentorsWithRelations> {
    try {
      if(!id){
        throw new ValidationError("id is required")
      }

      const mentor =  await this.mentorRepository.getMentorById(id);
      if(!mentor){
        throw new ValidationError("failed to fetch mentor details")
      }
      return mentor
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in mentor service get by id func:", error);
      throw new Error("Failed to get by id mentor");
    }
  }
 async  approveOrRejectMentorApproval(id:string,status:string):Promise<MentorReturnDTO>{
    try {
      if(!id){
        throw new ValidationError("id is required")
      }
      if(!["verified","rejected"].includes(status)){
        throw new ValidationError("Invalid status to change mentor approval");
      }

      const mentor =  await this.mentorRepository.updateMentor(id,{verified:status as MentorVerifiedStatus})
      if(!mentor){
        throw new ValidationError(`failed to update  mentor details to  ${status} `)
      }
      const mentorDetails = await this.mentorRepository

      return mentor
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in mentor service approve or reject approval func:", error);
      throw new Error("Failed to approve or reject approval mentor");
    }
  }

}


export const mentorService = new MentorServiceImplementation(prismaMentorRepositoryInstance);
