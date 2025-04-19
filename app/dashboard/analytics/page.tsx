// "use client"

// import { useState } from "react"
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// // Mock data for monthly analytics
// const monthlyData = {
//   "2023-03": {
//     expenses: 210000,
//     bookings: 35,
//     revenue: 525000,
//     commissions: 78750,
//     profit: 236250,
//   },
//   "2023-02": {
//     expenses: 185000,
//     bookings: 28,
//     revenue: 420000,
//     commissions: 63000,
//     profit: 172000,
//   },
//   "2023-01": {
//     expenses: 195000,
//     bookings: 30,
//     revenue: 450000,
//     commissions: 67500,
//     profit: 187500,
//   },
// }

// // Mock data for monthly chart
// const monthlyChartData = [
//   { name: "Jan", profit: 187500, expenses: 195000 },
//   { name: "Feb", profit: 172000, expenses: 185000 },
//   { name: "Mar", profit: 236250, expenses: 210000 },
//   { name: "Apr", profit: 205000, expenses: 190000 },
//   { name: "May", profit: 220000, expenses: 200000 },
//   { name: "Jun", profit: 240000, expenses: 215000 },
//   { name: "Jul", profit: 260000, expenses: 225000 },
//   { name: "Aug", profit: 280000, expenses: 230000 },
//   { name: "Sep", profit: 270000, expenses: 220000 },
//   { name: "Oct", profit: 290000, expenses: 235000 },
//   { name: "Nov", profit: 310000, expenses: 240000 },
//   { name: "Dec", profit: 330000, expenses: 250000 },
// ]

// // Mock data for stakeholder profit division
// const stakeholderData = [
//   { name: "Ali Hassan", value: 35 },
//   { name: "Zainab Khan", value: 25 },
//   { name: "Usman Ali", value: 40 },
// ]

// // Colors for pie chart
// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

// export default function AnalyticsPage() {
//   const [selectedMonth, setSelectedMonth] = useState("03")
//   const [selectedYear, setSelectedYear] = useState("2023")

//   // Get data for selected month
//   const selectedMonthData = monthlyData[`${selectedYear}-${selectedMonth}`] || {
//     expenses: 0,
//     bookings: 0,
//     revenue: 0,
//     commissions: 0,
//     profit: 0,
//   }

//   return (
//     <div className="flex flex-col gap-6">
//       <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//         <h1 className="text-3xl font-bold tracking-tight">Business Analytics</h1>
//         <div className="flex gap-2">
//           <Select value={selectedMonth} onValueChange={setSelectedMonth}>
//             <SelectTrigger className="w-[120px]">
//               <SelectValue placeholder="Month" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="01">January</SelectItem>
//               <SelectItem value="02">February</SelectItem>
//               <SelectItem value="03">March</SelectItem>
//               <SelectItem value="04">April</SelectItem>
//               <SelectItem value="05">May</SelectItem>
//               <SelectItem value="06">June</SelectItem>
//               <SelectItem value="07">July</SelectItem>
//               <SelectItem value="08">August</SelectItem>
//               <SelectItem value="09">September</SelectItem>
//               <SelectItem value="10">October</SelectItem>
//               <SelectItem value="11">November</SelectItem>
//               <SelectItem value="12">December</SelectItem>
//             </SelectContent>
//           </Select>

//           <Select value={selectedYear} onValueChange={setSelectedYear}>
//             <SelectTrigger className="w-[100px]">
//               <SelectValue placeholder="Year" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="2023">2023</SelectItem>
//               <SelectItem value="2022">2022</SelectItem>
//               <SelectItem value="2021">2021</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">${selectedMonthData.expenses.toLocaleString()}</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Monthly Bookings</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{selectedMonthData.bookings}</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">${selectedMonthData.revenue.toLocaleString()}</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Monthly Commissions</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">${selectedMonthData.commissions.toLocaleString()}</div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Monthly Profit</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">${selectedMonthData.profit.toLocaleString()}</div>
//           </CardContent>
//         </Card>
//       </div>

//       <Tabs defaultValue="charts" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="charts">Charts</TabsTrigger>
//           <TabsTrigger value="stakeholders">Stakeholder Division</TabsTrigger>
//         </TabsList>
//         <TabsContent value="charts" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Monthly Profit and Expenses</CardTitle>
//               <CardDescription>Last 12 months of profit and expenses.</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-[400px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart
//                     data={monthlyChartData}
//                     margin={{
//                       top: 20,
//                       right: 30,
//                       left: 20,
//                       bottom: 5,
//                     }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="profit" fill="#8884d8" name="Profit" />
//                     <Bar dataKey="expenses" fill="#82ca9d" name="Expenses" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//         <TabsContent value="stakeholders" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Stakeholder Profit Division</CardTitle>
//               <CardDescription>Percentage of profit by stakeholder.</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-[400px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={stakeholderData}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={true}
//                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                       outerRadius={150}
//                       fill="#8884d8"
//                       dataKey="value"
//                     >
//                       {stakeholderData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip formatter={(value) => `${value}%`} />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

