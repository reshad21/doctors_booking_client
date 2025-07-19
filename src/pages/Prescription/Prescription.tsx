/* eslint-disable @typescript-eslint/no-explicit-any */

import { useGetPatientQuery } from "@/redux/api/patient/patient";
import PrescriptionTable from "./_components/PrescriptionTable";

const Prescription = () => {
  const { data: patients } = useGetPatientQuery(undefined);

  return (
    <div>
      <PrescriptionTable patients={patients}/>
    </div>
  );
};

export default Prescription;
