import { useDispatch, useSelector } from "react-redux";
import { useGetPatientQuery } from "@/redux/api/patient/patient";
import type { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { nextSerial, prevSerial } from "@/redux/api/features/serialSlice";

const today = new Date().toISOString().split("T")[0];

const SerialControlPage = () => {
  const dispatch = useDispatch();
  const currentSerial = useSelector(
    (state: RootState) => state.serial.currentSerial
  );

  const { data: patientApiData, isLoading } = useGetPatientQuery({
    limit: 1000,
    filter: JSON.stringify({ createdAt: today }),
    orderBy: JSON.stringify({ createdAt: "desc" }),
  });

  const totalPatients = patientApiData?.data?.data?.length || 0;

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-xl font-bold">Serial Control</h1>
      <div className="flex gap-4">
        <Button
          onClick={() => dispatch(prevSerial())}
          disabled={currentSerial <= 0}
        >
          Previous Serial
        </Button>
        <Button
          onClick={() => dispatch(nextSerial(totalPatients))}
          disabled={currentSerial >= totalPatients - 1}
        >
          Next Serial
        </Button>
      </div>
      <p className="text-md mt-4">Current Serial: {currentSerial + 1}</p>
    </div>
  );
};

export default SerialControlPage;
