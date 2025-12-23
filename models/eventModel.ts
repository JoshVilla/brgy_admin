import mongoose from "mongoose";

export interface IEvent {
  title: string;
  description: string;
  datetime: string;
  venue: string;
}

const EventSchema = new mongoose.Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    datetime: { type: String, required: true },
    venue: { type: String, required: true },
  },
  { timestamps: true }
);

const Event =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
export default Event;
