import { ISkillRepository } from "../core/interfaces/skill.repository.interface";
import { ISkillService } from "../core/interfaces/skill.service.interface";
import { prismaSkillRepositoryInstance } from "../repositories/prisma.skill.repository";
import { ValidationError } from "../core/errors/errors";
import { Skill } from "../core/entities/skill";
import {
  createSkillDTO,
  getAllSkillsDTO,
  updateSkillDTO,
} from "../core/dtos/skillDtos";

export class SkillService implements ISkillService {
  private skillRepository: ISkillRepository;

  constructor(skillRepository: ISkillRepository) {
    this.skillRepository = skillRepository;
  }

  async createSkill(skill: createSkillDTO): Promise<Skill> {
    try {
      if (!skill.name || !skill.description) {
        throw new ValidationError("invalid data to create skill");
      }
      const createdSkill = await this.skillRepository.create(skill);
      if (!createdSkill) {
        throw new ValidationError("failed to   create skill");
      }

      return createdSkill;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in skill service create skill func :", error);
      throw new Error("failed to   create skill");
    }
  }

  async getSkillById(id: string): Promise<Skill | null> {
    return this.skillRepository.findById(id);
  }

  async getSkillByName(name: string): Promise<Skill | null> {
    return this.skillRepository.findByName(name);
  }

  async getAllSkillsWithPagination(
    skip: number,
    limit: number
  ): Promise<getAllSkillsDTO> {
    try {
      const skills = await this.skillRepository.findAll({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      });
      const totalCount = await this.skillRepository.totalCount();

      const data = {
        skills,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      };
      return data;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in skill service get skill func :", error);
      throw new Error("failed to fetch  get skills");
    }
  }

  async updateSkill(data: updateSkillDTO): Promise<Skill> {
    try {
      const { id, name, description } = data;
      if (!id || !name || !description) {
        throw new ValidationError("invalid data to update  skill");
      }
      const updated = await this.skillRepository.update(id, {
        name,
        description,
      });
      if (!updated) {
        throw new ValidationError("failed to   update  skill");
      }
      return updated;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in skill service update skill func :", error);
      throw new Error("failed to   update  skill");
    }
  }

  async deleteSkill(id: string): Promise<boolean> {
    try {
      if (!id) {
        throw new ValidationError("invalid data to delete skill");
      }
      const deleted = await this.skillRepository.delete(id);
      if (!deleted) {
        throw new ValidationError("failed to   delete skill");
      }
      return deleted;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in skill service delete skill func :", error);
      throw new Error("failed to   delete skill");
    }
  }
  async getAllSkills():Promise<Skill[]>{

    try {


      return await this.skillRepository.findAll({});


    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in skill service get all skills func :", error);
      throw new Error("failed to   get all skill");
    }
  }
}

export const skillService = new SkillService(prismaSkillRepositoryInstance);
