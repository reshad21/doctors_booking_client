import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FormField } from "./FormField";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Plus, Save, Eye, EyeOff, RotateCcw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  type FormFieldData,
  updateFormField,
  setFormFields,
  addFormField,
  deleteFormField,
} from "../../redux/slices/prescriptionTemplateSlice";

export function FormBuilder() {
  const dispatch = useAppDispatch();
  const { formFields } = useAppSelector(
    (state) => state.prescriptionTemplate.patientSection
  );
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Calculate row positions based on field widths
  const calculateRows = useCallback((fieldsData: FormFieldData[]) => {
    const sortedFields = [...fieldsData].sort((a, b) => a.order - b.order);
    let currentRow = 0;
    let currentRowWidth = 0;

    return sortedFields.map((field) => {
      if (currentRowWidth + field.width > 12) {
        currentRow++;
        currentRowWidth = field.width;
      } else {
        currentRowWidth += field.width;
      }

      return { ...field, row: currentRow };
    });
  }, []);

  const updateFieldOrder = useCallback(
    (newFields: FormFieldData[]) => {
      const fieldsWithOrder = newFields.map((field, index) => ({
        ...field,
        order: index,
      }));
      const fieldsWithRows = calculateRows(fieldsWithOrder);
      dispatch(setFormFields(fieldsWithRows));
    },
    [calculateRows, dispatch]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = formFields.findIndex((field) => field.id === active.id);
      const newIndex = formFields.findIndex((field) => field.id === over.id);

      const newFields = arrayMove(formFields, oldIndex, newIndex);
      updateFieldOrder(newFields);
    }
  };

  const addField = () => {
    const newField: FormFieldData = {
      id: Date.now().toString(),
      label: "New Field",
      type: "text",
      placeholder: "Enter value",
      required: false,
      order: formFields.length,
      width: 6,
      row: 0,
      defaultValue: "",
    };

    dispatch(addFormField(newField));

    // Recalculate rows after adding
    const newFields = [...formFields, newField];
    updateFieldOrder(newFields);
  };

  const updateField = (id: string, updates: Partial<FormFieldData>) => {
    dispatch(updateFormField({ id, updates }));

    // If width changed, recalculate rows
    if (updates.width !== undefined) {
      const updatedFields = formFields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      );
      updateFieldOrder(updatedFields);
    }
  };

  const deleteField = (id: string) => {
    dispatch(deleteFormField(id));

    // Recalculate rows after deletion
    const newFields = formFields.filter((field) => field.id !== id);
    updateFieldOrder(newFields);
  };

  const resetForm = () => {
    const defaultFields: FormFieldData[] = [
      {
        id: "1",
        label: "Patient Name",
        type: "text",
        placeholder: "Enter patient name",
        required: true,
        order: 0,
        width: 6,
        row: 0,
        defaultValue: "",
      },
      {
        id: "2",
        label: "Age",
        type: "number",
        placeholder: "Enter age",
        required: true,
        order: 1,
        width: 3,
        row: 0,
        defaultValue: "",
      },
      {
        id: "3",
        label: "Gender",
        type: "select",
        placeholder: "Select gender",
        required: true,
        order: 2,
        width: 3,
        row: 0,
        defaultValue: "",
        options: ["Male", "Female", "Other"],
      },
      {
        id: "4",
        label: "Patient ID",
        type: "text",
        placeholder: "Enter patient ID",
        required: false,
        order: 3,
        width: 6,
        row: 1,
        defaultValue: "",
      },
      {
        id: "5",
        label: "Visit Date",
        type: "date",
        placeholder: "Select date",
        required: true,
        order: 4,
        width: 6,
        row: 1,
        defaultValue: "",
      },
    ];

    dispatch(setFormFields(defaultFields));
  };

  const saveForm = () => {
    const formBlueprint = {
      fields: formFields.map((field) => ({
        ...field,
        row: field.row,
      })),
      metadata: {
        totalFields: formFields.length,
        totalRows: Math.max(...formFields.map((f) => f.row)) + 1,
        createdAt: new Date().toISOString(),
      },
    };

    console.log("🎯 Form Blueprint:", JSON.stringify(formBlueprint, null, 2));

    // Download as JSON file
    const blob = new Blob([JSON.stringify(formBlueprint, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `patient-form-template-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Group fields by row for display
  const fieldsByRow = formFields.reduce(
    (acc, field) => {
      if (!acc[field.row]) {
        acc[field.row] = [];
      }
      acc[field.row].push(field);
      return acc;
    },
    {} as Record<number, FormFieldData[]>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Patient Section Form Builder</h2>
            <p className="text-sm text-gray-600 mt-1">
              Drag and drop to reorder • Resize fields with +/- • Click settings
              to customize
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              variant={isPreviewMode ? "default" : "outline"}
              size="sm"
            >
              {isPreviewMode ? (
                <EyeOff className="w-4 h-4 mr-2" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              {isPreviewMode ? "Edit Mode" : "Preview"}
            </Button>

            <Button onClick={resetForm} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>

            {!isPreviewMode && (
              <Button onClick={addField} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </Button>
            )}

            <Button onClick={saveForm} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save & Export
            </Button>
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-600 flex items-center gap-4">
          <span>Total Fields: {formFields.length}</span>
          <span>Rows: {Math.max(...formFields.map((f) => f.row), 0) + 1}</span>
          <span>Mode: {isPreviewMode ? "Preview" : "Edit"}</span>
        </div>

        {isPreviewMode ? (
          // Preview Mode - Show actual form
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Form Preview</h3>
              <p className="text-blue-700 text-sm">
                This is how your form will appear to users
              </p>
            </div>

            {Object.entries(fieldsByRow)
              .sort(([a], [b]) => Number.parseInt(a) - Number.parseInt(b))
              .map(([rowNum, rowFields]) => (
                <div key={rowNum} className="grid grid-cols-12 gap-4">
                  {rowFields
                    .sort((a, b) => a.order - b.order)
                    .map((field) => (
                      <div
                        key={field.id}
                        className={`col-span-${field.width}`}
                        style={{ gridColumn: `span ${field.width}` }}
                      >
                        <FormField
                          field={field}
                          onUpdate={() => {}}
                          onDelete={() => {}}
                          isPreview={true}
                        />
                      </div>
                    ))}
                </div>
              ))}
          </div>
        ) : (
          // Edit Mode with Drag & Drop
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={formFields.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-6">
                {Object.entries(fieldsByRow)
                  .sort(([a], [b]) => Number.parseInt(a) - Number.parseInt(b))
                  .map(([rowNum, rowFields]) => (
                    <div key={rowNum} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-xs text-gray-500 font-medium">
                          Row {Number.parseInt(rowNum) + 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-12 gap-4">
                        {rowFields
                          .sort((a, b) => a.order - b.order)
                          .map((field) => (
                            <div
                              key={field.id}
                              className={`col-span-${field.width}`}
                              style={{ gridColumn: `span ${field.width}` }}
                            >
                              <FormField
                                field={field}
                                onUpdate={(updates) =>
                                  updateField(field.id, updates)
                                }
                                onDelete={() => deleteField(field.id)}
                                isPreview={false}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {formFields.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <div className="text-6xl mb-4">📝</div>
            <p className="mb-4 text-lg">No fields added yet</p>
            <p className="mb-6 text-sm">
              Start building your patient form by adding your first field
            </p>
            <Button onClick={addField} variant="outline" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Field
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
