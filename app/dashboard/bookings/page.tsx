"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, Car, User, Clock, DollarSign, ArrowUpDown } from "lucide-react"
import { format, addDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import config from "../../../config"
import Link from "next/link"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Range } from "react-date-range"

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
  discountPercentage: number
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
  const [dateRange, setDateRange] = useState<Range>({
    startDate: addDays(new Date(), -30),
    endDate: new Date(),
    key: 'selection'
  })
  const [sortField, setSortField] = useState<string>("startDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

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

  const filteredBookings = bookings?.filter((booking) => {
    const matchesSearch = 
      booking.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.driverName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.carModel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerIdCard?.includes(searchQuery);

    const bookingDate = new Date(booking.startDate);
    const matchesDateRange = 
      bookingDate >= dateRange.startDate && 
      bookingDate <= dateRange.endDate;

    return matchesSearch && matchesDateRange;
  }) || [];

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "startDate":
        comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        break;
      case "endDate":
        comparison = new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        break;
      case "totalBill":
        comparison = a.totalBill - b.totalBill;
        break;
      case "customerName":
        comparison = a.customerName.localeCompare(b.customerName);
        break;
      case "carModel":
        comparison = a.carModel.localeCompare(b.carModel);
        break;
      default:
        comparison = 0;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by customer name, registration number, or ID card..."
            className="w-full bg-background pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
          <Select
            value={`${sortField}-${sortDirection}`}
            onValueChange={(value) => {
              const [field, direction] = value.split("-");
              setSortField(field);
              setSortDirection(direction as "asc" | "desc");
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="startDate-desc">Start Date (Newest)</SelectItem>
              <SelectItem value="startDate-asc">Start Date (Oldest)</SelectItem>
              <SelectItem value="endDate-desc">End Date (Newest)</SelectItem>
              <SelectItem value="endDate-asc">End Date (Oldest)</SelectItem>
              <SelectItem value="totalBill-desc">Total Bill (High to Low)</SelectItem>
              <SelectItem value="totalBill-asc">Total Bill (Low to High)</SelectItem>
              <SelectItem value="customerName-asc">Customer Name (A-Z)</SelectItem>
              <SelectItem value="customerName-desc">Customer Name (Z-A)</SelectItem>
              <SelectItem value="carModel-asc">Car Model (A-Z)</SelectItem>
              <SelectItem value="carModel-desc">Car Model (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedBookings.map((booking) => (
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
                {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{booking.startTime}</span>
                </div> */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Total: {booking.totalBill} | Paid: {booking.advancePaid} | Remaining: {Number(booking.remainingAmount) - Number((booking.discountPercentage / 100) * booking.totalBill)}</span>
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

