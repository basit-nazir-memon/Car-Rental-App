"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Download, Printer, Share2, Edit, X } from "lucide-react"
import { format } from "date-fns"
import { useReactToPrint } from "react-to-print"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import config from "../../../../config"

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
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"

interface Booking {
  id: string
  status: string
  customer: {
    name: string
    phone: string
    idCard: string
  }
  car: {
    model: string
    year: number
    color: string
    registrationNumber: string
    chassisNumber: string
    engineNumber: string
    image: string
    meterReading: number
  }
  driver: {
    name: string
    phone: string
    idCard: string
    image: string
  }
  trip: {
    type: string
    city: string
    startDate: string
    endDate: string
    actualEndDate: string | null
    startTime: string
    endTime: string | null
  }
  billing: {
    totalAmount: number
    advancePaid: number
    discount: number
    discountReference: string
    remaining: number
  }
  createdAt: string
  createdBy: string
  updatedAt: string
  lastModifiedBy: string
}

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [bookingData, setBookingData] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEndingBooking, setIsEndingBooking] = useState(false)
  const [actualEndDate, setActualEndDate] = useState<Date>(new Date())
  const [finalMeterReading, setFinalMeterReading] = useState<string>("")
  const printRef = useRef<HTMLDivElement>(null)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [cancellationReason, setCancellationReason] = useState("")
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)
  const [isEndingDialogOpen, setIsEndingDialogOpen] = useState(false)

  const print = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Booking_${bookingData?.id}_Report`,
    onAfterPrint: () => console.log("Printed successfully"),
  })

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const token = localStorage.getItem("token")
        const response = await fetch(
          `${config.backendUrl}/bookings/${params.bookingId}/details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch booking details")
        }

        const data = await response.json()
        setBookingData(data)
      } catch (error) {
        console.error("Error fetching booking details:", error)
        setError("Failed to load booking details. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.bookingId) {
      fetchBookingDetails()
    }
  }, [params.bookingId])

  const handleEndBooking = async () => {
    if (!actualEndDate || !finalMeterReading) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setIsEndingBooking(true)
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${config.backendUrl}/bookings/${params.bookingId}/end`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endTime: actualEndDate.toISOString(),
          finalMeterReading: Number(finalMeterReading),
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Please login again")
        }
        throw new Error("Failed to end booking")
      }

      toast.success("Booking ended successfully")
      setIsEndingBooking(false)
      setIsEndingDialogOpen(false)
      // router.refresh()
      setBookingData(prevData => prevData ? { ...prevData, status: "completed" } : null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to end booking")
      console.error("Error ending booking:", error)
    } finally {
      setIsEndingBooking(false)
    }
  }

  const handleCancelBooking = async () => {
    if (!cancellationReason.trim()) {
      setCancelError("Please provide a cancellation reason")
      return
    }

    setIsCancelling(true)
    setCancelError(null)

    try {
      const response = await fetch(`${config.backendUrl}/bookings/${params.bookingId}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          cancellationReason: cancellationReason.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to cancel booking")
      }

      // Refresh the page to show updated status
      router.refresh()
      setIsCancelDialogOpen(false)
    } catch (error) {
      console.error("Error cancelling booking:", error)
      setCancelError("Failed to cancel booking. Please try again.")
    } finally {
      setIsCancelling(false)
    }
  }

  const handlePrint = () => {
    if (printRef.current) {
      print()
    }
  }

  const handleDownloadReport = () => {
    handlePrint()
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Error</h1>
          <Button variant="outline" asChild>
            <Link href="/dashboard/bookings">Back to Bookings</Link>
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive">{error}</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!bookingData) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Booking Not Found</h1>
          <Button variant="outline" asChild>
            <Link href="/dashboard/bookings">Back to Bookings</Link>
          </Button>
        </div>
      </div>
    )
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
          <Badge variant={bookingData.status === "active" ? "default" : bookingData.status === "cancelled" ? "destructive" : "secondary"}>
            {bookingData.status === "active" ? "Active" : bookingData.status === "cancelled" ? "Cancelled" : "Completed"}
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
                      {format(new Date(bookingData.trip.startDate), "MMM dd, yyyy")} -{" "}
                      {format(new Date(bookingData.trip.endDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                  {bookingData.trip.actualEndDate && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Actual End Date</p>
                      <p>{format(new Date(bookingData.trip.actualEndDate), "MMM dd, yyyy")}</p>
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
                <Dialog open={isEndingDialogOpen} onOpenChange={setIsEndingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>End Booking</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>End Booking</DialogTitle>
                      <DialogDescription>Enter the final meter reading and time for this booking.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
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
                      <div className="grid gap-2">
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={format(actualEndDate, "HH:mm")}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(":")
                            const newDate = new Date(actualEndDate)
                            newDate.setHours(parseInt(hours))
                            newDate.setMinutes(parseInt(minutes))
                            setActualEndDate(newDate)
                          }}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEndingDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleEndBooking} disabled={isEndingBooking}>
                        {isEndingBooking ? "Ending Booking..." : "End Booking"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCancelDialogOpen(true)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel Booking
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/bookings/${params.bookingId}/edit`}>Edit Trip Details</Link>
                </Button>
              </>
            ) : (
              <Button disabled>{bookingData.status === "cancelled" ? "Booking Cancelled" : "Booking Completed"}</Button>
            )}
            <Button variant="outline" onClick={handleDownloadReport}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print Report
            </Button>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <p>Created on {format(new Date(bookingData.createdAt), "MMM dd, yyyy")}</p>
            <p>Created by {bookingData.createdBy}</p>
          </div>
        </CardFooter>
      </Card>

      {/* <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={() => setIsCancelDialogOpen(true)}
          className="text-destructive hover:text-destructive"
        >
          <X className="mr-2 h-4 w-4" />
          Cancel Booking
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/bookings">Back to Bookings</Link>
        </Button>
      </div> */}

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this booking.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter cancellation reason..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              className="min-h-[100px]"
            />
            {cancelError && (
              <p className="text-sm text-destructive">{cancelError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
              disabled={isCancelling}
            >
              Back
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

