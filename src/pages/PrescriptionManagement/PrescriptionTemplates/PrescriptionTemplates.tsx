import { Link } from "react-router-dom";

const PrescriptionTemplates = () => {
  return (
    <div>
      <Link
        to={
          "/dashboard/pre-management/prescription-templates/page-customize/page-setup"
        }
        className="text-blue-500 underline"
      >
        Go to Prescription Template Setup
      </Link>
    </div>
  );
};

export default PrescriptionTemplates;
