'use client'

import { useEffect, useState, useTransition } from "react";
import { CalendarX, Search, Eye, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { BookingStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Cancel_Mentor_Session_Server_Action, Get_Mentor_Bookings_With_Pagination_Server_Action, GetMentorBookingsDTO } from "@/server/actions/mentor/sessionsMangement/server-actions";
import ReusableTable from "./reusableTable";
import PaginationComponent from "./reusablePagenation";
import ConfirmDialog from "./reusableConfirmAlertDialog";

// Define the booking/session entity type
type Session = {
  id: string;
  userId: string;
  mentorId: string;
  startTime: string;
  endTime: string;
  bookingDate: string;
  paymentAmount: string;
  status: BookingStatus;
  user: {
    name: string;
    email: string;
  };
  createdAt: Date;
};

// Define the Session management props interface
interface SessionManagementProps extends GetMentorBookingsDTO {
  currentPage: number;
  itemsPerPage: number;
}

const MentorSessionManagementClient = ({
  bookings: initialBookings,
  totalPages: initialTotalPages,
  currentPage: initialCurrentPage,
  totalCount: initialTotalCount,
  itemsPerPage
}: SessionManagementProps) => {
  // Table headers definition
  const headers = ["No", "Student", "Date", "Time", "Amount", "Status", "Actions"];

  // State management
  const [sessions, setSessions] = useState<Session[]>(initialBookings ?? []);
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages ?? 1);
  const [currentPage, setCurrentPage] = useState<number>(initialCurrentPage ?? 1);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount ?? 0);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const router = useRouter();

  // Stats for summary cards
  const upcomingSessions = sessions.filter(session =>
    session.status === "confirmed" || session.status === "pending"
  ).length;

  const completedSessions = sessions.filter(session =>
    session.status === "completed"
  ).length;

  const cancelledSessions = sessions.filter(session =>
    session.status === "canceled"
  ).length;

  // Pagination handler
  const handlePageChange = async (newPage: number) => {
    startTransition(async () => {
      const result = await Get_Mentor_Bookings_With_Pagination_Server_Action(newPage, itemsPerPage);

      if (result.success && result.data) {
        setCurrentPage(newPage);
        setSessions(result.data.bookings);
        setTotalPages(result.data.totalPages);
        setTotalCount(result.data.totalCount);
      }
    });
  };

  // Event handlers
  const handleViewDetails = (session: Session) => {
    // You might implement a details view for sessions
    toast.error("Session details view not implemented yet");
  };

  const handleCancel = (session: Session) => {
    setCurrentSession(session);
    setCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    if (currentSession) {
      const result = await Cancel_Mentor_Session_Server_Action(currentSession.id);

      if (result.success) {
        setCancelDialogOpen(false);

        // Refresh current page
        await handlePageChange(currentPage);

        toast.success(result.message || "Session cancelled successfully");
      } else {
        console.error(result.message);
        toast.error(result.message || "Failed to cancel session");
      }
    }
  };

  // Filter function for search and status
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    // Implement status filtering logic here if needed
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const dateParts = dateString.split('-');
      if (dateParts.length === 3) {
        const [year, month, day] = dateParts;
        return `${day}/${month}/${year}`;
      }
      return dateString;
    } catch (error) {
      return dateString;
    }
  };

  // Format time for display
  const formatTime = (startTime: string, endTime: string) => {
    return (
      <div className="flex flex-col">
        <span className="text-sm font-medium flex items-center">
          <Clock className="h-3 w-3 mr-1" /> {startTime} - {endTime}
        </span>
      </div>
    );
  };

  // Format status for display with appropriate badge
  const formatStatus = (status: BookingStatus) => {
    let badgeClass = "";

    switch (status) {
      case "pending":
        badgeClass = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
        break;
      case "confirmed":
        badgeClass = "bg-green-100 text-green-800 hover:bg-green-100";
        break;
      case "canceled":
        badgeClass = "bg-red-100 text-red-800 hover:bg-red-100";
        break;
      case "completed":
        badgeClass = "bg-blue-100 text-blue-800 hover:bg-blue-100";
        break;
      // case "failed": // Removed as "failed" is not part of BookingStatus
      //   badgeClass = "bg-gray-100 text-gray-800 hover:bg-gray-100";
      //   break;
      default:
        badgeClass = "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }

    return (
      <Badge className={badgeClass} variant="outline">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Calculate starting number for the booking list
  const sessionNumberStart = 1 + (currentPage - 1) * itemsPerPage;

  // Generate table rows from sessions data
  const rows = sessions.map((session, index) => [
    sessionNumberStart + index,
    <div key={`user-${session.id}`} className="flex flex-col">
      <span className="font-medium">{session.user.name}</span>
      <span className="text-sm text-gray-500">{session.user.email}</span>
    </div>,
    <div key={`date-${session.id}`} className="flex items-center">
      <Calendar className="h-3 w-3 mr-1" />
      <span>{formatDate(session.bookingDate)}</span>
    </div>,
    formatTime(session.startTime, session.endTime),
    <span key={`amount-${session.id}`}>${session.paymentAmount}</span>,
    formatStatus(session.status),
    <div key={`actions-${session.id}`} className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleViewDetails(session)}
      >
        <Eye className="h-4 w-4 mr-1" />
        Join
      </Button>
      {(session.status === 'pending' || session.status === 'confirmed') && (
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          onClick={() => handleCancel(session)}
        >
          <CalendarX className="h-4 w-4 mr-1" />
          Cancel
        </Button>
      )}
    </div>
  ]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Sessions</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingSessions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Completed Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedSessions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Cancelled Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cancelledSessions}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Session List</h2>

        {/* <div className="flex space-x-4">
          <Select
            value={statusFilter}
            onValueChange={handleStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sessions</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div> */}
      </div>

      {/* Table component */}
      {sessions.length > 0 ? (
        <ReusableTable headers={headers} rows={rows} />
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-md">
          <p className="text-gray-500">No sessions found</p>
        </div>
      )}

      {/* Pagination component */}
      {totalPages > 1 && (
        <PaginationComponent
          currentPage={currentPage}
          pageCount={totalPages}
          onPageChange={handlePageChange}
          isLoading={isPending}
        />
      )}

      {/* Confirmation dialog for cancel */}
      <ConfirmDialog
        isOpen={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        onConfirm={confirmCancel}
        title="Cancel Session"
        description={`Are you sure you want to cancel this session with ${currentSession?.user.name} for ${currentSession?.bookingDate} at ${currentSession?.startTime}? This will make the time slot available again.`}
        confirmText="Cancel Session"
        cancelText="Keep Session"
        confirmVariant="destructive"
      />
    </div>
  );
};

export default MentorSessionManagementClient;