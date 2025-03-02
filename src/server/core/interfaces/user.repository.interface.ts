import { IUser } from "@/server/core/entities/user";
import { createUserDTO } from "../dtos/userDtos";

export interface IUserRepository {
  createUser(user: createUserDTO): Promise<IUser>;
  getUserById(id: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserByGoogleId(googleId: string): Promise<IUser | null>;
  updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null>;
  deleteUser(id: string): Promise<boolean>;
  getAllUsers(options:object): Promise<IUser[]>;
  changeBlockStatus(id: string,status:boolean): Promise<boolean>;
  isEmailTaken(email: string): Promise<boolean> ;
  totalCount():Promise<number>;
}
