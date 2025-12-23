import { IAdmin } from "@/models/adminModel";
import { IAnnouncement } from "@/models/announcementModel";
import { IEvent } from "@/models/eventModel";
import { IRequest } from "@/models/requestModel";
import { IResident } from "@/models/residentModel";

export interface IApiResponse<T> {
  data: T;
  isSuccess?: boolean;
  message: string;
  error: string;
}

export interface IServiceParams {
  [key: string]: any;
}

export interface IResResident extends IResident {
  _id: string;
}

export interface IResEvent extends IEvent {
  _id: string;
}

export interface IResAnnouncement extends IAnnouncement {
  _id: string;
}

export interface IResRequest extends IRequest {
  _id: string;
  createdAt: string;
}

export interface IResAdmin extends IAdmin {
  _id: string;
}
