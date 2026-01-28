"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { MapPin, Search, X, ChevronDown, Building2, Stethoscope, Scissors } from "lucide-react"
import classNames from "classnames"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  variable: "--font-inter"
})

interface SearchDropdownProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: { id: string; name: string }[]
  selectedOption: string
  onOptionSelect: (id: string) => void
  onClear: () => void
  type: "city" | "branch" | "treatment" | "doctor" | "specialty"
}

export const SearchDropdown = ({
  value,
  onChange,
  placeholder,
  options,
  selectedOption,
  onOptionSelect,
  onClear,
  type
}: SearchDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedOptionName = useMemo(() => options.find(opt => opt.id === selectedOption)?.name || '', [options, selectedOption]);

  // Determine the value to display in the input field
  const displayedValue = selectedOptionName || value;

  const filteredOptions = useMemo(() => {
    return options
      .filter(option => option.name.toLowerCase().includes(value.toLowerCase()))
      // UPDATED LOGIC: Sort by name A-Z
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [options, value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  useEffect(() => {
    if (isOpen && filteredOptions.length > 0) {
      setHighlightedIndex(0)
    } else {
      setHighlightedIndex(-1)
    }
  }, [isOpen, filteredOptions.length])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filteredOptions.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0) {
          onOptionSelect(filteredOptions[highlightedIndex].id)
          onChange("") // Clear search query to reset filtering state
          setIsOpen(false)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // If an option was selected, clear it when the user starts typing
    if (selectedOption) onOptionSelect("")
    // Update the search query value
    onChange(e.target.value)
    setIsOpen(true)
  }

  const getIcon = () => {
    const icons = {
      city: MapPin,
      branch: Building2,
      doctor: Stethoscope,
      treatment: Scissors,
      specialty: Search
    }
    const Icon = icons[type] || Search
    return <Icon className="w-4 h-4 text-[#241d1f]/60" />
  }

  const getPlaceholder = () => {
    const placeholders = {
      city: "Filter by City (e.g., New Delhi)",
      branch: "Search branches...",
      doctor: "Search doctors...",
      treatment: "Search treatments...",
      specialty: "Search specialties..."
    }
    return placeholders[type] || placeholder
  }

  const getNoResultsText = () => {
    const texts = {
      city: "cities",
      branch: "branches",
      doctor: "doctors",
      treatment: "treatments",
      specialty: "specializations"
    }
    return texts[type] || ""
  }

  return (
    <div ref={dropdownRef} className="relative space-y-2 w-full max-w-64">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">{getIcon()}</div>
        <input
          ref={inputRef}
          type="text"
          placeholder={getPlaceholder()}
          value={displayedValue} // Use the calculated displayedValue
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={`pl-10 pr-12 py-2.5 border border-gray-200 rounded-sm w-full text-sm bg-white focus:bg-white focus:ring-2 focus:ring-[#74BF44]/50 focus:border-[#74BF44]/50 transition-all placeholder:text-[#241d1f]/40 font-extralight ${inter.variable}`}
          aria-label={`Search ${getPlaceholder()}`}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
        {isOpen && (
          <ul role="listbox" className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-sm shadow-lg z-10 max-h-60 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li key={option.id}>
                  <button
                    onClick={() => {
                      onOptionSelect(option.id)
                      onChange("") // Clear search input value after selecting an option
                      setIsOpen(false)
                    }}
                    className={classNames(
                      "w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-[#241d1f] font-extralight",
                      { "bg-[#74BF44]/10": index === highlightedIndex }
                    )}
                    aria-selected={index === highlightedIndex}
                  >
                    {option.name}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-gray-500">No {getNoResultsText()} found</li>
            )}
          </ul>
        )}
        {selectedOption && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#241d1f]/40 hover:text-[#241d1f]/70"
            aria-label="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {!selectedOption && !value && (
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#241d1f]/40" />
        )}
      </div>
    </div>
  )
}