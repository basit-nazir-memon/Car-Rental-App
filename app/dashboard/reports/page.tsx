"use client"

import { useState } from "react"
import { Download, Printer, Calendar, DollarSign } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for reports
const bookingReportData = [
  {
    id: 1,
    carModel: "Toyota Corolla",
    registrationNumber: "ABC-123",
    customerName: "John Doe",
    driverName: "David Johnson",
    startDate: new Date(2023, 2, 15),
    endDate: new Date(2023, 2, 18),
    totalAmount: 15000,
    status: "completed",
  },
  {
    id: 2,
    carModel: "Honda Civic",
    registrationNumber: "DEF-456",
    customerName: "Jane Smith",
    driverName: "Michael Brown",
    startDate: new Date(2023, 2, 10),
    endDate: new Date(2023, 2, 20),
    totalAmount: 25000,
    status: "completed",
  },
  {
    id: 3,
    carModel: "Suzuki Swift",
    registrationNumber: "GHI-789",
    customerName: "Robert Williams",
    driverName: "John Smith",
    startDate: new Date(2023, 2, 25),
    endDate: new Date(2023, 3, 5),
    totalAmount: 22000,
    status: "active",
  },
]

const revenueReportData = [
  {
    month: "January",
    revenue: 150000,
    expenses: 60000,
    profit: 90000,
  },
  {
    month: "February",
    revenue: 180000,
    expenses: 70000,
    profit: 110000,
  },
  {
    month: "March",
    revenue: 210000,
    expenses: 80000,
    profit: 130000,
  },
]

const stakeholderReportData = [
  {
    id: 1,
    name: "Ali Hassan",
    totalCars: 3,
    totalRevenue: 125000,
    commission: 15,
    commissionAmount: 18750,
    netPayment: 106250,
  },
  {
    id: 2,
    name: "Zainab Khan",
    totalCars: 2,
    totalRevenue: 85000,
    commission: 12,
    commissionAmount: 10200,
    netPayment: 74800,
  },
  {
    id: 3,
    name: "Usman Ali",
    totalCars: 5,
    totalRevenue: 210000,
    commission: 18,
    commissionAmount: 37800,
    netPayment: 172200,
  },
]

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("bookings")
  const [selectedMonth, setSelectedMonth] = useState("3") // March
  const [selectedYear, setSelectedYear] = useState("2023")

  const handleDownloadReport = () => {
    // This would normally generate and download a PDF report
    console.log(`Downloading ${activeTab} report for ${selectedMonth}/${selectedYear}`)
  }

  const handlePrintReport = () => {
    // This would normally print the report
    console.log(`Printing ${activeTab} report for ${selectedMonth}/${selectedYear}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">January</SelectItem>
              <SelectItem value="2">February</SelectItem>
              <SelectItem value="3">March</SelectItem>
              <SelectItem value="4">April</SelectItem>
              <SelectItem value="5">May</SelectItem>
              <SelectItem value="6">June</SelectItem>
              <SelectItem value="7">July</SelectItem>
              <SelectItem value="8">August</SelectItem>
              <SelectItem value="9">September</SelectItem>
              <SelectItem value="10">October</SelectItem>
              <SelectItem value="11">November</SelectItem>
              <SelectItem value="12">December</SelectItem>
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
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35</div>
            <p className="text-xs text-muted-foreground">For March 2023</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$210,000</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$80,000</div>
            <p className="text-xs text-muted-foreground">+14% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$130,000</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookings" onValueChange={setActiveTab}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="bookings">Bookings Report</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Report</TabsTrigger>
            <TabsTrigger value="stakeholders">Stakeholder Report</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadReport}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" onClick={handlePrintReport}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bookings Report</CardTitle>
              <CardDescription>All bookings for March 2023.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Car</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookingReportData.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="font-medium">{booking.carModel}</div>
                        <div className="text-sm text-muted-foreground">{booking.registrationNumber}</div>
                      </TableCell>
                      <TableCell>{booking.customerName}</TableCell>
                      <TableCell>{booking.driverName}</TableCell>
                      <TableCell>{format(booking.startDate, "MMM dd, yyyy")}</TableCell>
                      <TableCell>{format(booking.endDate, "MMM dd, yyyy")}</TableCell>
                      <TableCell>${booking.totalAmount}</TableCell>
                      <TableCell>{booking.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 flex justify-between">
                <div>
                  <p className="text-sm font-medium">Total Bookings: 35</p>
                  <p className="text-sm text-muted-foreground">Active: 12, Completed: 23</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Amount: $210,000</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Report</CardTitle>
              <CardDescription>Revenue, expenses, and profit for Q1 2023.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Expenses</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Profit Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueReportData.map((data) => (
                    <TableRow key={data.month}>
                      <TableCell className="font-medium">{data.month}</TableCell>
                      <TableCell>${data.revenue.toLocaleString()}</TableCell>
                      <TableCell>${data.expenses.toLocaleString()}</TableCell>
                      <TableCell>${data.profit.toLocaleString()}</TableCell>
                      <TableCell>{Math.round((data.profit / data.revenue) * 100)}%</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="font-bold">
                      ${revenueReportData.reduce((sum, data) => sum + data.revenue, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-bold">
                      ${revenueReportData.reduce((sum, data) => sum + data.expenses, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-bold">
                      ${revenueReportData.reduce((sum, data) => sum + data.profit, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-bold">
                      {Math.round(
                        (revenueReportData.reduce((sum, data) => sum + data.profit, 0) /
                          revenueReportData.reduce((sum, data) => sum + data.revenue, 0)) *
                          100,
                      )}
                      %
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="mt-6">
                <div className="h-[300px]">
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    Revenue Chart (This would be a real chart in production)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stakeholders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stakeholder Report</CardTitle>
              <CardDescription>Revenue and payments for stakeholders in March 2023.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stakeholder</TableHead>
                    <TableHead>Cars</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Commission Amount</TableHead>
                    <TableHead>Net Payment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stakeholderReportData.map((data) => (
                    <TableRow key={data.id}>
                      <TableCell className="font-medium">{data.name}</TableCell>
                      <TableCell>{data.totalCars}</TableCell>
                      <TableCell>${data.totalRevenue.toLocaleString()}</TableCell>
                      <TableCell>{data.commission}%</TableCell>
                      <TableCell>${data.commissionAmount.toLocaleString()}</TableCell>
                      <TableCell>${data.netPayment.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="font-bold">
                      {stakeholderReportData.reduce((sum, data) => sum + data.totalCars, 0)}
                    </TableCell>
                    <TableCell className="font-bold">
                      ${stakeholderReportData.reduce((sum, data) => sum + data.totalRevenue, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-bold">-</TableCell>
                    <TableCell className="font-bold">
                      ${stakeholderReportData.reduce((sum, data) => sum + data.commissionAmount, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-bold">
                      ${stakeholderReportData.reduce((sum, data) => sum + data.netPayment, 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="mt-6">
                <div className="h-[300px]">
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    Stakeholder Distribution Chart (This would be a real chart in production)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

