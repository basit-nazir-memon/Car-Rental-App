"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, DollarSign, Car, Calendar, TrendingUp, Users, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import config from "@/config"

interface StakeholderData {
  stakeholder: {
    id: string;
    name: string;
    email: string;
    phone: string;
    commissionPercentage: number;
    avatar: string;
  };
  overview: {
    totalCars: number;
    totalBookings: number;
    completedBookings: number;
    totalRevenue: number;
    totalExpenses: number;
    totalCommission: number;
    totalProfit: number;
  };
  cars: Array<{
    id: string;
    model: string;
    year: number;
    color: string;
    variant: string;
    registrationNumber: string;
    image: string;
    stats: {
      totalBookings: number;
      completedBookings: number;
      totalRevenue: number;
      totalExpenses: number;
      commissionAmount: number;
      totalProfit: number;
    }
  }>;
}

interface PageProps {
  params: Promise<{
    stakeholderId: string;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function StakeholderDetailPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const [activeTab, setActiveTab] = useState("overview")
  const [stakeholderData, setStakeholderData] = useState<StakeholderData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchStakeholderData()
  }, [resolvedParams.stakeholderId])

  const fetchStakeholderData = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      
      const response = await fetch(
        `${config.backendUrl}/stakeholders/details/${resolvedParams.stakeholderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch stakeholder data")
      }

      const data = await response.json()
      setStakeholderData(data)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load data. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!stakeholderData) {
    return <div>Stakeholder not found</div>
  }

  const { stakeholder, overview, cars } = stakeholderData

  const pieChartData = [
    { name: 'Revenue', value: overview.totalRevenue },
    { name: 'Expenses', value: overview.totalExpenses },
    { name: 'Commission', value: overview.totalCommission },
    { name: 'Profit', value: overview.totalProfit },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/stakeholders">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{stakeholder.name}</h1>
      </div>

      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cars">Cars</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview.totalCars}</div>
                <p className="text-xs text-muted-foreground">Total cars owned</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview.totalBookings}</div>
                <p className="text-xs text-muted-foreground">
                  {overview.completedBookings} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rs. {overview?.totalRevenue?.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Lifetime earnings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rs. {overview?.totalProfit?.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">After expenses & commission</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Financial Distribution</CardTitle>
                <CardDescription>Breakdown of revenue, expenses, and profit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [`Rs. ${value?.toLocaleString()}`, 'Amount']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Commission Rate</p>
                      <p className="text-2xl font-bold">{stakeholder.commissionPercentage}%</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-sm font-medium">Total Commission</p>
                      <p className="text-2xl font-bold">
                        Rs. {overview?.totalCommission?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Total Expenses</p>
                      <p className="text-2xl font-bold">
                        Rs. {overview?.totalExpenses?.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-sm font-medium">Completion Rate</p>
                      <p className="text-2xl font-bold">
                        {((overview?.completedBookings / overview?.totalBookings) * 100)?.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
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
                    <TableHead>Bookings</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Expenses</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cars.map((car) => (
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
                            <div className="text-sm text-muted-foreground">
                              {car.variant} • {car.year}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{car.registrationNumber}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div>{car.stats.totalBookings} total</div>
                          <div className="text-sm text-muted-foreground">
                            {car.stats.completedBookings} completed
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>Rs. {car?.stats?.totalRevenue?.toLocaleString()}</TableCell>
                      <TableCell>Rs. {car?.stats?.totalExpenses?.toLocaleString()}</TableCell>
                      <TableCell>Rs. {car?.stats?.totalProfit?.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/my-cars/${car.id}`}>View Details</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>Detailed breakdown of revenue, expenses, and profit.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Total Revenue</TableCell>
                    <TableCell>
                      Rs. {overview?.totalRevenue?.toLocaleString()}
                    </TableCell>
                    <TableCell>100%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Commission ({stakeholder.commissionPercentage}%)
                    </TableCell>
                    <TableCell>
                      Rs. {overview?.totalCommission?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {((overview?.totalCommission / overview?.totalRevenue) * 100)?.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Expenses</TableCell>
                    <TableCell>
                      Rs. {overview?.totalExpenses?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {((overview?.totalExpenses / overview?.totalRevenue) * 100)?.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Net Profit</TableCell>
                      <TableCell>
                      Rs. {overview?.totalProfit?.toLocaleString()}
                      </TableCell>
                    <TableCell>
                      {((overview?.totalProfit / overview?.totalRevenue) * 100)?.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

