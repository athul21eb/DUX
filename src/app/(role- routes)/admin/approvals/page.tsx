import AdminMentorApprovalsManagementClient from '@/components/layouts/admin/admin-mentor-approvals-client';
import { Get_All_Mentor_Approvals_With_Pagination_Server_Action } from '@/server/actions/admin/mentorsManagement/get-all-approvals-with-pagination.server-action';
import { getAllApprovalsDTO } from '@/server/core/dtos/mentorDtos';

async function MentorApprovalsManagementPage() {
  // Get initial approvals data from the server
  const itemsPerPage = 5;
  const initialData = await Get_All_Mentor_Approvals_With_Pagination_Server_Action(1, itemsPerPage);

  if (!initialData.success) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          Failed to fetch mentor approvals: {initialData.message}
        </div>
      </div>
    );
  }

  return (
    <div>
      {initialData.data && (
        <AdminMentorApprovalsManagementClient
          approvals={initialData.data.approvals}
          totalPages={initialData.data.totalPages}
          currentPage={initialData.data.currentPage}
          totalCount={initialData.data.totalCount}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}

export default MentorApprovalsManagementPage;