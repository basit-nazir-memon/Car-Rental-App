"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data for bookings
const bookings = [
  {
    id: 1,
    carModel: "Toyota Corolla",
    carYear: 2022,
    registrationNumber: "ABC-123",
    customerName: "John Doe",
    customerIdCard: "12345-6789012-3",
    driverName: "David Johnson",
    startDate: new Date(2023, 2, 15),
    endDate: new Date(2023, 2, 18),
    status: "active",
  },
  {
    id: 2,
    carModel: "Honda Civic",
    carYear: 2021,
    registrationNumber: "DEF-456",
    customerName: "Jane Smith",
    customerIdCard: "98765-4321098-7",
    driverName: "Michael Brown",
    startDate: new Date(2023, 2, 10),
    endDate: new Date(2023, 2, 20),
    status: "active",
  },
  {
    id: 3,
    carModel: "Suzuki Swift",
    carYear: 2020,
    registrationNumber: "GHI-789",
    customerName: "Robert Williams",
    customerIdCard: "45678-9012345-6",
    driverName: "John Smith",
    startDate: new Date(2023, 1, 25),
    endDate: new Date(2023, 2, 5),
    status: "completed",
  },
  {
    id: 4,
    carModel: "Nissan Altima",
    carYear: 2019,
    registrationNumber: "JKL-012",
    customerName: "Emily Johnson",
    customerIdCard: "78901-2345678-9",
    driverName: "David Johnson",
    startDate: new Date(2023, 1, 15),
    endDate: new Date(2023, 1, 20),
    status: "completed",
  },
]

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())

  // Filter bookings based on active tab and search query
  const filteredBookings = bookings.filter((booking) => {
    const matchesTab = activeTab === "active" ? booking.status === "active" : booking.status === "completed"

    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerIdCard.includes(searchQuery) ||
      booking.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTab && matchesSearch
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
      </div>

      <Tabs defaultValue="active" onValueChange={setActiveTab}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {activeTab === "history" && (
            <div className="flex gap-2">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">January</SelectItem>
                  <SelectItem value="1">February</SelectItem>
                  <SelectItem value="2">March</SelectItem>
                  <SelectItem value="3">April</SelectItem>
                  <SelectItem value="4">May</SelectItem>
                  <SelectItem value="5">June</SelectItem>
                  <SelectItem value="6">July</SelectItem>
                  <SelectItem value="7">August</SelectItem>
                  <SelectItem value="8">September</SelectItem>
                  <SelectItem value="9">October</SelectItem>
                  <SelectItem value="10">November</SelectItem>
                  <SelectItem value="11">December</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="relative my-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by customer name, ID card, or registration number..."
            className="w-full bg-background pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <TabsContent value="active" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Car</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="font-medium">{booking.carModel}</div>
                    <div className="text-sm text-muted-foreground">{booking.registrationNumber}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{booking.customerName}</div>
                    <div className="text-sm text-muted-foreground">{booking.customerIdCard}</div>
                  </TableCell>
                  <TableCell>{booking.driverName}</TableCell>
                  <TableCell>{format(booking.startDate, "MMM dd, yyyy")}</TableCell>
                  <TableCell>{format(booking.endDate, "MMM dd, yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant={booking.status === "active" ? "default" : "secondary"}>
                      {booking.status === "active" ? "Active" : "Completed"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/dashboard/bookings/${booking.id}`}>View</a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Car</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="font-medium">{booking.carModel}</div>
                    <div className="text-sm text-muted-foreground">{booking.registrationNumber}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{booking.customerName}</div>
                    <div className="text-sm text-muted-foreground">{booking.customerIdCard}</div>
                  </TableCell>
                  <TableCell>{booking.driverName}</TableCell>
                  <TableCell>{format(booking.startDate, "MMM dd, yyyy")}</TableCell>
                  <TableCell>{format(booking.endDate, "MMM dd, yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant={booking.status === "active" ? "default" : "secondary"}>
                      {booking.status === "active" ? "Active" : "Completed"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/dashboard/bookings/${booking.id}`}>View</a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  )
}

