
import { Outlet } from "react-router-dom";
import Login from "./pages/Login/Login";
import PatientCallingDisplay from "./pages/PatientCallingDisplay/Patientcallingdisplay";

function App() {
  return (
    <div>
      {/* <Login /> */}
      {/* <div className="text-center text-xl font-semibold">
        <span className="text-green-500">Doctor</span> Booking Component
      </div> */}
      <PatientCallingDisplay />
      <Outlet />
    </div>
  );
}

export default App;
