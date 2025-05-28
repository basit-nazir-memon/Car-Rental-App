"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, UserPlus, Download } from "lucide-react"
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
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface Customer {
  _id: string
  fullName: string
  careOf: string
  phoneNumber: string
  idCardNumber: string
  bookingCount: number
  lastBookingDate: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    careOf: "",
    phone: "",
    idCard: "",
    email: "",
    address: "",
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

  const formatCNIC = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "")
    
    // Format as XXXXX-XXXXXXX-X
    if (digits.length <= 5) return digits
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    
    if (id === "idCard") {
      setNewCustomer(prev => ({
        ...prev,
        idCard: formatCNIC(value)
      }))
    } else {
      setNewCustomer(prev => ({
        ...prev,
        [id]: value
      }))
    }
  }

  const handleAddCustomer = async () => {
    // Validate required fields
    if (!newCustomer.name || !newCustomer.careOf || !newCustomer.phone || !newCustomer.idCard) {
      toast.error("Name, Care Of, Phone, and ID Card are required")
      return
    }

    // Validate phone number format
    if (!/^[0-9]{11}$/.test(newCustomer.phone)) {
      toast.error("Please enter a valid 11-digit phone number")
      return
    }

    // Validate email format if provided
    if (newCustomer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCustomer.email)) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
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
          careOf: newCustomer.careOf,
          phoneNumber: newCustomer.phone,
          idCardNumber: newCustomer.idCard,
          email: newCustomer.email || undefined,
          address: newCustomer.address || undefined
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
      setNewCustomer({ name: "", careOf: "", phone: "", idCard: "", email: "", address: "" })
      setShowAddDialog(false)
      fetchCustomers() // Refresh the list
    } catch (error) {
      console.error("Error adding customer:", error)
      toast.error("Failed to add customer. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    
    // Add header with background
    doc.setFillColor(23, 37, 63) // Dark blue background
    doc.rect(0, 0, 210, 30, "F")
    
    // Add title
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.text("Customer List", 105, 20, { align: "center" })
    
    // Add date
    doc.setFontSize(9)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 205, 10, { align: "right" })
    
    // Reset text color for table
    doc.setTextColor(0, 0, 0)
    
    // Add table
    const tableData = customers.map(customer => [
      customer.fullName,
      customer.phoneNumber,
      customer.idCardNumber,
      customer.careOf || "N/A",
      customer.bookingCount,
      customer.lastBookingDate ? format(new Date(customer.lastBookingDate), "dd/MM/yyyy") : "N/A"
    ])
    
    autoTable(doc, {
      startY: 40,
      head: [["Name", "Phone", "ID Card", "Care Of", "Total Bookings", "Last Booking"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [23, 37, 63] },
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 27 },
        2: { cellWidth: 35 },
        3: { cellWidth: 30 },
        4: { cellWidth: 20 },
        5: { cellWidth: 25 }
      }
    })
    
    doc.save("customer-list.pdf")
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={downloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
            </Button>
          <Button onClick={() => setShowAddDialog(true)}>Add Customer</Button>
            </div>
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

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>Enter the customer details below to add them to the system.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={newCustomer.name}
                onChange={handleInputChange}
                placeholder="Enter customer's full name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="careOf">Care Of *</Label>
              <Input
                id="careOf"
                value={newCustomer.careOf}
                onChange={handleInputChange}
                placeholder="Enter care of name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={newCustomer.phone}
                onChange={handleInputChange}
                placeholder="Enter 11-digit phone number"
                maxLength={11}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="idCard">ID Card Number *</Label>
              <Input
                id="idCard"
                value={newCustomer.idCard}
                onChange={handleInputChange}
                placeholder="XXXXX-XXXXXXX-X"
                maxLength={15}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newCustomer.email}
                onChange={handleInputChange}
                placeholder="Enter customer's email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={newCustomer.address}
                onChange={handleInputChange}
                placeholder="Enter customer's address"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddCustomer} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Customer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

