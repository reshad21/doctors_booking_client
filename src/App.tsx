import { Outlet } from "react-router-dom";
import PatientCallingDisplay from "./pages/PatientCallingDisplay/PatientCallingDisplay";
import BaseImageUpload from "./components/shared/BaseImageUpload";

function App() {
  return (
    <div>
      <PatientCallingDisplay />
      <Outlet />
      <BaseImageUpload />
    </div>
  );
}

export default App;
