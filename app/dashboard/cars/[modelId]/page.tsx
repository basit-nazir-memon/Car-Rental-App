"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for specific cars of a model
const carsByModel = {
  "1": [
    {
      id: 101,
      model: "Toyota Corolla",
      year: 2022,
      color: "red",
      registrationNumber: "ABC-123",
      chassisNumber: "TC2022RED001",
      engineNumber: "ENG2022001",
      image: "/placeholder.svg?height=200&width=300",
      available: true,
    },
    {
      id: 102,
      model: "Toyota Corolla",
      year: 2021,
      color: "blue",
      registrationNumber: "DEF-456",
      chassisNumber: "TC2021BLU001",
      engineNumber: "ENG2021001",
      image: "/placeholder.svg?height=200&width=300",
      available: true,
    },
    {
      id: 103,
      model: "Toyota Corolla",
      year: 2020,
      color: "white",
      registrationNumber: "GHI-789",
      chassisNumber: "TC2020WHT001",
      engineNumber: "ENG2020001",
      image: "/placeholder.svg?height=200&width=300",
      available: true,
    },
    {
      id: 104,
      model: "Toyota Corolla",
      year: 2019,
      color: "black",
      registrationNumber: "JKL-012",
      chassisNumber: "TC2019BLK001",
      engineNumber: "ENG2019001",
      image: "/placeholder.svg?height=200&width=300",
      available: false,
    },
    {
      id: 105,
      model: "Toyota Corolla",
      year: 2018,
      color: "silver",
      registrationNumber: "MNO-345",
      chassisNumber: "TC2018SLV001",
      engineNumber: "ENG2018001",
      image: "/placeholder.svg?height=200&width=300",
      available: false,
    },
  ],
}

export default function CarModelPage({ params }: { params: { modelId: string } }) {
  const [searchQuery, setSearchQuery] = useState("")

  // Get cars for this model
  const cars = carsByModel[params.modelId as keyof typeof carsByModel] || []

  // Filter cars based on search query
  const filteredCars = cars.filter(
    (car) =>
      car.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.chassisNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.color.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/cars">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{cars.length > 0 ? cars[0].model : "Car Model"}</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by registration, chassis, or color..."
          className="w-full bg-background pl-8 md:w-[300px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCars.map((car) => (
          <Link href={`/dashboard/cars/${params.modelId}/${car.id}`} key={car.id}>
            <Card className={`overflow-hidden transition-all hover:shadow-md ${!car.available ? "opacity-60" : ""}`}>
              <div className="relative h-48">
                <Image
                  src={car.image || "/placeholder.svg"}
                  alt={`${car.model} - ${car.color}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2 left-2">
                  <Badge variant={car.available ? "default" : "destructive"}>
                    {car.available ? "Available" : "Not Available"}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold">
                    {car.model} ({car.year})
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: car.color }} />
                    <span className="text-sm capitalize">{car.color}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Reg: {car.registrationNumber}</p>
                  <p className="text-sm text-muted-foreground">Chassis: {car.chassisNumber}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

