'use client'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious, PaginationLink, PaginationEllipsis } from "../ui/pagination";
import { Loader2 } from "lucide-react";

// Reusable Pagination Component
interface PaginationComponentProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function PaginationComponent({
  currentPage,
  pageCount,
  onPageChange,
  isLoading = false
}: PaginationComponentProps) {
  if (pageCount <= 1) return null;

  // Generate the page numbers to display
  const getPageNumbers = () => {
    const MAX_VISIBLE_PAGES = 5;
    const pages = [];

    // Always show first page
    pages.push(1);

    // Calculate range of pages to show around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(pageCount - 1, currentPage + 1);

    // Adjust if at the beginning or end
    if (currentPage <= 3) {
      endPage = Math.min(MAX_VISIBLE_PAGES - 1, pageCount - 1);
    } else if (currentPage >= pageCount - 2) {
      startPage = Math.max(2, pageCount - (MAX_VISIBLE_PAGES - 2));
    }

    // Add ellipsis before middle pages if needed
    if (startPage > 2) {
      pages.push(-1); // -1 represents ellipsis
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis after middle pages if needed
    if (endPage < pageCount - 1) {
      pages.push(-2); // -2 represents second ellipsis
    }

    // Always show last page if there are multiple pages
    if (pageCount > 1) {
      pages.push(pageCount);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => !isLoading && onPageChange(Math.max(currentPage - 1, 1))}
              className={currentPage === 1 || isLoading ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {pageNumbers.map((page, index) => {
            if (page === -1 || page === -2) {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => !isLoading && onPageChange(page)}
                  className={isLoading ? "pointer-events-none" : "cursor-pointer"}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => !isLoading && onPageChange(Math.min(currentPage + 1, pageCount))}
              className={currentPage === pageCount || isLoading ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {isLoading && (
            <PaginationItem className="ml-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}