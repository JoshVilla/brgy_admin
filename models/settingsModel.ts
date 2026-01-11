import mongoose from "mongoose";

const RequestTypeSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    serviceFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    requirements: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const GeneralSettingsSchema = new mongoose.Schema(
  {
    adminLogo: {
      type: String,
      default: null,
    },
    adminTitle: {
      type: String,
      default: null,
    },
  },
  { _id: false }
);

const SettingsSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: "SYSTEM_SETTINGS",
    },
    request: {
      type: [RequestTypeSchema],
      default: [
        {
          id: 1,
          name: "Barangay Clearance",
          enabled: true,
          serviceFee: 0,
          requirements: [],
        },
        {
          id: 2,
          name: "Certificate of Indigency",
          enabled: true,
          serviceFee: 0,
          requirements: [],
        },
        {
          id: 3,
          name: "Barangay Cedula",
          enabled: true,
          serviceFee: 0,
          requirements: [],
        },
        {
          id: 4,
          name: "Certificate of Residency",
          enabled: true,
          serviceFee: 0,
          requirements: [],
        },
        {
          id: 5,
          name: "Business Clearance",
          enabled: true,
          serviceFee: 0,
          requirements: [],
        },
        {
          id: 6,
          name: "Certificate of Good Moral",
          enabled: false,
          serviceFee: 0,
          requirements: [],
        },
        {
          id: 7,
          name: "Certificate of No Income",
          enabled: true,
          serviceFee: 0,
          requirements: [],
        },
        {
          id: 8,
          name: "Solo Parent Certificate",
          enabled: false,
          serviceFee: 0,
          requirements: [],
        },
        {
          id: 9,
          name: "Senior Citizen Certificate",
          enabled: true,
          serviceFee: 0,
          requirements: [],
        },
        {
          id: 10,
          name: "PWD Certificate",
          enabled: false,
          serviceFee: 0,
          requirements: [],
        },
        {
          id: 11,
          name: "Barangay ID",
          enabled: true,
          serviceFee: 0,
          requirements: [],
        },
        {
          id: 12,
          name: "Travel Certificate",
          enabled: false,
          serviceFee: 0,
          requirements: [],
        },
        {
          id: 13,
          name: "Event Permit",
          enabled: true,
          serviceFee: 0,
          requirements: [],
        },
      ],
    },
    general: {
      type: GeneralSettingsSchema,
      default: {
        adminLogo: null,
        adminTitle: null,
      },
    },
  },
  {
    timestamps: true,
    collection: "settings",
  }
);

// TypeScript interfaces
export interface IRequestType {
  id: number;
  name: string;
  enabled: boolean;
  serviceFee: number;
  requirements: string[];
}

export interface IGeneralSettings {
  adminLogo: string | null;
  adminTitle: string | null;
}

export interface ISettings extends mongoose.Document {
  _id: string;
  request: IRequestType[];
  general: IGeneralSettings;
  createdAt: Date;
  updatedAt: Date;
}

const Settings =
  mongoose.models.Settings ||
  mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
