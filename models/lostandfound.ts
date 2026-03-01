import mongoose from "mongoose";

export interface ILostFound {
    item: string;
    type: string;
    description: string;
    image1: string;
    image2: string;
    image3: string;
    dateFound: Date;
    status: string;
}

const LostFoundSchema = new mongoose.Schema({
    item: {type: String, required: true},
    type: {type: String, required: true},
    description: {type: String, required: true},
    image1: {type: String, required: true},
    image2: {type: String},
    image3: {type: String},
    dateFound: {type: Date, required: true},
    status: {type: String, required: true}
}, {timestamps: true})

const LostFound =
  mongoose.models.LostFound ||
  mongoose.model<ILostFound>("LostFound", LostFoundSchema);
export default LostFound;