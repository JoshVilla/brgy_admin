// lib/useAuthGuard.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { isTokenValid } from "@/lib/utils";
import { setAdminInfo } from "@/redux/slice/adminSlice";
import { RootState } from "@/redux/store";

export const useAuthGuard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const adminInfo = useSelector((state: RootState) => state.admin.adminInfo);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = token ? isTokenValid(token) : null;

    if (!decoded) {
      localStorage.removeItem("token");
      router.replace("/"); //login page
    } else if (!adminInfo) {
      dispatch(setAdminInfo(decoded));
      setAuthLoading(false);
    } else {
      setAuthLoading(false);
    }
  }, [router, dispatch, adminInfo]);

  return authLoading;
};
