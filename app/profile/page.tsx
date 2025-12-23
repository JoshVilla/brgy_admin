"use client";

import { useSelector } from "react-redux";
import EditAccountForm from "./editForm";
import { RootState } from "@/redux/store";
import { IResAdmin } from "@/utils/types";

export default function EditAdminPage() {
  const adminInfo = useSelector(
    (state: RootState) => state.admin.adminInfo as IResAdmin
  );

  if (!adminInfo) return null; // or a loading spinner

  const handleSubmit = async (data: {
    id: string;
    username: string;
    password?: string;
  }) => {
    console.log("Form submitted:", data);
    // Call your API here to update admin info
  };

  return (
    <EditAccountForm
      initialData={{ id: adminInfo._id, username: adminInfo.username }}
      onSubmit={handleSubmit}
    />
  );
}
