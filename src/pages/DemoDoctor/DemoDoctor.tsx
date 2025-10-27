import { useCreateDoctorMutation } from "@/redux/api/admin/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const doctorSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
})

type DoctorFormData = z.infer<typeof doctorSchema>

export default function DemoDoctorForm() {
    const [createDoctor, { isLoading }] = useCreateDoctorMutation()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful },
    } = useForm<DoctorFormData>({
        resolver: zodResolver(doctorSchema),
    })

    const onSubmit = async (data: DoctorFormData) => {
        try {
            await createDoctor(data).unwrap()
            reset()
        } catch (error) {
            console.error("❌ Failed to create doctor:", error)
        }
    }

    return (
        <div className="min-h-screen bg-background shadow-2xl shadow-black flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>User Information Form</CardTitle>
                    <CardDescription>Enter your details below</CardDescription>
                </CardHeader>
                <CardContent>
                    {isSubmitSuccessful && (
                        <Alert className="mb-4 border-green-200 bg-green-50">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                                ✓ Doctor created successfully!
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                Name
                            </label>
                            <Input
                                id="name"
                                placeholder="Dr."
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="demo@gmail.com"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium mb-1"
                            >
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••"
                                {...register("password")}
                            />
                            {errors.password && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium mb-1">
                                Phone
                            </label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="01100000000"
                                {...register("phone")}
                            />
                            {errors.phone && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>

                        <Button type="submit" className="w-full bg-black" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
