import { MentorDetailsClient } from "@/components/layouts/admin/admin-mentor-with-details";
import { Get_Mentor_Details_By_Id_Server_Action } from "@/server/actions/admin/mentorsManagement/get-mentor-by-Id.server-action";





interface MentorParams {
  params: {
    mentorId: string;
  };
}
async function page({params}:MentorParams) {

  const { mentorId } = await params;


  const mentorDetails = await Get_Mentor_Details_By_Id_Server_Action(mentorId);

  if (!mentorDetails?.success||!mentorDetails.data) {

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md text-red-800">
          Error fetching mentor Details. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mentor  Details</h1>
      <MentorDetailsClient mentor={mentorDetails.data} mentorId={mentorId} approvalOrNot={false} adminOrNot={false}/>
    </div>
  );
}

export default page