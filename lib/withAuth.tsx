import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isTokenValid } from "./utils";
import { setAdminInfo } from "@/redux/slice/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "sonner";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthComponent = (props: any) => {
    const dispatch = useDispatch();
    const adminInfo = useSelector((state: RootState) => state.admin.adminInfo);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");

      const decoded = token ? isTokenValid(token) : null;

      // Only dispatch if Redux doesn't already have it
      if (!decoded) {
        localStorage.removeItem("token");
        router.replace("/");
        toast.error("Session expired. Please log in again.");
      } else if (!adminInfo) {
        dispatch(setAdminInfo(decoded));
        setLoading(false);
      } else {
        // already in Redux, no need to dispatch again
        setLoading(false);
      }
    }, [router, adminInfo, dispatch]);

    if (loading) {
      return <p>Loading...</p>; // You can customize this with a spinner or skeleton
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
