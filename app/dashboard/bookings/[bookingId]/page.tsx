"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Download, Printer, Share2, Edit } from "lucide-react"
import { format } from "date-fns"
import { useReactToPrint } from "react-to-print"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// Mock data for a specific booking
const bookingData = {
  id: 1,
  status: "active",
  customer: {
    name: "John Doe",
    phone: "+92 300 1234567",
    idCard: "12345-6789012-3",
  },
  car: {
    model: "Toyota Corolla",
    year: 2022,
    color: "red",
    registrationNumber: "ABC-123",
    chassisNumber: "TC2022RED001",
    engineNumber: "ENG2022001",
    image: "/placeholder.svg?height=200&width=300",
    meterReading: 12500,
  },
  driver: {
    name: "David Johnson",
    phone: "+92 301 2345678",
    idCard: "23456-7890123-4",
    image: "/placeholder.svg?height=100&width=100",
  },
  trip: {
    type: "within-city",
    city: "",
    startDate: new Date(2023, 2, 15),
    endDate: new Date(2023, 2, 18),
    actualEndDate: null,
  },
  billing: {
    totalAmount: 15000,
    advancePaid: 5000,
    discount: 0,
    discountReference: "",
    remaining: 10000,
  },
  createdAt: new Date(2023, 2, 14),
  createdBy: "Employee Name",
}

export default function BookingDetailPage({ params }: { params: { bookingId: string } }) {
  const [isEndingBooking, setIsEndingBooking] = useState(false)
  const [actualEndDate, setActualEndDate] = useState<Date | null>(null)
  const [finalMeterReading, setFinalMeterReading] = useState<string>("")
  const printRef = useRef<HTMLDivElement>(null)

  const handleEndBooking = () => {
    // This would normally update the booking in the database
    console.log("Ending booking with actual end date:", actualEndDate)
    console.log("Final meter reading:", finalMeterReading)
    setIsEndingBooking(false)
  }

  const handleCancelBooking = () => {
    // This would normally cancel the booking in the database
    console.log("Cancelling booking:", bookingData.id)
  }

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Booking_${bookingData.id}_Report`,
    onAfterPrint: () => console.log("Printed successfully"),
  })

  const handleDownloadReport = () => {
    // Use the same print functionality but trigger download instead
    handlePrint()
    console.log("Downloading report for booking:", bookingData.id)
  }

  const handleShareReport = () => {
    // This would normally share the report via WhatsApp or email
    console.log("Sharing report for booking:", bookingData.id)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/bookings">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Booking #{bookingData.id}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={bookingData.status === "active" ? "default" : "secondary"}>
            {bookingData.status === "active" ? "Active" : "Completed"}
          </Badge>
          {bookingData.status === "active" && (
            <Button variant="outline" asChild>
              <Link href={`/dashboard/bookings/${params.bookingId}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Booking
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div ref={printRef} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p>{bookingData.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p>{bookingData.customer.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">ID Card</p>
                  <p>{bookingData.customer.idCard}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Driver Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full overflow-hidden">
                  <Image
                    src={bookingData.driver.image || "/placeholder.svg"}
                    alt={bookingData.driver.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div className="grid grid-cols-1 gap-1">
                  <p className="font-medium">{bookingData.driver.name}</p>
                  <p className="text-sm text-muted-foreground">{bookingData.driver.phone}</p>
                  <p className="text-sm text-muted-foreground">ID: {bookingData.driver.idCard}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Car Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative h-48 w-full overflow-hidden rounded-md">
                <Image
                  src={bookingData.car.image || "/placeholder.svg"}
                  alt={`${bookingData.car.model} - ${bookingData.car.color}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Model</p>
                  <p>{bookingData.car.model}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Year</p>
                  <p>{bookingData.car.year}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Color</p>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: bookingData.car.color }} />
                    <span className="capitalize">{bookingData.car.color}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Registration</p>
                  <p>{bookingData.car.registrationNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Chassis Number</p>
                  <p>{bookingData.car.chassisNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Engine Number</p>
                  <p>{bookingData.car.engineNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Initial Meter Reading</p>
                  <p>{bookingData.car.meterReading} km</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Trip Type</p>
                    <p className="capitalize">{bookingData.trip.type.replace("-", " ")}</p>
                  </div>
                  {bookingData.trip.type === "out-of-city" && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">City</p>
                      <p>{bookingData.trip.city}</p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Duration</p>
                    <p>
                      {format(bookingData.trip.startDate, "MMM dd, yyyy")} -{" "}
                      {format(bookingData.trip.endDate, "MMM dd, yyyy")}
                    </p>
                  </div>
                  {bookingData.trip.actualEndDate && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Actual End Date</p>
                      <p>{format(bookingData.trip.actualEndDate, "MMM dd, yyyy")}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                    <p className="text-lg font-semibold">${bookingData.billing.totalAmount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Advance Paid</p>
                    <p>${bookingData.billing.advancePaid}</p>
                  </div>
                  {bookingData.billing.discount > 0 && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Discount</p>
                        <p>{bookingData.billing.discount}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Discount Reference</p>
                        <p>{bookingData.billing.discountReference}</p>
                      </div>
                    </>
                  )}
                  <div className="col-span-2">
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <p className="font-medium">Remaining Amount</p>
                      <p className="font-bold text-lg">${bookingData.billing.remaining}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking Actions</CardTitle>
          <CardDescription>Manage this booking or generate reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {bookingData.status === "active" ? (
              <>
                <Dialog open={isEndingBooking} onOpenChange={setIsEndingBooking}>
                  <DialogTrigger asChild>
                    <Button>End Booking</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>End Booking</DialogTitle>
                      <DialogDescription>Enter the actual end date and time for this booking.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label>Actual End Date</Label>
                        <Input type="datetime-local" onChange={(e) => setActualEndDate(new Date(e.target.value))} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="finalMeterReading">Final Meter Reading (km)</Label>
                        <Input
                          id="finalMeterReading"
                          type="number"
                          value={finalMeterReading}
                          onChange={(e) => setFinalMeterReading(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEndingBooking(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleEndBooking}>End Booking</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" onClick={handleCancelBooking}>
                  Cancel Booking
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/bookings/${params.bookingId}/edit`}>Edit Trip Details</Link>
                </Button>
              </>
            ) : (
              <Button disabled>Booking Completed</Button>
            )}
            <Button variant="outline" onClick={handleDownloadReport}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print Report
            </Button>
            <Button variant="outline" onClick={handleShareReport}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Report
            </Button>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <p>Created on {format(bookingData.createdAt, "MMM dd, yyyy")}</p>
            <p>Created by {bookingData.createdBy}</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

