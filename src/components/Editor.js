"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { RotateCcw } from 'lucide-react'
import "quill/dist/quill.snow.css"

// Simple loading state
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <div className="h-48 bg-gray-50 flex items-center justify-center">Loading...</div>
})

const Editor = ({
  value = "",
  onChange,
  placeholder = "Start writing...",
  height = "200px", 
  maxLength = null,
}) => {
  const [charCount, setCharCount] = useState(0)
  
  // Handle content change
  const handleChange = (content) => {
    if (!content) {
      setCharCount(0)
      onChange("")
      return
    }
    
    // Simple character count
    const text = content.replace(/<[^>]*>/g, "")
    setCharCount(text.length)
    
    // Check max length
    if (maxLength && text.length > maxLength) return
    
    onChange(content)
  }

  // Basic formats only
  const formats = ["bold", "italic", "list", "bullet", "link"]

  return (
    <div className="border rounded-md">
      <div className="flex justify-between p-2 border-b bg-gray-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange("")}
          disabled={!value}
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Clear
        </Button>
        
        {maxLength && (
          <span className="text-xs self-center">
            {maxLength - charCount} chars left
          </span>
        )}
      </div>

      <div style={{ height }}>
        <ReactQuill
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          formats={formats}
          modules={{
            toolbar: [
              ['bold', 'italic'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link']
            ]
          }}
        />
      </div>

      <style jsx global>{`
        .ql-container { border: none !important; }
        .ql-toolbar { border: none !important; border-bottom: 1px solid #e5e7eb !important; }
        .ql-editor { padding: 12px; min-height: 100px; }
      `}</style>
    </div>
  )
}

export default Editor
