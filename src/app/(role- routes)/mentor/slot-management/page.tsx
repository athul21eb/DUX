import SlotManagement from "@/components/shared/mentor-slot-mangement";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";
import { auth } from "@/lib/auth/auth";
import { Default_TimeSlots_Server_Action } from "@/server/actions/mentor/timeSlotManagement/defaultTimeSlots.server-action";
import { timeSlotService } from "@/server/services/timeSlot.service";
import React, { Suspense } from "react";

async function SlotManageMent() {
  const session = await auth();

  if (!session || !session.user?.email) {
    return <div>Not Authorized</div>;
  }

  const initialData = await Default_TimeSlots_Server_Action(session.user.id);




  if (!initialData.success||!initialData.data) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          Failed to fetch mentor approvals: {initialData.message}
        </div>
      </div>
    );
  }

  console.log(initialData.data);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Your Time Slots</h1>

    <Suspense fallback={<LoadingSpinner />}>
        <SlotManagement defaultTimeSlots={initialData.data.slots??[]} id={initialData.data.mentorId}/>
      </Suspense>

    </div>
  );
}

export default SlotManageMent;
