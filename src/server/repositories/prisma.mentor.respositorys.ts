import { prisma } from "@/lib/db/database";
import {
  createMentorDTO,
  MentorReturnDTO,
  MentorsWithRelations,
} from "../core/dtos/mentorDtos";
import { IMentorRepository } from "../core/interfaces/mentor.repository.interface";
import { ValidationError } from "../core/errors/errors";

export class PrismaMentorRepositoryImplementation implements IMentorRepository {
  async createMentorWithRelationsUsingTransaction(
    data: createMentorDTO
  ): Promise<MentorReturnDTO> {
    try {
      return await prisma.$transaction(async (tx) => {
        // Create Mentor
        const mentor = await tx.mentor.create({
          data: {
            userId: data.userId,
            aboutMe: data.aboutMe,
            expertise: data.expertise,
            documents: data.documents,
            languages: data.languages,
            hourlyRate: data.hourlyRate,
          },
        });

        // Validate that Mentor is created
        if (!mentor) throw new ValidationError("Mentor creation failed");

        // Store Experiences
        if (data.experiences?.length) {
          await tx.experience.createMany({
            data: data.experiences.map((exp) => ({
              mentorId: mentor.id,
              company: exp.company,
              role: exp.role,
              startDate: new Date(exp.startDate),
              description: exp.description,
              endDate: exp.endDate ? new Date(exp.endDate) : null,
            })),
          });
        }

        if (data.educations?.length) {
          await tx.education.createMany({
            data: data.educations.map((edu) => ({
              mentorId: mentor.id,
              degree: edu.degree,
              institution: edu.institution,
              startDate: edu.startDate.toISOString(),
              endDate: edu.endDate ? edu.endDate.toISOString() : "", // Now null is valid
              description: edu.description,
            })),
          });
        }

        // Store Skills (junction table)
        if (data.skills?.length) {
          await tx.mentorSkill.createMany({
            data: data.skills.map((skill) => ({
              mentorId: mentor.id,
              skillId: skill.id,
            })),
          });
        }

        return mentor;
      });
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in mentor repository transaction:", error);
      throw new Error("Transaction failed: Mentor creation unsuccessful");
    }
  }

  async findAll(options: object = {}): Promise<MentorReturnDTO[]> {
    return prisma.mentor.findMany(options);
  }

  async totalCount(): Promise<number> {
    return prisma.mentor.count();
  }

  async getMentorById(id: string): Promise<MentorsWithRelations | null> {
    return prisma.mentor.findUnique({
      where: { id },
      include: {
        educations: true,
        experiences: true,
        profile: true,
        skills: {
          include: {
            skill: true, // This ensures that the full Skill details are fetched
          },
        },
      },
    }).then((mentor) => {
      if (!mentor) return null;

      return {
        ...mentor,
        skills: mentor.skills.map((ms) => ms.skill), // Convert MentorSkill[] to Skill[]
      };
    });
  }
}

export const prismaMentorRepositoryInstance =
  new PrismaMentorRepositoryImplementation();

// import { prisma } from "@/lib/db/database";
// import { EducationRepository, ExperienceRepository, IMentorRepository, MentorSkillRepository } from "../core/interfaces/mentor.repository.interface";
// import { EducationDTO, EducationReturnDTO, ExperienceDTO, ExperienceReturnDTO, MentorDTO, MentorReturnDTO, MentorSkillDTO } from "../core/dtos/mentorDtos";

// export class PrismaMentorRepositoryImpl implements IMentorRepository {
//   private prisma = prisma;

//   async create(mentorData: MentorDTO):Promise<MentorReturnDTO> {
//     return this.prisma.mentor.create({ data: mentorData });
//   }

//   async findById(id: string) {
//     return this.prisma.mentor.findUnique({ where: { id } });
//   }

//   async findAll(options:object={}) {
//     return this.prisma.mentor.findMany(options);
//   }

//   async update(id: string, mentorData: Partial<MentorDTO>) {
//     return this.prisma.mentor.update({ where: { id }, data: mentorData });
//   }

//   async delete(id: string) {
//     return this.prisma.mentor.delete({ where: { id } });
//   }
// }

// export const mentorPrismaInstance = new PrismaMentorRepositoryImpl();

// ////---------------experiences
// export class PrismaExperienceRepositoryImpl implements ExperienceRepository {
//   private prisma = prisma;

//   async create(experienceData: ExperienceDTO): Promise<ExperienceReturnDTO | null> {
//     return this.prisma.experience.create({ data: experienceData });
//   }

//   async findById(id: string): Promise<ExperienceReturnDTO | null> {
//     return this.prisma.experience.findUnique({ where: { id } });
//   }

//   async findAll(page = 1, limit = 10): Promise<ExperienceReturnDTO[]> {
//     return this.prisma.experience.findMany({ skip: (page - 1) * limit, take: limit });
//   }

//   async update(id: string, experienceData: Partial<ExperienceDTO>): Promise<ExperienceReturnDTO | null> {
//     return this.prisma.experience.update({ where: { id }, data: experienceData });
//   }

//   async delete(id: string) {
//     return this.prisma.experience.delete({ where: { id } });
//   }
// }

// export const mentorExperiencesPrismaInstance = new PrismaExperienceRepositoryImpl();

// ////-------------educations
// export class PrismaEducationRepositoryImpl implements EducationRepository {
//   private prisma = prisma ;

//   async create(educationData: EducationDTO): Promise<EducationReturnDTO | null> {
//     return this.prisma.education.create({ data: educationData });
//   }

//   async findById(id: string): Promise<EducationReturnDTO | null> {
//     return this.prisma.education.findUnique({ where: { id } });
//   }

//   async findAll(page = 1, limit = 10): Promise<EducationReturnDTO[]> {
//     return this.prisma.education.findMany({ skip: (page - 1) * limit, take: limit });
//   }

//   async update(id: string, educationData: Partial<EducationDTO>): Promise<EducationReturnDTO | null> {
//     return this.prisma.education.update({ where: { id }, data: educationData });
//   }

//   async delete(id: string) {
//     return this.prisma.education.delete({ where: { id } });
//   }
// }

// export const mentorEducationsPrismaInstance = new PrismaEducationRepositoryImpl();

// ////------------mentorskill
// export class PrismaMentorSkillRepositoryImpl implements MentorSkillRepository {
//   private prisma = prisma;

//   async create(mentorSkillData: MentorSkillDTO) {
//     return this.prisma.mentorSkill.create({ data: mentorSkillData });
//   }

//   async delete(mentorId: string, skillId: string) {
//     return this.prisma.mentorSkill.delete({ where: { mentorId_skillId: { mentorId, skillId } } });
//   }
// }
// export const MentorSkillsJunctionTablePrismaInstance = new PrismaMentorSkillRepositoryImpl();
