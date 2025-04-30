import MentorSessionManagementClient from '@/components/shared/mentor-bookings-management';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/database';
import { Get_Mentor_Bookings_With_Pagination_Server_Action } from '@/server/actions/mentor/sessionsMangement/server-actions';
import { redirect } from 'next/navigation';

async function MentorSessionsPage() {
  // Get current user session
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard/mentoring/sessions');
  }

  // Verify user is a mentor
  const mentorProfile = await prisma.mentor.findUnique({
    where: { userId: session.user.id },
  });

  if (!mentorProfile) {
    redirect('/dashboard'); // Redirect to dashboard if not a mentor
  }

  // Get initial sessions from the server
  const itemsPerPage = 10;
  const initialData = await Get_Mentor_Bookings_With_Pagination_Server_Action(1, itemsPerPage);

  if (!initialData.success) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-700">
          Failed to Fetch Sessions: {initialData.message}
        </div>
      </div>
    );
  }

  return (
    <div>
      {initialData.data && (
        <MentorSessionManagementClient
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

export default MentorSessionsPage;