"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Eye, Check, ChevronDown } from "lucide-react"
import "quill/dist/quill.snow.css"

// Lazy load tooltip components
const Tooltip = dynamic(() => import("@/components/ui/tooltip").then(mod => mod.Tooltip))
const TooltipContent = dynamic(() => import("@/components/ui/tooltip").then(mod => mod.TooltipContent))
const TooltipProvider = dynamic(() => import("@/components/ui/tooltip").then(mod => mod.TooltipProvider))
const TooltipTrigger = dynamic(() => import("@/components/ui/tooltip").then(mod => mod.TooltipTrigger))
const Badge = dynamic(() => import("@/components/ui/badge").then(mod => mod.Badge))
const Separator = dynamic(() => import("@/components/ui/separator").then(mod => mod.Separator))

// Simplified loading state
const ReactQuill = dynamic(() => import("react-quill"), {
	ssr: false,
	loading: () => <div className="h-48 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center"><span>Loading...</span></div>
})


const MarkdownView = ({
	content = "",
	showControls = true,
	allowCopy = true,
	maxHeight = "600px",
	minHeight = "200px",
	className = "",
	showWordCount = false,
	truncate = false,
	maxLines = 3,
	hasImages = false
}) => {
	const [isFullscreen, setIsFullscreen] = useState(false)
	const [expanded, setExpanded] = useState(!truncate || !hasImages)
	const [showControls_, setShowControls] = useState(showControls)

	// Simple content statistics calculation
	const getContentStats = () => {
		if (!content) return { words: 0, characters: 0 }
		const text = content.replace(/<[^>]*>/g, "").trim()
		return {
			words: text ? text.split(/\s+/).length : 0,
			characters: text.length
		}
	}

	const contentStats = getContentStats()

	// Determine if we should truncate the content
	const shouldTruncate = truncate && hasImages && !expanded

	return (
		<TooltipProvider>
			<div className={`relative ${isFullscreen ? "fixed inset-0 z-50 bg-white" : ""} ${className}`}>
				<Card className={`${isFullscreen ? "h-full" : ""} shadow-sm border-gray-200 `}>
					<CardContent className="p-2">
						<div className={`markdown-view-container transition-colors duration-200 ${shouldTruncate ? 'truncated' : ''}`} >
							<ReactQuill
								value={content}
								readOnly={true}
								modules={{
									toolbar: false,
									clipboard: {
										matchVisual: false,
									},
								}}
								style={{ height: "100%" }}
							/>
							
							{shouldTruncate && (
								<div className="expand-overlay">
									<Button 
										variant="ghost" 
										size="sm" 
										className="expand-button"
										onClick={() => setExpanded(true)}
									>
										<ChevronDown className="h-4 w-4 mr-1" />
										Show more
									</Button>
								</div>
							)}
						</div>
					</CardContent>

					{/* Simplified Footer */}
					{showControls_ && contentStats.characters > 0 && (
						<div className="p-2 border-t bg-gray-50/50 text-xs text-gray-500">
							{contentStats.characters} characters
						</div>
					)}
				</Card>

				{/* Custom Styles */}
				<style jsx global>{`
          .markdown-view-container .ql-container {
            border: none !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            height: 100%;
          }
          
          .markdown-view-container .ql-editor {
            border: none !important;
            padding: 2px !important;
            font-size: inherit;
            line-height: 1.7;
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            scroll-behavior: smooth;
          }
          
          .markdown-view-container.truncated .ql-editor {
            max-height: ${maxLines * 1.7}em;
            overflow: hidden;
            position: relative;
          }
          
          .markdown-view-container .expand-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 40px;
            background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1));
            display: flex;
            align-items: flex-end;
            justify-content: center;
            padding-bottom: 4px;
          }
          
          .markdown-view-container .expand-button {
            background-color: white;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            padding: 2px 8px;
            font-size: 12px;
            cursor: pointer;
          }
          
          .markdown-view-container .ql-editor::-webkit-scrollbar {
            width: 6px;
          }
          
          .markdown-view-container .ql-editor::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .markdown-view-container .ql-editor::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
          }
          
          .markdown-view-container .ql-editor::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
          
          /* Typography improvements */
          .markdown-view-container .ql-editor h1,
          .markdown-view-container .ql-editor h2,
          .markdown-view-container .ql-editor h3,
          .markdown-view-container .ql-editor h4,
          .markdown-view-container .ql-editor h5,
          .markdown-view-container .ql-editor h6 {
            font-weight: 600;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            line-height: 1.3;
          }
          
          .markdown-view-container .ql-editor h1 {
            font-size: 2em;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 0.3em;
          }
          
          .markdown-view-container .ql-editor h2 {
            font-size: 1.5em;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 0.3em;
          }
          
          .markdown-view-container .ql-editor h3 {
            font-size: 1.25em;
          }
          
          .markdown-view-container .ql-editor p {
            margin-bottom: 1em;
            line-height: 1.7;
          }
          
          .markdown-view-container .ql-editor blockquote {
            border-left: 4px solid #3b82f6;
            background: #f8fafc;
            padding: 1em 1.5em;
            margin: 1.5em 0;
            border-radius: 0 6px 6px 0;
            font-style: italic;
          }
          
          .markdown-view-container .ql-editor ul,
          .markdown-view-container .ql-editor ol {
            padding-left: 1.5em;
            margin-bottom: 1em;
          }
          
          .markdown-view-container .ql-editor li {
            margin-bottom: 0.5em;
            line-height: 1.6;
          }
          
          .markdown-view-container .ql-editor a {
            color: #3b82f6;
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: border-color 0.2s;
          }
          
          .markdown-view-container .ql-editor a:hover {
            border-bottom-color: #3b82f6;
          }
          
          .markdown-view-container .ql-editor img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            margin: 1em 0;
          }
          
          .markdown-view-container .ql-editor pre {
            background: #1f2937;
            color: #f9fafb;
            padding: 1em;
            border-radius: 6px;
            overflow-x: auto;
            margin: 1em 0;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.875em;
          }
          
          .markdown-view-container .ql-editor code {
            background: #f1f5f9;
            color: #e11d48;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.875em;
          }
          
          /* Theme-specific styles */
          .bg-amber-50 .ql-editor blockquote {
            background: #fef3c7;
            border-left-color: #d97706;
          }
          
          .bg-gray-900 .ql-editor blockquote {
            background: #374151;
            border-left-color: #60a5fa;
            color: #f3f4f6;
          }
          
          .bg-gray-900 .ql-editor code {
            background: #374151;
            color: #fbbf24;
          }
          
          .bg-gray-900 .ql-editor pre {
            background: #111827;
            color: #f9fafb;
          }
          
          .bg-gray-900 .ql-editor a {
            color: #60a5fa;
          }
          
          .bg-gray-900 .ql-editor a:hover {
            border-bottom-color: #60a5fa;
          }
          
          /* Print styles */
          @media print {
            .markdown-view-container .ql-editor {
              padding: 0 !important;
              font-size: 12pt !important;
              line-height: 1.5 !important;
            }
          }
          
          /* Mobile responsiveness */
          @media (max-width: 640px) {
            .markdown-view-container .ql-editor {
              padding: 16px !important;
              font-size: 14px !important;
            }
            
            .markdown-view-container .ql-editor h1 {
              font-size: 1.5em;
            }
            
            .markdown-view-container .ql-editor h2 {
              font-size: 1.25em;
            }
          }
        `}</style>
			</div >
		</TooltipProvider >
	)
}

export default MarkdownView