"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Calendar, Car, Phone, MapPin, Mail, Edit } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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

// Mock data for a specific driver
const driverData = {
  id: 1,
  name: "John Smith",
  idCard: "12345-6789012-3",
  licenseNumber: "DL-2022-123456",
  phone: "+92 300 1234567",
  email: "john.smith@example.com",
  address: "123 Main Street, Karachi, Pakistan",
  age: 35,
  dateOfJoining: "2021-05-15",
  status: "available",
  totalTrips: 45,
  rating: 4.8,
  image: "/placeholder.svg?height=300&width=300",
  emergencyContact: {
    name: "Sarah Smith",
    relation: "Wife",
    phone: "+92 301 2345678",
  },
  documents: [
    { name: "Driver's License", status: "verified", expiryDate: "2025-05-15" },
    { name: "ID Card", status: "verified", expiryDate: "2030-01-01" },
    { name: "Medical Certificate", status: "verified", expiryDate: "2023-12-31" },
  ],
}

// Mock data for driver trips
const driverTrips = [
  {
    id: 101,
    carModel: "Toyota Corolla",
    carYear: 2022,
    registrationNumber: "ABC-123",
    customerName: "John Doe",
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
    customerName: "Jane Smith",
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
    customerName: "Robert Williams",
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
    customerName: "Emily Johnson",
    startDate: new Date(2023, 3, 1),
    endDate: new Date(2023, 3, 10),
    totalAmount: 25000,
    status: "active",
  },
]

export default function DriverDetailPage({ params }: { params: { driverId: string } }) {
  const [activeTab, setActiveTab] = useState("details")
  const [isEditingDriver, setIsEditingDriver] = useState(false)
  const [editedDriver, setEditedDriver] = useState({
    phone: driverData.phone,
    email: driverData.email,
    address: driverData.address,
    emergencyContactName: driverData.emergencyContact.name,
    emergencyContactRelation: driverData.emergencyContact.relation,
    emergencyContactPhone: driverData.emergencyContact.phone,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setEditedDriver((prev) => ({ ...prev, [id]: value }))
  }

  const handleUpdateDriver = () => {
    // This would normally update the driver in the database
    console.log("Updating driver:", editedDriver)
    setIsEditingDriver(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/drivers">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{driverData.name}</h1>
        <Badge variant={driverData.status === "available" ? "default" : "secondary"}>
          {driverData.status === "available" ? "Available" : "On Trip"}
        </Badge>
      </div>

      <Tabs defaultValue="details" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Driver Details</TabsTrigger>
          <TabsTrigger value="trips">Trip History</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="relative h-48 w-48 overflow-hidden rounded-full">
                  <Image
                    src={driverData.image || "/placeholder.svg"}
                    alt={driverData.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold">{driverData.name}</h2>
                  <p className="text-sm text-muted-foreground">Driver ID: {driverData.id}</p>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(driverData.rating) ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm font-medium">{driverData.rating}</span>
                  </div>
                </div>
                <div className="mt-2 w-full space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{driverData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{driverData.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <span>{driverData.address}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Dialog open={isEditingDriver} onOpenChange={setIsEditingDriver}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Driver Details</DialogTitle>
                      <DialogDescription>Update the driver's contact information and other details.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" value={editedDriver.phone} onChange={handleInputChange} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={editedDriver.email} onChange={handleInputChange} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea id="address" value={editedDriver.address} onChange={handleInputChange} />
                      </div>
                      <div className="grid gap-2">
                        <Label>Emergency Contact</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            id="emergencyContactName"
                            placeholder="Name"
                            value={editedDriver.emergencyContactName}
                            onChange={handleInputChange}
                          />
                          <Input
                            id="emergencyContactRelation"
                            placeholder="Relation"
                            value={editedDriver.emergencyContactRelation}
                            onChange={handleInputChange}
                          />
                        </div>
                        <Input
                          id="emergencyContactPhone"
                          placeholder="Phone"
                          value={editedDriver.emergencyContactPhone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditingDriver(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateDriver}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ID Card Number</p>
                    <p className="text-lg">{driverData.idCard}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">License Number</p>
                    <p className="text-lg">{driverData.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Age</p>
                    <p className="text-lg">{driverData.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date of Joining</p>
                    <p className="text-lg">{driverData.dateOfJoining}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Trips</p>
                    <p className="text-lg">{driverData.totalTrips}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="mb-2 text-lg font-semibold">Emergency Contact</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Name</p>
                      <p className="text-lg">{driverData.emergencyContact.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Relation</p>
                      <p className="text-lg">{driverData.emergencyContact.relation}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="text-lg">{driverData.emergencyContact.phone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>The driver's most recent trips.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {driverTrips.slice(0, 3).map((trip) => (
                  <div key={trip.id} className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      {trip.status === "active" ? (
                        <Calendar className="h-5 w-5 text-primary" />
                      ) : (
                        <Car className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {trip.carModel} ({trip.carYear}) - {trip.customerName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(trip.startDate, "MMM dd, yyyy")} - {format(trip.endDate, "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">${trip.totalAmount}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trip History</CardTitle>
              <CardDescription>View all trips made by this driver.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Car</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {driverTrips.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell>
                        <div className="font-medium">{trip.carModel}</div>
                        <div className="text-sm text-muted-foreground">{trip.registrationNumber}</div>
                      </TableCell>
                      <TableCell>{trip.customerName}</TableCell>
                      <TableCell>{format(trip.startDate, "MMM dd, yyyy")}</TableCell>
                      <TableCell>{format(trip.endDate, "MMM dd, yyyy")}</TableCell>
                      <TableCell>${trip.totalAmount}</TableCell>
                      <TableCell>
                        <Badge variant={trip.status === "active" ? "default" : "secondary"}>
                          {trip.status === "active" ? "Active" : "Completed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/bookings/${trip.id}`}>View</Link>
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
              <CardTitle>Driver Documents</CardTitle>
              <CardDescription>View and manage driver's documents and their verification status.</CardDescription>
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
                  {driverData.documents.map((document) => (
                    <TableRow key={document.name}>
                      <TableCell className="font-medium">{document.name}</TableCell>
                      <TableCell>
                        <Badge variant={document.status === "verified" ? "default" : "destructive"}>
                          {document.status === "verified" ? "Verified" : "Not Verified"}
                        </Badge>
                      </TableCell>
                      <TableCell>{document.expiryDate}</TableCell>
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
      </Tabs>
    </div>
  )
}

