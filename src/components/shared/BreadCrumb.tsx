import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface BreadcrumbItem {
  label: string;
  icon?: ReactNode;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className="flex items-center text-sm text-gray-500 mb-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {item.to ? (
            <Link
              to={item.to}
              className="flex items-center hover:text-gray-700 cursor-pointer"
            >
              {item.icon && <span className="h-4 w-4 mr-1">{item.icon}</span>}
              <span>{item.label}</span>
            </Link>
          ) : (
            <div className="flex items-center text-gray-900 font-medium">
              {item.icon && <span className="h-4 w-4 mr-1">{item.icon}</span>}
              <span>{item.label}</span>
            </div>
          )}
          {index < items.length - 1 && <span className="mx-2">/</span>}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;
