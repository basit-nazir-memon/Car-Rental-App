"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Trash2 } from "lucide-react"
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
import { Camera } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  variant: string
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
    careOf: "",
  })
  const [isAdmin, setIsAdmin] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [driverPreference, setDriverPreference] = useState<"driver" | "self">("driver")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [tripDescription, setTripDescription] = useState("")
  const [tripStartTime, setTripStartTime] = useState("09:00")

  // Add max date calculation
  const maxDate = addDays(new Date(), 7)

  // Generate time options for every 30 minutes
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minute = i % 2 === 0 ? "00" : "30"
    return `${hour.toString().padStart(2, "0")}:${minute}`
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

  const formatCNIC = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '')
    
    // Format as XXXXX-XXXXXXX-X
    if (digits.length <= 5) {
      return digits
    } else if (digits.length <= 12) {
      return `${digits.slice(0, 5)}-${digits.slice(5)}`
    } else {
      return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`
    }
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '')
    
    // Ensure it starts with 03 and is exactly 11 digits
    if (digits.length > 0 && !digits.startsWith('03')) {
      return '03' + digits.slice(0, 9)
    }
    return digits.slice(0, 11)
  }

  const handleCNICChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCNIC(e.target.value)
    setCustomerDetails(prev => ({ ...prev, idCard: formattedValue }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value)
    setCustomerDetails(prev => ({ ...prev, phone: formattedValue }))
  }

  const handleBookCar = async () => {
    if (driverPreference === "driver" && !selectedDriver) {
      toast.error("Please select a driver")
      return
    }

    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Please select a date range")
      return
    }

    // Add date validation
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const maxDate = addDays(today, 7)

    if (dateRange.from < today) {
      toast.error("Booking start date cannot be in the past")
      return
    }

    if (dateRange.from > maxDate) {
      toast.error("Bookings can only be made up to 7 days in advance")
      return
    }

    if (!meterReading) {
      toast.error("Please enter meter reading")
      return
    }

    // Validate CNIC format
    const cnicDigits = customerDetails.idCard.replace(/\D/g, '')
    if (cnicDigits.length !== 13) {
      toast.error("Please enter a valid CNIC number")
      return
    }

    // Validate phone number format
    if (customerDetails.phone.length !== 11 || !customerDetails.phone.startsWith('03')) {
      toast.error("Please enter a valid phone number starting with 03")
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
          driverId: driverPreference === "driver" ? selectedDriver : null,
          driverPreference,
          customerLicenseNumber: driverPreference === "self" ? licenseNumber : null,
          tripType,
          cityName: tripType === "out-of-city" ? cityName : null,
          startDate: dateRange.from,
          endDate: dateRange.to,
          tripStartTime,
          tripDescription,
          meterReading: Number(meterReading),
          totalBill,
          advancePaid,
          discountPercentage,
          discountReference: discountPercentage > 0 ? discountReference : null,
          customerName: customerDetails.name,
          cellNumber: customerDetails.phone,
          idCardNumber: customerDetails.idCard,
          careOf: customerDetails.careOf,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to book car")
      }

      toast.success("Car booked successfully!")
      
      // Redirect to bookings page after successful booking
      setTimeout(() => {
        router.push("/dashboard/bookings")
      }, 2000)
    } catch (error) {
      console.error("Error booking car:", error)
      toast.error(error instanceof Error ? error.message : "Failed to book car. Please try again.")
    } finally {
      setIsBooking(false)
    }
  }

  const handleCustomerSelect = (customer: any) => {
    setCustomerDetails({
      name: customer.fullName,
      phone: customer.phoneNumber,
      idCard: customer.idCardNumber,
      careOf: customer.careOf,
    })
  }

  useEffect(() => {
    // Check for admin role on client side
    const role = localStorage.getItem("role")
    setIsAdmin(role === "admin")
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("image", file)

      const token = localStorage.getItem("token")
      const response = await fetch(`${config.backendUrl}/cars/upload-image/${params.carId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to upload image")
      }

      const data = await response.json()
      setCarDetails(prev => prev ? { ...prev, image: data.image_url } : null)
      toast.success("Image updated successfully")
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error(error instanceof Error ? error.message : "Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteCar = async () => {
    if (!window.confirm("Are you sure you want to delete this car? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${config.backendUrl}/cars/${params.carId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json() 
        throw new Error(errorData.error || "Failed to delete car")
      }

      toast.success("Car deleted successfully")
      router.push(`/dashboard/cars/${params.modelId}`)
    } catch (error) {
      console.error("Error deleting car:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete car")
    } finally {
      setIsDeleting(false)
    }
  }

  // Add function to handle date selection
  const handleDateSelect = (range: DateRange | undefined) => {
    if (!range?.from) {
      setDateRange(range)
      return
    }

    // If start date is selected and it's within 7 days
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (range.from < today) {
      toast.error("Booking start date cannot be in the past")
      return
    }

    if (range.from > maxDate) {
      toast.error("Bookings can only be made up to 7 days in advance")
      return
    }

    // If end date is selected, ensure it's after start date
    if (range.to && range.to < range.from) {
      toast.error("End date must be after start date")
      return
    }

    setDateRange(range)
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
      <div className="flex items-center justify-between">
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
        {isAdmin && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteCar}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete Car"}
          </Button>
        )}
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
                loading="lazy"
                className="object-cover"
              />
              {isAdmin && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white hover:bg-white/20 transition-colors">
                      <Camera className="h-5 w-5" />
                      <span>{isUploading ? "Uploading..." : "Change Image"}</span>
                    </div>
                  </label>
                </div>
              )}
            </div>
            {/* <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="relative aspect-video overflow-hidden rounded-lg"> */}
              {/* <Image
                src={carDetails.image || "/placeholder.svg"}
                alt={carDetails.model || "Car image"}
                fill
                className="object-cover"
              /> */}
              
            {/* </div>
          </div> */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Model</p>
                <p>{carDetails.model}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Variant</p>
                <p>{carDetails.variant || "N/A"}</p>
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
                    onChange={handlePhoneChange}
                    placeholder="03XXXXXXXXX"
                    maxLength={11}
                    pattern="^03[0-9]{9}$"
                  />
                  {customerDetails.phone && customerDetails.phone.length !== 11 && (
                    <p className="text-sm text-destructive">Phone number must be 11 digits starting with 03</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idCard">CNIC Number</Label>
                  <Input
                    id="idCard"
                    value={customerDetails.idCard}
                    onChange={handleCNICChange}
                    placeholder="XXXXX-XXXXXXX-X"
                    maxLength={15}
                  />
                  {customerDetails.idCard && customerDetails.idCard.replace(/\D/g, '').length !== 13 && (
                    <p className="text-sm text-destructive">CNIC must be 13 digits</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="careOf">Care Of</Label>
                  <Input
                    id="careOf"
                    value={customerDetails.careOf}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, careOf: e.target.value })}
                    placeholder="Enter care of person name"
                    // required
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
                <Label>Driver Preference</Label>
                <RadioGroup value={driverPreference} onValueChange={(value) => {
                  setDriverPreference(value as "driver" | "self")
                  setSelectedDriver(null) // Reset selected driver when switching preference
                }}>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="driver" id="with-driver" />
                      <Label htmlFor="with-driver">With Driver</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="self" id="self-drive" />
                      <Label htmlFor="self-drive">Self Drive</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {driverPreference === "self" ? (
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number (Optional)</Label>
                  <Input
                    id="licenseNumber"
                    placeholder="Enter your license number"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                  />
                </div>
              ) : (
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
              )}
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
                    onSelect={handleDateSelect}
                    numberOfMonths={2}
                    disabled={(date) => {
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      
                      if (dateRange?.from) {
                        return date < dateRange.from
                      }
                      
                      return date < today || date > maxDate
                    }}
                    className="border rounded-md"
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground">
                Start date must be within the next 7 days. End date can be any date after the start date.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tripStartTime">Trip Start Time</Label>
              <Select
                value={tripStartTime}
                onValueChange={setTripStartTime}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tripDescription">Trip Description</Label>
              <Textarea
                id="tripDescription"
                placeholder="Enter trip details, purpose, or any special requirements..."
                value={tripDescription}
                onChange={(e) => setTripDescription(e.target.value)}
                className="min-h-[100px]"
              />
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
              <span className="font-bold text-lg">Rs. {remaining.toFixed(2)}</span>
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

