"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Define the props interface
interface ReusableDataTableProps {
  headers: string[];
  rows: (ReactNode | ReactNode[])[]; // Each row contains multiple columns

  loading?: boolean;
  className?: string;
  onClickRow?: (index:number) => void;
}

// Animation variants for rows
const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: index * 0.05, // Staggered animation effect
    },
  }),
};

const MotionTableRow = motion.create(TableRow);

export default function ReusableTable(props: ReusableDataTableProps) {
  const { headers, rows, loading, className, onClickRow } = props;

  // Render loading state
  if (loading) {
    return (
      <div className={cn("rounded-md border overflow-x-auto w-full", className)}>
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index} className="px-4 py-3 text-left font-medium">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(3)
              .fill(0)
              .map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array(headers.length)
                    .fill(0)
                    .map((_, cellIndex) => (
                      <TableCell key={cellIndex} className="px-4 py-3">
                        <div className="h-4 bg-muted animate-pulse rounded" />
                      </TableCell>
                    ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className={cn("rounded-md border overflow-x-auto w-full", className)}>
      <Table>
        {/* Table Header */}
        <TableHeader className="bg-muted">
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={index} className="px-4 py-3 text-left font-medium">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Table Body */}
        <TableBody>
          {rows.length > 0 ? (
            rows.map((rowData, rowIndex) => (
              <MotionTableRow
                key={rowIndex}
                initial="hidden"
                animate="visible"
                variants={rowVariants}
                custom={rowIndex}

                className="transition-colors cursor-pointer hover:bg-accent/10"
                onClick={() => onClickRow?.(rowIndex)}
              >
                {Array.isArray(rowData) ? (
                  rowData.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} className="px-4 py-3">
                      {cell}
                    </TableCell>
                  ))
                ) : (
                  <TableCell className="px-4 py-3">{rowData}</TableCell>
                )}
              </MotionTableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headers.length} className="h-24 text-center">
                No data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
