import React, { useState, useRef, useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setBodySection } from "@/redux/slices/prescriptionTemplateSlice";

interface BodyCustomizerProps {
  className?: string;
}

const BodyCustomizer: React.FC<BodyCustomizerProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const { bodySection } = useAppSelector((state) => state.prescriptionTemplate);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftTopMarginRef = useRef<HTMLDivElement>(null);
  const rightTopMarginRef = useRef<HTMLDivElement>(null);
  const verticalDividerRef = useRef<HTMLDivElement>(null);

  const [isDraggingVertical, setIsDraggingVertical] = useState(false);
  const [isDraggingLeftMargin, setIsDraggingLeftMargin] = useState(false);
  const [isDraggingRightMargin, setIsDraggingRightMargin] = useState(false);

  // Handle vertical divider drag (left/right section width)
  const handleVerticalMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingVertical(true);
  }, []);

  const handleVerticalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingVertical || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const offsetX = e.clientX - containerRect.left;
      const containerWidth = containerRect.width;
      const leftPercentage = (offsetX / containerWidth) * 100;

      // Ensure minimum 10% width for each section
      const clampedLeftPercentage = Math.max(10, Math.min(90, leftPercentage));
      const rightPercentage = 100 - clampedLeftPercentage;

      dispatch(
        setBodySection({
          ...bodySection,
          bodyLeftSideWidth: Math.round(clampedLeftPercentage),
          bodyRightSideWidth: Math.round(rightPercentage),
        })
      );
    },
    [isDraggingVertical, bodySection, dispatch]
  );

  // Handle left top margin drag
  const handleLeftMarginMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingLeftMargin(true);
  }, []);

  const handleLeftMarginMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingLeftMargin || !leftTopMarginRef.current) return;

      const containerRect =
        leftTopMarginRef.current.parentElement!.getBoundingClientRect();
      const offsetY = e.clientY - containerRect.top;
      const containerHeight = containerRect.height;
      const marginPercentage = (offsetY / containerHeight) * 100;

      // Ensure margin doesn't exceed 50% of container height
      const clampedMarginPercentage = Math.max(
        0,
        Math.min(50, marginPercentage)
      );

      dispatch(
        setBodySection({
          ...bodySection,
          bodyLeftSideTopMargin: Math.round(clampedMarginPercentage),
        })
      );
    },
    [isDraggingLeftMargin, bodySection, dispatch]
  );

  // Handle right top margin drag
  const handleRightMarginMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingRightMargin(true);
  }, []);

  const handleRightMarginMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRightMargin || !rightTopMarginRef.current) return;

      const containerRect =
        rightTopMarginRef.current.parentElement!.getBoundingClientRect();
      const offsetY = e.clientY - containerRect.top;
      const containerHeight = containerRect.height;
      const marginPercentage = (offsetY / containerHeight) * 100;

      // Ensure margin doesn't exceed 50% of container height
      const clampedMarginPercentage = Math.max(
        0,
        Math.min(50, marginPercentage)
      );

      dispatch(
        setBodySection({
          ...bodySection,
          bodyRightSideTopMargin: Math.round(clampedMarginPercentage),
        })
      );
    },
    [isDraggingRightMargin, bodySection, dispatch]
  );

  const handleMouseUp = useCallback(() => {
    setIsDraggingVertical(false);
    setIsDraggingLeftMargin(false);
    setIsDraggingRightMargin(false);
  }, []);

  // Add global mouse event listeners
  useEffect(() => {
    if (isDraggingVertical || isDraggingLeftMargin || isDraggingRightMargin) {
      const handleMouseMove = (e: MouseEvent) => {
        handleVerticalMouseMove(e);
        handleLeftMarginMouseMove(e);
        handleRightMarginMouseMove(e);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [
    isDraggingVertical,
    isDraggingLeftMargin,
    isDraggingRightMargin,
    handleVerticalMouseMove,
    handleLeftMarginMouseMove,
    handleRightMarginMouseMove,
    handleMouseUp,
  ]);

  return (
    <div className={`min-h-[400px] ${className}`}>
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Body Section Customizer</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Left Section Width:</span>{" "}
            {bodySection.bodyLeftSideWidth}%
          </div>
          <div>
            <span className="font-medium">Right Section Width:</span>{" "}
            {bodySection.bodyRightSideWidth}%
          </div>
          <div>
            <span className="font-medium">Left Top Margin:</span>{" "}
            {bodySection.bodyLeftSideTopMargin}%
          </div>
          <div>
            <span className="font-medium">Right Top Margin:</span>{" "}
            {bodySection.bodyRightSideTopMargin}%
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative min-h-[400px] border-2 border-gray-300 rounded-lg overflow-hidden"
        style={{
          display: "flex",
        }}
      >
        {/* Left Section */}
        <div
          className="relative bg-blue-50 border-r border-gray-300"
          style={{
            width: `${bodySection.bodyLeftSideWidth}%`,
            minHeight: "400px",
          }}
        >
          {/* Left Top Margin Divider */}
          <div
            className="absolute top-0 left-0 right-0 bg-blue-200 border-b-2 border-blue-400 flex items-center justify-center cursor-ns-resize hover:bg-blue-300 transition-colors"
            style={{
              height: `${bodySection.bodyLeftSideTopMargin}%`,
              minHeight: "20px",
            }}
            onMouseDown={handleLeftMarginMouseDown}
            ref={leftTopMarginRef}
          >
            <div className="text-xs text-blue-700 font-medium">
              Top Margin ({bodySection.bodyLeftSideTopMargin}%)
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full"></div>
          </div>

          {/* Left Content Area */}
          <div
            className="p-4 flex items-center justify-center text-gray-600"
            style={{
              marginTop: `${bodySection.bodyLeftSideTopMargin}%`,
              height: `${100 - bodySection.bodyLeftSideTopMargin}%`,
              minHeight: "200px",
            }}
          >
            <div className="text-center">
              <h4 className="font-semibold text-lg mb-2">Left Section</h4>
              <p className="text-sm">Content area for left section</p>
              <p className="text-xs text-gray-500 mt-2">
                Width: {bodySection.bodyLeftSideWidth}%
              </p>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div
          ref={verticalDividerRef}
          className="absolute top-0 bottom-0 w-2 bg-gray-400 cursor-col-resize hover:bg-gray-600 transition-colors flex items-center justify-center"
          style={{
            left: `${bodySection.bodyLeftSideWidth}%`,
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
          onMouseDown={handleVerticalMouseDown}
        >
          <div className="w-1 h-8 bg-white rounded-full"></div>
        </div>

        {/* Right Section */}
        <div
          className="relative bg-green-50"
          style={{
            width: `${bodySection.bodyRightSideWidth}%`,
            minHeight: "400px",
          }}
        >
          {/* Right Top Margin Divider */}
          <div
            className="absolute top-0 left-0 right-0 bg-green-200 border-b-2 border-green-400 flex items-center justify-center cursor-ns-resize hover:bg-green-300 transition-colors"
            style={{
              height: `${bodySection.bodyRightSideTopMargin}%`,
              minHeight: "20px",
            }}
            onMouseDown={handleRightMarginMouseDown}
            ref={rightTopMarginRef}
          >
            <div className="text-xs text-green-700 font-medium">
              Top Margin ({bodySection.bodyRightSideTopMargin}%)
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-green-600 rounded-full"></div>
          </div>

          {/* Right Content Area */}
          <div
            className="p-4 flex items-center justify-center text-gray-600"
            style={{
              marginTop: `${bodySection.bodyRightSideTopMargin}%`,
              height: `${100 - bodySection.bodyRightSideTopMargin}%`,
              minHeight: "200px",
            }}
          >
            <div className="text-center">
              <h4 className="font-semibold text-lg mb-2">Right Section</h4>
              <p className="text-sm">Content area for right section</p>
              <p className="text-xs text-gray-500 mt-2">
                Width: {bodySection.bodyRightSideWidth}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
        <p className="text-sm text-yellow-800">
          <strong>Instructions:</strong>
          <br />
          • Drag the vertical divider in the middle to adjust left/right section
          widths
          <br />
          • Drag the top margin dividers to adjust the top spacing for each
          section
          <br />• All changes are automatically saved to the template
        </p>
      </div>
    </div>
  );
};

export default BodyCustomizer;
