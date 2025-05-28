"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { DateRange as ReactDateRange } from "react-date-range"
import type { Range } from "react-date-range"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  value: Range
  onChange: (value: Range) => void
  className?: string
}

export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.startDate ? (
              value.endDate ? (
                <>
                  {format(value.startDate, "LLL dd, y")} -{" "}
                  {format(value.endDate, "LLL dd, y")}
                </>
              ) : (
                format(value.startDate, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <ReactDateRange
            ranges={[value]}
            onChange={(item) => {
              if (item.selection.startDate && item.selection.endDate) {
                onChange(item.selection)
              }
            }}
            months={2}
            direction="horizontal"
            showDateDisplay={false}
            rangeColors={["#2563eb"]}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
} 