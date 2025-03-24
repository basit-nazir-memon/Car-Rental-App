"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Calendar, AlertTriangle, DollarSign } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for a specific car
const carData = {
  id: 1,
  model: "Toyota Corolla",
  year: 2022,
  color: "red",
  registrationNumber: "ABC-123",
  chassisNumber: "TC2022RED001",
  engineNumber: "ENG2022001",
  meterReading: 12500,
  purchaseDate: "2021-10-15",
  purchasePrice: 2500000,
  currentValue: 2300000,
  status: "available",
  image: "/placeholder.svg?height=400&width=600",
  documents: [
    { name: "Registration Certificate", status: "verified", expiryDate: "2025-10-15" },
    { name: "Insurance Policy", status: "verified", expiryDate: "2023-10-15" },
    { name: "Fitness Certificate", status: "verified", expiryDate: "2023-12-31" },
  ],
  maintenanceHistory: [
    {
      id: 1,
      date: new Date(2023, 2, 15),
      type: "Oil Change",
      cost: 5000,
      description: "Regular oil change and filter replacement",
      meterReading: 10000,
    },
    {
      id: 2,
      date: new Date(2023, 1, 10),
      type: "Brake Service",
      cost: 8000,
      description: "Front brake pads replacement",
      meterReading: 8500,
    },
    {
      id: 3,
      date: new Date(2022, 11, 5),
      type: "Tire Replacement",
      cost: 20000,
      description: "All four tires replaced",
      meterReading: 7000,
    },
  ],
  financials: {
    totalRevenue: 225000,
    totalProfit: 135000,
    totalExpenses: 90000,
    commission: 15,
    commissionAmount: 33750,
  },
}

// Mock data for car bookings
const carBookings = [
  {
    id: 101,
    customerName: "John Doe",
    driverName: "David Johnson",
    startDate: new Date(2023, 2, 15),
    endDate: new Date(2023, 2, 18),
    totalAmount: 15000,
    status: "completed",
  },
  {
    id: 102,
    customerName: "Jane Smith",
    driverName: "Michael Brown",
    startDate: new Date(2023, 1, 10),
    endDate: new Date(2023, 1, 15),
    totalAmount: 12500,
    status: "completed",
  },
  {
    id: 103,
    customerName: "Robert Williams",
    driverName: "John Smith",
    startDate: new Date(2022, 11, 20),
    endDate: new Date(2022, 11, 25),
    totalAmount: 10000,
    status: "completed",
  },
  {
    id: 104,
    customerName: "Emily Johnson",
    driverName: "David Johnson",
    startDate: new Date(2023, 3, 1),
    endDate: new Date(2023, 3, 10),
    totalAmount: 25000,
    status: "active",
  },
]

// Monthly revenue data for charts
const monthlyRevenueData = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 38000 },
  { month: "Mar", revenue: 45000 },
  { month: "Apr", revenue: 50000 },
]

export default function MyCarDetailPage({ params }: { params: { carId: string } }) {
  const [activeTab, setActiveTab] = useState("details")
  const [isAddingMaintenance, setIsAddingMaintenance] = useState(false)
  const [newMaintenance, setNewMaintenance] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    type: "Oil Change",
    cost: "",
    description: "",
    meterReading: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewMaintenance((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value: string) => {
    setNewMaintenance((prev) => ({ ...prev, type: value }))
  }

  const handleAddMaintenance = () => {
    // This would normally add the maintenance record to the database
    console.log("Adding maintenance record:", newMaintenance)
    setIsAddingMaintenance(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/my-cars">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {carData.model} ({carData.year})
        </h1>
        <Badge variant={carData.status === "available" ? "default" : "secondary"}>
          {carData.status === "available" ? "Available" : "On Trip"}
        </Badge>
      </div>

      <Tabs defaultValue="details" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Car Details</TabsTrigger>
          <TabsTrigger value="bookings">Booking History</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Car Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative h-64 w-full overflow-hidden rounded-md">
                  <Image
                    src={carData.image || "/placeholder.svg"}
                    alt={`${carData.model} - ${carData.color}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Model</p>
                    <p>{carData.model}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Year</p>
                    <p>{carData.year}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Color</p>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: carData.color }} />
                      <span className="capitalize">{carData.color}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Registration</p>
                    <p>{carData.registrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Chassis Number</p>
                    <p>{carData.chassisNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Engine Number</p>
                    <p>{carData.engineNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Meter Reading</p>
                    <p>{carData.meterReading} km</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Purchase Date</p>
                    <p>{carData.purchaseDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Purchase Price</p>
                    <p>Rs. {carData.purchasePrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Value</p>
                    <p>Rs. {carData.currentValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Depreciation</p>
                    <p>Rs. {(carData.purchasePrice - carData.currentValue).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="mb-2 text-lg font-semibold">Performance Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <p className="text-lg font-semibold">${carData.financials.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                      <p className="text-lg font-semibold">${carData.financials.totalExpenses.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Commission ({carData.financials.commission}%)
                      </p>
                      <p className="text-lg font-semibold">${carData.financials.commissionAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                      <p className="text-lg font-semibold">${carData.financials.totalProfit.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>The car's most recent bookings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {carBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      {booking.status === "active" ? (
                        <Calendar className="h-5 w-5 text-primary" />
                      ) : (
                        <Calendar className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {booking.customerName} (Driver: {booking.driverName})
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
              <CardDescription>View all bookings for this car.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.customerName}</TableCell>
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

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Maintenance History</CardTitle>
                <CardDescription>View and manage maintenance records for this car.</CardDescription>
              </div>
              <Dialog open={isAddingMaintenance} onOpenChange={setIsAddingMaintenance}>
                <DialogTrigger asChild>
                  <Button>Add Maintenance Record</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Maintenance Record</DialogTitle>
                    <DialogDescription>
                      Enter the details of the maintenance work performed on the car.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" value={newMaintenance.date} onChange={handleInputChange} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="type">Maintenance Type</Label>
                        <Select value={newMaintenance.type} onValueChange={handleSelectChange}>
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Oil Change">Oil Change</SelectItem>
                            <SelectItem value="Brake Service">Brake Service</SelectItem>
                            <SelectItem value="Tire Replacement">Tire Replacement</SelectItem>
                            <SelectItem value="Battery Replacement">Battery Replacement</SelectItem>
                            <SelectItem value="General Service">General Service</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="cost">Cost</Label>
                        <Input
                          id="cost"
                          type="number"
                          placeholder="Enter cost"
                          value={newMaintenance.cost}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="meterReading">Meter Reading (km)</Label>
                        <Input
                          id="meterReading"
                          type="number"
                          placeholder="Enter meter reading"
                          value={newMaintenance.meterReading}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter details of the maintenance work"
                        value={newMaintenance.description}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingMaintenance(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddMaintenance}>Add Record</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Meter Reading</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carData.maintenanceHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{format(record.date, "MMM dd, yyyy")}</TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell className="max-w-[300px] truncate">{record.description}</TableCell>
                      <TableCell>{record.meterReading} km</TableCell>
                      <TableCell>${record.cost}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Car Documents</CardTitle>
              <CardDescription>View and manage documents for this car.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carData.documents.map((document) => (
                    <TableRow key={document.name}>
                      <TableCell className="font-medium">{document.name}</TableCell>
                      <TableCell>
                        <Badge variant={document.status === "verified" ? "default" : "destructive"}>
                          {document.status === "verified" ? "Verified" : "Not Verified"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {new Date(document.expiryDate) < new Date() && (
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          )}
                          {document.expiryDate}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View Document
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6">
                <Button>Upload New Document</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financials" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${carData.financials.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Lifetime earnings from this car</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${carData.financials.totalExpenses.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Including maintenance and repairs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${carData.financials.totalProfit.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">After commission and expenses</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Revenue generated by this car per month.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                  Revenue Chart (This would be a real chart in production)
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>Detailed breakdown of revenue, expenses, and profit.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Total Revenue</TableCell>
                    <TableCell>${carData.financials.totalRevenue.toLocaleString()}</TableCell>
                    <TableCell>100%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Commission ({carData.financials.commission}%)</TableCell>
                    <TableCell>${carData.financials.commissionAmount.toLocaleString()}</TableCell>
                    <TableCell>{carData.financials.commission}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Maintenance Expenses</TableCell>
                    <TableCell>${carData.financials.totalExpenses.toLocaleString()}</TableCell>
                    <TableCell>
                      {Math.round((carData.financials.totalExpenses / carData.financials.totalRevenue) * 100)}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Net Profit</TableCell>
                    <TableCell>${carData.financials.totalProfit.toLocaleString()}</TableCell>
                    <TableCell>
                      {Math.round((carData.financials.totalProfit / carData.financials.totalRevenue) * 100)}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

