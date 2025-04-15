



export const MentorMangementResponseMessages = {
  //// Error Messages
  ErrorInvalidInput : "Invalid input to approve or reject mentor application",
  ErrorInvalidInputByIdIsRequired : "id is required",
  ErrorInvalidInputToRegisterMentor : "Invalid input to register mentor",
  ErrorInvalidInputToRegisterMentorByProfilePicisRequired : "profile picture is required to register as mentor !",
  ErrorInvalidInputToRegisterMentorByDocumentsisRequired : "Documents is required to register as mentor !(atleast 3 documents)",
   ErrorInvalidToChangeMentorApprovalStatus : "Invalid status to change mentor approval",


  ErrorFailedToApproveOrReject :(status:string)=> `Failed to update mentor details to ${status}`,
  ErrorFailedToSendApprovalEmail : "Failed to send approval email, but mentor was approved successfully.",
  ErrorFailedToSendRejectionEmail : "Failed to send rejection email, but mentor was rejected successfully.",
  ErrorDefaultForStatusChange : "Failed to approve or reject mentor application",
  ErrorFailedToFetchMentorApprovals : "Failed to fetch mentor approvals",
  ErrorFailedToFetchMentors : "Failed to fetch mentors",
  ErrorFailedToFetchMentorDetailsByIdIsRequired : "id is required",
  ErrorFailedToFetchMentorDetails : "Failed to fetch mentor details",
  ErrorFaliedToUploadProfilePicture : "Failed to upload profile picture",
  ErrorFailedToUploadDocuments : "Failed to upload documents",
  ErrorFailedToRegisterMentor : "Failed to Register mentor",
//// Success Messages

SuccessMentorApprovalsFetched : "successfully fetched mentor approvals",
  SuccessMentorApplicationStatusChanged : (status:string)=>`Mentor application successfully ${status}`,
  SuccessMentorsFetched : "successfully fetched mentors",
  SuccessMentorDetailsFetched : "successfully fetched mentor details",
  SuccessMentorApplicationApplied : "Mentor application submitted successfully . Dux team will contact via email   ",
}


export const SkillManagementResponseMessages = {
  //// Error Messages

  ErrorInvalidInputToCreate : "Invalid input to create skill",
  ErrorInvalidInputToDelete : "Invalid input to delete skill",
  ErrorInvalidInputToUpdate : "Invalid input to update skill",
  ErrorFailedToUpdateSkill : "Failed to update skill",
  ErrorFailedToDeleteSkill : "Failed to delete skill",
  ErrorFailedToCreateSkill : "Failed to create skill",
  ErrorFailedToFetchSkills : "Failed to fetch skills",


  //// Success Messages
  SuccessSkillCreated : "new skill created successfully",
  SuccessSkillsFetched : "successfully fetched skills",
  SuccessSkillDeleted : "skill deleted successfully",
  SuccessSkillUpdated : "skill updated successfully",
}



export const UserManagementResponseMessages = {
  //// Error Messages
  ErrorInvalidInputToLogin : "Invalid input to login user",
   ErrorInvalidInputToSignUP : "Invalid input to sign up user",
   ErrorInvalidInputtoSendOTP : "Invalid input to send OTP, email is required",
   ErrorInvalidInputToVerifyOTP : "Invalid input to verify OTP, email and otp are required",
  ErrorInvalidInputToChangeIsBlockedStatus : "Invalid data to change isBlocked status",
  ErrorInvalidInputToFetchUsersDetailsByEmail : "Invalid input to fetch user details , email is required",
  ErrorInvalidInputToUpdateUserDetails : "Invalid input to update user details",
  ErrorInvalidInputToChangePassword : "Invalid input to change password",
 ErrorInvalidInputToContactUsForm : "Invalid input to contact us ",


  ErrorFailedToChangeIsBlocked :(status:boolean)=> `failed to change into ${status ? "blocked" : "unblocked"} `,
  ErrorFailedToFetchUsers : "failed to fetch users data",
  ErrorFailedToLogin : "failed to login user",
  ErrorFailedToFetchUserDetails : "failed to fetch user details",
  ErrorFailedToUpdateUserDetails : "failed to update user details",
  ErrorFaliedToSignUp : "failed to sign up user",
  ErrorFaliedToVerifyOTP : "failed to verify otp",
  ErrorFaliedToSendOTP : "failed to send otp",
  ErrorFaliledToVerifyEmail : "failed to verify email",
  ErrorFaliedToChangePassword : "failed to change password",
  ErrorFaliedToUploadProfilePicture : "failed to upload profile picture",
  ErrorFailedToDeleteUser : "failed to delete user",
  ErrorFailedToContactUs : "Failed to Contact Us. Please try again later.",


  ErrorEmailAlreadyExists : "Email is already taken. Please use another email.",
  ErrorEmailRegisteredwithGoogle : "Email already registered via Google. Please Login Using Google SignIn",
  ErrorPasswordNotMatch : "password and confirm password do not match",
  ErrorFaliedToSendVerificationEmail : "failed to send verification link email",
  ErrorUserNotFound : "user not found",
  ErrorVerificationTokenNotFound : "verification token not found",
  ErrorEmailNotVerified : "email is not verified ,check your email for verification link",
  ErrorGoogleSigninFailed : "failed to sign in with google",
  ErrorVerificationTokenExpiredAndResend : " verification Link has expired , New verification Link successfully sended",
  ErrorInvalidOtp : "Invalid OTP",
  ErrorOtpexpired : "OTP expired",
  ErrorUserisBlocked : "user account is blocked",
  ErrorInvalidCreadentials : "Invalid credentials",
  ErrorGoogleAccountCannotChangePassword : " Google via Signin Account can not use change password",
  ErrorNewPasswordAndOldPasswordSame : "New password and old password are same",


  //// Success Messages

  SuccessUserIsBlockedStatusChanged :(status:boolean)=> `successfully ${status ? "blocked" : "unblocked"} `,
  SuccessUsersFetched : "successfully fetched users data",
  SuccessUserDetailsFetched : "successfully fetched user details",
  SuccessUserDetailsUpdated : "successfully updated user details",
  SuccessVerificationEmailSent :(email:string)=> `verification email sent successfully to ${email}`,
  SuccessOtpSent :(email:string)=> `otp sent successfully to ${email}`,
  SuccessOtpVerified : "otp verified successfully",
  SuccessUserLoggedIn : "user logged in successfully",
  SuccessEmailVerified : "email verified successfully",
  SuccessPasswordChanged : "password changed successfully",
  SuccessContactFormSubmitted : "Contact Us form submitted successfully. We'll get back to you soon.",


}
