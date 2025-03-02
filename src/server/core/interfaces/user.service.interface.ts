import { createUserDTO, getAllUsersDTO, loginUserDTO, updateUserDTO } from "../dtos/userDtos";
import { IUser } from "../entities/user";

export interface IUserService {
  registerUser(data: createUserDTO): Promise<IUser>;
  loginUser(data:loginUserDTO) : Promise<IUser>;
  getUserDetailsByEmail(email:string):Promise<IUser>;
  changeEmailVerification(email:string):Promise<IUser>;
  updateGoogleIdOfUser(id:string,googleId:string):Promise<IUser>;
  changePasswordOfUser(email:string,password:string):Promise<IUser>;
  updateUserDetails(data:updateUserDTO,image:File|null):Promise<IUser>;
  getAllUsersWithPagination(skip:number,limit:number):Promise<getAllUsersDTO>
  changeIsBlockedStatus(id:string,status:boolean):Promise<boolean>;

}
