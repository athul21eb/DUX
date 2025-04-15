import { createSkillDTO } from "../core/dtos/skillDtos";
import { Skill } from "../core/entities/skill";
import { ISkillRepository } from "../core/interfaces/skill.repository.interface";
import { prisma } from "@/lib/db/database";
import { BaseRepository } from "./prisma.BaseRepository";

export class PrismaSkillRepository extends BaseRepository<Skill> implements ISkillRepository {

   constructor() {
        super(prisma.skill);  // Replace 'YourTimeSlotModel' with your actual time slot model
      }
  async create(skill: createSkillDTO): Promise<Skill> {
    const createdSkill = await prisma.skill.create({
      data: {
        name: skill.name,
        description: skill.description,
      },
    });
    return createdSkill;
  }

  async findById(id: string): Promise<Skill | null> {
    const skill = await prisma.skill.findUnique({ where: { id } });
    return skill ? skill : null;
  }

  async findByName(name: string): Promise<Skill | null> {
    const skill = await prisma.skill.findUnique({ where: { name } });
    return skill ? skill : null;
  }

  async findAll(options: object = {}): Promise<Skill[]> {
    const skills = await prisma.skill.findMany(options);
    return skills.map((skill) => skill);
  }

  async update(id: string, skill: Partial<Skill>): Promise<Skill | null> {
    const updatedSkill = await prisma.skill.update({
      where: { id },
      data: skill,
    });
    return updatedSkill ? updatedSkill : null;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.skill.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async totalCount(): Promise<number> {
    return await prisma.skill.count();
  }
}

export const prismaSkillRepositoryInstance = new PrismaSkillRepository();
