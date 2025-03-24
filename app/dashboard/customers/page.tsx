"use client"

import type React from "react"

import { useState } from "react"
import { Search, UserPlus } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Mock data for customers
const customers = [
  {
    id: 1,
    name: "John Doe",
    phone: "+92 300 1234567",
    idCard: "12345-6789012-3",
    totalBookings: 5,
    lastBooking: "2023-03-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    phone: "+92 301 2345678",
    idCard: "98765-4321098-7",
    totalBookings: 3,
    lastBooking: "2023-02-20",
  },
  {
    id: 3,
    name: "Robert Williams",
    phone: "+92 302 3456789",
    idCard: "45678-9012345-6",
    totalBookings: 2,
    lastBooking: "2023-01-10",
  },
  {
    id: 4,
    name: "Emily Johnson",
    phone: "+92 303 4567890",
    idCard: "78901-2345678-9",
    totalBookings: 1,
    lastBooking: "2022-12-05",
  },
  {
    id: 5,
    name: "Michael Brown",
    phone: "+92 304 5678901",
    idCard: "23456-7890123-4",
    totalBookings: 4,
    lastBooking: "2023-03-01",
  },
]

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    idCard: "",
  })

  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.idCard.includes(searchQuery),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setNewCustomer((prev) => ({ ...prev, [id]: value }))
  }

  const handleAddCustomer = () => {
    // This would normally add the customer to the database
    console.log("Adding customer:", newCustomer)
    // Reset form
    setNewCustomer({ name: "", phone: "", idCard: "" })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>Enter the customer details below to add them to the system.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={handleInputChange}
                  placeholder="Enter customer's full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={handleInputChange}
                  placeholder="Enter customer's phone number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="idCard">ID Card Number</Label>
                <Input
                  id="idCard"
                  value={newCustomer.idCard}
                  onChange={handleInputChange}
                  placeholder="Enter customer's ID card number"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddCustomer}>Add Customer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, phone, or ID card..."
          className="w-full bg-background pl-8 md:w-[300px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>Manage your customers and view their booking history.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>ID Card</TableHead>
                <TableHead>Total Bookings</TableHead>
                <TableHead>Last Booking</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.idCard}</TableCell>
                  <TableCell>{customer.totalBookings}</TableCell>
                  <TableCell>{customer.lastBooking}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/customers/${customer.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

