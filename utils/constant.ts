export const SALT_ROUNDS = 10;

export const CLOUD_FOLDER_NAME = "brgy_pictures";

export const ANIMATION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

export const LOADER_COUNT = 6;

export const STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  APPROVED: "approved",
  CANCELLED: "cancelled",
};

export const REQUEST_TYPE = {
  BRGYCERT: 1,
  BRGYINDIGENCY: 2,
  BRGYCEDULA: 3,
};
