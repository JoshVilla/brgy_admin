import { toast } from "sonner";

export const calculateAge = (birthDateStr: string) => {
  const birthDate = new Date(birthDateStr);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};

export const toastError = (message: string) => {
  toast.error(message, {
    className: "bg-red-600 text-white border-red-700",
  });
};

export const toastSuccess = (message: string) => {
  toast.success(message, {
    className: "bg-green-600 text-white border-green-700",
  });
};

export const toastWarning = (message: string) => {
  toast.warning(message, {
    className: "bg-yellow-500 text-black border-yellow-600",
  });
};

export const toastLoading = (message: string) =>
  toast.loading(message, {
    className: "bg-muted text-muted-foreground border-muted",
  });
