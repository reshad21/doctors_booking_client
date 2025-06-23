import BaseSelect from "./components/shared/BaseSelect";
import Login from "./pages/Login/Login";

function App() {
  return (
    <div>
      <Login />
      <div className="text-center text-xl font-semibold">
        <span className="text-green-500">Doctor</span> Booking Component
      </div>
      <BaseSelect placeholder="Select Doctor" title="Doctor" />
    </div>
  );
}

export default App;
