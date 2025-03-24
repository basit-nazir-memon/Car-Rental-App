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
import { Badge } from "@/components/ui/badge"

// Mock data for employees
const employees = [
  {
    id: 1,
    name: "Ahmed Khan",
    idCard: "12345-6789012-3",
    address: "123 Main Street, Karachi, Pakistan",
    age: 28,
    dateOfJoining: "2021-05-15",
    status: "active",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Sara Ali",
    idCard: "98765-4321098-7",
    address: "456 Park Avenue, Lahore, Pakistan",
    age: 32,
    dateOfJoining: "2020-10-20",
    status: "active",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Bilal Ahmed",
    idCard: "45678-9012345-6",
    address: "789 Garden Road, Islamabad, Pakistan",
    age: 25,
    dateOfJoining: "2022-01-10",
    status: "active",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "Fatima Zaidi",
    idCard: "78901-2345678-9",
    address: "321 River View, Karachi, Pakistan",
    age: 30,
    dateOfJoining: "2021-08-05",
    status: "inactive",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    idCard: "",
    address: "",
    age: "",
    dateOfJoining: "",
  })

  // Filter employees based on search query
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) || employee.idCard.includes(searchQuery),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setNewEmployee((prev) => ({ ...prev, [id]: value }))
  }

  const handleAddEmployee = () => {
    // This would normally add the employee to the database
    console.log("Adding employee:", newEmployee)
    // Reset form
    setNewEmployee({ name: "", idCard: "", address: "", age: "", dateOfJoining: "" })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>Enter the employee details below to add them to the system.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newEmployee.name}
                  onChange={handleInputChange}
                  placeholder="Enter employee's full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="idCard">ID Card Number</Label>
                <Input
                  id="idCard"
                  value={newEmployee.idCard}
                  onChange={handleInputChange}
                  placeholder="Enter employee's ID card number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newEmployee.address}
                  onChange={handleInputChange}
                  placeholder="Enter employee's address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={newEmployee.age}
                    onChange={handleInputChange}
                    placeholder="Enter age"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dateOfJoining">Date of Joining</Label>
                  <Input
                    id="dateOfJoining"
                    type="date"
                    value={newEmployee.dateOfJoining}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddEmployee}>Add Employee</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name or ID card..."
          className="w-full bg-background pl-8 md:w-[300px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
          <CardDescription>Manage your employees and their details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>ID Card</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Date of Joining</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <Image
                          src={employee.image || "/placeholder.svg"}
                          alt={employee.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">{employee.address}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.idCard}</TableCell>
                  <TableCell>{employee.age}</TableCell>
                  <TableCell>{employee.dateOfJoining}</TableCell>
                  <TableCell>
                    <Badge variant={employee.status === "active" ? "default" : "secondary"}>
                      {employee.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View
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

