import React from "react";
import BodyCustomizer from "@/components/BodyCustomizer";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setBodySection } from "@/redux/slices/prescriptionTemplateSlice";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const BodySection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { bodySection } = useAppSelector((state) => state.prescriptionTemplate);

  const handleLineToggle = (
    lineType: keyof typeof bodySection,
    value: boolean
  ) => {
    dispatch(
      setBodySection({
        ...bodySection,
        [lineType]: value,
      })
    );
  };

  return (
    <div className="min-h-[400px] p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 min-h-[400px] gap-4">
        <div className="col-span-3 border-r-2 border-gray-200">
          <BodyCustomizer />
        </div>
        <div className="col-span-1">
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Line Options
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="top-line" className="text-sm font-medium">
                    Show Top Line
                  </Label>
                  <Switch
                    id="top-line"
                    checked={bodySection.showTopLine}
                    className="bg-green-500"
                    onCheckedChange={(value) =>
                      handleLineToggle("showTopLine", value)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="bottom-line" className="text-sm font-medium">
                    Show Bottom Line
                  </Label>
                  <Switch
                    id="bottom-line"
                    checked={bodySection.showBottomLine}
                    onCheckedChange={(value) =>
                      handleLineToggle("showBottomLine", value)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="left-line" className="text-sm font-medium">
                    Show Left Line
                  </Label>
                  <Switch
                    id="left-line"
                    checked={bodySection.showLeftLine}
                    onCheckedChange={(value) =>
                      handleLineToggle("showLeftLine", value)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="right-line" className="text-sm font-medium">
                    Show Right Line
                  </Label>
                  <Switch
                    id="right-line"
                    checked={bodySection.showRightLine}
                    onCheckedChange={(value) =>
                      handleLineToggle("showRightLine", value)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="middle-line" className="text-sm font-medium">
                    Show Middle Line
                  </Label>
                  <Switch
                    id="middle-line"
                    checked={bodySection.showMiddleLine}
                    onCheckedChange={(value) =>
                      handleLineToggle("showMiddleLine", value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BodySection;
