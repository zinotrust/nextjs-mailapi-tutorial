// app/components/EmailTemplate.jsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  sendEmailWithMailAPI,
  updateMailApiList,
} from "@/actions/emailActions";

export default function EmailTemplate() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Welcome!");
  const [status, setStatus] = useState("");
  const [apiMessage, setApiMessage] = useState("");

  const handleInputFocus = () => {
    setStatus("");
    setApiMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setApiMessage("");

    const res = await sendEmailWithMailAPI({
      from: "MailAPI <noreply@mail.mailapi.dev>",
      to: email,
      subject: subject,
      template_id: "welcome",
      template_data: {
        name: "John Doe",
        url: "https://app.mailapi.dev/login",
      },
      verify_and_save: true, // Automatically add to contact list
    });

    if (res.success) {
      setStatus("success");
      setApiMessage(res.data?.message || "Welcome email sent!");
      setEmail("");
      setSubject("Welcome!");
    } else {
      setStatus("error");
      setApiMessage(res.error || "Failed to send email.");
    }
  };

  const updateUserSession = async (userEmail) => {
    const res = await updateMailApiList({
      email: userEmail,
      lastSeenAt: new Date().toISOString(),
    });

    if (res.error) {
      console.error("Failed to update contact:", res.error);
      // Handle failure (e.g., log to your own monitoring)
    } else {
      console.log("Contact updated!", res.data);
    }
  };

  // const updateUserSubscription = async (userEmail) => {
  //   const res = await updateMailApiList({
  //     email: userEmail,
  //     subscriptionStatus: "active",
  //     plan: {
  //       id: "price_1234567890",
  //       name: "Pro",
  //       amount: 20,
  //       interval: "month",
  //     },
  //     convertedAt: new Date().toISOString(),
  //   });

  //   if (res.error) {
  //     console.error("Failed to update contact:", res.error);
  //     // Handle failure (e.g., log to your own monitoring)
  //   } else {
  //     console.log("Contact updated!", res.data);
  //   }
  // };

  const updateUserSubscription = async (userEmail) => {
    const res = await updateMailApiList({
      email: userEmail,
      subscriptionStatus: "canceled",
      lastSeenAt: new Date().toISOString(),
      churnedAt: new Date().toISOString(),
      churnReason: "Too expensive",
    });

    if (res.error) {
      console.error("Failed to update contact:", res.error);
      // Handle failure (e.g., log to your own monitoring)
    } else {
      console.log("Contact updated!", res.data);
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
      <br />
      <br />
      <Button onClick={() => updateUserSubscription("donaldzee.ng@gmail.com")}>
        Update MailApi User
      </Button>
      <br />
      <br />
      <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
        Send Template Email
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={handleInputFocus}
          required
        />
        <Input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          onFocus={handleInputFocus}
          required
        />
        <Button
          type="submit"
          disabled={status === "sending"}
          className="w-full"
        >
          {status === "sending" ? "Sending..." : "Send Welcome Email"}
        </Button>
        {apiMessage && (
          <p
            className={`text-sm text-center mt-2 ${
              status === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status === "success" ? "✅" : "❌"} {apiMessage}
          </p>
        )}
      </form>
    </div>
  );
}
