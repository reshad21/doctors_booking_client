import { useState } from "react"
import { Card } from "@/components/ui/card"
import { GripVertical, Eye, EyeOff } from "lucide-react"
import { jwtDecode } from "jwt-decode"
import { useCurrentToken } from "@/redux/api/features/authSlice"
import { useAppSelector } from "@/redux/hooks"
import { useCreateClinicalTemplateMutation, useGetClinicTemplateQuery, useUpdateClinicalTemplateMutation } from "@/redux/api/clinicalNoteTemplate/clinicalNoteTemplate"
import toast from "react-hot-toast"

interface SortableItemProps {
  id: string
  title: string
  category: string
  isShow: boolean
  onToggleVisibility: (id: string) => void
  index: number
  onDragStart: (e: React.DragEvent, index: number) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, index: number) => void
  isDragging: boolean
}

const SortableItem = ({ 
  id, 
  title, 
  category, 
  isShow, 
  onToggleVisibility, 
  index,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging
}: SortableItemProps) => {
  const categoryColors = {
    left: "border-blue-300 bg-blue-50 hover:bg-blue-100",
    right: "border-indigo-300 bg-indigo-50 hover:bg-indigo-100",
  }

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      className={`${isDragging ? "opacity-50 scale-105 z-50" : "opacity-100"}`}
    >
      <Card
        className={`p-4 mb-3 cursor-move transition-all duration-200 border-2 ${categoryColors[category as keyof typeof categoryColors]} ${isDragging ? "shadow-2xl" : "shadow-sm hover:shadow-md"}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors">
            <GripVertical className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
            <p className="text-xs text-gray-500 mt-1">
              Category: <span className="font-medium capitalize">{category}</span>
            </p>
          </div>
          <button
            onClick={() => onToggleVisibility(id)}
            className="flex-shrink-0 p-1.5 hover:bg-white rounded-lg transition-colors"
            aria-label={isShow ? "Hide item" : "Show item"}
          >
            {isShow ? <Eye className="w-5 h-5 text-gray-600" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
          </button>
          <div className="flex-shrink-0 text-xs font-medium text-gray-400">#{id}</div>
        </div>
      </Card>
    </div>
  )
}

const ClinicalNotesOrdering = () => {
  const [createClinicTemplate] = useCreateClinicalTemplateMutation();
  const [updateClinicTemplate] = useUpdateClinicalTemplateMutation();
  const { data: clinicalData } = useGetClinicTemplateQuery({});
  const token = useAppSelector(useCurrentToken);
  const decoded: { id: string } = jwtDecode(token);
  
  const [leftItems, setLeftItems] = useState([
    { id: "left-1", title: "Chief Complaint", category: "left", isShow: true },
    { id: "left-2", title: "On Examinations", category: "left", isShow: true },
    { id: "left-3", title: "Diagnosis", category: "left", isShow: true },
    { id: "left-4", title: "Investigation", category: "left", isShow: true },
    { id: "left-5", title: "History", category: "left", isShow: true },
    { id: "left-6", title: "Treatment Plan", category: "left", isShow: true },
    { id: "left-7", title: "Co Morbidities", category: "left", isShow: true },
  ])

  const [rightItems, setRightItems] = useState([
    { id: "right-1", title: "Medicine", category: "right", isShow: true },
    { id: "right-2", title: "Advice", category: "right", isShow: true },
    { id: "right-3", title: "Next Visit", category: "right", isShow: true },
  ])

  const [draggedLeftIndex, setDraggedLeftIndex] = useState<number | null>(null)
  const [draggedRightIndex, setDraggedRightIndex] = useState<number | null>(null)

  const handleLeftDragStart = (e: React.DragEvent, index: number) => {
    setDraggedLeftIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleRightDragStart = (e: React.DragEvent, index: number) => {
    setDraggedRightIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleLeftDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedLeftIndex === null || draggedLeftIndex === dropIndex) return

    const newItems = [...leftItems]
    const [draggedItem] = newItems.splice(draggedLeftIndex, 1)
    newItems.splice(dropIndex, 0, draggedItem)
    setLeftItems(newItems)
    setDraggedLeftIndex(null)

    console.log("Left Section Reordered:", {
      category: "left",
      items: newItems.map((item, index) => ({
        id: item.id,
        title: item.title,
        order: index + 1,
      })),
    })
  }

  const handleRightDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedRightIndex === null || draggedRightIndex === dropIndex) return

    const newItems = [...rightItems]
    const [draggedItem] = newItems.splice(draggedRightIndex, 1)
    newItems.splice(dropIndex, 0, draggedItem)
    setRightItems(newItems)
    setDraggedRightIndex(null)

    console.log("Right Section Reordered:", {
      category: "right",
      items: newItems.map((item, index) => ({
        id: item.id,
        title: item.title,
        order: index + 1,
      })),
    })
  }

  const handleSaveOrder = async () => {
    const finalOrder = {
      leftSection: leftItems.map((item, index) => ({
        title: item.title,
        category: item.category,
        order: index + 1,
        isShow: item.isShow
      })),
      rightSection: rightItems.map((item, index) => ({
        title: item.title,
        category: item.category,
        order: index + 1,
        isShow: item.isShow
      })),
    }

    const payload = {
      doctorId: decoded?.id,
      notes: [...finalOrder.leftSection, ...finalOrder.rightSection],
    };

    try {
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
      }
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("Failed to save order!");
    }
  }

  const handleToggleLeftItemVisibility = (id: string) => {
    setLeftItems(leftItems.map((item) => (item.id === id ? { ...item, isShow: !item.isShow } : item)))
  }

  const handleToggleRightItemVisibility = (id: string) => {
    setRightItems(rightItems.map((item) => (item.id === id ? { ...item, isShow: !item.isShow } : item)))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-3 sm:py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mt-6 mb-6 sm:mt-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Clinical Notes Ordering</h1>
              <p className="text-sm sm:text-base text-gray-600">Drag and drop to reorder items within each section</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveOrder}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                Save Order
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Patient Assessment</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 min-h-[400px]">
              <p className="text-xs text-gray-500 mb-4 flex items-center gap-2">
                <GripVertical className="w-4 h-4" />
                Drag items to reorder
              </p>
              {leftItems.map((item, index) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  category={item.category}
                  isShow={item.isShow}
                  onToggleVisibility={handleToggleLeftItemVisibility}
                  index={index}
                  onDragStart={handleLeftDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleLeftDrop}
                  isDragging={draggedLeftIndex === index}
                />
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-10 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full"></div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Treatment & Follow-up</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 min-h-[400px]">
              <p className="text-xs text-gray-500 mb-4 flex items-center gap-2">
                <GripVertical className="w-4 h-4" />
                Drag items to reorder
              </p>
              {rightItems.map((item, index) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  category={item.category}
                  isShow={item.isShow}
                  onToggleVisibility={handleToggleRightItemVisibility}
                  index={index}
                  onDragStart={handleRightDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleRightDrop}
                  isDragging={draggedRightIndex === index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClinicalNotesOrdering