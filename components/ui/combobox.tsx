"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ComboboxProps {
  options: { value: string; label: string }[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  creatable?: boolean // Allow custom values not in the list
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  className,
  creatable = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  const selectedOption = options.find((option) => option.value === value)
  const displayValue = selectedOption ? selectedOption.label : value || ""

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options
    const searchLower = searchValue.toLowerCase()
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchLower) ||
        option.value.toLowerCase().includes(searchLower)
    )
  }, [options, searchValue])

  // Check if search value is a custom value not in options
  const isCustomValue = React.useMemo(() => {
    if (!creatable || !searchValue) return false
    return !options.some(
      (option) => option.value.toLowerCase() === searchValue.toLowerCase() || 
                  option.label.toLowerCase() === searchValue.toLowerCase()
    )
  }, [creatable, searchValue, options])

  // Handle popover close - just reset search
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearchValue("")
    }
  }

  // Handle Enter key in CommandInput - accept custom value if it exists
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && creatable && searchValue && isCustomValue) {
      e.preventDefault()
      onValueChange(searchValue)
      setSearchValue("")
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between bg-background border-border text-foreground hover:border-primary", className)}
        >
          <span className="truncate">
            {displayValue || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={setSearchValue}
            onKeyDown={handleKeyDown}
          />
          <CommandList>
            {filteredOptions.length === 0 && !isCustomValue && (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            )}
            {isCustomValue && (
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    onValueChange(searchValue)
                    setSearchValue("")
                    setOpen(false)
                  }}
                  className="text-primary"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Use "{searchValue}"
                </CommandItem>
              </CommandGroup>
            )}
            {filteredOptions.length > 0 && (
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      const newValue = option.value === value ? "" : option.value
                      onValueChange(newValue)
                      setSearchValue("")
                      setOpen(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

