import { PrismaClient } from "@prisma/client";
import { prisma } from "./database";
import { Skill } from "@/types/skills";

class SkillService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Create a new skill with error handling
  async createSkill(name: string, description?: string): Promise<Skill | null> {
    try {
      return await this.prisma.skill.create({
        data: { name, description },
      });
    } catch (error) {
      console.error("Error creating skill:", error);
      return null;
    }
  }

  // Get all skills with error handling
  async getAllSkills(): Promise<Skill[] | null> {
    try {
      return await this.prisma.skill.findMany();
    } catch (error) {
      console.error("Error getting skills:", error);
      return null;
    }
  }

  async getSkillsWithPagination(
    skip: number,
    limit: number
  ): Promise<Skill[] | null> {
    try {
      return await this.prisma.skill.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }, // Sort by latest created skill
      });
    } catch (error) {
      console.error("Error fetching paginated skills:", error);
      return null; // Return null to indicate failure
    }
  }

  // ✅ Get total skill count (with error handling)
  async getTotalSkillCount(): Promise<number> {
    try {
      return await this.prisma.skill.count();
    } catch (error) {
      console.error("Error fetching total skill count:", error);
      return 0; // Return 0 to indicate failure
    }
  }

  // Get a skill by ID with error handling
  async getSkillById(skillId: string): Promise<Skill | null> {
    try {
      return await this.prisma.skill.findUnique({
        where: { id: skillId },
      });
    } catch (error) {
      console.error("Error getting skill by ID:", error);
      return null;
    }
  }

  // Update a skill with error handling
  async updateSkill(
    skillId: string,
    name?: string,
    description?: string
  ): Promise<Skill | null> {
    try {
      return await this.prisma.skill.update({
        where: { id: skillId },
        data: { name, description },
      });
    } catch (error) {
      console.error("Error updating skill:", error);
      return null;
    }
  }

  // Delete a skill with error handling
  async deleteSkill(skillId: string): Promise<Skill | null> {
    try {
      return await this.prisma.skill.delete({
        where: { id: skillId },
      });
    } catch (error) {
      console.error("Error deleting skill:", error);
      return null;
    }
  }
}

export const skillService = new SkillService(prisma);
