import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Printer, Ruler, Settings, Eye, MapPin } from "lucide-react";
import { useGetChambersQuery } from "@/redux/api/chamber/chamber";

// Define Chamber interface
interface Chamber {
  id: string;
  address: string;
  // Add other chamber properties as needed
}

interface PageSettings {
  pageType: "a4" | "custom";
  chamberId: string;
  totalHeight: number;
  totalWidth: number;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
}

const PageSetup: React.FC = () => {
  const { data: chambers, isLoading: isLoadingChambers } = useGetChambersQuery(
    {}
  );
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    pageType: "a4",
    chamberId: "",
    totalHeight: 11.7,
    totalWidth: 8.3,
    leftMargin: 0.5,
    rightMargin: 0.5,
    topMargin: 0.5,
    bottomMargin: 0.5,
  });

  const { register, watch, setValue, handleSubmit, control } =
    useForm<PageSettings>({
      defaultValues: pageSettings,
    });

  // Watch specific fields instead of the entire form object
  const watchedPageType = watch("pageType");
  const watchedChamberId = watch("chamberId");
  const watchedTotalHeight = watch("totalHeight");
  const watchedTotalWidth = watch("totalWidth");
  const watchedLeftMargin = watch("leftMargin");
  const watchedRightMargin = watch("rightMargin");
  const watchedTopMargin = watch("topMargin");
  const watchedBottomMargin = watch("bottomMargin");

  // Update state when form values change for real-time preview
  useEffect(() => {
    setPageSettings({
      pageType: watchedPageType,
      chamberId: watchedChamberId,
      totalHeight: watchedTotalHeight,
      totalWidth: watchedTotalWidth,
      leftMargin: watchedLeftMargin,
      rightMargin: watchedRightMargin,
      topMargin: watchedTopMargin,
      bottomMargin: watchedBottomMargin,
    });
  }, [
    watchedPageType,
    watchedChamberId,
    watchedTotalHeight,
    watchedTotalWidth,
    watchedLeftMargin,
    watchedRightMargin,
    watchedTopMargin,
    watchedBottomMargin,
  ]);

  const handlePageTypeChange = (type: "a4" | "custom") => {
    if (type === "a4") {
      // Standard A4 dimensions in inches
      setValue("pageType", "a4");
      setValue("totalHeight", 11.7);
      setValue("totalWidth", 8.3);
      setValue("leftMargin", 0.5);
      setValue("rightMargin", 0.5);
      setValue("topMargin", 0.5);
      setValue("bottomMargin", 0.5);
    } else {
      setValue("pageType", "custom");
      // Dr. Prescription Pad common dimensions
      setValue("totalHeight", 8.5);
      setValue("totalWidth", 5.5);
      setValue("leftMargin", 0.3);
      setValue("rightMargin", 0.3);
      setValue("topMargin", 0.4);
      setValue("bottomMargin", 0.4);
    }
  };

  const onSubmit = (data: PageSettings) => {
    console.log("Page settings:", data);
  };

  // Calculate preview dimensions (scaled down for display)
  const previewScale = 0.1; // Increased scale for better visibility
  const previewWidth = Math.max(
    pageSettings.totalWidth * 96 * previewScale,
    60
  );
  const previewHeight = Math.max(
    pageSettings.totalHeight * 96 * previewScale,
    80
  );
  const previewLeftMargin = pageSettings.leftMargin * 96 * previewScale;
  const previewRightMargin = pageSettings.rightMargin * 96 * previewScale;
  const previewTopMargin = pageSettings.topMargin * 96 * previewScale;
  const previewBottomMargin = pageSettings.bottomMargin * 96 * previewScale;

  return (
    <div className="min-h-[600px] p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Page Setup Configuration
          </h1>
          <p className="text-gray-600">
            Configure your prescription template page dimensions and margins
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Panel - Settings */}
          <div className="space-y-6">
            {/* Page Type Selection */}
            <Card className="shadow-xl border-0 overflow-hidden pt-0">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white pt-2">
                <CardTitle className="flex items-center gap-3">
                  <Printer className="h-6 w-6" />
                  Choose Page Type
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={
                      pageSettings.pageType === "a4" ? "default" : "outline"
                    }
                    className={`h-24 flex flex-col gap-3 transition-all duration-300 ${
                      pageSettings.pageType === "a4"
                        ? "bg-green-500 hover:bg-green-600 shadow-lg scale-105"
                        : "hover:bg-green-50 hover:border-green-300"
                    }`}
                    onClick={() => handlePageTypeChange("a4")}
                  >
                    <FileText className="h-8 w-8" />
                    <div className="text-center">
                      <span className="font-semibold">A4 Paper</span>
                      <div className="text-xs opacity-75">8.3" × 11.7"</div>
                    </div>
                  </Button>
                  <Button
                    type="button"
                    variant={
                      pageSettings.pageType === "custom" ? "default" : "outline"
                    }
                    className={`h-24 flex flex-col gap-3 transition-all duration-300 ${
                      pageSettings.pageType === "custom"
                        ? "bg-green-500 hover:bg-green-600 shadow-lg scale-105"
                        : "hover:bg-green-50 hover:border-green-300"
                    }`}
                    onClick={() => handlePageTypeChange("custom")}
                  >
                    <Ruler className="h-8 w-8" />
                    <div className="text-center">
                      <span className="font-semibold">
                        Dr. Prescription Pad
                      </span>
                      <div className="text-xs opacity-75">Custom Size</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Page Measurements */}
            <Card className="shadow-xl border-0 overflow-hidden pt-0">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white pt-2">
                <CardTitle className="flex items-center gap-3">
                  <Settings className="h-6 w-6" />
                  Page Measurements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Page Dimensions */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      Page Dimensions (inches)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="totalHeight"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Total Height
                        </Label>
                        <Input
                          id="totalHeight"
                          type="number"
                          step="0.1"
                          {...register("totalHeight", {
                            valueAsNumber: true,
                            min: 1,
                            max: 20,
                          })}
                          disabled={pageSettings.pageType === "a4"}
                          className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          placeholder="11.7"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="totalWidth"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Total Width
                        </Label>
                        <Input
                          id="totalWidth"
                          type="number"
                          step="0.1"
                          {...register("totalWidth", {
                            valueAsNumber: true,
                            min: 1,
                            max: 20,
                          })}
                          disabled={pageSettings.pageType === "a4"}
                          className="focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          placeholder="8.3"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Margins */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      Margins (inches)
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="leftMargin"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Left Margin
                        </Label>
                        <Input
                          id="leftMargin"
                          type="number"
                          step="0.1"
                          {...register("leftMargin", {
                            valueAsNumber: true,
                            min: 0,
                            max: 5,
                          })}
                          className="focus:ring-2 focus:ring-green-500 transition-all duration-200"
                          placeholder="0.5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="rightMargin"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Right Margin
                        </Label>
                        <Input
                          id="rightMargin"
                          type="number"
                          step="0.1"
                          {...register("rightMargin", {
                            valueAsNumber: true,
                            min: 0,
                            max: 5,
                          })}
                          className="focus:ring-2 focus:ring-green-500 transition-all duration-200"
                          placeholder="0.5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="topMargin"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Top Margin
                        </Label>
                        <Input
                          id="topMargin"
                          type="number"
                          step="0.1"
                          {...register("topMargin", {
                            valueAsNumber: true,
                            min: 0,
                            max: 5,
                          })}
                          className="focus:ring-2 focus:ring-green-500 transition-all duration-200"
                          placeholder="0.5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="bottomMargin"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Bottom Margin
                        </Label>
                        <Input
                          id="bottomMargin"
                          type="number"
                          step="0.1"
                          {...register("bottomMargin", {
                            valueAsNumber: true,
                            min: 0,
                            max: 5,
                          })}
                          className="focus:ring-2 focus:ring-green-500 transition-all duration-200"
                          placeholder="0.5"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Chamber Selection */}
            <Card className="shadow-xl border-0 overflow-hidden pt-0">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white pt-2">
                <CardTitle className="flex items-center gap-3">
                  <MapPin className="h-6 w-6" />
                  Select Chamber
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="chamberId"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    Chamber Location
                  </Label>
                  <Controller
                    name="chamberId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full focus:ring-2 focus:ring-indigo-500">
                          <SelectValue placeholder="Select a chamber location" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingChambers ? (
                            <SelectItem value="" disabled>
                              Loading chambers...
                            </SelectItem>
                          ) : chambers?.data?.length > 0 ? (
                            chambers.data.map((chamber: Chamber) => (
                              <SelectItem key={chamber.id} value={chamber.id}>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-indigo-500" />
                                  {chamber.address}
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="" disabled>
                              No chambers available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {pageSettings.chamberId && (
                    <div className="mt-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                      <p className="text-sm text-indigo-700">
                        <span className="font-medium">Selected Chamber:</span>{" "}
                        {
                          chambers?.data?.find(
                            (c: Chamber) => c.id === pageSettings.chamberId
                          )?.address
                        }
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Real-time Preview */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 overflow-hidden pt-0">
              <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white pt-2">
                <CardTitle className="flex items-center gap-3">
                  <Eye className="h-6 w-6" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="flex flex-col items-center space-y-6">
                  {/* Dimensions Display */}
                  <div className="text-center bg-white rounded-lg p-4 shadow-sm w-full">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-500">Width</span>
                        <span className="font-bold text-lg text-blue-600">
                          {pageSettings.totalWidth}"
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500">Height</span>
                        <span className="font-bold text-lg text-blue-600">
                          {pageSettings.totalHeight}"
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Page Preview */}
                  <div className="relative mb-10 mt-4">
                    <div
                      className="bg-white border-2 border-gray-400 shadow-2xl relative mx-auto"
                      style={{
                        width: `${previewWidth}px`,
                        height: `${previewHeight}px`,
                        minWidth: "120px",
                        minHeight: "160px",
                      }}
                    >
                      {/* Content Area */}
                      <div
                        className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-400 relative transition-all duration-300"
                        style={{
                          margin: `${previewTopMargin}px ${previewRightMargin}px ${previewBottomMargin}px ${previewLeftMargin}px`,
                          height: `${Math.max(previewHeight - previewTopMargin - previewBottomMargin, 20)}px`,
                          width: `${Math.max(previewWidth - previewLeftMargin - previewRightMargin, 20)}px`,
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <FileText className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                            <span className="text-xs text-blue-600 font-medium block">
                              Prescription
                            </span>
                            <span className="text-xs text-blue-600 font-medium">
                              Area
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Margin Labels */}
                      <div className="absolute -top-8 left-0 right-0 text-center">
                        <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded shadow">
                          Top: {pageSettings.topMargin}"
                        </span>
                      </div>
                      <div className="absolute -bottom-8 left-0 right-0 text-center">
                        <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded shadow">
                          Bottom: {pageSettings.bottomMargin}"
                        </span>
                      </div>
                      <div className="absolute -left-20 top-1/2 transform -translate-y-1/2">
                        <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded shadow transform -rotate-90 whitespace-nowrap">
                          Left: {pageSettings.leftMargin}"
                        </span>
                      </div>
                      <div className="absolute -right-20 top-1/2 transform -translate-y-1/2">
                        <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded shadow transform rotate-90 whitespace-nowrap">
                          Right: {pageSettings.rightMargin}"
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Settings Summary */}
                  <div className="w-full bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Current Configuration
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 text-sm">
                          Page Type:
                        </span>
                        <span
                          className={`font-medium text-sm px-2 py-1 rounded-full ${
                            pageSettings.pageType === "a4"
                              ? "bg-green-100 text-green-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {pageSettings.pageType === "a4"
                            ? "A4 Standard"
                            : "Custom Prescription Pad"}
                        </span>
                      </div>
                      {pageSettings.chamberId && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600 text-sm">
                            Chamber:
                          </span>
                          <span className="font-medium text-sm px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 max-w-[200px] truncate">
                            {chambers?.data?.find(
                              (c: Chamber) => c.id === pageSettings.chamberId
                            )?.address || "Unknown"}
                          </span>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dimensions:</span>
                          <span className="font-medium">
                            {pageSettings.totalWidth}" ×{" "}
                            {pageSettings.totalHeight}"
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Content Area:</span>
                          <span className="font-medium">
                            {(
                              pageSettings.totalWidth -
                              pageSettings.leftMargin -
                              pageSettings.rightMargin
                            ).toFixed(1)}
                            " ×
                            {(
                              pageSettings.totalHeight -
                              pageSettings.topMargin -
                              pageSettings.bottomMargin
                            ).toFixed(1)}
                            "
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageSetup;
