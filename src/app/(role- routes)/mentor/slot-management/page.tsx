import { auth } from "@/lib/auth/auth";
import { Default_TimeSlots_Server_Action } from "@/server/actions/mentor/timeSlotManagement/defaultTimeSlots.server-action";
import { timeSlotService } from "@/server/services/timeSlot.service";
import React, { Suspense } from "react";

async function SlotManageMent() {
  const session = await auth();

  if (!session || !session.user?.email) {
    return <div>Not Authorized</div>;
  }

  const data = await Default_TimeSlots_Server_Action(session.user.id);

  console.log(data);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Your Time Slots</h1>

        {/* <TimeSlotManager defaultTimeSlots={defaultTimeSlots} /> */}

    </div>
  );
}

export default SlotManageMent;
