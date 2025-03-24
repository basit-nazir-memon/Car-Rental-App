"use client"

import type React from "react"

import { useState } from "react"
import { Search, UserPlus } from "lucide-react"
import Image from "next/image"

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

// Mock data for stakeholders
const stakeholders = [
  {
    id: 1,
    name: "Ali Hassan",
    idCard: "12345-6789012-3",
    email: "ali.hassan@example.com",
    phone: "+92 300 1234567",
    commission: 15,
    totalCars: 3,
    totalRevenue: 125000,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Zainab Khan",
    idCard: "98765-4321098-7",
    email: "zainab.khan@example.com",
    phone: "+92 301 2345678",
    commission: 12,
    totalCars: 2,
    totalRevenue: 85000,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Usman Ali",
    idCard: "45678-9012345-6",
    email: "usman.ali@example.com",
    phone: "+92 302 3456789",
    commission: 18,
    totalCars: 5,
    totalRevenue: 210000,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function StakeholdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [newStakeholder, setNewStakeholder] = useState({
    name: "",
    idCard: "",
    email: "",
    phone: "",
    commission: "",
    image: null as File | null,
  })

  // Filter stakeholders based on search query
  const filteredStakeholders = stakeholders.filter(
    (stakeholder) =>
      stakeholder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stakeholder.idCard.includes(searchQuery) ||
      stakeholder.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stakeholder.phone.includes(searchQuery),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target

    if (id === "image" && files && files.length > 0) {
      setNewStakeholder((prev) => ({ ...prev, image: files[0] }))
    } else {
      setNewStakeholder((prev) => ({ ...prev, [id]: value }))
    }
  }

  const handleAddStakeholder = () => {
    // This would normally add the stakeholder to the database
    console.log("Adding stakeholder:", newStakeholder)
    // Reset form
    setNewStakeholder({ name: "", idCard: "", email: "", phone: "", commission: "", image: null })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Stakeholders</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Stakeholder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Stakeholder</DialogTitle>
              <DialogDescription>Enter the stakeholder details below to add them to the system.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newStakeholder.name}
                  onChange={handleInputChange}
                  placeholder="Enter stakeholder's full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="idCard">ID Card Number (CNIC)</Label>
                <Input
                  id="idCard"
                  value={newStakeholder.idCard}
                  onChange={handleInputChange}
                  placeholder="Enter stakeholder's ID card number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStakeholder.email}
                  onChange={handleInputChange}
                  placeholder="Enter stakeholder's email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Cell Phone</Label>
                <Input
                  id="phone"
                  value={newStakeholder.phone}
                  onChange={handleInputChange}
                  placeholder="Enter stakeholder's phone number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="commission">Standard Commission Deduction (%)</Label>
                <Input
                  id="commission"
                  type="number"
                  value={newStakeholder.commission}
                  onChange={handleInputChange}
                  placeholder="Enter commission percentage"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Stakeholder's Picture</Label>
                <Input id="image" type="file" accept="image/*" onChange={handleInputChange} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddStakeholder}>Add Stakeholder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, ID card, email, or phone..."
          className="w-full bg-background pl-8 md:w-[300px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stakeholder List</CardTitle>
          <CardDescription>Manage your stakeholders and view their car investments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stakeholder</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Cars</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStakeholders.map((stakeholder) => (
                <TableRow key={stakeholder.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <Image
                          src={stakeholder.image || "/placeholder.svg"}
                          alt={stakeholder.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{stakeholder.name}</div>
                        <div className="text-sm text-muted-foreground">{stakeholder.idCard}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{stakeholder.email}</div>
                      <div>{stakeholder.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{stakeholder.commission}%</TableCell>
                  <TableCell>{stakeholder.totalCars}</TableCell>
                  <TableCell>${stakeholder.totalRevenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View Details
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

