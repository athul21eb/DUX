import { ApprovalClient } from "@/components/layouts/admin/admin-mentor-aprrovals-with-details";
import { Get_Mentor_Details_By_Id_Server_Action } from "@/server/actions/admin/mentorsManagement/get-mentor-by-Id.server-action";


interface MentorApprovalParams {
  params: {
    mentorId: string;
  };
}

export default async function MentorApprovalDetailPage({ params }: MentorApprovalParams) {
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
      <h1 className="text-2xl font-bold mb-6">Mentor Approval Details</h1>
      <ApprovalClient mentor={approval.data} mentorId={mentorId} />
    </div>
  );
}