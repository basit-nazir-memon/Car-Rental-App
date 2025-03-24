"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Plus, BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for stakeholder's cars
const stakeholderCars = [
  {
    id: 1,
    model: "Toyota Corolla",
    year: 2022,
    color: "red",
    registrationNumber: "ABC-123",
    chassisNumber: "TC2022RED001",
    engineNumber: "ENG2022001",
    image: "/placeholder.svg?height=200&width=300",
    available: true,
    totalBookings: 15,
    totalRevenue: 225000,
    totalProfit: 135000,
  },
  {
    id: 2,
    model: "Honda Civic",
    year: 2021,
    color: "blue",
    registrationNumber: "DEF-456",
    chassisNumber: "HC2021BLU001",
    engineNumber: "ENG2021001",
    image: "/placeholder.svg?height=200&width=300",
    available: false,
    totalBookings: 12,
    totalRevenue: 180000,
    totalProfit: 108000,
  },
  {
    id: 3,
    model: "Suzuki Swift",
    year: 2020,
    color: "white",
    registrationNumber: "GHI-789",
    chassisNumber: "SS2020WHT001",
    engineNumber: "ENG2020001",
    image: "/placeholder.svg?height=200&width=300",
    available: true,
    totalBookings: 18,
    totalRevenue: 180000,
    totalProfit: 108000,
  },
]

// Car models for selection
const carModels = ["Toyota Corolla", "Honda Civic", "Suzuki Swift", "Nissan Altima", "Hyundai Elantra", "Kia Sportage"]

// Car colors for selection
const carColors = ["red", "blue", "white", "black", "silver", "gray"]

export default function MyCarPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [newCar, setNewCar] = useState({
    model: "",
    year: new Date().getFullYear().toString(),
    color: "",
    registrationNumber: "",
    chassisNumber: "",
    engineNumber: "",
    image: null as File | null,
  })

  // Filter cars based on search query
  const filteredCars = stakeholderCars.filter(
    (car) =>
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.color.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target

    if (id === "image" && files && files.length > 0) {
      setNewCar((prev) => ({ ...prev, image: files[0] }))
    } else {
      setNewCar((prev) => ({ ...prev, [id]: value }))
    }
  }

  const handleSelectChange = (id: string, value: string) => {
    setNewCar((prev) => ({ ...prev, [id]: value }))
  }

  const handleAddCar = () => {
    // This would normally add the car to the database
    console.log("Adding car:", newCar)
    // Reset form
    setNewCar({
      model: "",
      year: new Date().getFullYear().toString(),
      color: "",
      registrationNumber: "",
      chassisNumber: "",
      engineNumber: "",
      image: null,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Cars</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Car
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Car</DialogTitle>
              <DialogDescription>Enter the car details below to add it to your fleet.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="model">Car Model</Label>
                <Select value={newCar.model} onValueChange={(value) => handleSelectChange("model", value)}>
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Select car model" />
                  </SelectTrigger>
                  <SelectContent>
                    {carModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={newCar.year}
                    onChange={handleInputChange}
                    placeholder="Enter year"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="color">Color</Label>
                  <Select value={newCar.color} onValueChange={(value) => handleSelectChange("color", value)}>
                    <SelectTrigger id="color">
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {carColors.map((color) => (
                        <SelectItem key={color} value={color}>
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: color }} />
                            <span className="capitalize">{color}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  value={newCar.registrationNumber}
                  onChange={handleInputChange}
                  placeholder="Enter registration number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="chassisNumber">Chassis Number</Label>
                <Input
                  id="chassisNumber"
                  value={newCar.chassisNumber}
                  onChange={handleInputChange}
                  placeholder="Enter chassis number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="engineNumber">Engine Number</Label>
                <Input
                  id="engineNumber"
                  value={newCar.engineNumber}
                  onChange={handleInputChange}
                  placeholder="Enter engine number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Car Image</Label>
                <Input id="image" type="file" accept="image/*" onChange={handleInputChange} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddCar}>Add Car</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search cars..."
          className="w-full bg-background pl-8 md:w-[300px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCars.map((car) => (
          <Card key={car.id} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={car.image || "/placeholder.svg"}
                alt={`${car.model} - ${car.color}`}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-2 left-2">
                <Badge variant={car.available ? "default" : "secondary"}>
                  {car.available ? "Available" : "On Trip"}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {car.model} ({car.year})
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: car.color }} />
                    <span className="text-sm capitalize">{car.color}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Reg: {car.registrationNumber}</p>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="rounded-md bg-muted p-2">
                    <p className="font-medium">{car.totalBookings}</p>
                    <p className="text-xs text-muted-foreground">Bookings</p>
                  </div>
                  <div className="rounded-md bg-muted p-2">
                    <p className="font-medium">${(car.totalRevenue / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                  <div className="rounded-md bg-muted p-2">
                    <p className="font-medium">${(car.totalProfit / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-muted-foreground">Profit</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/my-cars/${car.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

