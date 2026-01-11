import ActivityLog from "@/models/activityLogModel";

export async function logActivity(
  name: string,
  activity: string,
  action: "Add" | "Edit" | "Delete",
  page: string
) {
  try {
    await ActivityLog.create({
      name,
      activity,
      action,
      page,
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}
