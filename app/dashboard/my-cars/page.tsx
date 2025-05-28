"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AddCar from "../cars/add-car"
import config from "../../../config"

interface Car {
  id: string
  model: string
  year: number
  color: string
  registrationNumber: string
  chassisNumber: string
  engineNumber: string
  image: string
  available: boolean
  totalBookings: number
  totalRevenue: number
  totalProfit: number
}

export default function MyCarPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCars = async () => {
    console.log("fetching cars")
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }
      console.log("token", token)
      const response = await fetch(`${config.backendUrl}/cars/mine`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Please login again")
        }
        throw new Error("Failed to fetch cars")
      }

      const data = await response.json()
      setCars(data.cars)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load cars")
      console.error("Error fetching cars:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCars()
  }, [])

  // Function to add a new car
  const onCarAdded = () => {
    fetchCars()
  }

  // Filter cars based on search query
  const filteredCars = cars.filter(
    (car) =>
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.color.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Cars</h1>
        {/* <AddCar onCarAdded={onCarAdded} /> */}
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
        {loading ? (
          <div className="col-span-full text-center">Loading...</div>
        ) : filteredCars.length === 0 ? (
          <div className="col-span-full text-center">No cars found</div>
        ) : (
          filteredCars.map((car) => (
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
                  <div className="mt-2 grid grid-cols-2 gap-2 text-center text-sm">
                    <div className="rounded-md bg-muted p-2">
                      <p className="font-medium">{car.totalBookings}</p>
                      <p className="text-xs text-muted-foreground">Bookings</p>
                    </div>
                    <div className="rounded-md bg-muted p-2">
                      <p className="font-medium">Rs. {(car.totalRevenue / 1000).toFixed(1)}k</p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                    {/* <div className="rounded-md bg-muted p-2">
                      <p className="font-medium">Rs. {(car.totalProfit / 1000).toFixed(1)}k</p>
                      <p className="text-xs text-muted-foreground">Profit</p>
                    </div> */}
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/dashboard/my-cars/${car.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

