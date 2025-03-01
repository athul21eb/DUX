import { createSkillDTO, getAllSkillsDTO, updateSkillDTO } from "../dtos/skillDtos";
import { Skill } from "../entities/skill";


export interface ISkillService {
  createSkill(skill: createSkillDTO): Promise<Skill>;
  getSkillById(id: string): Promise<Skill | null>;
  getSkillByName(name: string): Promise<Skill | null>;
  getAllSkillsWithPagination(skip:number,limit:number): Promise<getAllSkillsDTO>;
  updateSkill(data:updateSkillDTO): Promise<Skill>;
  deleteSkill(id: string): Promise<boolean>;
}
