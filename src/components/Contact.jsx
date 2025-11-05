// app/components/Contact.jsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { sendEmailWithMailAPI } from "@/actions/emailActions";

export default function Contact() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
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
      from: "MailApi <noreply@mail.mailapi.dev>",
      to: email,
      subject,
      message,
    });

    if (res.success) {
      setStatus("success");
      setApiMessage(res.data?.message || "Email sent successfully!");
      setEmail("");
      setSubject("");
      setMessage("");
    } else {
      setStatus("error");
      setApiMessage(res.error || "Failed to send email.");
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
        Contact Us
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
        <Textarea
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={handleInputFocus}
          required
        />
        <Button type="submit" disabled={status === "sending"} className="w-full">
          {status === "sending" ? "Sending..." : "Send Message"}
        </Button>
        {apiMessage && (
          <p className={`text-sm text-center mt-2 ${status === "success" ? "text-green-600" : "text-red-600"}`}>
            {status === "success" ? "✅" : "❌"} {apiMessage}
          </p>
        )}
      </form>
    </div>
  );
}