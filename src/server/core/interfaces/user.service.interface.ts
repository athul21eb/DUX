import { createUserDTO } from "../dtos/userDtos";
import { IUser } from "../entities/user";

export interface IUserService {
  registerUser(data: createUserDTO): Promise<IUser | string>;
}
