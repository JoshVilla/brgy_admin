import mongoose from "mongoose";

export interface IAnnouncement {
  announcement: string;
  isViewed: boolean;
}

const AnnouncementSchema = new mongoose.Schema<IAnnouncement>(
  {
    announcement: { type: String, required: true },
    isViewed: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const Announcement =
  mongoose.models.Announcement ||
  mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);
export default Announcement;
