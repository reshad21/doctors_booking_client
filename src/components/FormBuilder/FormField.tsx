import { useState, useEffect, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Settings, Trash2, GripHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import type { FormFieldData } from "../../redux/slices/prescriptionTemplateSlice";

interface FormFieldProps {
  field: FormFieldData;
  totalWidth: number;
  onUpdate: (updates: Partial<FormFieldData>) => void;
  onDelete: () => void;
}

export function FormField({
  field,
  totalWidth,
  onUpdate,
  onDelete,
}: FormFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDragResizing, setIsDragResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, width: 0 });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  // Ensure widthInches exists, fallback to width property or default
  const currentWidth =
    field.widthInches ??
    (field as FormFieldData & { width?: number }).width ??
    2.0;

  const handleWidthChange = useCallback(
    (newWidth: number) => {
      const clampedWidth = Math.min(Math.max(newWidth, 0.5), totalWidth);
      onUpdate({ widthInches: clampedWidth });
    },
    [totalWidth, onUpdate]
  );

  // Handle mouse down on resize handle
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragResizing(true);
    setDragStart({
      x: e.clientX,
      width: currentWidth,
    });
  };

  // Handle mouse move and up for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragResizing) return;

      const deltaX = e.clientX - dragStart.x;
      // Convert pixel delta to inches (approximately 96 pixels per inch)
      const deltaInches = deltaX / 96;
      const newWidth = dragStart.width + deltaInches;

      handleWidthChange(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragResizing(false);
    };

    if (isDragResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragResizing, dragStart, handleWidthChange]);

  const renderFormPlaceholder = () => {
    let typeIcon = "";
    let displayText = field.placeholder || "Enter value";

    switch (field.type) {
      case "textarea":
        typeIcon = "📝";
        displayText = field.placeholder || "Enter text...";
        return (
          <div className="w-full h-16 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm">
            <span className="mr-2">{typeIcon}</span>
            {displayText}
          </div>
        );
      case "select":
        typeIcon = "📋";
        displayText = field.placeholder || "Select option";
        break;
      case "checkbox":
        typeIcon = "☑️";
        displayText = field.placeholder || "Checkbox option";
        break;
      case "radio":
        typeIcon = "🔘";
        displayText = field.placeholder || "Radio option";
        break;
      case "date":
        typeIcon = "📅";
        displayText = field.placeholder || "Select date";
        break;
      case "email":
        typeIcon = "✉️";
        displayText = field.placeholder || "Enter email";
        break;
      case "number":
        typeIcon = "🔢";
        displayText = field.placeholder || "Enter number";
        break;
      case "password":
        typeIcon = "🔒";
        displayText = field.placeholder || "Enter password";
        break;
      default:
        typeIcon = "📄";
        displayText = field.placeholder || "Enter text";
    }

    return (
      <div className="w-full h-10 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center px-3 text-gray-500 text-sm">
        <span className="mr-2">{typeIcon}</span>
        {displayText}
      </div>
    );
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Card
        className={`p-4 relative transition-all duration-200 ${
          isSortableDragging ? "shadow-lg border-blue-400" : "hover:shadow-md"
        } ${isDragResizing ? "ring-2 ring-blue-300 shadow-lg" : ""}`}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute -top-2 -left-2 w-8 h-8 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors z-10"
        >
          <GripVertical className="w-4 h-4 text-white" />
        </div>

        {/* Field Actions */}
        <div className="absolute -top-2 -right-2 flex gap-1 z-10">
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

          <div className="flex items-center gap-2">
            <div className="flex-1">{renderFormPlaceholder()}</div>

            {/* Drag Resize Handle */}
            <div
              className={`flex flex-col items-center cursor-ew-resize hover:bg-gray-100 p-2 rounded select-none transition-colors ${
                isDragResizing ? "bg-blue-100 border-2 border-blue-300" : ""
              }`}
              onMouseDown={handleResizeMouseDown}
              title={`Drag to resize width: ${currentWidth.toFixed(1)}"`}
            >
              <GripHorizontal
                className={`w-4 h-4 rotate-90 transition-colors ${
                  isDragResizing ? "text-blue-600" : "text-gray-500"
                }`}
              />
              <span
                className={`text-xs mt-1 transition-colors ${
                  isDragResizing
                    ? "text-blue-600 font-semibold"
                    : "text-gray-500"
                }`}
              >
                {currentWidth.toFixed(1)}"
              </span>
            </div>
          </div>
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

            <div>
              <Label htmlFor={`default-${field.id}`} className="text-xs">
                Default Value
              </Label>
              <Input
                id={`default-${field.id}`}
                value={field.defaultValue}
                onChange={(e) => onUpdate({ defaultValue: e.target.value })}
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
