"use server";

import { ValidationError } from "@/server/core/errors/errors";
import { mentorService } from "@/server/services/mentor.service";
import { userService } from "@/server/services/user.service";
import { MentorMangementResponseMessages } from "@/server/shared/constants/constant";
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
      throw new ValidationError(MentorMangementResponseMessages.ErrorInvalidInput);
    }

    const updatedMentor = await mentorService.approveOrRejectMentorApproval(mentorId, status);

    if (!updatedMentor?.profile?.email) {
      throw new ValidationError(MentorMangementResponseMessages.ErrorFailedToApproveOrReject(status));
    }

    if (status === "verified") {
      const updatedMentorProfile = await userService.changeEmailVerification(updatedMentor.profile.email);

      const mailSent = await sendMentorApplicationApprovalSuccessEmail(updatedMentorProfile.email);
      if (!mailSent) {
        throw new ValidationError(MentorMangementResponseMessages.ErrorFailedToSendApprovalEmail);
      }
    } else {


      await userService.deleteUser(updatedMentor.userId);

      const mailSent = await sendMentorApplicationRejectionEmail(updatedMentor.profile.email);
      if (!mailSent) {
        throw new ValidationError(MentorMangementResponseMessages.ErrorFailedToSendRejectionEmail);
      }
    }

    return SuccessResponse(MentorMangementResponseMessages.SuccessMentorApplicationStatusChanged(status));
  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "Error in approve or reject mentor application server action");
    return ErrorResponse(error instanceof Error ? error.message : MentorMangementResponseMessages.ErrorDefaultForStatusChange);
  }
};
