"use server";

import { ValidationError } from "@/server/core/errors/errors";

import { UserManagementResponseMessages } from "@/server/shared/constants/constant";
import { sendContactFormEmail } from "@/utils/mail/contact-form-mail";
import {
  ErrorResponse,
  SuccessResponse,
  TErrorResponse,
  TSuccessResponse,
} from "@/utils/serverActionResponses/serverActionResponses";


import { ContactFormSchema, TContactFormInputType } from "@/utils/validator/contact-form";

export const Contact_Form_Server_Action = async (data: TContactFormInputType): Promise<TSuccessResponse<null> | TErrorResponse> => {
  try {
    const validData = ContactFormSchema.parse(data);
    if (!validData) {
      throw new ValidationError(
        UserManagementResponseMessages.ErrorInvalidInputToContactUsForm,
      );
    }

  const { name,surname, email, message } = validData;


    // Send the email using your mail service
    const messageSent = await sendContactFormEmail(name, surname, email, message);

    if(!messageSent) {
      throw new ValidationError(
        UserManagementResponseMessages.ErrorFailedToContactUs,
      );
    }



    return SuccessResponse(
      UserManagementResponseMessages.SuccessContactFormSubmitted,
      null
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in  contact form server action");
    return ErrorResponse(
      error instanceof Error
        ? error.message
        : UserManagementResponseMessages.ErrorFailedToContactUs,
    );
  }
};
