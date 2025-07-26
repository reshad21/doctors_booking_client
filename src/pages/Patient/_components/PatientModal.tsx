import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { UserCheck, User, Phone, Mail, Calendar, Users, Weight, Activity, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Patient } from "@/types/patient.types"
import formatDateToReadable from "@/utils/formateDateToReveal"

interface PatientModalProps {
  patient: Patient | null
  isOpen: boolean
  onClose: () => void
}

const PatientModal = ({ patient, isOpen, onClose }: PatientModalProps) => {
  if (!patient) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Patient Information
          </DialogTitle>
          <DialogDescription>Complete details and medical information for the selected patient</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Name</p>
                  <p className="font-medium">{patient.name || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Phone</p>
                  <p className="font-medium">{patient.phoneNumber || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
                  <p className="font-medium text-sm">{patient.email || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Age</p>
                  <p className="font-medium">{patient.age ? `${patient.age} years` : "Not provided"}</p>
                </div>
              </div>
            </div>
          </div>
          <Separator />
          {/* Medical Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Medical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Gender</p>
                  <p className="font-medium">{patient.gender || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Weight className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Weight</p>
                  <p className="font-medium">{patient.weight || "Not recorded"}</p>
                </div>
              </div>
            </div>
          </div>
          <Separator />
          {/* Status Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Status & Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Patient Status</p>
                    <Badge className="mt-1">{patient.status || "Unknown"}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Visit Status</p>
                    <Badge className="mt-1">{patient.visitStatus || "Unknown"}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 md:col-span-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Registration Date</p>
                  <p className="font-medium">
                    {patient.createdAt ? formatDateToReadable(patient.createdAt) : "Not available"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PatientModal
