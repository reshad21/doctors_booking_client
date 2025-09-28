import React, { useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateHeaderField } from "@/redux/slices/prescriptionTemplateSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import RichTextEditor from "@/components/shared/RichTextEditor";
import BaseImageUpload from "@/components/shared/BaseImageUpload";
import {
  FileText,
  Globe,
  Languages,
  Image as ImageIcon,
  Eye,
  Settings,
} from "lucide-react";

interface HeaderFormData {
  doctorInfoBangla: string;
  doctorInfoEnglish: string;
  showLogo: boolean;
  showPrescriptionInBangla: boolean;
  showPrescriptionInEnglish: boolean;
  showPrescriptionHeader: boolean;
}

type HeaderFieldValue =
  | string
  | boolean
  | {
      name: string;
      size: number;
      type: string;
      base64: string;
    }
  | null;

const HeaderSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { headerSection } = useAppSelector(
    (state) => state.prescriptionTemplate
  );

  const { control, watch, setValue } = useForm<HeaderFormData>({
    defaultValues: {
      doctorInfoBangla: headerSection.doctorInfoBangla,
      doctorInfoEnglish: headerSection.doctorInfoEnglish,
      showLogo: headerSection.showLogo,
      showPrescriptionInBangla: headerSection.showPrescriptionInBangla,
      showPrescriptionInEnglish: headerSection.showPrescriptionInEnglish,
      showPrescriptionHeader: headerSection.showPrescriptionHeader,
    },
  });

  // Watch all form values for real-time updates
  const watchedValues = watch();

  const handleFieldUpdate = useCallback(
    (field: keyof typeof headerSection, value: HeaderFieldValue) => {
      dispatch(updateHeaderField({ field, value }));
    },
    [dispatch]
  );

  const handleRichTextChange = useCallback(
    (field: "doctorInfoBangla" | "doctorInfoEnglish", content: string) => {
      setValue(field, content);
      handleFieldUpdate(field, content);
    },
    [setValue, handleFieldUpdate]
  );

  const handleLogoChange = useCallback(
    (file: File | null) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          handleFieldUpdate("logo", base64);
          handleFieldUpdate("logoFile", {
            name: file.name,
            size: file.size,
            type: file.type,
            base64: base64,
          });
        };
        reader.readAsDataURL(file);
      } else {
        handleFieldUpdate("logo", "");
        handleFieldUpdate("logoFile", null);
      }
    },
    [handleFieldUpdate]
  );

  const handleToggleChange = useCallback(
    (field: keyof HeaderFormData, value: boolean) => {
      setValue(field, value);
      handleFieldUpdate(field, value);
    },
    [setValue, handleFieldUpdate]
  );

  return (
    <div className="min-h-[600px] p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Header Configuration
          </h1>
          <p className="text-gray-600">
            Configure your prescription template header with doctor information
            and logo
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Panel - Doctor Information Forms */}
          <div className="xl:col-span-2 space-y-6">
            {/* Doctor Information in Bangla */}
            <Card className="shadow-xl border-0 overflow-hidden pt-0">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4">
                <CardTitle className="flex items-center gap-3">
                  <Languages className="h-6 w-6" />
                  Doctor Information (বাংলা)
                  <Badge
                    variant={
                      watchedValues.showPrescriptionInBangla
                        ? "secondary"
                        : "outline"
                    }
                    className={
                      watchedValues.showPrescriptionInBangla
                        ? "bg-white text-emerald-600"
                        : "bg-emerald-400 text-white border-white"
                    }
                  >
                    {watchedValues.showPrescriptionInBangla
                      ? "Enabled"
                      : "Disabled"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Controller
                    name="showPrescriptionInBangla"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <Label
                          htmlFor="showBangla"
                          className="text-sm font-medium text-emerald-800 flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          Display Bangla Information
                        </Label>
                        <Switch
                          id="showBangla"
                          checked={field.value}
                          onCheckedChange={(value) => {
                            field.onChange(value);
                            handleToggleChange(
                              "showPrescriptionInBangla",
                              value
                            );
                          }}
                          className="data-[state=checked]:bg-emerald-500"
                        />
                      </div>
                    )}
                  />

                  {watchedValues.showPrescriptionInBangla && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Doctor Information Content (বাংলায়)
                      </Label>
                      <div className="border-2 border-emerald-200 rounded-lg overflow-hidden">
                        <RichTextEditor
                          content={headerSection.doctorInfoBangla}
                          onChange={(content) =>
                            handleRichTextChange("doctorInfoBangla", content)
                          }
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Add your doctor information, qualifications, and
                        specializations in Bengali
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Doctor Information in English */}
            <Card className="shadow-xl border-0 overflow-hidden pt-0">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
                <CardTitle className="flex items-center gap-3">
                  <Globe className="h-6 w-6" />
                  Doctor Information (English)
                  <Badge
                    variant={
                      watchedValues.showPrescriptionInEnglish
                        ? "secondary"
                        : "outline"
                    }
                    className={
                      watchedValues.showPrescriptionInEnglish
                        ? "bg-white text-blue-600"
                        : "bg-blue-400 text-white border-white"
                    }
                  >
                    {watchedValues.showPrescriptionInEnglish
                      ? "Enabled"
                      : "Disabled"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Controller
                    name="showPrescriptionInEnglish"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <Label
                          htmlFor="showEnglish"
                          className="text-sm font-medium text-blue-800 flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Display English Information
                        </Label>
                        <Switch
                          id="showEnglish"
                          checked={field.value}
                          onCheckedChange={(value) => {
                            field.onChange(value);
                            handleToggleChange(
                              "showPrescriptionInEnglish",
                              value
                            );
                          }}
                          className="data-[state=checked]:bg-blue-500"
                        />
                      </div>
                    )}
                  />

                  {watchedValues.showPrescriptionInEnglish && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Doctor Information Content (English)
                      </Label>
                      <div className="border-2 border-blue-200 rounded-lg overflow-hidden">
                        <RichTextEditor
                          content={headerSection.doctorInfoEnglish}
                          onChange={(content) =>
                            handleRichTextChange("doctorInfoEnglish", content)
                          }
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Add your doctor information, qualifications, and
                        specializations in English
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Logo Upload and Settings */}
          <div className="space-y-6">
            {/* Logo Upload */}
            <Card className="shadow-xl border-0 overflow-hidden pt-0">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4">
                <CardTitle className="flex items-center gap-3">
                  <ImageIcon className="h-6 w-6" />
                  Logo Upload
                  <Badge
                    variant={watchedValues.showLogo ? "secondary" : "outline"}
                    className={
                      watchedValues.showLogo
                        ? "bg-white text-purple-600"
                        : "bg-purple-400 text-white border-white"
                    }
                  >
                    {watchedValues.showLogo ? "Enabled" : "Disabled"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Controller
                    name="showLogo"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <Label
                          htmlFor="showLogo"
                          className="text-sm font-medium text-purple-800 flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Display Logo
                        </Label>
                        <Switch
                          id="showLogo"
                          checked={field.value}
                          onCheckedChange={(value) => {
                            field.onChange(value);
                            handleToggleChange("showLogo", value);
                          }}
                          className="data-[state=checked]:bg-purple-500"
                        />
                      </div>
                    )}
                  />

                  {watchedValues.showLogo && (
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Upload Logo Image
                      </Label>
                      <BaseImageUpload
                        classname="min-h-[120px] border-2 border-dashed border-purple-300 bg-purple-50 hover:bg-purple-100 transition-colors"
                        onFileChange={handleLogoChange}
                        defaultImage={headerSection.logo}
                      />
                      {headerSection.logoFile && (
                        <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="text-sm text-purple-700">
                            <span className="font-medium">File:</span>{" "}
                            {headerSection.logoFile.name}
                          </p>
                          <p className="text-sm text-purple-700">
                            <span className="font-medium">Size:</span>{" "}
                            {(headerSection.logoFile.size / 1024).toFixed(1)} KB
                          </p>
                          <p className="text-sm text-purple-700">
                            <span className="font-medium">Type:</span>{" "}
                            {headerSection.logoFile.type}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        Upload a high-quality logo image. Recommended size:
                        200x200px or larger.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Additional Settings */}
            <Card className="shadow-xl border-0 overflow-hidden pt-0">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4">
                <CardTitle className="flex items-center gap-3">
                  <Settings className="h-6 w-6" />
                  Header Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Controller
                    name="showPrescriptionHeader"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                        <Label
                          htmlFor="showHeader"
                          className="text-sm font-medium text-indigo-800 flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          Show Prescription Header
                        </Label>
                        <Switch
                          id="showHeader"
                          checked={field.value}
                          onCheckedChange={(value) => {
                            field.onChange(value);
                            handleToggleChange("showPrescriptionHeader", value);
                          }}
                          className="data-[state=checked]:bg-indigo-500"
                        />
                      </div>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Live Preview Summary */}
            <Card className="shadow-xl border-0 overflow-hidden pt-0">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4">
                <CardTitle className="flex items-center gap-3">
                  <Eye className="h-6 w-6" />
                  Configuration Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Bangla Info:</span>
                    <Badge
                      variant={
                        watchedValues.showPrescriptionInBangla
                          ? "default"
                          : "secondary"
                      }
                      className={
                        watchedValues.showPrescriptionInBangla
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }
                    >
                      {watchedValues.showPrescriptionInBangla
                        ? "Enabled"
                        : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">English Info:</span>
                    <Badge
                      variant={
                        watchedValues.showPrescriptionInEnglish
                          ? "default"
                          : "secondary"
                      }
                      className={
                        watchedValues.showPrescriptionInEnglish
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }
                    >
                      {watchedValues.showPrescriptionInEnglish
                        ? "Enabled"
                        : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Logo:</span>
                    <Badge
                      variant={
                        watchedValues.showLogo && headerSection.logo
                          ? "default"
                          : "secondary"
                      }
                      className={
                        watchedValues.showLogo && headerSection.logo
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }
                    >
                      {watchedValues.showLogo && headerSection.logo
                        ? "Uploaded"
                        : "Not Set"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-sm">
                      Header Display:
                    </span>
                    <Badge
                      variant={
                        watchedValues.showPrescriptionHeader
                          ? "default"
                          : "secondary"
                      }
                      className={
                        watchedValues.showPrescriptionHeader
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }
                    >
                      {watchedValues.showPrescriptionHeader
                        ? "Enabled"
                        : "Disabled"}
                    </Badge>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Content Status
                  </p>
                  <div className="flex justify-center gap-2">
                    <Badge
                      variant={
                        headerSection.doctorInfoBangla ? "default" : "outline"
                      }
                      className={
                        headerSection.doctorInfoBangla ? "bg-blue-500" : ""
                      }
                    >
                      Bangla:{" "}
                      {headerSection.doctorInfoBangla ? "Added" : "Empty"}
                    </Badge>
                    <Badge
                      variant={
                        headerSection.doctorInfoEnglish ? "default" : "outline"
                      }
                      className={
                        headerSection.doctorInfoEnglish ? "bg-blue-500" : ""
                      }
                    >
                      English:{" "}
                      {headerSection.doctorInfoEnglish ? "Added" : "Empty"}
                    </Badge>
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

export default HeaderSection;
