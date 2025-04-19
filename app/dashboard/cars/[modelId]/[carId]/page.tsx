"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { addDays } from "date-fns"
import { DateRange, DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TextField, Box, Typography, Paper, Grid } from '@mui/material'
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import config from "../../../../../config"
import { CustomerSearch } from "@/components/customer-search"

interface CarDetails {
  id: string
  model: string
  year: number
  color: string
  registrationNumber: string
  chassisNumber: string
  engineNumber: string
  image: string
  createdAt: string
  updatedAt: string
}

interface Driver {
  id: string
  name: string
}

export default function CarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [carDetails, setCarDetails] = useState<CarDetails | null>(null)
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDriversLoading, setIsDriversLoading] = useState(false)
  const [driversError, setDriversError] = useState<string | null>(null)
  const [isBooking, setIsBooking] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null)
  const [tripType, setTripType] = useState("within-city")
  const [cityName, setCityName] = useState("")
  const [totalBill, setTotalBill] = useState(5000)
  const [advancePaid, setAdvancePaid] = useState(2000)
  const [discountPercentage, setDiscountPercentage] = useState(0)
  const [discountReference, setDiscountReference] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [meterReading, setMeterReading] = useState(0)
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    idCard: "",
  })

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("token")
        
        const response = await fetch(`${config.backendUrl}/cars/details/${params.carId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        setCarDetails(data)
      } catch (error) {
        console.error("Error fetching car details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchDrivers = async () => {
      try {
        setIsDriversLoading(true)
        const token = localStorage.getItem("token")
        
        const response = await fetch(`${config.backendUrl}/drivers/names`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        setDrivers(data)
      } catch (error) {
        console.error("Error fetching drivers:", error)
      } finally {
        setIsDriversLoading(false)
      }
    }

    fetchCarDetails()
    fetchDrivers()
  }, [params.carId])

  // Add new useEffect for fetching drivers when date range changes
  useEffect(() => {
    const fetchAvailableDrivers = async () => {
      if (!dateRange?.from || !dateRange?.to) {
        setDrivers([])
        return
      }

      setIsDriversLoading(true)
      setDriversError(null)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(
          `${config.backendUrl}/drivers/available?startDate=${format(dateRange.from, "yyyy-MM-dd")}&endDate=${format(dateRange.to, "yyyy-MM-dd")}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch available drivers")
        }

        const data = await response.json()
        setDrivers(data)
      } catch (error) {
        console.error("Error fetching available drivers:", error)
        setDriversError(error instanceof Error ? error.message : "Failed to fetch available drivers")
        setDrivers([])
      } finally {
        setIsDriversLoading(false)
      }
    }

    fetchAvailableDrivers()
  }, [dateRange])

  // Calculate remaining amount
  const remaining = totalBill - advancePaid - totalBill * (discountPercentage / 100)

  const handleBookCar = async () => {
    if (!selectedDriver) {
      toast.error("Please select a driver")
      return
    }

    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Please select a date range")
      return
    }

    if (!meterReading) {
      toast.error("Please enter meter reading")
      return
    }

    if (!customerDetails.name || !customerDetails.idCard || !customerDetails.phone) {
      toast.error("Please fill in all customer details")
      return
    }

    setIsBooking(true)
    try {
      const response = await fetch(`${config.backendUrl}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          carId: params.carId,
          driverId: selectedDriver,
          tripType,
          cityName: tripType === "out-of-city" ? cityName : null,
          startDate: dateRange.from,
          endDate: dateRange.to,
          meterReading: Number(meterReading),
          totalBill,
          advancePaid,
          discountPercentage,
          discountReference: discountPercentage > 0 ? discountReference : null,
          customerName: customerDetails.name,
          cellNumber: customerDetails.phone,
          idCardNumber: customerDetails.idCard,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to book car")
      }

      toast.success("Car booked successfully!")
      
      // Redirect to bookings page after successful booking
      setTimeout(() => {
        router.push("/dashboard/bookings")
      }, 2000)
    } catch (error) {
      console.error("Error booking car:", error)
      toast.error("Failed to book car. Please try again.")
    } finally {
      setIsBooking(false)
    }
  }

  const handleCustomerSelect = (customer: any) => {
    setCustomerDetails({
      name: customer.fullName,
      phone: customer.phoneNumber,
      idCard: customer.idCardNumber,
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
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

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-24" />
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
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

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!carDetails) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/cars/${params.modelId}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Car Not Found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/cars/${params.modelId}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          Book {carDetails.model} ({carDetails.year})
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Car Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative h-64 w-full overflow-hidden rounded-md">
              <Image
                src={carDetails.image || "/placeholder.svg"}
                alt={`${carDetails.model} - ${carDetails.color}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Model</p>
                <p>{carDetails.model}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Year</p>
                <p>{carDetails.year}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Color</p>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: carDetails.color }} />
                  <span className="capitalize">{carDetails.color}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Registration</p>
                <p>{carDetails.registrationNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Chassis Number</p>
                <p>{carDetails.chassisNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engine Number</p>
                <p>{carDetails.engineNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Meter Reading</p>
                <Input
                  type="number"
                  placeholder="Enter current meter reading"
                  value={meterReading}
                  onChange={(e) => setMeterReading(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Customer Search</Label>
                <CustomerSearch onCustomerSelect={handleCustomerSelect} />
              </div>

              <div className="grid grid-cols-1 gap-4 ">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                    placeholder="Enter customer's full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={customerDetails.phone}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                    placeholder="Enter customer's phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idCard">ID Card Number</Label>
                  <Input
                    id="idCard"
                    value={customerDetails.idCard}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, idCard: e.target.value })}
                    placeholder="Enter customer's ID card number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Driver Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Driver</Label>
                {isDriversLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-6 w-32" />
                      </div>
                    ))}
                  </div>
                ) : driversError ? (
                  <div className="text-sm text-destructive">{driversError}</div>
                ) : drivers.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No drivers available for selected dates</div>
                ) : (
                  <RadioGroup
                    value={selectedDriver || ""}
                    onValueChange={setSelectedDriver}
                  >
                    <div className="grid gap-4">
                      {drivers.map((driver) => (
                        <div key={driver.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={driver.id} id={`driver-${driver.id}`} />
                          <Label htmlFor={`driver-${driver.id}`} className="cursor-pointer">
                            {driver.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Trip Type</Label>
              <RadioGroup value={tripType} onValueChange={setTripType}>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="within-city" id="within-city" />
                    <Label htmlFor="within-city">Within City</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="out-of-city" id="out-of-city" />
                    <Label htmlFor="out-of-city">Out of City</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {tripType === "out-of-city" && (
              <div className="space-y-2">
                <Label htmlFor="cityName">City Name</Label>
                <Input
                  id="cityName"
                  placeholder="Enter destination city"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Trip Duration</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground",
                      !carDetails && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={!carDetails}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DayPicker
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    disabled={(date) => date < new Date()}
                    className="border rounded-md"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="totalBill">Total Bill</Label>
              <Input
                id="totalBill"
                type="number"
                value={totalBill}
                onChange={(e) => setTotalBill(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="advancePaid">Advance Paid</Label>
              <Input
                id="advancePaid"
                type="number"
                value={advancePaid}
                onChange={(e) => setAdvancePaid(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountPercentage">Discount Percentage</Label>
              <Input
                id="discountPercentage"
                type="number"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(Number(e.target.value))}
              />
            </div>

            {discountPercentage > 0 && (
              <div className="space-y-2">
                <Label htmlFor="discountReference">Discount Reference</Label>
                <Input
                  id="discountReference"
                  placeholder="Enter reference for discount"
                  value={discountReference}
                  onChange={(e) => setDiscountReference(e.target.value)}
                />
              </div>
            )}

            <Separator />

            <div className="flex justify-between">
              <span className="font-medium">Remaining Amount:</span>
              <span className="font-bold text-lg">${remaining.toFixed(2)}</span>
            </div>

            <Button 
              className="w-full" 
              onClick={handleBookCar}
              disabled={isBooking}
            >
              {isBooking ? "Booking..." : "Book Now"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

