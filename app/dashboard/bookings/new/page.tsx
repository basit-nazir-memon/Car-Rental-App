"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for available cars
const availableCars = [
  { id: 1, model: "Toyota Corolla", year: 2022, registrationNumber: "ABC-123" },
  { id: 2, model: "Honda Civic", year: 2021, registrationNumber: "DEF-456" },
  { id: 3, model: "Suzuki Swift", year: 2020, registrationNumber: "GHI-789" },
]

// Mock data for available drivers
const availableDrivers = [
  { id: 1, name: "David Johnson" },
  { id: 2, name: "Michael Brown" },
  { id: 3, name: "John Smith" },
]

// Mock data for available customers
const availableCustomers = [
  { id: 1, name: "John Doe", phone: "+92 300 1234567" },
  { id: 2, name: "Jane Smith", phone: "+92 301 2345678" },
  { id: 3, name: "Robert Williams", phone: "+92 302 3456789" },
]

export default function NewBookingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    customerId: "",
    carId: "",
    tripType: "within-city",
    city: "",
    dateRange: {
      from: new Date(),
      to: new Date(new Date().setDate(new Date().getDate() + 3)),
    },
    driverId: "",
    totalAmount: "",
    advancePaid: "",
    discount: "0",
    discountReference: "",
    meterReading: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setFormData((prev) => ({ ...prev, dateRange: range }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // This would normally be a fetch to your backend API
      // For demo purposes, we'll simulate a successful creation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to bookings page
      router.push("/dashboard/bookings")
    } catch (error) {
      console.error("Error creating booking:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/bookings">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">New Booking</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer & Car Details</CardTitle>
              <CardDescription>Select customer and car for this booking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, customerId: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCustomers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.name} ({customer.phone})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="carId">Car</Label>
                <Select
                  value={formData.carId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, carId: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a car" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCars.map((car) => (
                      <SelectItem key={car.id} value={car.id.toString()}>
                        {car.model} ({car.year}) - {car.registrationNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meterReading">Current Meter Reading (km)</Label>
                <Input
                  id="meterReading"
                  name="meterReading"
                  type="number"
                  value={formData.meterReading}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
              <CardDescription>Enter trip information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Trip Type</Label>
                <RadioGroup
                  value={formData.tripType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, tripType: value }))}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="within-city" id="within-city" />
                    <Label htmlFor="within-city" className="cursor-pointer">
                      Within City
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="out-of-city" id="out-of-city" />
                    <Label htmlFor="out-of-city" className="cursor-pointer">
                      Out of City
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.tripType === "out-of-city" && (
                <div className="space-y-2">
                  <Label htmlFor="city">Destination City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter destination city"
                    required={formData.tripType === "out-of-city"}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Trip Duration</Label>
                <DatePickerWithRange date={formData.dateRange} setDate={handleDateRangeChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="driverId">Driver</Label>
                <Select
                  value={formData.driverId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, driverId: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDrivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id.toString()}>
                        {driver.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Enter payment details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="totalAmount">Total Amount</Label>
                <Input
                  id="totalAmount"
                  name="totalAmount"
                  type="number"
                  value={formData.totalAmount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="advancePaid">Advance Paid</Label>
                <Input
                  id="advancePaid"
                  name="advancePaid"
                  type="number"
                  value={formData.advancePaid}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountReference">Discount Reference</Label>
                <Input
                  id="discountReference"
                  name="discountReference"
                  value={formData.discountReference}
                  onChange={handleChange}
                  placeholder="Reason for discount (if any)"
                />
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between">
                <p className="font-medium">Remaining Amount</p>
                <p className="font-bold text-lg">
                  $
                  {formData.totalAmount && formData.advancePaid
                    ? Number(formData.totalAmount) - Number(formData.advancePaid)
                    : 0}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/bookings">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>Creating Booking...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Booking
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

