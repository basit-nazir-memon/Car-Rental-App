"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import config from "@/config"

interface Customer {
  _id: string
  fullName: string
  phoneNumber: string
  idCardNumber: string
}

interface CustomerSearchProps {
  onCustomerSelect: (customer: Customer) => void
}

export function CustomerSearch({ onCustomerSelect }: CustomerSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    const searchCustomers = async () => {
      if (searchQuery.length < 2) {
        setCustomers([])
        return
      }

      setIsLoading(true)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(
          `${config.backendUrl}/customers/search?query=${encodeURIComponent(searchQuery)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error("Failed to search customers")
        }

        const data = await response.json()
        setCustomers(data)
      } catch (error) {
        console.error("Error searching customers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchCustomers, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const handleCustomerSelect = (customer: Customer) => {
    onCustomerSelect(customer)
    setSearchQuery("")
    setShowSuggestions(false)
  }

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search by name, phone, or ID card..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value)
          setShowSuggestions(true)
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      {showSuggestions && (searchQuery.length >= 2 || customers.length > 0) && (
        <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-auto">
          <div className="p-2">
            {isLoading ? (
              <div className="p-2 text-sm text-muted-foreground">Searching...</div>
            ) : customers.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground">No customers found</div>
            ) : (
              customers.map((customer) => (
                <div
                  key={customer._id}
                  className="p-2 hover:bg-accent cursor-pointer rounded-sm"
                  onClick={() => handleCustomerSelect(customer)}
                >
                  <div className="font-medium">{customer.fullName}</div>
                  <div className="text-sm text-muted-foreground">
                    {customer.phoneNumber} • {customer.idCardNumber}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  )
} 