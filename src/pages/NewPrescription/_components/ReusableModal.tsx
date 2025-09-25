"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search } from "lucide-react"
import { useState } from "react"

interface ModalField {
  id: string
  label: string
  type?: "text" | "textarea" | "date"
  placeholder?: string
  rows?: number
}

interface ModalConfig {
  title: string
  fields: ModalField[]
  buttonLabel: string
}

interface Tag {
  id: string
  label: string
  category?: string
}

interface ReusableModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Record<string, string>) => void
  config: ModalConfig
  formData: Record<string, string>
  onFormDataChange: (data: Record<string, string>) => void
  tags?: Tag[]
  showSearch?: boolean
  onTagSelect?: (tag: Tag) => void
  searchPlaceholder?: string
  customComponent?: React.ReactNode
}

const ReusableModal: React.FC<ReusableModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  config,
  formData,
  onFormDataChange,
  tags = [],
  showSearch = false,
  onTagSelect,
  searchPlaceholder = "Search...",
  customComponent,
}) => {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTags = tags.filter(
    (tag) =>
      tag.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tag.category && tag.category.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleInputChange = (fieldId: string, value: string) => {
    onFormDataChange({ ...formData, [fieldId]: value })
  }

  const handleSubmit = () => {
    onSubmit(formData)
  }

  const handleTagClick = (tag: Tag) => {
    if (onTagSelect) {
      onTagSelect(tag)
    }
  }

  const renderField = (field: ModalField) => {
    const commonProps = {
      id: field.id,
      value: formData[field.id] || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        handleInputChange(field.id, e.target.value),
      placeholder: field.placeholder,
    }

    switch (field.type) {
      case "textarea":
        return <Textarea {...commonProps} rows={field.rows || 3} />
      case "date":
        return (
          <Input {...commonProps} type="date" value={formData[field.id] || new Date().toISOString().split("T")[0]} />
        )
      default:
        return <Input {...commonProps} />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-800">{config.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {showSearch && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {tags.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Quick Select:</Label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {filteredTags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleTagClick(tag)}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
                      >
                        {tag.label}
                        {tag.category && <span className="ml-1 text-blue-600">({tag.category})</span>}
                      </button>
                    ))}
                  </div>
                  {filteredTags.length === 0 && searchQuery && (
                    <p className="text-sm text-gray-500 italic">No tags found matching "{searchQuery}"</p>
                  )}
                </div>
              )}
            </div>
          )}
          {customComponent ? (
            <div>{customComponent}</div>
          ) : (
            config.fields.map((field) => (
              <div key={field.id}>
                <Label htmlFor={field.id} className="mb-2">
                  {field.label}
                </Label>
                {renderField(field)}
              </div>
            ))
          )}
          <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700 cursor-pointer">
            {config.buttonLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ReusableModal
