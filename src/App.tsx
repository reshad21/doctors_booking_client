import { Outlet } from "react-router-dom";
import PatientCallingDisplay from "./pages/PatientCallingDisplay/PatientCallingDisplay";
import DemoShadcnForm from "./components/shared/DemoShadcnForm";

function App() {
  return (
    <div>
      <PatientCallingDisplay />
      <Outlet />
      {/* <DemoShadcnForm /> */}
    </div>
  );
}

export default App;
