import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setCalledSerials,
  setEndedSerials,
} from "@/redux/api/features/serialSlice";

export function useSyncSerialAcrossTabs() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "calledSerials" && e.newValue) {
        const calledSerials = JSON.parse(e.newValue);
        dispatch(setCalledSerials(calledSerials));
      }
      if (e.key === "endedSerials" && e.newValue) {
        const endedSerials = JSON.parse(e.newValue);
        dispatch(setEndedSerials(endedSerials));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch]);
}
