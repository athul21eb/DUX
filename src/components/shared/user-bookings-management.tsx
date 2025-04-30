'use client'

import { useEffect, useState, useTransition } from "react";
import { CalendarX, Search, Filter, Eye } from "lucide-react";
import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { BookingStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cancel_Booking_Server_Action, Get_All_Bookings_With_Pagination_Server_Action, GetAllBookingsDTO } from "@/server/actions/user/bookingManagement/get-all-bookings.server-action";
import ReusableTable from "./reusableTable";
import PaginationComponent from "./reusablePagenation";
import ConfirmDialog from "./reusableConfirmAlertDialog";

// Define the booking entity type
type Booking = {
  id: string;
  mentorId: string;
  startTime: string;
  endTime: string;
  bookingDate: string;
  paymentAmount: string;
  status: BookingStatus;
  user: {
    name: string;
    image: string | null;
  };
  mentor: {
    expertise: string;
    profile: {
      name: string;
      image: string | null;
    }
  };
  createdAt: Date;
};

// Define the Booking management props interface
interface BookingManagementProps extends GetAllBookingsDTO {
  currentPage: number;
  itemsPerPage: number;
}

const BookingManagementClient = ({
  bookings: initialBookings,
  totalPages: initialTotalPages,
  currentPage: initialCurrentPage,
  totalCount: initialTotalCount,
  itemsPerPage
}: BookingManagementProps) => {
  // Table headers definition
  const headers = ["No",  "Mentor & Expertise", "Session Details", "Status", "Actions"];

  // State management
  const [bookings, setBookings] = useState<Booking[]>(initialBookings ?? []);
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages ?? 1);
  const [currentPage, setCurrentPage] = useState<number>(initialCurrentPage ?? 1);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount ?? 0);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Function to get initials from a name
  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Pagination handler
  const handlePageChange = async (newPage: number) => {
    startTransition(async () => {
      const result = await Get_All_Bookings_With_Pagination_Server_Action(newPage, itemsPerPage);

      if (result.success && result.data) {
        setCurrentPage(newPage);
        setBookings(result.data.bookings);
        setTotalPages(result.data.totalPages);
        setTotalCount(result.data.totalCount);
      }
    });
  };

  // Event handlers
  const handleCancel = (booking: Booking) => {
    setCurrentBooking(booking);
    setCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    if (currentBooking) {
      const result = await Cancel_Booking_Server_Action(currentBooking.id);

      if (result.success) {
        setCancelDialogOpen(false);

        // Refresh current page
        await handlePageChange(currentPage);

        toast.success(result.message || "Booking cancelled successfully");
      } else {
        console.error(result.message);
        toast.error(result.message || "Failed to cancel booking");
      }
    }
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
      case "failed":
        badgeClass = "bg-gray-100 text-gray-800 hover:bg-gray-100";
        break;
      default:
        badgeClass = "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }

    return (
      <Badge className={badgeClass} variant="outline">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Filter function for search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Implementation would typically involve server-side filtering
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    // Implementation would typically involve server-side filtering
  };

  // Calculate starting number for the booking list
  const bookingNumberStart = 1 + (currentPage - 1) * itemsPerPage;

  // Generate table rows from bookings data
  const rows = bookings.map((booking, index) => [
    bookingNumberStart + index,
    // <div key={`user-${booking.id}`} className="flex items-center gap-3">
    //   <Avatar className="h-9 w-9">
    //     <AvatarImage src={booking.user.image || ""} alt={booking.user.name || "User"} />
    //     <AvatarFallback>{getInitials(booking.user.name)}</AvatarFallback>
    //   </Avatar>
    //   <div className="font-medium">{booking.user.name}</div>
    // </div>,
    <div key={`mentor-${booking.id}`} className="flex items-center gap-3">
      <Avatar className="h-9 w-9">
        <AvatarImage src={booking.mentor.profile.image || ""} alt={booking.mentor.profile.name || "Mentor"} />
        <AvatarFallback>{getInitials(booking.mentor.profile.name)}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">{booking.mentor.profile.name}</div>
        <div className="text-sm text-gray-500">{booking.mentor.expertise}</div>
      </div>
    </div>,
    <div key={`session-${booking.id}`} className="flex flex-col">
      <div className="font-medium">{booking.bookingDate}</div>
      <div className="text-sm text-gray-500">
        {booking.startTime} - {booking.endTime}
      </div>
      <div className="text-sm font-medium">${booking.paymentAmount}</div>
    </div>,
    formatStatus(booking.status),
    <div key={`actions-${booking.id}`} className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() =>   toast.error("Session details view not implemented yet")}
      >
        <Eye className="h-4 w-4 mr-1" />
        Join
      </Button>
      {booking.status !== 'canceled' && booking.status !== 'completed' && booking.status !== 'failed' && (
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          onClick={() => handleCancel(booking)}
        >
          <CalendarX className="h-4 w-4 mr-1" />
          Cancel
        </Button>
      )}
      {(booking.status === 'canceled' || booking.status === 'completed' || booking.status === 'failed') && (
        <span className="text-sm text-gray-500 italic">No actions available</span>
      )}
    </div>
  ]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Booking Management</h1>

        {/* <div className="flex gap-3">
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          {/* <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
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

      {/* Confirmation dialog for cancel */}
      <ConfirmDialog
        isOpen={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        onConfirm={confirmCancel}
        title="Cancel Booking"
        description={`Are you sure you want to cancel this booking with ${currentBooking?.user.name} for ${currentBooking?.bookingDate} at ${currentBooking?.startTime}?`}
        confirmText="Cancel Booking"
        cancelText="Keep Booking"
        confirmVariant="destructive"
      />
    </div>
  );
};

export default BookingManagementClient;