import { auth } from "@/lib/auth/auth";
import { Get_Mentor_Details_By_Id_Server_Action } from "@/server/actions/admin/mentorsManagement/get-mentor-by-Id.server-action";
import { Default_TimeSlots_Server_Action } from "@/server/actions/mentor/timeSlotManagement/defaultTimeSlots.server-action";
import { redirect } from "next/navigation";

import { AlertTriangle } from "lucide-react";
import MentorBooking from "@/components/shared/mentor-booking";
import { Suspense } from "react";
import CheckUserRoleAndRedirect from "@/components/shared/protectingRoleBasedRouteComponent";
import LoadingFullScreen from "@/app/loading";

interface MentorParams {
  params: {
    mentorId: string;
  };
}

interface Slot {
  id: string;
  start: string;
  end: string;
}

// Transform data from server format to client format
const transformMentorData = (data: any) => {
  return {
    id: data.id || "",
    name: data.profile?.name || "Unknown Mentor",
    image: data.profile?.image || "",
    expertise: data.expertise || "General Mentoring",
    verified: data.verified || "pending",
    hourlyRate: data.hourlyRate || 0,
    bio: data.aboutMe || "No bio available for this mentor.",
    languages: data.languages || [],
    education: data.educations?.map((edu: any) => ({
      id: edu.id,
      degree: edu.degree,
      institution: edu.institution,
      startDate: edu.startDate,
      endDate: edu.endDate,
      description: edu.description
    })) || [],
    experience: data.experiences?.map((exp: any) => ({
      id: exp.id,
      role: exp.role,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description
    })) || [],
    skills: data.skills?.map((skill: any) => skill.name) || []
  };
};

// Transform time slots data
const transformSlotsData = (data: any): Slot[] => {
  // Check if data has a slots array property
  if (data.slots && Array.isArray(data.slots)) {
    return data.slots.map((slot: any) => ({
      id: slot.id,
      start: slot.start,
      end: slot.end
    }));
  }
  // If data is directly an array
  else if (Array.isArray(data)) {
    return data.map((slot: any) => ({
      id: slot.id,
      start: slot.start,
      end: slot.end
    }));
  }
  // Return empty array if format doesn't match
  return [];
};
export const revalidate = 0;

async function MentorBookingPage({ params }: MentorParams) {
  const session = await auth();

  // Check user authentication
  if (session?.user?.role !== "user") {
       await redirect("/");
       return null
  }

  const { mentorId } = await params;

  // Fetch mentor details
  const mentorResponse = await Get_Mentor_Details_By_Id_Server_Action(mentorId);

  if (!mentorResponse?.success || !mentorResponse.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md flex items-center gap-3 text-red-800">
          <AlertTriangle className="h-5 w-5" />
          Error fetching mentor details. Please try again.
        </div>
      </div>
    );
  }

  // Fetch initial time slots
  const initialSlotsResponse = await Default_TimeSlots_Server_Action(
    mentorResponse.data?.profile?.id ?? ""
  );

  if (!initialSlotsResponse.success || !initialSlotsResponse.data) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 p-4 rounded-md flex items-center gap-3 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          Failed to fetch mentor time slots: {initialSlotsResponse.message}
        </div>
      </div>
    );
  }


  // Transform the data for the client component
  const mentorData = transformMentorData(mentorResponse.data);
  const slotsData = transformSlotsData(initialSlotsResponse.data);

  console.log(initialSlotsResponse.data, "initialSlotsResponse.data",mentorData);
  console.log(mentorResponse.data, "mentorResponse.data",slotsData);

  return (
    <div className="container mx-auto px-4 py-8">
       {/* New Suspense Boundary to avoid hydration errors */}
       <Suspense fallback={<LoadingFullScreen />}>
        <CheckUserRoleAndRedirect allowedRole="user" />
      </Suspense>
      <h1 className="text-2xl font-bold mb-6">Book a Session</h1>
      <MentorBooking
        mentor={mentorData}
        initialSlots={slotsData}
      />
    </div>
  );
}

export default MentorBookingPage;