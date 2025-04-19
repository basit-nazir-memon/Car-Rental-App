"use client"

import { useState, useEffect, useRef } from "react"
import { Download, Printer, Calendar, DollarSign } from "lucide-react"
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

interface ReportData {
  stats: MonthlyStats
  bookingReportData: BookingReport[]
  revenueReportData: RevenueReport[]
  stakeholderReportData: StakeholderReport[]
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

  useEffect(() => {
    fetchReportData()
  }, [selectedMonth, selectedYear])

  const fetchReportData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const token = localStorage.getItem("token")
      
      const response = await fetch(
        `${config.backendUrl}/reports/monthly?month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch report data")
      }

      const data = await response.json()
      setReportData(data)
    } catch (error) {
      console.error("Error fetching report data:", error)
      setError("Failed to load report data. Please try again later.")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load report data. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

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

  const handleDownload = async () => {
    if (!reportRef.current) return

    try {
      // Create a new window for printing
      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        throw new Error("Failed to open print window")
      }

      // Get the report content
      const reportContent = reportRef.current.innerHTML

      // Create the print document
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${activeTab}-report-${selectedMonth}-${selectedYear}</title>
            <style>
              @page {
                size: A4;
                margin: 20mm;
              }
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
              }
              .no-print {
                display: none;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
              .card {
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 15px;
                margin-bottom: 20px;
              }
              .stats-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 15px;
                margin-bottom: 20px;
              }
            </style>
          </head>
          <body>
            <h1>${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Report - ${selectedMonth} ${selectedYear}</h1>
            ${reportContent}
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    } catch (error) {
      console.error("Error downloading report:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download report. Please try again.",
      })
    }
  }

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
                ${reportData?.stats.totalRevenue.toLocaleString()}
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
                ${reportData?.stats.totalExpenses.toLocaleString()}
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
                ${reportData?.stats.netProfit.toLocaleString()}
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
              {/* <TabsTrigger value="stakeholders">Stakeholder Report</TabsTrigger> */}
          </TabsList>

          <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
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
                        Rs. {reportData?.stats.totalRevenue.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-bold">
                      Rs. {reportData?.stats.totalExpenses.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-bold">
                      Rs. {reportData?.stats.netProfit.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-bold">
                        {reportData?.stats.netProfit && reportData?.stats.totalRevenue
                          ? Math.round((reportData.stats.netProfit / reportData.stats.totalRevenue) * 100)
                          : 0}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="stakeholders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stakeholder Report</CardTitle>
              <CardDescription>Revenue and payments for stakeholders in {selectedYear}.</CardDescription>
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
                  {reportData?.stakeholderReportData.map((data) => (
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
                      {reportData?.stakeholderReportData.reduce((sum, data) => sum + data.totalCars, 0)}
                    </TableCell>
                    <TableCell className="font-bold">
                      ${reportData?.stats.totalRevenue.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-bold">-</TableCell>
                    <TableCell className="font-bold">
                      ${reportData?.stakeholderReportData.reduce((sum, data) => sum + data.commissionAmount, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-bold">
                      ${reportData?.stats.netProfit.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
      </div>
    </div>
  )
}

