'use client'

import { useEffect, useState, useTransition } from "react";
import { Trash2, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import ReusableTable from "../../shared/reusableTable";
import PaginationComponent from "../../shared/reusablePagenation";
import ConfirmDialog from "../../shared/reusableConfirmAlertDialog";
import { getAllUsersDTO } from "@/server/core/dtos/userDtos";
import { IUser } from "@/server/core/entities/user";
import { Get_All_Users_With_Pagination_Server_Action } from "@/server/actions/admin/usersManagement/get-all-users-with-paginatin.server-action";
import { Change_IsBlocked_Status_Server_Action } from "@/server/actions/admin/usersManagement/change-isBlocked-status.server-action";
import Image from "next/image";



// Define the User management props interface
interface UserManagementProps extends getAllUsersDTO {
  currentPage: number;
  itemsPerPage: number;
}


const UserManagement = ({
  users: initialUsers,
  totalPages: initialTotalPages,
  currentPage: initialCurrentPage,
  totalCount: initialTotalCount,
  itemsPerPage
}: UserManagementProps) => {
  // Table headers definition
  const headers = ["No", "Name", "Image", "Email", "DOB", "Gender", "Phone", "Actions"];

  // State management
  const [users, setUsers] = useState<IUser[]>(initialUsers ?? []);
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages ?? 1);
  const [currentPage, setCurrentPage] = useState<number>(initialCurrentPage ?? 1);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount ?? 1);
  const [isPending, startTransition] = useTransition();

  // Pagination handler
  const handlePageChange = async (newPage: number) => {
    startTransition(async () => {
      const result = await Get_All_Users_With_Pagination_Server_Action(newPage, itemsPerPage);

      if (result.success && result.data) {
        setCurrentPage(newPage);
        setUsers(result.data.users);
        setTotalPages(result.data.totalPages);
        setTotalCount(result.data.totalCount);
      }
    });
  };

  // Event handlers
  const handleToggleBlock = (user: IUser) => {
    setCurrentUser(user);
    setBlockDialogOpen(true);
  };

  const confirmToggleBlock = async () => {
    if (currentUser) {
      // Toggle block status
      const newBlockStatus = !currentUser.isBlocked;

      const result = await Change_IsBlocked_Status_Server_Action(currentUser.id, newBlockStatus);

      if (result.success) {

        // Refresh current page
        await handlePageChange(currentPage);
        setBlockDialogOpen(false);
        toast.success(result.message || `User ${newBlockStatus ? 'blocked' : 'unblocked'} successfully`);
      } else {
        console.error(result.message);
        toast.error(result.message || "Failed to update user status");
      }
    }
  };

  // Format date function
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  // Calculate starting number for the user list
  const userNumberStart = 1 + (currentPage - 1) * itemsPerPage;

  // Generate table rows from users data
  const rows = users.map((user, index) => [
    userNumberStart + index,
    user.name || "N/A",
    user.image ? <img
    src={user.image }
    alt={user.name || "User"}
    className="h-10 w-10 rounded-full"
    width={40}
    height={40} // Ensure proper sizing with Next.js Image
  /> : "No Image",
    user.email,
    formatDate(user.dob),
    user.gender || "N/A",
    user.phone || "N/A",
    <div key={`actions-${user.id}`} className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        className={user.isBlocked ?
          "text-green-500 border-green-200 hover:bg-green-50 hover:text-green-600" :
          "text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"}
        onClick={() => handleToggleBlock(user)}
      >
        {user.isBlocked ? (
          <>
            <Unlock className="h-4 w-4 mr-1" />
            Unblock
          </>
        ) : (
          <>
            <Lock className="h-4 w-4 mr-1" />
            Block
          </>
        )}
      </Button>
    </div>
  ]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>

      {/* Table component */}
      <ReusableTable headers={headers} rows={rows} />

      {/* Pagination component */}
      <PaginationComponent
        currentPage={currentPage}
        pageCount={totalPages}
        onPageChange={handlePageChange}
        isLoading={isPending}
      />

      {/* Confirmation dialog for block/unblock */}
      <ConfirmDialog
        isOpen={blockDialogOpen}
        onClose={() => setBlockDialogOpen(false)}
        onConfirm={confirmToggleBlock}
        title="Are you sure?"
        description={currentUser?.isBlocked
          ? `This will unblock the user "${currentUser?.name || currentUser?.email}". They will regain access to the system.`
          : `This will block the user "${currentUser?.name || currentUser?.email}". They will no longer be able to access the system.`}
        confirmText={currentUser?.isBlocked ? "Unblock" : "Block"}
        cancelText="Cancel"
        confirmVariant={currentUser?.isBlocked ? "default" : "destructive"}
      />
    </div>
  );
};

export default UserManagement;