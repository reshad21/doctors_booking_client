import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface PageHeaderProps {
  title: string;
}
// const PageHeader = ({ title}: { title: string }) => {
const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  return (
    <div className="absolute top-15 bottom-0 left-0 right-0">
      <Card className="py-1 rounded-sm mx-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold p-2 flex items-center text-green-800">
            {title}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default PageHeader;
