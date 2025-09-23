import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Settings,
  Trash2,
  Plus,
  Minus,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import type { FormFieldData } from "../../redux/slices/prescriptionTemplateSlice";

interface FormFieldProps {
  field: FormFieldData;
  onUpdate: (updates: Partial<FormFieldData>) => void;
  onDelete: () => void;
  isPreview?: boolean;
}

export function FormField({
  field,
  onUpdate,
  onDelete,
  isPreview = false,
}: FormFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleWidthChange = (increment: boolean) => {
    const newWidth = increment
      ? Math.min(field.width + 1, 12)
      : Math.max(field.width - 1, 1);
    onUpdate({ width: newWidth });
  };

  const renderFormInput = () => {
    const baseProps = {
      placeholder: field.placeholder,
      defaultValue: field.defaultValue,
      disabled: !isPreview,
      className: "w-full",
    };

    switch (field.type) {
      case "textarea":
        return <Textarea {...baseProps} rows={3} />;
      case "select":
        return (
          <Select defaultValue={field.defaultValue} disabled={!isPreview}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={field.id}
              disabled={!isPreview}
              className="rounded"
            />
            <Label htmlFor={field.id}>{field.placeholder}</Label>
          </div>
        );
      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${field.id}-${option}`}
                  name={field.id}
                  value={option}
                  disabled={!isPreview}
                />
                <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </div>
        );
      default:
        return <Input {...baseProps} type={field.type} />;
    }
  };

  if (isPreview) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {renderFormInput()}
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={`p-4 relative transition-all duration-200 ${
          isDragging ? "shadow-lg border-blue-400" : "hover:shadow-md"
        }`}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute -top-2 -left-2 w-8 h-8 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors z-10"
        >
          <GripVertical className="w-4 h-4 text-white" />
        </div>

        {/* Width Controls */}
        <div className="absolute -top-2 left-8 flex items-center gap-1 z-10">
          <Button
            size="sm"
            variant="outline"
            className="w-6 h-6 p-0 bg-red-500 hover:bg-red-600 border-red-500 text-white"
            onClick={() => handleWidthChange(false)}
            disabled={field.width <= 1}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <Badge variant="secondary" className="px-2 py-1 text-xs font-medium">
            {field.width}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            className="w-6 h-6 p-0 bg-green-500 hover:bg-green-600 border-green-500 text-white"
            onClick={() => handleWidthChange(true)}
            disabled={field.width >= 12}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        {/* Field Actions */}
        <div className="absolute -top-2 -right-2 flex gap-1 z-10">
          <Button
            size="sm"
            variant="outline"
            className="w-6 h-6 p-0 bg-blue-500 hover:bg-blue-600 border-blue-500 text-white"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? (
              <EyeOff className="w-3 h-3" />
            ) : (
              <Eye className="w-3 h-3" />
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-6 h-6 p-0 bg-gray-500 hover:bg-gray-600 border-gray-500 text-white"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Settings className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-6 h-6 p-0 bg-red-500 hover:bg-red-600 border-red-500 text-white"
            onClick={onDelete}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>

        {/* Field Content */}
        <div className="space-y-3 mt-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Order: {field.order}</span>
              <span>Row: {field.row}</span>
            </div>
          </div>

          {showPreview ? (
            renderFormInput()
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 text-sm">
              {field.type} field - {field.placeholder}
            </div>
          )}
        </div>

        {/* Settings Panel */}
        {isEditing && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`label-${field.id}`} className="text-xs">
                  Label
                </Label>
                <Input
                  id={`label-${field.id}`}
                  value={field.label}
                  onChange={(e) => onUpdate({ label: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor={`type-${field.id}`} className="text-xs">
                  Type
                </Label>
                <Select
                  value={field.type}
                  onValueChange={(value) =>
                    onUpdate({ type: value as FormFieldData["type"] })
                  }
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="password">Password</SelectItem>
                    <SelectItem value="textarea">Textarea</SelectItem>
                    <SelectItem value="select">Select</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="radio">Radio</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor={`placeholder-${field.id}`} className="text-xs">
                Placeholder
              </Label>
              <Input
                id={`placeholder-${field.id}`}
                value={field.placeholder}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                className="text-sm"
              />
            </div>

            {(field.type === "select" || field.type === "radio") && (
              <div>
                <Label htmlFor={`options-${field.id}`} className="text-xs">
                  Options (comma separated)
                </Label>
                <Input
                  id={`options-${field.id}`}
                  value={field.options?.join(", ") || ""}
                  onChange={(e) =>
                    onUpdate({
                      options: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="text-sm"
                  placeholder="Option 1, Option 2, Option 3"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id={`required-${field.id}`}
                checked={field.required}
                onCheckedChange={(checked) => onUpdate({ required: checked })}
              />
              <Label htmlFor={`required-${field.id}`} className="text-xs">
                Required field
              </Label>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
