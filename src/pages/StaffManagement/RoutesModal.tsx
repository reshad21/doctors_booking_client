"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SquarePlus } from "lucide-react";
import type { RouteAccess } from "@/types/staff.types";

interface Permission {
  name: string;
  selected: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  view: boolean;
}

const initialPermissions: Permission[] = [
  {
    name: "Dashboard",
    selected: true,
    create: true,
    edit: true,
    delete: true,
    view: true,
  },
  {
    name: "Patient",
    selected: false,
    create: false,
    edit: false,
    delete: false,
    view: false,
  },
  {
    name: "Appointment",
    selected: false,
    create: false,
    edit: false,
    delete: false,
    view: false,
  },
  {
    name: "Prescription",
    selected: false,
    create: false,
    edit: false,
    delete: false,
    view: false,
  },
  {
    name: "Chamber",
    selected: false,
    create: false,
    edit: false,
    delete: false,
    view: false,
  },
  {
    name: "Notice",
    selected: false,
    create: false,
    edit: false,
    delete: false,
    view: false,
  },
  {
    name: "Service Details",
    selected: false,
    create: false,
    edit: false,
    delete: false,
    view: false,
  },
  {
    name: "Video",
    selected: false,
    create: false,
    edit: false,
    delete: false,
    view: false,
  },
];

export default function RoutesModal({
  routesAccess,
}: {
  routesAccess: RouteAccess;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [permissions, setPermissions] =
    useState<Permission[]>(initialPermissions);

  console.log(routesAccess);

  const updatePermission = (
    index: number,
    field: keyof Omit<Permission, "name">,
    value: boolean
  ) => {
    const newPermissions = [...permissions];
    newPermissions[index] = { ...newPermissions[index], [field]: value };
    setPermissions(newPermissions);
  };

  const toggleRouteSelection = (index: number, selected: boolean) => {
    const newPermissions = [...permissions];
    newPermissions[index] = {
      ...newPermissions[index],
      selected,
      create: selected,
      edit: selected,
      delete: selected,
      view: selected,
    };
    setPermissions(newPermissions);
  };

  const handleSave = () => {
    console.log("Saving permissions:", permissions);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-center">
      <div
        onClick={() => setIsOpen(true)}
        className=" hover:bg-green-50 no-border cursor-pointer"
      >
        <SquarePlus className="h-5 w-5 text-[#14400D]" />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-2xl p-0 bg-white w-full max-h-[85vh] rounded overflow-hidden">
          <DialogHeader className="px-4 py-3 border-b">
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Permission
            </DialogTitle>
          </DialogHeader>

          <div className="px-4 pb-4 overflow-hidden">
            <div className="bg-[#E3E3E3] overflow-hidden rounded">
              {/* Header Row - Desktop */}
              <div className="hidden sm:grid sm:grid-cols-5 gap-3 p-3 bg-gray-200 font-medium text-gray-700 text-sm">
                <div>Name</div>
                <div className="text-center">Create</div>
                <div className="text-center">Edit</div>
                <div className="text-center">Delete</div>
                <div className="text-center">View</div>
              </div>

              {/* Permission Rows - scrollable area */}
              <div className="max-h-60 overflow-y-auto">
                {permissions.map((permission, index) => (
                  <div
                    key={permission.name}
                    className="border-b border-gray-300 last:border-b-0 bg-white"
                  >
                    {/* Desktop Layout */}
                    <div className="hidden sm:grid sm:grid-cols-5 gap-3 py-3 pl-1 text-sm items-center">
                      <div className="flex items-center gap-2 min-w-0">
                        <Checkbox
                          checked={permission.selected}
                          onCheckedChange={(checked) =>
                            toggleRouteSelection(index, checked as boolean)
                          }
                          className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 flex-shrink-0"
                        />
                        <span className="text-gray-800 truncate">
                          {permission.name}
                        </span>
                      </div>
                      <div className="flex justify-center">
                        <Checkbox
                          checked={permission.create}
                          disabled={true}
                          onCheckedChange={(checked) =>
                            updatePermission(
                              index,
                              "create",
                              checked as boolean
                            )
                          }
                          className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 disabled:opacity-50"
                        />
                      </div>
                      <div className="flex justify-center">
                        <Checkbox
                          checked={permission.edit}
                          disabled={true}
                          onCheckedChange={(checked) =>
                            updatePermission(index, "edit", checked as boolean)
                          }
                          className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 disabled:opacity-50"
                        />
                      </div>
                      <div className="flex justify-center">
                        <Checkbox
                          checked={permission.delete}
                          disabled={true}
                          onCheckedChange={(checked) =>
                            updatePermission(
                              index,
                              "delete",
                              checked as boolean
                            )
                          }
                          className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 disabled:opacity-50"
                        />
                      </div>
                      <div className="flex justify-center">
                        <Checkbox
                          checked={permission.view}
                          disabled={true}
                          onCheckedChange={(checked) =>
                            updatePermission(index, "view", checked as boolean)
                          }
                          className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="sm:hidden p-3 text-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <Checkbox
                          checked={permission.selected}
                          onCheckedChange={(checked) =>
                            toggleRouteSelection(index, checked as boolean)
                          }
                          className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 flex-shrink-0"
                        />
                        <span className="text-gray-800 font-medium">
                          {permission.name}
                        </span>
                      </div>

                      {permission.selected && (
                        <div className="ml-6 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Create</span>
                            <Checkbox
                              checked={permission.create}
                              onCheckedChange={(checked) =>
                                updatePermission(
                                  index,
                                  "create",
                                  checked as boolean
                                )
                              }
                              className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Edit</span>
                            <Checkbox
                              checked={permission.edit}
                              onCheckedChange={(checked) =>
                                updatePermission(
                                  index,
                                  "edit",
                                  checked as boolean
                                )
                              }
                              className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Delete</span>
                            <Checkbox
                              checked={permission.delete}
                              onCheckedChange={(checked) =>
                                updatePermission(
                                  index,
                                  "delete",
                                  checked as boolean
                                )
                              }
                              className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">View</span>
                            <Checkbox
                              checked={permission.view}
                              onCheckedChange={(checked) =>
                                updatePermission(
                                  index,
                                  "view",
                                  checked as boolean
                                )
                              }
                              className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4 px-1">
              <Button
                onClick={handleSave}
                className="bg-green-700 hover:bg-green-800 cursor-pointer text-white px-6 py-2 w-full sm:w-auto"
              >
                Save
              </Button>
              <Button
                onClick={handleClose}
                className="bg-red-600 hover:bg-red-700 cursor-pointer text-white px-6 py-2 w-full sm:w-auto"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
