import { Outlet } from "react-router-dom";
import PatientCallingDisplay from "./pages/PatientCallingDisplay/PatientCallingDisplay";
import { useSyncSerialAcrossTabs } from "./utils/useSyncSerialAcrossTabs";

function App() {
  useSyncSerialAcrossTabs();
  return (
    <div>
      <PatientCallingDisplay />
      <Outlet />
    </div>
  );
}

export default App;
