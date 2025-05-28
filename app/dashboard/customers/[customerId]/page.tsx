"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Calendar, Car, Edit } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import config from "../../../../config"
import { useParams } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

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

interface Booking {
  id: string
  carModel: string
  carYear: number
  registrationNumber: string
  driverName: string
  startDate: string
  endDate: string
  totalAmount: number
  status: string
  tripType: string
  advancePaid: number
  remainingAmount: number
  discountPercentage: number
  meterReading: number
}

interface Statistics {
  totalBookings: number
  totalSpent: number
  completedBookings: number
  activeBookings: number
  averageBookingAmount: number
}

interface CustomerDetails {
  customerData: CustomerData
  customerBookings: Booking[]
  statistics: Statistics
}

export default function CustomerDetailPage() {
  const [activeTab, setActiveTab] = useState("details")
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const params = useParams();
  const customerId = params.customerId as string;

  useEffect(() => {
    fetchCustomerDetails()
  }, [params.customerId])

  const fetchCustomerDetails = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch(`${config.backendUrl}/customers/${params.customerId}/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch customer details")
      }

      const data = await response.json()
      setCustomerDetails(data)
    } catch (error) {
      console.error("Error fetching customer details:", error)
      toast.error("Failed to fetch customer details")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCNIC = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "")
    
    // Format as XXXXX-XXXXXXX-X
    if (digits.length <= 5) return digits
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    
    if (!customerDetails) return

    if (id === "idCard") {
      setCustomerDetails({
        ...customerDetails,
        customerData: {
          ...customerDetails.customerData,
          idCard: formatCNIC(value)
        }
      })
    } else {
      setCustomerDetails({
        ...customerDetails,
        customerData: {
          ...customerDetails.customerData,
          [id]: value
        }
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard/customers">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Loading...</h1>
          </div>
          <Button disabled>
            <Edit className="mr-2 h-4 w-4" />
            Edit Customer
          </Button>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-96 w-full rounded-lg bg-muted" />
        </div>
      </div>
    )
  }

  if (!customerDetails) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard/customers">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Customer Not Found</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/customers">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{customerDetails.customerData.name}</h1>
        </div>
        <Button asChild>
          <Link href={`/dashboard/customers/${params.customerId}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Customer
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="details" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Customer Details</TabsTrigger>
          <TabsTrigger value="bookings">Booking History</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>View customer details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                    <p className="text-lg">{customerDetails.customerData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Care Of</p>
                    <p className="text-lg">{customerDetails.customerData.careOf || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                    <p className="text-lg">{customerDetails.customerData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ID Card Number</p>
                    <p className="text-lg">{customerDetails.customerData.idCard}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-lg">{customerDetails.customerData.email || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <p className="text-lg">{customerDetails.customerData.address || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Join Date</p>
                    <p className="text-lg">{format(new Date(customerDetails.customerData.joinDate), "MMM dd, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                    <p className="text-lg">{customerDetails.statistics.totalBookings}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/customers/${params.customerId}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Details
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/dashboard/cars">New Booking</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>The customer's most recent bookings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {customerDetails.customerBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      {booking.status === "active" ? (
                        <Calendar className="h-5 w-5 text-primary" />
                      ) : (
                        <Car className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {booking.carModel} ({booking.carYear})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.startDate), "MMM dd, yyyy")} -{" "}
                        {format(new Date(booking.endDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">Rs. {booking.totalAmount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking History</CardTitle>
              <CardDescription>View all bookings made by this customer.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Car</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerDetails.customerBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="font-medium">{booking.carModel}</div>
                        <div className="text-sm text-muted-foreground">{booking.registrationNumber}</div>
                      </TableCell>
                      <TableCell>{booking.driverName}</TableCell>
                      <TableCell>{format(new Date(booking.startDate), "MMM dd, yyyy")}</TableCell>
                      <TableCell>{format(new Date(booking.endDate), "MMM dd, yyyy")}</TableCell>
                      <TableCell>Rs. {booking.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={booking.status === "active" ? "default" : "secondary"}>
                          {booking.status === "active" ? "Active" : "Completed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/bookings/${booking.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

