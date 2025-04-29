import { createMentorDTO, getAllApprovalsDTO, getAllMentorsDTO, MentorReturnDTO, MentorsWithRelations, MentorVerifiedStatus } from "../core/dtos/mentorDtos";
import { ValidationError } from "../core/errors/errors";
import { IMentorRepository } from "../core/interfaces/mentor.repository.interface";

import { IMentorService } from "../core/interfaces/mentor.service.interface";
import { prismaMentorRepositoryInstance } from "../repositories/prisma.mentor.respositorys";
import { MentorMangementResponseMessages, UserManagementResponseMessages } from "../shared/constants/constant";

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
      throw new Error(MentorMangementResponseMessages.ErrorFailedToRegisterMentor);
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
      throw new Error(MentorMangementResponseMessages.ErrorFailedToFetchMentorApprovals);
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
      throw new Error(MentorMangementResponseMessages.ErrorFailedToFetchMentors);
    }
  }

  async getMentorDetailsById(id:string): Promise<MentorsWithRelations> {
    try {
      if(!id){
        throw new ValidationError(MentorMangementResponseMessages.ErrorFailedToFetchMentorDetailsByIdIsRequired)
      }

      const mentor =  await this.mentorRepository.getMentorById(id);
      if(!mentor){
        throw new ValidationError(MentorMangementResponseMessages.ErrorFailedToFetchMentorDetails)
      }
      return mentor
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in mentor service get by id func:", error);
      throw new Error(MentorMangementResponseMessages.ErrorFailedToFetchMentorDetails);
    }
  }

  async getMentorDetailsByUserId(id:string): Promise<MentorReturnDTO> {
    try {
      if(!id){
        throw new ValidationError(MentorMangementResponseMessages.ErrorFailedToFetchMentorDetailsByIdIsRequired)
      }

      const mentor =  await this.mentorRepository.getMentorByUserId(id);
      if(!mentor){
        throw new ValidationError(MentorMangementResponseMessages.ErrorFailedToFetchMentorDetails)
      }
      return mentor
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in mentor service get by id func:", error);
      throw new Error(MentorMangementResponseMessages.ErrorFailedToFetchMentorDetails);
    }
  }
  
 async  approveOrRejectMentorApproval(id:string,status:string):Promise<MentorReturnDTO>{
    try {
      if(!id){
        throw new ValidationError(MentorMangementResponseMessages.ErrorInvalidInputByIdIsRequired)
      }
      if(!["verified","rejected"].includes(status)){
        throw new ValidationError(MentorMangementResponseMessages.ErrorInvalidToChangeMentorApprovalStatus);
      }

      const mentor =  await this.mentorRepository.updateMentor(id,{verified:status as MentorVerifiedStatus})
      if(!mentor){
        throw new ValidationError(MentorMangementResponseMessages.ErrorFailedToApproveOrReject(status))
      }
      const mentorDetails = await this.mentorRepository

      return mentor
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in mentor service approve or reject approval func:", error);
      throw new Error(MentorMangementResponseMessages.ErrorFailedToApproveOrReject(status));
    }
  }

}


export const mentorService = new MentorServiceImplementation(prismaMentorRepositoryInstance);
