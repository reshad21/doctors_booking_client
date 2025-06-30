import { Card, CardHeader, CardTitle } from "@/components/ui/card"; // Adjust the import path if needed

const AppointmentManagement = () => {
  return (
    <div className="absolute top-13 bottom-0 left-0 right-0">
      <Card className="py-1 rounded-sm mx-6">
        <CardHeader>
          <CardTitle className=" text-lg font-medium p-1 text-green-800">
            Appointment History
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default AppointmentManagement;
