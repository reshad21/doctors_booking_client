/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { GripVertical } from "lucide-react";
import {
  useCreateClinicalTemplateMutation,
  useGetClinicTemplateQuery,
  useUpdateClinicalTemplateMutation,
} from "@/redux/api/clinicalNoteTemplate/clinicalNoteTemplate";
import { useAppSelector } from "@/redux/hooks";
import { useCurrentToken } from "@/redux/api/features/authSlice";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

interface SortableItemProps {
  id: string;
  title: string;
  category: string;
}

const SortableItem = ({ id, title, category }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const categoryColors = {
    left: "border-blue-300 bg-blue-50 hover:bg-blue-100",
    right: "border-indigo-300 bg-indigo-50 hover:bg-indigo-100",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "opacity-50 scale-105 z-50" : "opacity-100"}`}
    >
      <Card
        className={`p-4 mb-3 cursor-move transition-all duration-200 border-2 ${
          categoryColors[category as keyof typeof categoryColors]
        } ${isDragging ? "shadow-2xl" : "shadow-sm hover:shadow-md"}`}
      >
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
          >
            <GripVertical className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
            <p className="text-xs text-gray-500 mt-1">
              Category:{" "}
              <span className="font-medium capitalize">{category}</span>
            </p>
          </div>
          <div className="flex-shrink-0 text-xs font-medium text-gray-400">
            #{id}
          </div>
        </div>
      </Card>
    </div>
  );
};

const ClinicalNotesOrdering = () => {
  const [createClinicTemplate] = useCreateClinicalTemplateMutation();
  const [updateClinicTemplate] = useUpdateClinicalTemplateMutation();
  const { data: clinicalData } = useGetClinicTemplateQuery({});
  const token = useAppSelector(useCurrentToken);
  const decoded: { id: string } = jwtDecode(token);
  const [leftItems, setLeftItems] = useState([
    { id: "left-1", title: "Chief Complaint", category: "left" },
    { id: "left-2", title: "On Examinations", category: "left" },
    { id: "left-3", title: "Diagnosis", category: "left" },
    { id: "left-4", title: "Investigation", category: "left" },
    { id: "left-5", title: "History", category: "left" },
  ]);

  const [rightItems, setRightItems] = useState([
    { id: "right-1", title: "Medicine", category: "right" },
    { id: "right-2", title: "Advice", category: "right" },
    { id: "right-3", title: "Next Visit", category: "right" },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (clinicalData?.data?.notes?.length) {
      const notes = clinicalData.data.notes;

      const left = notes
        .filter((n: any) => n.category === "left")
        .sort((a: any, b: any) => a.order - b.order)
        .map((n: any, i: number) => ({
          id: `left-${i + 1}`,
          title: n.title,
          category: "left",
        }));

      const right = notes
        .filter((n: any) => n.category === "right")
        .sort((a: any, b: any) => a.order - b.order)
        .map((n: any, i: number) => ({
          id: `right-${i + 1}`,
          title: n.title,
          category: "right",
        }));

      setLeftItems(left);
      setRightItems(right);
    }
  }, [clinicalData]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // Find which list the active item belongs to
    const activeInLeft = leftItems.find((item) => item.id === active.id);
    const activeInRight = rightItems.find((item) => item.id === active.id);

    // Find which list the over item belongs to
    const overInLeft = leftItems.find((item) => item.id === over.id);
    const overInRight = rightItems.find((item) => item.id === over.id);

    // Handle left section reordering
    if (activeInLeft && overInLeft) {
      const oldIndex = leftItems.findIndex((item) => item.id === active.id);
      const newIndex = leftItems.findIndex((item) => item.id === over.id);

      const newLeftItems = arrayMove(leftItems, oldIndex, newIndex);
      setLeftItems(newLeftItems);

      console.log("Left Section Reordered:", {
        category: "left",
        items: newLeftItems.map((item, index) => ({
          id: item.id,
          title: item.title,
          order: index + 1,
        })),
      });
    }

    // Handle right section reordering
    if (activeInRight && overInRight) {
      const oldIndex = rightItems.findIndex((item) => item.id === active.id);
      const newIndex = rightItems.findIndex((item) => item.id === over.id);

      const newRightItems = arrayMove(rightItems, oldIndex, newIndex);
      setRightItems(newRightItems);

      console.log("Right Section Reordered:", {
        category: "right",
        items: newRightItems.map((item, index) => ({
          id: item.id,
          title: item.title,
          order: index + 1,
        })),
      });
    }
  };

  const handleSaveOrder = async () => {
    const finalOrder = {
      leftSection: leftItems.map((item, index) => ({
        title: item.title,
        category: item.category,
        order: index + 1,
      })),
      rightSection: rightItems.map((item, index) => ({
        title: item.title,
        category: item.category,
        order: index + 1,
      })),
    };

    const payload = {
      doctorId: decoded?.id,
      notes: [...finalOrder.leftSection, ...finalOrder.rightSection],
    };

    if (clinicalData?.data) {
      const res = await updateClinicTemplate(payload).unwrap();
      console.log(res);
      if (res.statusCode === 200) {
        toast.success("Save successfully");
      } else {
        toast.error("Something went wrong!");
      }
    } else {
      const res = await createClinicTemplate(payload).unwrap();
      console.log(res);
      if (res.statusCode === 201) {
        toast.success("Save successfully");
      } else {
        toast.error("Something went wrong!");
      }

      console.log("Final Order to Save:", payload);
      alert("Order saved! Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-3 sm:py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mt-6 mb-6 sm:mt-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Clinical Notes Ordering
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Drag and drop to reorder items within each section
              </p>
            </div>
            <button
              onClick={handleSaveOrder}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Save Order
            </button>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Patient Assessment
                </h2>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 min-h-[400px]">
                <p className="text-xs text-gray-500 mb-4 flex items-center gap-2">
                  <GripVertical className="w-4 h-4" />
                  Drag items to reorder
                </p>
                <SortableContext
                  items={leftItems.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {leftItems.map((item) => (
                    <SortableItem
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      category={item.category}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>

            {/* Right Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-10 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full"></div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Treatment & Follow-up
                </h2>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 min-h-[400px]">
                <p className="text-xs text-gray-500 mb-4 flex items-center gap-2">
                  <GripVertical className="w-4 h-4" />
                  Drag items to reorder
                </p>
                <SortableContext
                  items={rightItems.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {rightItems.map((item) => (
                    <SortableItem
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      category={item.category}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default ClinicalNotesOrdering;
