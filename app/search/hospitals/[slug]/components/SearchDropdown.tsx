"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { X } from "lucide-react"

const SearchDropdown = ({ value, onChange, placeholder, options, onOptionSelect, onClear, type }: {
  value: string; onChange: (value: string) => void; placeholder: string; options: { id: string; name: string }[]; onOptionSelect: (id: string) => void; onClear: () => void; type: string
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const filteredOptions = useMemo(() => !value ? options : options.filter(option => option.name.toLowerCase().includes(value.toLowerCase())), [value, options])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className="relative space-y-2">
      <div className="relative">
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => setIsOpen(true)} placeholder={placeholder} className="w-full pl-4 pr-4 py-2 border border-gray-200 text-sm rounded-xs focus:outline-none focus:ring-1 focus:ring-gray-400/50 bg-white text-gray-900 placeholder-gray-500 shadow-sm" />
        {value && <button onClick={onClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"><X className="w-3 h-3" /></button>}
      </div>
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-40 w-full bg-white border border-gray-200 rounded-xs shadow-lg max-h-48 overflow-y-auto">
          {filteredOptions.map((option) => (
            <button key={option.id} onClick={() => { onOptionSelect(option.id); setIsOpen(false) }} className="w-full text-left px-4 border-b border-gray-200 py-2 text-sm transition-colors text-gray-700 hover:bg-gray-50">
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchDropdown