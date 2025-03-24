"use client"

import type React from "react"

import { useState } from "react"
import { Search, UserPlus } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

// Mock data for drivers
const drivers = [
  {
    id: 1,
    name: "John Smith",
    idCard: "12345-6789012-3",
    address: "123 Main Street, Karachi, Pakistan",
    age: 35,
    status: "available",
    totalTrips: 45,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "David Johnson",
    idCard: "98765-4321098-7",
    address: "456 Park Avenue, Lahore, Pakistan",
    age: 42,
    status: "on-trip",
    totalTrips: 78,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Michael Brown",
    idCard: "45678-9012345-6",
    address: "789 Garden Road, Islamabad, Pakistan",
    age: 28,
    status: "available",
    totalTrips: 32,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "Robert Williams",
    idCard: "78901-2345678-9",
    address: "321 River View, Karachi, Pakistan",
    age: 38,
    status: "on-trip",
    totalTrips: 56,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function DriversPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [newDriver, setNewDriver] = useState({
    name: "",
    idCard: "",
    address: "",
    age: "",
    image: null as File | null,
  })

  // Filter drivers based on search query
  const filteredDrivers = drivers.filter(
    (driver) => driver.name.toLowerCase().includes(searchQuery.toLowerCase()) || driver.idCard.includes(searchQuery),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target

    if (id === "image" && files && files.length > 0) {
      setNewDriver((prev) => ({ ...prev, image: files[0] }))
    } else {
      setNewDriver((prev) => ({ ...prev, [id]: value }))
    }
  }

  const handleAddDriver = () => {
    // This would normally add the driver to the database
    console.log("Adding driver:", newDriver)
    // Reset form
    setNewDriver({ name: "", idCard: "", address: "", age: "", image: null })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Drivers</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Driver
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Driver</DialogTitle>
              <DialogDescription>Enter the driver details below to add them to the system.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newDriver.name}
                  onChange={handleInputChange}
                  placeholder="Enter driver's full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="idCard">ID Card Number (CNIC)</Label>
                <Input
                  id="idCard"
                  value={newDriver.idCard}
                  onChange={handleInputChange}
                  placeholder="Enter driver's ID card number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newDriver.address}
                  onChange={handleInputChange}
                  placeholder="Enter driver's address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={newDriver.age}
                  onChange={handleInputChange}
                  placeholder="Enter age"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Driver's Picture</Label>
                <Input id="image" type="file" accept="image/*" onChange={handleInputChange} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddDriver}>Add Driver</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name or ID card..."
          className="w-full bg-background pl-8 md:w-[300px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Driver List</CardTitle>
          <CardDescription>Manage your drivers and view their trip history.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead>ID Card</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Trips</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <Image
                          src={driver.image || "/placeholder.svg"}
                          alt={driver.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{driver.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">{driver.address}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{driver.idCard}</TableCell>
                  <TableCell>{driver.age}</TableCell>
                  <TableCell>
                    <Badge variant={driver.status === "available" ? "default" : "secondary"}>
                      {driver.status === "available" ? "Available" : "On Trip"}
                    </Badge>
                  </TableCell>
                  <TableCell>{driver.totalTrips}</TableCell>
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
    </div>
  )
}

