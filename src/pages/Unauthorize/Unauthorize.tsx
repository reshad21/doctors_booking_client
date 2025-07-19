import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldX, Home } from "lucide-react"
import { Link } from "react-router-dom"

const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardContent className="pt-6">
                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="rounded-full bg-red-100 p-3">
                                <ShieldX className="h-8 w-8 text-red-600" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-gray-900">403</h1>
                            <h2 className="text-xl font-semibold text-gray-700">Unauthorized Access</h2>
                            <p className="text-gray-500 text-sm">
                                {
                                    "You don't have permission to access this page. Please contact your administrator if you believe this is an error."
                                }
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button asChild className="flex items-center bg-brand cursor-pointer gap-2">
                                <Link to="/dashboard" className="cursor-pointer">
                                    <Home className="h-4 w-4" />
                                    Home Page
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default UnauthorizedPage
