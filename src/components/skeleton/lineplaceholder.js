import React from 'react'

export default function Lineplaceholder({ animate = false, children }) {
    return (
        <div className={`h-2.5 ${animate && "animate-pulse"} rounded-full bg-gray-300 mb-2.5`}>
            {children}
        </div>
    )
}
