import React from "react"
import { X, Search as SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

type SearchProps = {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

type ToggleProps = {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  maxWidthClass?: string
  title?: string
  search?: false | true | Partial<SearchProps>
  prescriptionToggle?: false | true | Partial<ToggleProps>
  children?: React.ReactNode
}

const ModalCore: React.FC<ModalProps> & {
  Header: React.FC<{ children?: React.ReactNode }>
  Body: React.FC<{ children?: React.ReactNode }>
  Footer: React.FC<{ children?: React.ReactNode }>
} = ({ isOpen, onClose, maxWidthClass = "max-w-4xl", title, search = false, prescriptionToggle = false, children }) => {
  if (!isOpen) return null

  const renderSearchAndToggle = () => {
    if (!search && !prescriptionToggle) return null

    const renderSearchInner = () => {
      if (!search) return null
      if (search === true) {
        return (
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input className="pl-10 pr-4 py-2 w-full" placeholder="Search..." />
          </div>
        )
      }
      const s = search as SearchProps
      return (
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input value={s.value} onChange={(e) => s.onChange(e.target.value)} className="pl-10 pr-4 py-2 w-full" placeholder={s.placeholder ?? "Search..."} />
        </div>
      )
    }

    const renderToggleInner = () => {
      if (!prescriptionToggle) return null
      if (prescriptionToggle === true) {
        return (
          <div className="flex items-center gap-2">
            <Checkbox id="show-presc" checked={true} onCheckedChange={() => {}} />
            <label htmlFor="show-presc" className="text-sm font-medium text-gray-700 cursor-pointer">Show in Prescription</label>
          </div>
        )
      }
      const t = prescriptionToggle as ToggleProps
      return (
        <div className="flex items-center gap-2">
          <Checkbox id="show-presc" checked={Boolean(t.checked)} onCheckedChange={(c) => t.onChange(Boolean(c))} />
          <label htmlFor="show-presc" className="text-sm font-medium text-gray-700 cursor-pointer">{t.label ?? "Show in Prescription"}</label>
        </div>
      )
    }

    return (
      <div className="p-4 pb-4 space-y-4">
        <div className="flex items-center gap-4">
          {renderSearchInner()}
          <div>{renderToggleInner()}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white rounded-lg shadow-xl w-full ${maxWidthClass} mx-4 z-10 max-h-[90vh] flex flex-col`}>
        {title && (
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
        )}
   
          {renderSearchAndToggle()}
          
          {children}
      </div>
    </div>
  )
}

ModalCore.Header = ({ children }) => <div className="flex items-center justify-between p-4 border-b">{children}</div>
ModalCore.Body = ({ children }) => <div className="p-4">{children}</div>
ModalCore.Footer = ({ children }) => <div className="flex justify-end gap-3 p-2 border-t bg-gray-50">{children}</div>

export default ModalCore
