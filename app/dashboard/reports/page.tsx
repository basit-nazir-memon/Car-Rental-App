"use client"

import { useState, useEffect, useRef } from "react"
import { Download, Printer, Calendar, DollarSign, Car, TrendingUp, Wrench, FileText } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import config from "../../../config"
import { useReactToPrint } from "react-to-print"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface MonthlyStats {
  totalBookings: number
  activeBookings: number
  completedBookings: number
  cancelledBookings: number
  totalRevenue: number
  revenuePercent: string
  totalExpenses: number
  expensesPercent: string
  netProfit: number
  netPercent: string
}

interface BookingReport {
  id: string
  carModel: string
  registrationNumber: string
  customerName: string
  driverName: string
  startDate: string
  endDate: string
  totalAmount: number
  status: string
}

interface RevenueReport {
  month: string
  revenue: number
  expenses: number
  profit: number
}

interface StakeholderReport {
  id: string
  name: string
  totalCars: number
  totalRevenue: number
  commission: number
  commissionAmount: number
  netPayment: number
}

interface CarReport {
  id: string
  model: string
  variant: string
  registrationNumber: string
  year: number
  color: string
  chassisNumber: string
  engineNumber: string
  totalBookings: number
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  utilizationRate: number
  averageBookingDuration: number
  bookingHistory: {
    id: string
    customerName: string
    startDate: string
    endDate: string
    amount: number
    status: string
  }[]
  expenses: {
    id: string
    title: string
    amount: number
    date: string
    category: string
  }[]
  monthlyRevenue: {
    month: string
    revenue: number
  }[]
  monthlyBookings: {
    month: string
    bookings: number
  }[]
}

interface ReportData {
  stats: MonthlyStats
  bookingReportData: BookingReport[]
  revenueReportData: RevenueReport[]
  stakeholderReportData: StakeholderReport[]
  cars: { id: string; model: string; registrationNumber: string }[]
  selectedCarReport: CarReport | null
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("bookings")
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "MMMM"))
  const [selectedYear, setSelectedYear] = useState(format(new Date(), "yyyy"))
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const { toast } = useToast()
  const reportRef = useRef<HTMLDivElement>(null)
  const [selectedCar, setSelectedCar] = useState<string>("")

  useEffect(() => {
    fetchReportData()
  }, [selectedMonth, selectedYear])

  const fetchReportData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const token = localStorage.getItem("token")
      
      // Fetch monthly report data
      const reportResponse = await fetch(
        `${config.backendUrl}/reports/monthly?month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!reportResponse.ok) {
        throw new Error("Failed to fetch report data")
      }

      const reportData = await reportResponse.json()

      // Fetch cars list
      const carsResponse = await fetch(
        `${config.backendUrl}/cars/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!carsResponse.ok) {
        throw new Error("Failed to fetch cars data")
      }

      const carsData = await carsResponse.json()

      // Combine the data
      setReportData({
        ...reportData,
        cars: carsData.map((car: any) => ({
          id: car._id,
          model: car.model,
          registrationNumber: car.registrationNumber
        }))
      })
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to load data. Please try again later.")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load data. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCarReport = async (carId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `${config.backendUrl}/cars/report/${carId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch car report data")
      }

      const data = await response.json()
      setReportData(prev => prev ? { ...prev, selectedCarReport: data } : null)

    } catch (error) {
      console.error("Error fetching car report:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load car report data. Please try again later.",
      })
    }
  }

  useEffect(() => {
    if (selectedCar) {
      fetchCarReport(selectedCar)
    }
  }, [selectedCar, selectedMonth, selectedYear])

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `${activeTab}-report-${selectedMonth}-${selectedYear}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .no-print {
          display: none;
        }
      }
    `,
  })

  const handlePrintClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    handlePrint()
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <p className="text-destructive">{error}</p>
        <Button onClick={fetchReportData}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Monthly Reports</h1>
        <div className="flex gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="January">January</SelectItem>
              <SelectItem value="February">February</SelectItem>
              <SelectItem value="March">March</SelectItem>
              <SelectItem value="April">April</SelectItem>
              <SelectItem value="May">May</SelectItem>
              <SelectItem value="June">June</SelectItem>
              <SelectItem value="July">July</SelectItem>
              <SelectItem value="August">August</SelectItem>
              <SelectItem value="September">September</SelectItem>
              <SelectItem value="October">October</SelectItem>
              <SelectItem value="November">November</SelectItem>
              <SelectItem value="December">December</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{reportData?.stats.totalBookings}</div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  {reportData?.stats.activeBookings} Active
                </div>
                <div className="text-sm text-muted-foreground">
                  {reportData?.stats.completedBookings} Completed
                </div>
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">
                Rs. {reportData?.stats.totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {reportData?.stats.revenuePercent} from last month
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">
                Rs. {reportData?.stats.totalExpenses.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {reportData?.stats.expensesPercent} from last month
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">
                Rs. {reportData?.stats.netProfit.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {reportData?.stats.netPercent} from last month
              </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookings" onValueChange={setActiveTab}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-3">
          <TabsList>
            <TabsTrigger value="bookings">Bookings Report</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Report</TabsTrigger>
            <TabsTrigger value="cars">Car Reports</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrintClick}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

          <TabsContent value="bookings" className="space-y-4" ref={ activeTab === "bookings" ? reportRef : null}>
          <Card>
            <CardHeader>
              <CardTitle>Bookings Report</CardTitle>
                <CardDescription>All bookings for {selectedMonth} {selectedYear}.</CardDescription>
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
                    {reportData?.bookingReportData.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="font-medium">{booking.carModel}</div>
                        <div className="text-sm text-muted-foreground">{booking.registrationNumber}</div>
                      </TableCell>
                      <TableCell>{booking.customerName}</TableCell>
                      <TableCell>{booking.driverName}</TableCell>
                        <TableCell>{format(new Date(booking.startDate), "MMM dd, yyyy")}</TableCell>
                        <TableCell>{format(new Date(booking.endDate), "MMM dd, yyyy")}</TableCell>
                        <TableCell>Rs. {booking.totalAmount}</TableCell>
                      <TableCell>{booking.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 flex justify-between">
                <div>
                    <p className="text-sm font-medium">Total Bookings: {reportData?.stats.totalBookings}</p>
                    <p className="text-sm text-muted-foreground">Active: {reportData?.stats.activeBookings}, Completed: {reportData?.stats.completedBookings}, Cancelled: {reportData?.stats.cancelledBookings}</p>
                </div>
                <div>
                    <p className="text-sm font-medium">Total Amount: Rs. {reportData?.stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

          <TabsContent value="revenue" className="space-y-4"  ref={ activeTab === "revenue" ? reportRef : null}>
          <Card>
            <CardHeader>
              <CardTitle>Revenue Report</CardTitle>
                <CardDescription>Revenue, expenses, and profit for {selectedYear}.</CardDescription>
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
                    {reportData?.revenueReportData.map((data) => (
                    <TableRow key={data.month}>
                      <TableCell className="font-medium">{data.month}</TableCell>
                        <TableCell>Rs. {data.revenue.toLocaleString()}</TableCell>
                        <TableCell>Rs. {data.expenses.toLocaleString()}</TableCell>
                        <TableCell>Rs. {data.profit.toLocaleString()}</TableCell>
                        <TableCell>{Math.round((data.profit / data.revenue) * 100) || 0}%</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="font-bold">
                        Rs. {reportData?.revenueReportData.reduce((acc, row) => ({
                          revenue: acc.revenue + (row.revenue || 0),
                        }), { revenue: 0}).revenue.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-bold">
                        Rs. {reportData?.revenueReportData.reduce((acc, row) => ({
                          expenses: acc.expenses + (row.expenses || 0)
                        }), {expenses: 0}).expenses.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-bold">
                        Rs. {reportData?.revenueReportData.reduce((acc, row) => ({
                          profit: acc.profit + (row.profit || 0)
                        }), { profit: 0 }).profit.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-bold">
                        {(() => {
                          const totals = reportData?.revenueReportData.reduce((acc, row) => ({
                            revenue: acc.revenue + (row.revenue || 0),
                            profit: acc.profit + (row.profit || 0)
                          }), { revenue: 0, profit: 0 });
                          return totals?.revenue ? Math.round((totals.profit / totals.revenue) * 100) : 0;
                        })()}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cars" className="space-y-4" ref={activeTab === "cars" ? reportRef : null}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Car Reports</CardTitle>
                  <CardDescription>Detailed reports for individual cars.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Select value={selectedCar} onValueChange={setSelectedCar}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select a car" />
                  </SelectTrigger>
                  <SelectContent>
                    {(reportData?.cars || []).map((car) => (
                      <SelectItem key={car.id} value={car.id}>
                        {car.model} ({car.registrationNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {reportData?.selectedCarReport && (
                <div className="space-y-6">
                  {/* Car Details */}
                  <Card className="border-2">
                    <CardHeader className="bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl font-bold">{reportData.selectedCarReport.model}</CardTitle>
                          <CardDescription className="text-base mt-1">
                            {reportData.selectedCarReport.variant} • {reportData.selectedCarReport.year}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-muted-foreground">Registration Number</p>
                          <p className="text-lg font-bold">{reportData.selectedCarReport.registrationNumber}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Color</p>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border" 
                              style={{ backgroundColor: reportData.selectedCarReport.color.toLowerCase() }} 
                            />
                            <p className="text-base font-semibold capitalize">{reportData.selectedCarReport.color}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Chassis Number</p>
                          <p className="text-base font-semibold font-mono">{reportData.selectedCarReport.chassisNumber}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Engine Number</p>
                          <p className="text-base font-semibold font-mono">{reportData.selectedCarReport.engineNumber}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Overview Cards */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{reportData.selectedCarReport.totalBookings}</div>
                        <p className="text-xs text-muted-foreground">
                          {reportData.selectedCarReport.utilizationRate}% utilization
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          Rs. {reportData.selectedCarReport.totalRevenue.toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          Rs. {reportData.selectedCarReport.totalExpenses.toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          Rs. {reportData.selectedCarReport.netProfit.toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Graphs */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border">
                      <CardHeader>
                        <CardTitle>Monthly Revenue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={reportData.selectedCarReport.monthlyRevenue}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip 
                                formatter={(value) => [`Rs. ${value.toLocaleString()}`, 'Revenue']}
                                labelFormatter={(label) => `Month: ${label}`}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#2563eb" 
                                fill="#3b82f6" 
                                fillOpacity={0.2}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border">
                      <CardHeader>
                        <CardTitle>Monthly Bookings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reportData.selectedCarReport.monthlyBookings}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip 
                                formatter={(value) => [value, 'Bookings']}
                                labelFormatter={(label) => `Month: ${label}`}
                              />
                              <Bar 
                                dataKey="bookings" 
                                fill="#16a34a"
                                radius={[4, 4, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Booking History */}
                  <Card className="border">
                    <CardHeader>
                      <CardTitle>Booking History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                          {reportData.selectedCarReport.bookingHistory.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell className="font-medium">{booking.customerName}</TableCell>
                              <TableCell>{format(new Date(booking.startDate), "MMM dd, yyyy")}</TableCell>
                              <TableCell>{format(new Date(booking.endDate), "MMM dd, yyyy")}</TableCell>
                              <TableCell>Rs. {booking.amount.toLocaleString()}</TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  booking.status === 'Completed' 
                                    ? 'bg-green-100 text-green-800'
                                    : booking.status === 'Active'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {booking.status}
                                </span>
                              </TableCell>
                    </TableRow>
                  ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Expenses */}
                  <Card className="border">
                    <CardHeader>
                      <CardTitle>Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                  <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {reportData.selectedCarReport.expenses.map((expense) => (
                            <TableRow key={expense.id}>
                              <TableCell className="font-medium">{expense.title}</TableCell>
                              <TableCell>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {expense.category}
                                </span>
                    </TableCell>
                              <TableCell>{format(new Date(expense.date), "MMM dd, yyyy")}</TableCell>
                              <TableCell>Rs. {expense.amount.toLocaleString()}</TableCell>
                  </TableRow>
                          ))}
                </TableBody>
              </Table>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}

