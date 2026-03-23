"use client"

import * as React from "react"
import { Check } from "lucide-react"

export function Checkbox({ checked, className = "", ...props }: any) {
  return (
    <div 
      className={`h-5 w-5 rounded border border-slate-300 flex items-center justify-center transition-all ${checked ? 'bg-blue-600 border-blue-600' : 'bg-white'} ${className}`}
      {...props}
    >
      {checked && <Check size={14} className="text-white" strokeWidth={3} />}
    </div>
  )
}
