"use server";

import { ValidationError } from "@/server/core/errors/errors";
import { mentorService } from "@/server/services/mentor.service";
import { userService } from "@/server/services/user.service";
import { sendMentorApplicationApprovalSuccessEmail, sendMentorApplicationRejectionEmail } from "@/utils/mail/metorApproveOrRejectMail";
import {
  ErrorResponse,
  SuccessResponse,
  TErrorResponse,
  TSuccessResponse,
} from "@/utils/serverActionResponses/serverActionResponses";

export const Admin_Approve_Or_Reject_Mentor_Approval_Server_Action = async (
  mentorId: string,
  status: string
): Promise<TSuccessResponse<null> | TErrorResponse> => {
  try {
    if (!mentorId || !["verified", "rejected"].includes(status)) {
      throw new ValidationError("Invalid input to approve or reject mentor application");
    }

    const updatedMentor = await mentorService.approveOrRejectMentorApproval(mentorId, status);

    if (!updatedMentor?.profile?.email) {
      throw new ValidationError(`Failed to update mentor details to ${status}`);
    }

    if (status === "verified") {
      const updatedMentorProfile = await userService.changeEmailVerification(updatedMentor.profile.email);

      const mailSent = await sendMentorApplicationApprovalSuccessEmail(updatedMentorProfile.email);
      if (!mailSent) {
        throw new ValidationError("Failed to send approval email, but mentor was approved successfully.");
      }
    } else {


      await userService.deleteUser(updatedMentor.userId);

      const mailSent = await sendMentorApplicationRejectionEmail(updatedMentor.profile.email);
      if (!mailSent) {
        throw new ValidationError("Failed to send rejection email, but mentor was rejected successfully.");
      }
    }

    return SuccessResponse(`Mentor application successfully ${status}`);
  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "Error in approve or reject mentor application server action");
    return ErrorResponse(error instanceof Error ? error.message : "Failed to approve or reject mentor application");
  }
};
