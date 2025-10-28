import React, { useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateFooterField } from "@/redux/slices/prescriptionTemplateSlice";
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

interface FooterFormData {
  doctorInfoBangla: string;
  doctorInfoEnglish: string;
  showLogo: boolean;
  showPrescriptionInBangla: boolean;
  showPrescriptionInEnglish: boolean;
  showPrescriptionFooter: boolean;
}

type FooterFieldValue =
  | string
  | boolean
  | {
      name: string;
      size: number;
      type: string;
      base64: string;
    }
  | null;

const FooterSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { footerSection } = useAppSelector(
    (state) => state.prescriptionTemplate
  );

  const { control, watch, setValue } = useForm<FooterFormData>({
    defaultValues: {
      doctorInfoBangla: footerSection.doctorInfoBangla,
      doctorInfoEnglish: footerSection.doctorInfoEnglish,
      showLogo: footerSection.showLogo,
      showPrescriptionInBangla: footerSection.showPrescriptionInBangla,
      showPrescriptionInEnglish: footerSection.showPrescriptionInEnglish,
      showPrescriptionFooter: footerSection.showPrescriptionFooter,
    },
  });

  // Watch all form values for real-time updates
  const watchedValues = watch();

  const handleFieldUpdate = useCallback(
    (field: keyof typeof footerSection, value: FooterFieldValue) => {
      dispatch(updateFooterField({ field, value }));
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
    (field: keyof FooterFormData, value: boolean) => {
      setValue(field, value);
      handleFieldUpdate(field, value);
    },
    [setValue, handleFieldUpdate]
  );

  return (
    <div className="min-h-[600px] p-6 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto">
        {/* Footer Section Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Footer Configuration
          </h1>
          <p className="text-gray-600">
            Configure your prescription template footer with doctor information
            and logo
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Panel - Doctor Information Forms */}
          <div className="xl:col-span-2 space-y-6">
            {/* Doctor Information in Bangla */}
            <Card className="shadow-xl border-0 overflow-hidden pt-0">
              <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4">
                <CardTitle className="flex items-center gap-3">
                  <Languages className="h-6 w-6" />
                  Footer Information (বাংলা)
                  <Badge
                    variant={
                      watchedValues.showPrescriptionInBangla
                        ? "secondary"
                        : "outline"
                    }
                    className={
                      watchedValues.showPrescriptionInBangla
                        ? "bg-white text-teal-600"
                        : "bg-teal-400 text-white border-white"
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
                      <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg border border-teal-200">
                        <Label
                          htmlFor="showBangla"
                          className="text-sm font-medium text-teal-800 flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
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
                          className="data-[state=checked]:bg-teal-500"
                        />
                      </div>
                    )}
                  />

                  {watchedValues.showPrescriptionInBangla && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Footer Information Content (বাংলায়)
                      </Label>
                      <div className="border-2 border-teal-200 rounded-lg overflow-hidden">
                        <RichTextEditor
                          content={footerSection.doctorInfoBangla}
                          onChange={(content) =>
                            handleRichTextChange("doctorInfoBangla", content)
                          }
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Add footer information like clinic address, contact
                        details, or additional notes in Bengali
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Doctor Information in English */}
            <Card className="shadow-xl border-0 overflow-hidden pt-0">
              <CardHeader className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-4">
                <CardTitle className="flex items-center gap-3">
                  <Globe className="h-6 w-6" />
                  Footer Information (English)
                  <Badge
                    variant={
                      watchedValues.showPrescriptionInEnglish
                        ? "secondary"
                        : "outline"
                    }
                    className={
                      watchedValues.showPrescriptionInEnglish
                        ? "bg-white text-cyan-600"
                        : "bg-cyan-400 text-white border-white"
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
                      <div className="flex items-center justify-between p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                        <Label
                          htmlFor="showEnglish"
                          className="text-sm font-medium text-cyan-800 flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
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
                          className="data-[state=checked]:bg-cyan-500"
                        />
                      </div>
                    )}
                  />

                  {watchedValues.showPrescriptionInEnglish && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Footer Information Content (English)
                      </Label>
                      <div className="border-2 border-cyan-200 rounded-lg overflow-hidden">
                        <RichTextEditor
                          content={footerSection.doctorInfoEnglish}
                          onChange={(content) =>
                            handleRichTextChange("doctorInfoEnglish", content)
                          }
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Add footer information like clinic address, contact
                        details, or additional notes in English
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
              <CardHeader className="bg-gradient-to-r from-rose-500 to-rose-600 text-white p-4">
                <CardTitle className="flex items-center gap-3">
                  <ImageIcon className="h-6 w-6" />
                  Footer Logo
                  <Badge
                    variant={watchedValues.showLogo ? "secondary" : "outline"}
                    className={
                      watchedValues.showLogo
                        ? "bg-white text-rose-600"
                        : "bg-rose-400 text-white border-white"
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
                      <div className="flex items-center justify-between p-4 bg-rose-50 rounded-lg border border-rose-200">
                        <Label
                          htmlFor="showLogo"
                          className="text-sm font-medium text-rose-800 flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                          Display Footer Logo
                        </Label>
                        <Switch
                          id="showLogo"
                          checked={field.value}
                          onCheckedChange={(value) => {
                            field.onChange(value);
                            handleToggleChange("showLogo", value);
                          }}
                          className="data-[state=checked]:bg-rose-500"
                        />
                      </div>
                    )}
                  />

                  {watchedValues.showLogo && (
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Upload Footer Logo
                      </Label>
                      <BaseImageUpload
                        classname="min-h-[120px] border-2 border-dashed border-rose-300 bg-rose-50 hover:bg-rose-100 transition-colors"
                        onFileChange={handleLogoChange}
                        defaultImage={footerSection.logo}
                      />
                      {footerSection.logoFile && (
                        <div className="mt-3 p-3 bg-rose-50 rounded-lg border border-rose-200">
                          <p className="text-sm text-rose-700">
                            <span className="font-medium">File:</span>{" "}
                            {footerSection.logoFile.name}
                          </p>
                          <p className="text-sm text-rose-700">
                            <span className="font-medium">Size:</span>{" "}
                            {(footerSection.logoFile.size / 1024).toFixed(1)} KB
                          </p>
                          <p className="text-sm text-rose-700">
                            <span className="font-medium">Type:</span>{" "}
                            {footerSection.logoFile.type}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        Upload a logo for the footer section. This can be
                        different from the header logo.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Additional Settings */}
            <Card className="shadow-xl border-0 overflow-hidden pt-0">
              <CardHeader className="bg-gradient-to-r from-violet-500 to-violet-600 text-white p-4">
                <CardTitle className="flex items-center gap-3">
                  <Settings className="h-6 w-6" />
                  Footer Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Controller
                    name="showPrescriptionFooter"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center justify-between p-4 bg-violet-50 rounded-lg border border-violet-200">
                        <Label
                          htmlFor="showFooter"
                          className="text-sm font-medium text-violet-800 flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                          Show Prescription Footer
                        </Label>
                        <Switch
                          id="showFooter"
                          checked={field.value}
                          onCheckedChange={(value) => {
                            field.onChange(value);
                            handleToggleChange("showPrescriptionFooter", value);
                          }}
                          className="data-[state=checked]:bg-violet-500"
                        />
                      </div>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Live Preview Summary */}
            <Card className="shadow-xl border-0 overflow-hidden pt-0">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
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
                    <span className="text-gray-600 text-sm">Footer Logo:</span>
                    <Badge
                      variant={
                        watchedValues.showLogo && footerSection.logo
                          ? "default"
                          : "secondary"
                      }
                      className={
                        watchedValues.showLogo && footerSection.logo
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }
                    >
                      {watchedValues.showLogo && footerSection.logo
                        ? "Uploaded"
                        : "Not Set"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-sm">
                      Footer Display:
                    </span>
                    <Badge
                      variant={
                        watchedValues.showPrescriptionFooter
                          ? "default"
                          : "secondary"
                      }
                      className={
                        watchedValues.showPrescriptionFooter
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }
                    >
                      {watchedValues.showPrescriptionFooter
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
                        footerSection.doctorInfoBangla ? "default" : "outline"
                      }
                      className={
                        footerSection.doctorInfoBangla ? "bg-blue-500" : ""
                      }
                    >
                      Bangla:{" "}
                      {footerSection.doctorInfoBangla ? "Added" : "Empty"}
                    </Badge>
                    <Badge
                      variant={
                        footerSection.doctorInfoEnglish ? "default" : "outline"
                      }
                      className={
                        footerSection.doctorInfoEnglish ? "bg-blue-500" : ""
                      }
                    >
                      English:{" "}
                      {footerSection.doctorInfoEnglish ? "Added" : "Empty"}
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

export default FooterSection;
