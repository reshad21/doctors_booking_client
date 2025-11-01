import { useCallback, useMemo, useEffect } from "react";
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
import { Plus, Save, RotateCcw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  type FormFieldData,
  updateFormField,
  setFormFields,
  deleteFormField,
} from "../../redux/slices/prescriptionTemplateSlice";

export function FormBuilder() {
  const dispatch = useAppDispatch();
  const { formFields } = useAppSelector(
    (state) => state.prescriptionTemplate.patientSection
  );
  const { totalWidth } = useAppSelector(
    (state) => state.prescriptionTemplate.pageSetup
  );

  // Migration: Convert old width property to widthInches
  useEffect(() => {
    const needsMigration = formFields.some(
      (field) =>
        field.widthInches === undefined &&
        (field as FormFieldData & { width?: number }).width !== undefined
    );

    if (needsMigration) {
      const migratedFields = formFields.map((field) => {
        if (
          field.widthInches === undefined &&
          (field as FormFieldData & { width?: number }).width !== undefined
        ) {
          // Convert grid width (1-12) to approximate inches based on 8.3" total width
          const oldWidth = (field as FormFieldData & { width?: number }).width!;
          const approximateInches = (oldWidth / 12) * 8.3;
          return {
            ...field,
            widthInches: Math.round(approximateInches * 10) / 10,
          };
        }
        return field;
      });
      dispatch(setFormFields(migratedFields));
    }
  }, [formFields, dispatch]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Calculate row positions based on field widths in inches
  const calculateRows = useCallback(
    (fieldsData: FormFieldData[], availableWidth: number) => {
      const sortedFields = [...fieldsData].sort((a, b) => a.order - b.order);
      const rows: FormFieldData[][] = [];
      let currentRow: FormFieldData[] = [];
      let currentRowWidth = 0;

      sortedFields.forEach((field) => {
        // Ensure widthInches exists, fallback to width property or default
        const fieldWidth =
          field.widthInches ??
          (field as FormFieldData & { width?: number }).width ??
          2.0;

        // Add some padding between fields (0.2 inches)
        const fieldWidthWithPadding =
          fieldWidth + (currentRow.length > 0 ? 0.2 : 0);

        if (
          currentRowWidth + fieldWidthWithPadding > availableWidth &&
          currentRow.length > 0
        ) {
          // Start new row
          rows.push(currentRow);
          currentRow = [{ ...field, widthInches: fieldWidth }];
          currentRowWidth = fieldWidth;
        } else {
          // Add to current row
          currentRow.push({ ...field, widthInches: fieldWidth });
          currentRowWidth += fieldWidthWithPadding;
        }
      });

      if (currentRow.length > 0) {
        rows.push(currentRow);
      }

      // Update row numbers
      const fieldsWithRows: FormFieldData[] = [];
      rows.forEach((row, rowIndex) => {
        row.forEach((field) => {
          fieldsWithRows.push({ ...field, row: rowIndex });
        });
      });

      return fieldsWithRows;
    },
    []
  );

  // Grouped fields by row for rendering
  const fieldsByRow = useMemo(() => {
    const fieldsWithCalculatedRows = calculateRows(formFields, totalWidth);

    return fieldsWithCalculatedRows.reduce(
      (acc, field) => {
        if (!acc[field.row]) {
          acc[field.row] = [];
        }
        acc[field.row].push(field);
        return acc;
      },
      {} as Record<number, FormFieldData[]>
    );
  }, [formFields, totalWidth, calculateRows]);

  const updateFieldOrder = useCallback(
    (newFields: FormFieldData[]) => {
      const fieldsWithOrder = newFields.map((field, index) => ({
        ...field,
        order: index,
      }));
      const fieldsWithRows = calculateRows(fieldsWithOrder, totalWidth);
      dispatch(setFormFields(fieldsWithRows));
    },
    [calculateRows, dispatch, totalWidth]
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
      widthInches: 1.5,
      row: 0,
      defaultValue: "",
    };

    const newFields = [...formFields, newField];
    updateFieldOrder(newFields);
  };

  const updateField = (id: string, updates: Partial<FormFieldData>) => {
    dispatch(updateFormField({ id, updates }));

    // If width changed, recalculate rows
    if (updates.widthInches !== undefined) {
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
        widthInches: 1.8,
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
        widthInches: 1.5,
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
        widthInches: 1.2,
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
        widthInches: 1.8,
        row: 0,
        defaultValue: "",
      },
      {
        id: "5",
        label: "Visit Date",
        type: "date",
        placeholder: "Select date",
        required: true,
        order: 4,
        widthInches: 1.5,
        row: 0,
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
        totalWidth,
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

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Patient Section Form Builder</h2>
            <p className="text-sm text-gray-600 mt-1">
              Drag and drop to reorder • Use width selector to resize fields •
              Fields automatically wrap to new rows
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={resetForm} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>

            <Button onClick={addField} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Field
            </Button>

            <Button onClick={saveForm} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save & Export
            </Button>
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-600 flex items-center gap-4">
          <span>Total Fields: {formFields.length}</span>
          <span>Rows: {Math.max(...formFields.map((f) => f.row), 0) + 1}</span>
          <span>Available Width: {totalWidth}"</span>
        </div>

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
                    <div className="flex items-center gap-5">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-xs text-gray-500 font-medium">
                        Row {Number.parseInt(rowNum) + 1} (
                        {rowFields
                          .reduce((sum, field) => {
                            const fieldWidth =
                              field.widthInches ??
                              (field as FormFieldData & { width?: number })
                                .width ??
                              2.0;
                            return sum + fieldWidth;
                          }, 0)
                          .toFixed(1)}
                        " / {totalWidth}")
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-[10px]">
                      {rowFields
                        .sort((a, b) => a.order - b.order)
                        .map((field) => {
                          const fieldWidth =
                            field.widthInches ??
                            (field as FormFieldData & { width?: number })
                              .width ??
                            2.0;
                          return (
                            <div
                              key={field.id}
                              style={{
                                width: `${(fieldWidth / totalWidth) * 100}%`,
                                minWidth: `${fieldWidth * 96}px`, // 96px per inch approximation
                              }}
                            >
                              <FormField
                                field={field}
                                totalWidth={totalWidth}
                                onUpdate={(updates) =>
                                  updateField(field.id, updates)
                                }
                                onDelete={() => deleteField(field.id)}
                              />
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
            </div>
          </SortableContext>
        </DndContext>

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
