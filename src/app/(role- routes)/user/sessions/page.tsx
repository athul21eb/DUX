import BookingManagementClient from "@/components/shared/user-bookings-management";
import { Get_All_Bookings_With_Pagination_Server_Action } from "@/server/actions/user/bookingManagement/get-all-bookings.server-action";

async function BookingsManagementPage() {
  // Get initial bookings from the server
  console.log("Bookings page rendered");
  const itemsPerPage = 10;
  const initialData = await Get_All_Bookings_With_Pagination_Server_Action(1, itemsPerPage); // Fetching the first page of bookings

  if (!initialData.success) return <div>Failed to Fetch Bookings: {initialData.message}</div>;

  return (
    <div>
      {initialData.data && (
        <BookingManagementClient
          bookings={initialData.data.bookings}
          totalPages={initialData.data.totalPages}
          currentPage={initialData.data.currentPage}
          totalCount={initialData.data.totalCount}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}

export default BookingsManagementPage;