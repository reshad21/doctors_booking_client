"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  active: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  active = 1,
  totalPages = 4,
  onPageChange = () => {},
}: PaginationProps) {
  const adjacentPages = 1;
  const pages: React.ReactNode[] = [];
  const startPage = Math.max(1, active - adjacentPages);
  const endPage = Math.min(totalPages, active + adjacentPages);

  // Generate pages
  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <Button
        key={i}
        size="sm"
        className={cn(
          "h-8 w-8 rounded-full",
          active === i
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-transparent hover:bg-green-50"
        )}
        onClick={() => onPageChange(i)}
        variant={active === i ? "default" : "ghost"}
      >
        {i}
      </Button>
    );
  }

  // Add first page and ellipsis if needed
  if (startPage > 1) {
    pages.unshift(
      <Button
        key="ellipsis-start"
        size="sm"
        className="h-8 w-8 rounded-full bg-transparent"
        variant="ghost"
        disabled
      >
        ...
      </Button>
    );
  }

  // Add last page and ellipsis if needed
  if (endPage < totalPages) {
    pages.push(
      <Button
        key="ellipsis-end"
        size="sm"
        className="h-8 w-8 rounded-full bg-transparent"
        variant="ghost"
        disabled
      >
        ...
      </Button>
    );
  }

  return (
    <div className="flex items-center justify-end">
      <div className="flex items-center gap-1 rounded-full cursor-pointer bg-green-50 px-2 py-1">
        <Button
          size="sm"
          className="h-8 w-8 rounded-full bg-transparent cursor-pointer hover:bg-brand hover:text-green-500"
          onClick={() => onPageChange(active - 1)}
          disabled={active === 1}
          variant="ghost"
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <div className="cursor-pointer">{pages}</div>
        <Button
          size="sm"
          className="h-8 w-8 rounded-full bg-transparent hover:bg-brand cursor-pointer hover:text-green-500"
          onClick={() => onPageChange(active + 1)}
          disabled={active === totalPages}
          variant="ghost"
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
