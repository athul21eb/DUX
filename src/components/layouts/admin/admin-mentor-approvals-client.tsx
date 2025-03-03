"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import ReusableTable from "../../shared/reusableTable";
import PaginationComponent from "../../shared/reusablePagenation";
import {
  getAllApprovalsDTO,
  MentorReturnDTO,
} from "@/server/core/dtos/mentorDtos";
import { Get_All_Mentor_Approvals_With_Pagination_Server_Action } from "@/server/actions/admin/mentorsManagement/get-all-approvals-with-pagination.server-action";
import { IUser } from "@/server/core/entities/user";

// Define the Mentor Approvals props interface
interface MentorApprovalsManagementProps extends getAllApprovalsDTO {
  currentPage: number;
  itemsPerPage: number;
}

const AdminMentorApprovalsManagementClient = ({
  approvals: initialApprovals,
  totalPages: initialTotalPages,
  currentPage: initialCurrentPage,
  totalCount: initialTotalCount,
  itemsPerPage,
}: MentorApprovalsManagementProps) => {
  console.log(initialApprovals);
  // Table headers definition
  const headers = [
    "No",
    "Name",
    "Image",
    "Email",
    "Expertise",
    "Gender",
    "Hourly Rate",
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
  const router = useRouter();

  // Pagination handler
  const handlePageChange = async (newPage: number) => {
    startTransition(async () => {
      const result =
        await Get_All_Mentor_Approvals_With_Pagination_Server_Action(
          newPage,
          itemsPerPage
        );

      if (result.success && result.data) {
        setCurrentPage(newPage);
        setApprovals(result.data.approvals);
        setTotalPages(result.data.totalPages);
        setTotalCount(result.data.totalCount);
      }
    });
  };

  // Handle row click to navigate to approval details
  const handleRowClick = (index: number) => {
    let mentorId = approvals[index]?.id;
    router.push(`/admin/approvals/${mentorId}`);
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
    ];
  });

  const rowClickHandler = (index: number) => {
    handleRowClick(index);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mentor Approvals Management</h1>
        <div className="text-sm text-gray-500">
          Total Pending Approvals: {totalCount}
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
    </div>
  );
};

export default AdminMentorApprovalsManagementClient;
