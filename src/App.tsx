import { Outlet } from "react-router-dom";
import PatientCallingDisplay from "./pages/PatientCallingDisplay/PatientCallingDisplay";

function App() {
  return (
    <div>
      <PatientCallingDisplay />
      <Outlet />
    </div>
  );
}

export default App;
