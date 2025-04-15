import { UserProfileForm } from "@/components/forms/updateUserDetailsForm";

import { auth } from "@/lib/auth/auth";

import { Fetch_User_Details_By_Email_Server_Action } from "@/server/actions/user/fetch-user-details.server-action";


export default async function ProfilePage() {

  const session = await auth();

  if (!session || !session.user?.email) {
    return <div>Not Authorized</div>;
  }

  // Fetch user details from DB using email
  const res = await Fetch_User_Details_By_Email_Server_Action(session.user.email);

  if(!res.success|| !res.data) return <div className=""> Failed to load user details</div>
 console.log(res.data)

  return <div>

    <UserProfileForm user={res.data} />
  </div>;
}
