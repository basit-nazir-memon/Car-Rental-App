"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Calendar, Car, Edit } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data for a specific customer
const customerData = {
  id: 1,
  name: "John Doe",
  phone: "+92 300 1234567",
  idCard: "12345-6789012-3",
  email: "john.doe@example.com",
  address: "123 Main Street, Karachi, Pakistan",
  joinDate: "2022-10-15",
}

// Mock data for customer bookings
const customerBookings = [
  {
    id: 101,
    carModel: "Toyota Corolla",
    carYear: 2022,
    registrationNumber: "ABC-123",
    driverName: "David Johnson",
    startDate: new Date(2023, 2, 15),
    endDate: new Date(2023, 2, 18),
    totalAmount: 15000,
    status: "completed",
  },
  {
    id: 102,
    carModel: "Honda Civic",
    carYear: 2021,
    registrationNumber: "DEF-456",
    driverName: "Michael Brown",
    startDate: new Date(2023, 1, 10),
    endDate: new Date(2023, 1, 15),
    totalAmount: 12500,
    status: "completed",
  },
  {
    id: 103,
    carModel: "Suzuki Swift",
    carYear: 2020,
    registrationNumber: "GHI-789",
    driverName: "John Smith",
    startDate: new Date(2022, 11, 20),
    endDate: new Date(2022, 11, 25),
    totalAmount: 10000,
    status: "completed",
  },
  {
    id: 104,
    carModel: "Toyota Corolla",
    carYear: 2022,
    registrationNumber: "JKL-012",
    driverName: "David Johnson",
    startDate: new Date(2022, 9, 5),
    endDate: new Date(2022, 9, 10),
    totalAmount: 15000,
    status: "completed",
  },
  {
    id: 105,
    carModel: "Honda Civic",
    carYear: 2021,
    registrationNumber: "MNO-345",
    driverName: "Michael Brown",
    startDate: new Date(2023, 3, 1),
    endDate: new Date(2023, 3, 10),
    totalAmount: 25000,
    status: "active",
  },
]

export default function CustomerDetailPage({ params }: { params: { customerId: string } }) {
  const [activeTab, setActiveTab] = useState("details")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/customers">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{customerData.name}</h1>
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
              <CardDescription>View and manage customer details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-lg">{customerData.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                  <p className="text-lg">{customerData.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID Card Number</p>
                  <p className="text-lg">{customerData.idCard}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-lg">{customerData.email}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p className="text-lg">{customerData.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Join Date</p>
                  <p className="text-lg">{customerData.joinDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <p className="text-lg">{customerBookings.length}</p>
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
                  <Link href="/dashboard/bookings/new">New Booking</Link>
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
                {customerBookings.slice(0, 3).map((booking) => (
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
                        {format(booking.startDate, "MMM dd, yyyy")} - {format(booking.endDate, "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">${booking.totalAmount}</div>
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
                  {customerBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="font-medium">{booking.carModel}</div>
                        <div className="text-sm text-muted-foreground">{booking.registrationNumber}</div>
                      </TableCell>
                      <TableCell>{booking.driverName}</TableCell>
                      <TableCell>{format(booking.startDate, "MMM dd, yyyy")}</TableCell>
                      <TableCell>{format(booking.endDate, "MMM dd, yyyy")}</TableCell>
                      <TableCell>${booking.totalAmount}</TableCell>
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

