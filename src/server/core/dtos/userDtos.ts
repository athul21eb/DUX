export interface createUserDTO {
  name: string;
  email: string;
  password: string;
}
export type Gender = "Male" | "Female" | "Other" | undefined;

export interface updateUserDTO {

    name: string;
    email:string;
    phone?: string;
    gender?: Gender;
    dob?: Date;



}

export interface UserProfileDTO {
  name?: string; // Optional name field
  email: string;
  phone?: string; // Optional phone field
  gender?: string; // Optional gender with specific values
  dob?: string; // Optional date of birth
  image?: string; // Optional image URL
}


export interface loginUserDTO {
  email: string;
  password: string;
}
