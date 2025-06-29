import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,

  CardContent,
  
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Users } from "lucide-react";

const appointmentData = [
  { sn: 10, name: "John Doe", phone: "01758191780", status: "On Going" },
  { sn: 10, name: "John Doe", phone: "01758191780", status: "Next" },
  { sn: 10, name: "John Doe", phone: "01758191780", status: "Next" },
  { sn: 10, name: "John Doe", phone: "01758191780", status: "Next" },
];

const DoctorDashboard = () => {
  return (
    <div>
      <main className="flex-1 p-6 overflow-auto">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src="/placeholder.svg?height=64&width=64"
                alt="Dr. Stven N Carter"
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome To DR. Stven N Carter
              </h2>
              <p className="text-gray-600">Have a nice day at work</p>
            </div>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 bg-black rounded transform rotate-45"></div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Appointment's</p>
                  <p className="text-3xl font-bold">1000</p>
                </div>
                <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Today's Appointment</p>
                  <p className="text-3xl font-bold">80</p>
                </div>
                <div className="w-12 h-12 bg-red-400 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Monthly Appointment</p>
                  <p className="text-3xl font-bold">200</p>
                </div>
                <div className="w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Summary */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Patient Summary January 2025
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Patient Percentage */}
            <Card className="border-none">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Patient Percentage</CardTitle>
                  <div className="flex space-x-2">
                    <Tabs defaultValue="daily" className="w-auto">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="daily" className="text-xs">
                          Daily
                        </TabsTrigger>
                        <TabsTrigger value="weekly" className="text-xs">
                          Weekly
                        </TabsTrigger>
                        <TabsTrigger value="monthly" className="text-xs">
                          Monthly
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-8 bg-gray-800 rounded"></div>
                      <div>
                        <p className="font-bold text-2xl">90%</p>
                        <p className="text-sm text-gray-600">New Patient</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-8 bg-gray-800 rounded"></div>
                      <div>
                        <p className="font-bold text-2xl">78%</p>
                        <p className="text-sm text-gray-600">Old Patient</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-8 bg-gray-800 rounded"></div>
                      <div>
                        <p className="font-bold text-2xl">50%</p>
                        <p className="text-sm text-gray-600">Report Patient</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card className="border-none">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Payment</CardTitle>
                  <div className="flex space-x-2">
                    <Tabs defaultValue="daily" className="w-auto">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="daily" className="text-xs">
                          Daily
                        </TabsTrigger>
                        <TabsTrigger value="weekly" className="text-xs">
                          Weekly
                        </TabsTrigger>
                        <TabsTrigger value="monthly" className="text-xs">
                          Monthly
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-8 bg-gray-800 rounded"></div>
                      <div>
                        <p className="font-bold text-2xl">30000</p>
                        <p className="text-sm text-gray-600">New Patient</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-8 bg-gray-800 rounded"></div>
                      <div>
                        <p className="font-bold text-2xl">20000</p>
                        <p className="text-sm text-gray-600">Old Patient</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-1 h-8 bg-gray-800 rounded"></div>
                      <div>
                        <p className="font-bold text-2xl">10000</p>
                        <p className="text-sm text-gray-600">Report Patient</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart */}
            <Card className="border-none">
              <CardHeader>
                <CardTitle className="text-lg">
                  Patient Summary January 2025
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray="150 251"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#f59e0b"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray="75 251"
                        strokeDashoffset="-150"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#d1d5db"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray="26 251"
                        strokeDashoffset="-225"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-sm">New Patient</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-sm">Old Patient</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded"></div>
                    <span className="text-sm">Report Patient</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Today's Appointments */}
            <Card className="border-none">
              <CardHeader>
                <CardTitle className="text-lg">Today Appointment's</CardTitle>
              </CardHeader>
              <CardContent>
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
                    {appointmentData.map((appointment, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-sm">
                          {appointment.sn}
                        </TableCell>
                        <TableCell className="text-sm">
                          {appointment.name}
                        </TableCell>
                        <TableCell className="text-sm">
                          {appointment.phone}
                        </TableCell>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
