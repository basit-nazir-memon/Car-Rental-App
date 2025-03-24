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

// Mock data for a specific booking
const bookingData = {
  id: 1,
  status: "active",
  customer: {
    id: 1,
    name: "John Doe",
    phone: "+92 300 1234567",
    idCard: "12345-6789012-3",
  },
  car: {
    id: 1,
    model: "Toyota Corolla",
    year: 2022,
    color: "red",
    registrationNumber: "ABC-123",
    meterReading: 12500,
  },
  driver: {
    id: 1,
    name: "David Johnson",
    phone: "+92 301 2345678",
    idCard: "23456-7890123-4",
  },
  trip: {
    type: "within-city",
    city: "",
    startDate: new Date(2023, 2, 15),
    endDate: new Date(2023, 2, 18),
  },
  billing: {
    totalAmount: 15000,
    advancePaid: 5000,
    discount: 0,
    discountReference: "",
    remaining: 10000,
  },
}

// Mock data for available drivers
const availableDrivers = [
  { id: 1, name: "David Johnson" },
  { id: 2, name: "Michael Brown" },
  { id: 3, name: "John Smith" },
]

export default function EditBookingPage({ params }: { params: { bookingId: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    tripType: bookingData.trip.type,
    city: bookingData.trip.city,
    dateRange: {
      from: bookingData.trip.startDate,
      to: bookingData.trip.endDate,
    },
    driverId: bookingData.driver.id.toString(),
    totalAmount: bookingData.billing.totalAmount.toString(),
    advancePaid: bookingData.billing.advancePaid.toString(),
    discount: bookingData.billing.discount.toString(),
    discountReference: bookingData.billing.discountReference,
    meterReading: bookingData.car.meterReading.toString(),
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
      // For demo purposes, we'll simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect back to booking details page
      router.push(`/dashboard/bookings/${params.bookingId}`)
    } catch (error) {
      console.error("Error updating booking:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/bookings/${params.bookingId}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Booking #{params.bookingId}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
              <CardDescription>Update trip information.</CardDescription>
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

              <div className="space-y-2">
                <Label htmlFor="meterReading">Current Meter Reading (km)</Label>
                <Input
                  id="meterReading"
                  name="meterReading"
                  type="number"
                  value={formData.meterReading}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Update payment details.</CardDescription>
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
                <p className="font-bold text-lg">${Number(formData.totalAmount) - Number(formData.advancePaid)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/bookings/${params.bookingId}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

