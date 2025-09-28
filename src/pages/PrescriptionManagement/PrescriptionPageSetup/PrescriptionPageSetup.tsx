import Breadcrumb from "@/components/shared/BreadCrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClipboardList, Plus, RepeatIcon } from "lucide-react";
import { Link } from "react-router-dom";

const PrescriptionPageSetup = () => {
  const breadcrumbItems = [
    {
      label: "Pre Management",
      icon: <RepeatIcon className="h-4 w-4" />,
      to: "/dashboard/pre-management",
    },
    { label: "Prescription Page", icon: <ClipboardList className="h-4 w-4" /> },
  ];
  return (
    <>
      <div className="custom-container flex-col !pt-5">
        <Breadcrumb items={breadcrumbItems} />
        <div className="w-full">
          <div className="flex items-center justify-between py-4 px-4 bg-white">
            <Link
              to={"/dashboard/pre-management/create-prescription-page-setup/page-setup"}
            >
              <Button className="bg-brand hover:bg-green-800 rounded cursor-pointer text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Prescription Page
              </Button>
            </Link>
            <Input className="w-72 rounded" placeholder="Search" />
          </div>
        </div>
      </div>
    </>
  );
};

export default PrescriptionPageSetup;
