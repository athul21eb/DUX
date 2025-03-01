import { Skill } from "../entities/skill";


export interface getAllSkillsDTO{

  skills:Skill[]
  totalPages:number

  totalCount:number

}



export interface createSkillDTO{
  name:string
  description:string

}

export interface updateSkillDTO extends createSkillDTO{
  id:string;

}