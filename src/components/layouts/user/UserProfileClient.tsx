"use client";

import { IUser } from "@/server/core/entities/user";
import { UserProfileForm } from "../forms/updateUserDetailsForm";

interface UserProfileFormProps {
  user: IUser;
}
export default function UserProfileClient({ user }:{user:IUser}) {



  return <UserProfileForm user={user} />;
}
