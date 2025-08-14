import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface Appointment {
  sn: number;
  name: string;
  phone: string;
  status: string;
}

interface TodayAppointmentsProps {
  appointments: Appointment[];
}

const TodayAppointments: React.FC<TodayAppointmentsProps> = ({
  appointments,
}) => {
  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="text-lg">Today Appointment's</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No appointments today
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              You have no scheduled appointments for today.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">SN</TableHead>
                <TableHead className="text-xs">Patient Name</TableHead>
                <TableHead className="text-xs">Phone Number</TableHead>
                <TableHead className="text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment, index) => (
                <TableRow key={index}>
                  <TableCell className="text-sm">{appointment.sn}</TableCell>
                  <TableCell className="text-sm">{appointment.name}</TableCell>
                  <TableCell className="text-sm">{appointment.phone}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        appointment.status === "On Going"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default TodayAppointments;
