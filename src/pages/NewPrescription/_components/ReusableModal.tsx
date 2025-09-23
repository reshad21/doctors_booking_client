import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ModalField {
  id: string;
  label: string;
  type?: "text" | "textarea" | "date";
  placeholder?: string;
  rows?: number;
}

interface ModalConfig {
  title: string;
  fields: ModalField[];
  buttonLabel: string;
}

interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => void;
  config: ModalConfig;
  formData: Record<string, string>;
  onFormDataChange: (data: Record<string, string>) => void;
}

const ReusableModal: React.FC<ReusableModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  config,
  formData,
  onFormDataChange,
}) => {
  const handleInputChange = (fieldId: string, value: string) => {
    onFormDataChange({ ...formData, [fieldId]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const renderField = (field: ModalField) => {
    const commonProps = {
      id: field.id,
      value: formData[field.id] || "",
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => handleInputChange(field.id, e.target.value),
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case "textarea":
        return <Textarea {...commonProps} rows={field.rows || 3} />;
      case "date":
        return (
          <Input
            {...commonProps}
            type="date"
            value={formData[field.id] || new Date().toISOString().split("T")[0]}
          />
        );
      default:
        return <Input {...commonProps} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-800">{config.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {config.fields.map((field) => (
            <div key={field.id}>
              <Label htmlFor={field.id} className="mb-2">{field.label}</Label>
              {renderField(field)}
            </div>
          ))}
          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {config.buttonLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReusableModal;
