import AdminSkillManagementClient from '@/components/layouts/admin/admin-skills-management-client'

import { Get_All_Skills_With_Pagination_Server_Action } from '@/server/actions/admin/skillManagement/get-all-skills.server-action';

async function SkillsManagementPage() {
  // Get initial skills from the server
console.log("rendered");
  const itemsPerPage = 5;
  const initialData = await Get_All_Skills_With_Pagination_Server_Action(1, itemsPerPage); // Fetching the first page of skills
  if (!initialData.success) return <div>Failed to Fetch Skills {initialData.message}</div>;

  console.log(initialData)
  return (
    <div>
      {initialData.data && (
        <AdminSkillManagementClient
          skills={initialData.data.skills}
          totalPages={initialData.data.totalPages}
          currentPage={initialData.data.currentPage}
          totalCount={initialData.data.totalCount}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}

export default SkillsManagementPage;
