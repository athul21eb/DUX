import { createUserDTO, loginUserDTO } from "../dtos/userDtos";
import { IUser } from "../entities/user";

export interface IUserService {
  registerUser(data: createUserDTO): Promise<IUser>;
  loginUser(data:loginUserDTO) : Promise<IUser>;
  getUserDetailsByEmail(email:string):Promise<IUser>;
  changeEmailVerification(email:string):Promise<IUser>;
  updateGoogleIdOfUser(id:string,googleId:string):Promise<IUser>;
  changePasswordOfUser(email:string,password:string):Promise<IUser>;
}
