import { useState, type ReactNode } from "react";
import { X, Search } from "lucide-react";
import type { Tag } from "@/types/new-prescription.types";

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  showSearch?: boolean;
  tags?: Tag[];
  onTagSelect?: (tag: Tag) => void;
  searchPlaceholder?: string;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showSearch = false,
  tags = [],
  onTagSelect,
  searchPlaceholder = "Search...",
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredTags = tags.filter(
    (tag) =>
      tag.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tag.category &&
        tag.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {showSearch && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {tags.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Quick Select:
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {filteredTags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => onTagSelect?.(tag)}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                      >
                        {tag.label}
                        {tag.category && (
                          <span className="ml-1 text-blue-600">
                            ({tag.category})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {filteredTags.length === 0 && searchQuery && (
                    <p className="text-sm text-gray-500 italic">
                      No tags found matching "{searchQuery}"
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};
