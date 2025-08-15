"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Filter, Search, X } from "lucide-react"

export function FeedFilters({ availableTags = [] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get current filter values from URL
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
    tags: searchParams.get("tags")?.split(",").filter(Boolean) || [],
    userId: searchParams.get("userId") || ""
  })

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams()
    
    // Add current page
    params.set("page", "1") // Reset to first page when filtering
    
    // Add filters
    if (filters.search) params.set("search", filters.search)
    if (filters.sortBy) params.set("sortBy", filters.sortBy)
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder)
    if (filters.tags.length > 0) params.set("tags", filters.tags.join(","))
    if (filters.userId) params.set("userId", filters.userId)
    
    // Update URL
    router.push(`?${params.toString()}`)
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      tags: [],
      userId: ""
    })
    router.push("") // Clear URL params
  }

  // Update filters when URL changes
  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || "",
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: searchParams.get("sortOrder") || "desc",
      tags: searchParams.get("tags")?.split(",").filter(Boolean) || [],
      userId: searchParams.get("userId") || ""
    })
  }, [searchParams])

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Search input */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="pl-8"
            />
          </div>
        </div>
        
        {/* Sort options */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) => setFilters({...filters, sortBy: value})}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Date</SelectItem>
            <SelectItem value="likeCount">Popularity</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Sort order */}
        <Select
          value={filters.sortOrder}
          onValueChange={(value) => setFilters({...filters, sortOrder: value})}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Descending</SelectItem>
            <SelectItem value="asc">Ascending</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Tags filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              Tags <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {availableTags.map(tag => (
              <DropdownMenuCheckboxItem
                key={tag}
                checked={filters.tags.includes(tag)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({...filters, tags: [...filters.tags, tag]})
                  } else {
                    setFilters({...filters, tags: filters.tags.filter(t => t !== tag)})
                  }
                }}
              >
                {tag}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Apply/Reset buttons */}
        <Button onClick={applyFilters} className="ml-auto">
          <Filter className="mr-2 h-4 w-4" /> Apply Filters
        </Button>
        <Button variant="ghost" onClick={resetFilters}>
          <X className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>
      
      {/* Active filters display */}
      {(filters.search || filters.tags.length > 0 || filters.sortBy !== "createdAt" || filters.sortOrder !== "desc") && (
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-muted-foreground">Active filters:</span>
          {filters.search && (
            <span className="bg-muted px-2 py-1 rounded-md">
              Search: {filters.search}
            </span>
          )}
          {filters.tags.map(tag => (
            <span key={tag} className="bg-muted px-2 py-1 rounded-md">
              Tag: {tag}
            </span>
          ))}
          {filters.sortBy !== "createdAt" && (
            <span className="bg-muted px-2 py-1 rounded-md">
              Sort: {filters.sortBy}
            </span>
          )}
          {filters.sortOrder !== "desc" && (
            <span className="bg-muted px-2 py-1 rounded-md">
              Order: {filters.sortOrder}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export function Pagination({ pagination }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const { page, pageSize, totalPages } = pagination
  
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`?${params.toString()}`)
  }
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always include first page
      pages.push(1)
      
      // Calculate start and end of page range
      let start = Math.max(2, page - 1)
      let end = Math.min(totalPages - 1, page + 1)
      
      // Adjust if at the beginning
      if (page <= 2) {
        end = Math.min(totalPages - 1, 4)
      }
      
      // Adjust if at the end
      if (page >= totalPages - 1) {
        start = Math.max(2, totalPages - 3)
      }
      
      // Add ellipsis if needed
      if (start > 2) {
        pages.push("...")
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push("...")
      }
      
      // Always include last page
      pages.push(totalPages)
    }
    
    return pages
  }
  
  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-muted-foreground">
        Showing page {page} of {totalPages}
      </div>
      
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(1)}
          disabled={page === 1}
        >
          First
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        
        {getPageNumbers().map((pageNum, index) => (
          <Button
            key={index}
            variant={pageNum === page ? "default" : "outline"}
            size="sm"
            onClick={() => {
              if (typeof pageNum === "number") {
                handlePageChange(pageNum)
              }
            }}
            disabled={typeof pageNum !== "number"}
          >
            {pageNum}
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          disabled={page === totalPages}
        >
          Last
        </Button>
      </div>
    </div>
  )
}