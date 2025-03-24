"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { DatePickerWithRange } from "@/components/date-range-picker"

// Mock data for a specific car
const carData = {
  id: 101,
  model: "Toyota Corolla",
  year: 2022,
  color: "red",
  registrationNumber: "ABC-123",
  chassisNumber: "TC2022RED001",
  engineNumber: "ENG2022001",
  image: "/placeholder.svg?height=400&width=600",
  available: true,
  meterReading: 12500,
}

// Mock data for drivers
const drivers = [
  { id: 1, name: "John Smith", image: "/placeholder.svg?height=100&width=100" },
  { id: 2, name: "David Johnson", image: "/placeholder.svg?height=100&width=100" },
  { id: 3, name: "Michael Brown", image: "/placeholder.svg?height=100&width=100" },
]

export default function CarDetailPage({ params }: { params: { modelId: string; carId: string } }) {
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null)
  const [tripType, setTripType] = useState("within-city")
  const [cityName, setCityName] = useState("")
  const [totalBill, setTotalBill] = useState(5000)
  const [advancePaid, setAdvancePaid] = useState(2000)
  const [discountPercentage, setDiscountPercentage] = useState(0)
  const [discountReference, setDiscountReference] = useState("")

  // Calculate remaining amount
  const remaining = totalBill - advancePaid - totalBill * (discountPercentage / 100)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/cars/${params.modelId}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          Book {carData.model} ({carData.year})
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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="Enter customer's full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cellNumber">Cell Number</Label>
                <Input id="cellNumber" placeholder="Enter customer's cell number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idCardNumber">ID Card Number</Label>
                <Input id="idCardNumber" placeholder="Enter customer's ID card number" />
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
                <RadioGroup
                  value={selectedDriver?.toString()}
                  onValueChange={(value) => setSelectedDriver(Number.parseInt(value))}
                >
                  <div className="grid gap-4">
                    {drivers.map((driver) => (
                      <div key={driver.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={driver.id.toString()} id={`driver-${driver.id}`} />
                        <Label htmlFor={`driver-${driver.id}`} className="flex items-center gap-2 cursor-pointer">
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            <Image
                              src={driver.image || "/placeholder.svg"}
                              alt={driver.name}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>
                          <span>{driver.name}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
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
              <DatePickerWithRange className="w-full" />
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

            <Button className="w-full">Book Now</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

