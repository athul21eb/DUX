import { createSkillDTO } from "../dtos/skillDtos";
import { Skill } from "../entities/skill";


export interface ISkillRepository {
  create(skill: createSkillDTO): Promise<Skill>;
  findById(id: string): Promise<Skill | null>;
  findByName(name: string): Promise<Skill | null>;
  findAll(options:object): Promise<Skill[]>;
  update(id: string, skill: Partial<Skill>): Promise<Skill | null>;
  delete(id: string): Promise<boolean>;
  totalCount():Promise<number>;
}
