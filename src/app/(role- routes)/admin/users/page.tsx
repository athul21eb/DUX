import { Get_All_Users_With_Pagination_Server_Action } from "@/server/actions/admin/usersManagement/get-all-users-with-paginatin.server-action";
 import AdminUserManagementClient from "@/components/layouts/admin/admin-users-management-client"
async function UserManagementPage() {
  // Get initial skills from the server
console.log("rendered");
  const itemsPerPage = 5;
  const initialData = await Get_All_Users_With_Pagination_Server_Action(1, itemsPerPage); // Fetching the first page of skills
  if (!initialData.success) return <div>Failed to Fetch Skills {initialData.message}</div>;


  return (
    <div>
      {initialData.data && (
        <AdminUserManagementClient
          users={initialData.data.users}
          totalPages={initialData.data.totalPages}
          currentPage={initialData.data.currentPage}
          totalCount={initialData.data.totalCount}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}

export default UserManagementPage;
