"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Calendar, AlertTriangle, DollarSign } from "lucide-react";
import { format } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import config from "@/config";
import { useParams } from "next/navigation";

interface Booking {
  id: string;
  customerName: string;
  driverName: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string;
}

interface MonthlyStat {
  month: string;
  revenue: number;
  profit: number;
  bookings: number;
}

interface CarData {
  id: string;
  model: string;
  year: number;
  color: string;
  registrationNumber: string;
  chassisNumber: string;
  engineNumber: string;
  status: string;
  image: string;
  financials: {
    totalRevenue: number;
    totalProfit: number;
    commission: number;
    commissionAmount: number;
  };
  bookings: Booking[];
  monthlyStats: MonthlyStat[];
}

export default function MyCarDetailPage() {
  const params = useParams();
  const carId = params.carId as string;

  const [activeTab, setActiveTab] = useState("details");
  const [carData, setCarData] = useState<CarData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          `${config.backendUrl}/cars/detailed/info/${params.carId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized: Please login again");
          }
          throw new Error("Failed to fetch car details");
        }

        const data = await response.json();
        setCarData(data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load car details"
        );
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [params.carId]);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!carData) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">Car not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/my-cars">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {carData.model} ({carData.year})
        </h1>
        <Badge
          variant={carData.status === "available" ? "default" : "secondary"}
        >
          {carData.status === "available" ? "Available" : "On Trip"}
        </Badge>
      </div>

      <Tabs defaultValue="details" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Car Details</TabsTrigger>
          <TabsTrigger value="bookings">Booking History</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Car Information</CardTitle>
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
                    <p className="text-sm font-medium text-muted-foreground">
                      Model
                    </p>
                    <p>{carData.model}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Year
                    </p>
                    <p>{carData.year}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Color
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full border"
                        style={{ backgroundColor: carData.color }}
                      />
                      <span className="capitalize">{carData.color}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Registration
                    </p>
                    <p>{carData.registrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Chassis Number
                    </p>
                    <p>{carData.chassisNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Engine Number
                    </p>
                    <p>{carData.engineNumber}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Revenue
                      </p>
                      <p className="text-lg font-semibold">
                        Rs. {carData.financials.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Commission ({carData.financials.commission}%)
                      </p>
                      <p className="text-lg font-semibold">
                        Rs.{" "}
                        {carData.financials.commissionAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Net Profit
                      </p>
                      <p className="text-lg font-semibold">
                        Rs. {carData.financials.totalProfit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>The car's most recent bookings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {carData.bookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      {booking.status === "active" ? (
                        <Calendar className="h-5 w-5 text-primary" />
                      ) : (
                        <Calendar className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {booking.customerName} (Driver: {booking.driverName})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.startDate), "MMM dd, yyyy")} -{" "}
                        {format(new Date(booking.endDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      Rs. {booking.totalAmount}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking History</CardTitle>
              <CardDescription>View all bookings for this car.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carData.bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {booking.customerName}
                      </TableCell>
                      <TableCell>{booking.driverName}</TableCell>
                      <TableCell>
                        {format(new Date(booking.startDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        {format(new Date(booking.endDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>Rs. {booking.totalAmount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            booking.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {booking.status === "active" ? "Active" : "Completed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/bookings/${booking.id}`}>
                            View
                          </Link>
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
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rs. {carData.financials.totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Lifetime earnings from this car
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Expenses
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rs.{" "}
                  {(
                    carData.financials.totalRevenue -
                    carData.financials.totalProfit
                  ).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Including commission and other expenses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Net Profit
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rs. {carData.financials.totalProfit.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  After commission and expenses
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>
                Revenue generated by this car per month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={carData.monthlyStats}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `Rs. ${value}`,
                        name,
                      ]}
                      labelFormatter={(label: string) => `Month: ${label}`}
                    />

                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      name="Revenue"
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stackId="1"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      name="Profit"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>
                Detailed breakdown of revenue, expenses, and profit.
              </CardDescription>
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
                      Rs. {carData.financials.totalRevenue.toLocaleString()}
                    </TableCell>
                    <TableCell>100%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Commission ({carData.financials.commission}%)
                    </TableCell>
                    <TableCell>
                      Rs. {carData.financials.commissionAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>{carData.financials.commission}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Net Profit</TableCell>
                    <TableCell>
                      Rs. {carData.financials.totalProfit.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {Math.round(
                        (carData.financials.totalProfit /
                          carData.financials.totalRevenue) *
                          100
                      )}
                      %
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
