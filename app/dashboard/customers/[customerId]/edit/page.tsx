"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import config from "../../../../../config"

interface CustomerData {
  id: string
  name: string
  careOf: string
  phone: string
  idCard: string
  email: string
  address: string
  joinDate: string
  bookingCount: number
  lastBookingDate: string
}

export default function EditCustomerPage() {
  const router = useRouter()
  const params = useParams()
  const customerId = params.customerId as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [customerData, setCustomerData] = useState<CustomerData | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    careOf: "",
    phone: "",
    idCard: "",
    email: "",
    address: "",
  })

  useEffect(() => {
    if (customerId) {
      fetchCustomerDetails()
    }
  }, [customerId])

  const fetchCustomerDetails = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch(`${config.backendUrl}/customers/${customerId}/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch customer details")
      }

      const data = await response.json()
      setCustomerData(data.customerData)
      setFormData({
        fullName: data.customerData.name,
        careOf: data.customerData.careOf || "",
        phone: data.customerData.phone,
        idCard: data.customerData.idCard,
        email: data.customerData.email,
        address: data.customerData.address,
      })
    } catch (error) {
      console.error("Error fetching customer details:", error)
      toast.error("Failed to fetch customer details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSave = async () => {
    // Validate required fields
    if (!formData.fullName || !formData.careOf || !formData.phone || !formData.idCard) {
      toast.error("Name, Care Of, Phone, and ID Card are required")
      return
    }

    // Validate phone number format
    if (!/^[0-9]{11}$/.test(formData.phone)) {
      toast.error("Please enter a valid 11-digit phone number")
      return
    }

    // Validate email format if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsSaving(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${config.backendUrl}/customers/${customerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          careOf: formData.careOf,
          phoneNumber: formData.phone,
          idCardNumber: formData.idCard,
          email: formData.email || undefined,
          address: formData.address || undefined
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update customer")
      }

      toast.success("Customer updated successfully")
      router.push(`/dashboard/customers/${customerId}`)
    } catch (error) {
      console.error("Error updating customer:", error)
      toast.error("Failed to update customer")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/customers/${customerId}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Loading...</h1>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!customerData) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/customers/${customerId}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Customer Not Found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/customers/${customerId}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Customer</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Customer Details</CardTitle>
          <CardDescription>Update the customer's information below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter customer's full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="careOf">Care Of *</Label>
            <Input
              id="careOf"
              value={formData.careOf}
              onChange={handleInputChange}
              placeholder="Enter care of name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter 11-digit phone number"
              maxLength={11}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idCard">ID Card Number *</Label>
            <Input
              id="idCard"
              value={formData.idCard}
              onChange={handleInputChange}
              placeholder="XXXXX-XXXXXXX-X"
              maxLength={15}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter customer's email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter customer's address"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/customers/${customerId}`}>Cancel</Link>
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

