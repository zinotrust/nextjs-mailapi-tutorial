// app/actions/emailAction.js
"use server";

import { MailApiDev } from "mailapidev";

// Initialize the client once. It automatically reads process.env.MAILAPI_KEY.
const mailapi = new MailApiDev(process.env.MAILAPI_KEY);

/**
 * Sends an email using the mailapidev package.
 */
export const sendEmailWithMailAPI = async (emailData) => {
  try {
    // Pass the payload directly. The API and package will handle validation.
    const { data, error } = await mailapi.emails.send(emailData);

    if (error) {
      console.error("MailAPI error:", error);
      return { success: false, error: error.message, code: error.code };
    }

    console.log("MailAPI success:", data);
    return { success: true, data: data };

  } catch (error) {
    console.error("Email sending error:", error);
    return {
      success: false,
      error: error.message || "Failed to send email",
    };
  }
};

/**
 * Updates a contact using the mailapidev package.
 */
export const updateMailApiList = async (userData) => {
  try {
    // Pass the payload directly. The API and package will handle validation.
    const { data, error } = await mailapi.emails.update(userData);

    if (error) {
      console.error("MailAPI update error:", error);
      return {
        success: false,
        error: error.message || "Failed to update contact",
        code: error.code || "update_failed",
      };
    }

    console.log("MailAPI update success:", data);
    return {
      success: true,
      message: data.message || "Contact updated successfully",
      data: data.data,
      action: data.action,
    };

  } catch (error) {
    console.error("Update contact error:", error);
    return {
      success: false,
      error: error.message || "Failed to update contact",
      code: "update_failed",
    };
  }
};