"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, DollarSign, BarChart3 } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for a specific stakeholder
const stakeholderData = {
  id: 1,
  name: "Ali Hassan",
  idCard: "12345-6789012-3",
  email: "ali.hassan@example.com",
  phone: "+92 300 1234567",
  address: "123 Main Street, Karachi, Pakistan",
  commission: 15,
  totalCars: 3,
  totalRevenue: 125000,
  totalProfit: 75000,
  joinDate: "2021-05-15",
  image: "/placeholder.svg?height=300&width=300",
  bankDetails: {
    accountName: "Ali Hassan",
    accountNumber: "1234567890",
    bankName: "MCB Bank",
    branchCode: "0123",
  },
}

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

// Mock data for stakeholder's payments
const stakeholderPayments = [
  {
    id: 1,
    date: new Date(2023, 2, 15),
    amount: 45000,
    status: "paid",
    reference: "PAY-2023-03-15-001",
    method: "Bank Transfer",
  },
  {
    id: 2,
    date: new Date(2023, 1, 15),
    amount: 38000,
    status: "paid",
    reference: "PAY-2023-02-15-001",
    method: "Bank Transfer",
  },
  {
    id: 3,
    date: new Date(2023, 0, 15),
    amount: 42000,
    status: "paid",
    reference: "PAY-2023-01-15-001",
    method: "Bank Transfer",
  },
  {
    id: 4,
    date: new Date(2023, 3, 15),
    amount: 50000,
    status: "pending",
    reference: "PAY-2023-04-15-001",
    method: "Bank Transfer",
  },
]

// Monthly revenue data for charts
const monthlyRevenueData = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 38000 },
  { month: "Mar", revenue: 45000 },
  { month: "Apr", revenue: 50000 },
]

export default function StakeholderDetailPage({ params }: { params: { stakeholderId: string } }) {
  const [activeTab, setActiveTab] = useState("details")
  const [selectedYear, setSelectedYear] = useState("2023")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/stakeholders">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{stakeholderData.name}</h1>
      </div>

      <Tabs defaultValue="details" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Stakeholder Details</TabsTrigger>
          <TabsTrigger value="cars">Cars</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                    src={stakeholderData.image || "/placeholder.svg"}
                    alt={stakeholderData.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold">{stakeholderData.name}</h2>
                  <p className="text-sm text-muted-foreground">Stakeholder ID: {stakeholderData.id}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Joined on {stakeholderData.joinDate}</p>
                </div>
                <div className="mt-4 grid w-full grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-sm text-muted-foreground">Total Cars</p>
                    <p className="text-2xl font-bold">{stakeholderData.totalCars}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-sm text-muted-foreground">Commission</p>
                    <p className="text-2xl font-bold">{stakeholderData.commission}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ID Card Number</p>
                    <p className="text-lg">{stakeholderData.idCard}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-lg">{stakeholderData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p className="text-lg">{stakeholderData.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <p className="text-lg">{stakeholderData.address}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="mb-2 text-lg font-semibold">Bank Details</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Account Name</p>
                      <p className="text-lg">{stakeholderData.bankDetails.accountName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                      <p className="text-lg">{stakeholderData.bankDetails.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Bank Name</p>
                      <p className="text-lg">{stakeholderData.bankDetails.bankName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Branch Code</p>
                      <p className="text-lg">{stakeholderData.bankDetails.branchCode}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stakeholderData.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Lifetime earnings from all cars</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stakeholderData.totalProfit.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">After commission and expenses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$43,750</div>
                <p className="text-xs text-muted-foreground">Average monthly revenue</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cars" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cars Owned</CardTitle>
              <CardDescription>View all cars owned by this stakeholder.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Car</TableHead>
                    <TableHead>Registration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stakeholderCars.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md overflow-hidden">
                            <Image
                              src={car.image || "/placeholder.svg"}
                              alt={car.model}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{car.model}</div>
                            <div className="text-sm text-muted-foreground">{car.year}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{car.registrationNumber}</TableCell>
                      <TableCell>
                        <Badge variant={car.available ? "default" : "secondary"}>
                          {car.available ? "Available" : "On Trip"}
                        </Badge>
                      </TableCell>
                      <TableCell>{car.totalBookings}</TableCell>
                      <TableCell>${car.totalRevenue.toLocaleString()}</TableCell>
                      <TableCell>${car.totalProfit.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/cars/${car.id}`}>View Details</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View all payments made to this stakeholder.</CardDescription>
              </div>
              <Button>
                <DollarSign className="mr-2 h-4 w-4" />
                Make Payment
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stakeholderPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{format(payment.date, "MMM dd, yyyy")}</TableCell>
                      <TableCell>{payment.reference}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>${payment.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={payment.status === "paid" ? "default" : "secondary"}>
                          {payment.status === "paid" ? "Paid" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="flex justify-end">
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

          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Revenue generated by stakeholder's cars per month.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                  Revenue Chart (This would be a real chart in production)
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Car</CardTitle>
                <CardDescription>Distribution of revenue across different cars.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    Pie Chart (This would be a real chart in production)
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
                <CardDescription>Number of bookings over time.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    Line Chart (This would be a real chart in production)
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

