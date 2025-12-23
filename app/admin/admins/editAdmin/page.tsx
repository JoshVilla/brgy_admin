"use client";

import EditAccountForm from "./editForm";

export default function EditAdminPage() {
  const initialData = {
    id: "123",
    username: "joshvilla",
  };

  const handleSubmit = async (data: {
    id: string;
    username: string;
    password?: string;
  }) => {
    console.log("Form submitted:", data);
    // Call your API here
  };

  return <EditAccountForm initialData={initialData} onSubmit={handleSubmit} />;
}
