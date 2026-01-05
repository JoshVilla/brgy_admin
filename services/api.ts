import { post } from "./service";

export const getResident = async (params: any): Promise<any> => {
  return await post("/api/resident", params);
};

export const addResident = async (params: any): Promise<any> => {
  return await post("/api/resident/addResident", params);
};

export const deleteResident = async (params: any): Promise<any> => {
  return await post("/api/resident/deleteResident", params);
};

export const editResident = async (params: any): Promise<any> => {
  return await post("/api/resident/editResident", params);
};

export const importResidents = async (params: any): Promise<any> => {
  return await post("/api/import/addResidents", params, true);
};

export const addEvent = async (params: any): Promise<any> => {
  return await post("/api/event/addEvent", params);
};

export const getEvent = async (params: any): Promise<any> => {
  return await post("/api/event", params);
};

export const deleteEvent = async (params: any): Promise<any> => {
  return await post("/api/event/deleteEvent", params);
};

export const editEvent = async (params: any): Promise<any> => {
  return await post("/api/event/editEvent", params);
};

export const getAnnouncement = async (params: any): Promise<any> => {
  return await post("/api/announcement", params);
};
export const addAnnouncement = async (params: any): Promise<any> => {
  return await post("/api/announcement/addAnnouncement", params);
};

export const deleteAnnouncement = async (params: any): Promise<any> => {
  return await post("/api/announcement/deleteAnnouncement", params);
};

export const editAnnouncement = async (params: any): Promise<any> => {
  return await post("/api/announcement/editAnnouncement", params);
};

export const getRequest = async (params: any): Promise<any> => {
  return await post("/api/request", params);
};

export const updateStatusRequest = async (params: any): Promise<any> => {
  return await post("/api/request/updateStatus", params);
};

export const addAdmin = async (params: any): Promise<any> => {
  return await post("/api/admin/addAdmin", params);
};

export const login = async (params: any): Promise<any> => {
  return await post("/api/login", params);
};

export const getAdmin = async (params: any): Promise<any> => {
  return await post("/api/admin", params);
};

export const deleteAdmin = async (params: any): Promise<any> => {
  return await post("/api/admin/deleteAdmin", params);
};

export const updateStatusAdmin = async (params: any): Promise<any> => {
  return await post("/api/admin/updateAdmin", params);
};

export const updateProfile = async (params: any): Promise<any> => {
  return await post("/api/profile/editProfile", params);
};

export const getTotals = async (params: any): Promise<any> => {
  return await post("/api/dashboard", params);
};

// Graph for Dashboard
export const getDashboardGraph = async (params: any): Promise<any> => {
  return await post("/api/dashboard/graph", params);
};

//analytics
export const getAnalytics = async (params: any): Promise<any> => {
  return await post("/api/analytics", params);
};

export const getMonthlySummary = async (params: any): Promise<any> => {
  return await post("/api/analytics/getMonthlySummary", params);
};

//blotter
export const getBlotters = async (params: any): Promise<any> => {
  return await post("/api/blotter", params);
};

export const addBlotter = async (params: any): Promise<any> => {
  return await post("/api/blotter/addBlotter", params);
};

export const updateBlotter = async (params: any): Promise<any> => {
  return await post("/api/blotter/editBlotter", params);
};

//settings
export const getSettings = async (params: any): Promise<any> => {
  return await post("/api/settings", params);
};

export const updateRequestSettings = async (params: any): Promise<any> => {
  return await post("/api/settings/updateRequest", params);
};

//privilage
export const getPrivilages = async (params: any): Promise<any> => {
  return await post("/api/privilage", params);
};

export const updatePrivilages = async (params: any): Promise<any> => {
  return await post("/api/privilage/updatePrivileges", params);
};

//ai
export const getSummaryAI = async (params: any): Promise<any> => {
  return await post("/api/ai/aiSummary", params);
};
