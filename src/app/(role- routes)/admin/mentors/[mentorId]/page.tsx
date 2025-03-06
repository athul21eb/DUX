import { MentorDetailsClient } from "@/components/layouts/admin/admin-mentor-with-details";
import { Get_Mentor_Details_By_Id_Server_Action } from "@/server/actions/admin/mentorsManagement/get-mentor-by-Id.server-action";


interface MentorApprovalParams {
  params: {
    mentorId: string;
  };
}

export default async function MentorDetailPage({ params }: MentorApprovalParams) {
  const { mentorId } = await params;
  const approval = await Get_Mentor_Details_By_Id_Server_Action(mentorId);

  if (!approval?.success||!approval.data) {

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md text-red-800">
          Error fetching mentor approval. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center" >Mentor  Details</h1>
      <MentorDetailsClient mentor={approval.data} mentorId={mentorId} approvalOrNot={false}/>
    </div>
  );
}