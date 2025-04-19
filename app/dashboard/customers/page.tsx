"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, UserPlus } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
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
import { Skeleton } from "@/components/ui/skeleton"
import config from "../../../config"
import { format } from "date-fns"

interface Customer {
  _id: string
  fullName: string
  phoneNumber: string
  idCardNumber: string
  bookingCount: number
  lastBookingDate: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    idCard: "",
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch(`${config.backendUrl}/customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch customers")
      }

      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error("Error fetching customers:", error)
      toast.error("Failed to fetch customers")
    } finally {
      setIsLoading(false)
    }
  }

  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phoneNumber.includes(searchQuery) ||
      customer.idCardNumber.includes(searchQuery),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setNewCustomer((prev) => ({ ...prev, [id]: value }))
  }

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone || !newCustomer.idCard) {
      toast.error("All fields are required")
      return
    }

    setIsAdding(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${config.backendUrl}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: newCustomer.name,
          phoneNumber: newCustomer.phone,
          idCardNumber: newCustomer.idCard
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 400) {
          toast.error(data.error || "Failed to add customer")
        } else {
          throw new Error("Failed to add customer")
        }
        return
      }

      toast.success("Customer added successfully")
      setNewCustomer({ name: "", phone: "", idCard: "" })
      fetchCustomers() // Refresh the list
    } catch (error) {
      console.error("Error adding customer:", error)
      toast.error("Failed to add customer. Please try again.")
    } finally {
      setIsAdding(false)
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

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
              <Button onClick={handleAddCustomer} disabled={isAdding}>
                {isAdding ? "Adding..." : "Add Customer"}
              </Button>
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
                <TableRow key={customer._id}>
                  <TableCell className="font-medium">{customer.fullName}</TableCell>
                  <TableCell>{customer.phoneNumber}</TableCell>
                  <TableCell>{customer.idCardNumber}</TableCell>
                  <TableCell>{customer.bookingCount}</TableCell>
                  <TableCell>
                    {customer.lastBookingDate 
                      ? format(new Date(customer.lastBookingDate), "dd/MM/yyyy")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/customers/${customer._id}`}>View</Link>
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

