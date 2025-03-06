"use client";
import { useState, useTransition } from "react";

import { Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import ReusableTable from "../../shared/reusableTable";
import PaginationComponent from "../../shared/reusablePagenation";
import ConfirmDialog from "../../shared/reusableConfirmAlertDialog";
import {

  getAllMentorsDTO,
  MentorReturnDTO,
} from "@/server/core/dtos/mentorDtos";
import { IUser } from "@/server/core/entities/user";
import { Change_IsBlocked_Status_Server_Action } from "@/server/actions/admin/usersManagement/change-isBlocked-status.server-action";
import { useTransitionRouter } from "next-view-transitions";
import { Get_All_Mentor_With_Pagination_Server_Action } from "@/server/actions/admin/mentorsManagement/get-all-mentors-with-pagination.server-action";


interface MentorApprovalsManagementProps extends getAllMentorsDTO {

  currentPage: number;
  itemsPerPage: number;
}

const AdminMentorManagementClient = ({
  mentors: initialApprovals,
  totalPages: initialTotalPages,
  currentPage: initialCurrentPage,
  totalCount: initialTotalCount,
  itemsPerPage,
}: MentorApprovalsManagementProps) => {
  // Table headers definition
  const headers = [
    "No",
    "Name",
    "Image",
    "Email",
    "Expertise",
    "Gender",
    "Hourly Rate",
    "Actions"
  ];

  // State management
  const [approvals, setApprovals] = useState<MentorReturnDTO[]>(
    initialApprovals ?? []
  );
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages ?? 1);
  const [currentPage, setCurrentPage] = useState<number>(
    initialCurrentPage ?? 1
  );
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount ?? 1);
  const [isPending, startTransition] = useTransition();
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [currentMentor, setCurrentMentor] = useState<MentorReturnDTO | null>(null);
  const router = useTransitionRouter();

  // Pagination handler
  const handlePageChange = async (newPage: number) => {
    startTransition(async () => {
      const result =
        await Get_All_Mentor_With_Pagination_Server_Action(
          newPage,
          itemsPerPage
        );
      if (result.success && result.data) {
        setCurrentPage(newPage);
        setApprovals(result.data.mentors);
        setTotalPages(result.data.totalPages);
        setTotalCount(result.data.totalCount);
      }
    });
  };

  // Handle row click to navigate to approval details
  const handleRowClick = (index: number) => {
    let mentorId = approvals[index]?.id;
    router.push(`/admin/mentors/${mentorId}`);
  };

  // Handle block/unblock mentor
  const handleToggleBlock = (mentor: MentorReturnDTO, event: React.MouseEvent) => {
    // Prevent row click event from firing
    event.stopPropagation();
    setCurrentMentor(mentor);
    setBlockDialogOpen(true);
  };

  const confirmToggleBlock = async () => {
    if (currentMentor) {
      // Toggle block status
      const newBlockStatus = !(currentMentor?.profile?.isBlocked || false);


      try {
        // This is a placeholder - replace with your actual server action
        const result = await Change_IsBlocked_Status_Server_Action(currentMentor.id, newBlockStatus);

        if (result.success) {
          // Refresh current page
          await handlePageChange(currentPage);
          setBlockDialogOpen(false);
          toast.success(result.message || `Mentor ${newBlockStatus ? 'blocked' : 'unblocked'} successfully`);
        } else {
          console.error(result.message);
          toast.error(result.message || "Failed to update mentor status");
        }
      } catch (error) {
        console.error("Error toggling mentor block status:", error);
        toast.error("Failed to update mentor status");
      }
    }
  };

  // Calculate starting number for the mentor list
  const mentorNumberStart = 1 + (currentPage - 1) * itemsPerPage;

  // Generate table rows from approvals data
  const rows = approvals.map((mentor, index) => {
    // Get the user profile from the mentor data
    const userProfile = mentor.profile as IUser | undefined;
    return [
      mentorNumberStart + index,
      userProfile?.name || "N/A",
      userProfile?.image ? (
        <img
          src={userProfile.image}
          alt={userProfile.name || "Mentor"}
          className="h-10 w-10 rounded-full"
          width={40}
          height={40}
        />
      ) : (
        "No Image"
      ),
      userProfile?.email || "N/A",
      mentor.expertise || "N/A",
      userProfile?.gender || "N/A",
      `${mentor.hourlyRate}/hr`,
      <div key={`actions-${mentor.id}`} className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className={currentMentor?.profile?.isBlocked ?
            "text-green-500 border-green-200 hover:bg-green-50 hover:text-green-600" :
            "text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"}
          onClick={(e) => handleToggleBlock(mentor, e)}
        >
          {currentMentor?.profile?.isBlocked? (
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
    ];
  });

  const rowClickHandler = (index: number) => {
    handleRowClick(index);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mentor  Management</h1>
        <div className="text-sm text-gray-500">

        </div>
      </div>

      {/* Table component */}
      <ReusableTable
        headers={headers}
        rows={rows}
        onClickRow={rowClickHandler}
      />

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
        description={currentMentor?.profile?.isBlocked
          ? `This will unblock the mentor "${(currentMentor?.profile as IUser)?.name || (currentMentor?.profile as IUser)?.email}". They will regain access to the system.`
          : `This will block the mentor "${(currentMentor?.profile as IUser)?.name || (currentMentor?.profile as IUser)?.email}". They will no longer be able to access the system.`}
        confirmText={currentMentor?.profile?.isBlocked? "Unblock" : "Block"}
        cancelText="Cancel"
        confirmVariant={currentMentor?.profile?.isBlocked ? "default" : "destructive"}
      />
    </div>
  );
};



export default AdminMentorManagementClient;