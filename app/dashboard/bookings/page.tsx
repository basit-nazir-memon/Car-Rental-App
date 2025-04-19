"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, Car, User, Clock, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import config from "../../../config"
import Link from "next/link"

interface Booking {
  id: string
  carModel: string
  carYear: number
  registrationNumber: string
  customerName: string
  customerIdCard: string
  driverName: string
  startDate: string
  endDate: string
  status: string
  tripType: string
  totalBill: number
  advancePaid: number
  remainingAmount: number
  meterReading: number
  startTime: string
  endTime: string | null
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchBookings()
  }, [statusFilter])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      const url = statusFilter === "all" 
        ? `${config.backendUrl}/bookings`
        : `${config.backendUrl}/bookings/status/${statusFilter}`
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch bookings")
      }

      const data = await response.json()
      setBookings(data.bookings)
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredBookings = bookings?.filter((booking) =>
    booking.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.driverName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.carModel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.customerIdCard?.includes(searchQuery)
  ) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Skeleton className="h-10 w-full md:w-[300px]" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
            <div className="flex gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
          >
            All
          </Button>
          <Button
            variant={statusFilter === "active" ? "default" : "outline"}
            onClick={() => setStatusFilter("active")}
          >
            Active
          </Button>
          <Button
            variant={statusFilter === "completed" ? "default" : "outline"}
            onClick={() => setStatusFilter("completed")}
          >
            Completed
          </Button>
          <Button
            variant={statusFilter === "cancelled" ? "default" : "outline"}
            onClick={() => setStatusFilter("cancelled")}
          >
            Cancelled
          </Button>
        </div>
        </div>

      <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
          placeholder="Search by customer name, registration number, or ID card..."
          className="w-full bg-background pl-8 md:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{booking.carModel} ({booking.carYear})</CardTitle>
                {getStatusBadge(booking.status)}
              </div>
              <p className="text-sm text-muted-foreground">{booking.registrationNumber}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{booking.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Car className="h-4 w-4" />
                  <span>{booking.driverName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(booking.startDate), "dd/MM/yyyy")} -{" "}
                    {format(new Date(booking.endDate), "dd/MM/yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{booking.startTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Total: {booking.totalBill} | Paid: {booking.advancePaid} | Remaining: {booking.remainingAmount}</span>
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href={`/dashboard/bookings/${booking.id}`}>
                      View Booking
                    </Link>
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

