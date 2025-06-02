import BaseInput from "./components/shared/BaseInput";
import BaseSelect from "./components/shared/BaseSelect";

function App() {
  return (
    <div>
      <div className="text-center text-xl font-semibold">
        <span className="text-green-500">Doctor</span> Booking Component
      </div>
      <BaseInput placeholder="Email" title="Email" />
      <BaseSelect placeholder="Select Doctor" title="Doctor" />
    </div>
  );
}

export default App;
