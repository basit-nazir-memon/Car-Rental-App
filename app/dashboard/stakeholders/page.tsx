"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, UserPlus, Loader2 } from "lucide-react"
import Image from "next/image"
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
import config from "../../../config"

interface Stakeholder {
  id: string
  name: string
  idNumber: string
  email: string
  phone: string
  commissionPercentage: number
  avatar?: string
  role: string
  blocked: boolean
  createdAt: string
}

export default function StakeholdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newStakeholder, setNewStakeholder] = useState({
    fullName: "",
    idCardNumber: "",
    email: "",
    cellPhone: "",
    commissionPercentage: "",
    avatar: null as File | null,
  })

  useEffect(() => {
    fetchStakeholders()
  }, [])

  const fetchStakeholders = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${config.backendUrl}/stakeholders`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Please login again")
        }
        throw new Error("Failed to fetch stakeholders")
      }

      const data = await response.json()
      setStakeholders(data)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load stakeholders")
      console.error("Error fetching stakeholders:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter stakeholders based on search query
  const filteredStakeholders = stakeholders.filter(
    (stakeholder) =>
      stakeholder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stakeholder.idNumber.includes(searchQuery) ||
      stakeholder.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stakeholder.phone.includes(searchQuery),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target

    if (id === "avatar" && files && files.length > 0) {
      setNewStakeholder((prev) => ({ ...prev, avatar: files[0] }))
    } else {
      setNewStakeholder((prev) => ({ ...prev, [id]: value }))
    }
  }

  const handleAddStakeholder = async () => {
    try {
      setIsAdding(true)
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`${config.backendUrl}/stakeholders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newStakeholder),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Please login again")
        }
        throw new Error(data.error || "Failed to add stakeholder")
      }

      setStakeholders((prev) => [...prev, data.stakeholder])
      toast.success("Stakeholder added successfully")
      
      // Reset form and close dialog
      setNewStakeholder({
        fullName: "",
        idCardNumber: "",
        email: "",
        cellPhone: "",
        commissionPercentage: "",
        avatar: null,
      })
      setIsDialogOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add stakeholder")
      console.error("Error adding stakeholder:", error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Stakeholders</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={newStakeholder.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter stakeholder's full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="idCardNumber">ID Card Number (CNIC)</Label>
                <Input
                  id="idCardNumber"
                  value={newStakeholder.idCardNumber}
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
                <Label htmlFor="cellPhone">Cell Phone</Label>
                <Input
                  id="cellPhone"
                  value={newStakeholder.cellPhone}
                  onChange={handleInputChange}
                  placeholder="Enter stakeholder's phone number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="commissionPercentage">Standard Commission Deduction (%)</Label>
                <Input
                  id="commissionPercentage"
                  type="number"
                  value={newStakeholder.commissionPercentage}
                  onChange={handleInputChange}
                  placeholder="Enter commission percentage"
                />
              </div>
              {/* <div className="grid gap-2">
                <Label htmlFor="avatar">Stakeholder's Picture</Label>
                <Input id="avatar" type="file" accept="image/*" onChange={handleInputChange} />
              </div> */}
            </div>
            <DialogFooter>
              <Button onClick={handleAddStakeholder} disabled={isAdding}>
                {isAdding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Stakeholder"
                )}
              </Button>
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
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody >
              {loading ? (
                <TableRow key={'loading'}>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredStakeholders.length === 0 ? (
                <TableRow key={'no-stakeholders'}>
                  <TableCell colSpan={6} className="text-center">
                    No stakeholders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredStakeholders.map((stakeholder) => (
                  <TableRow key={stakeholder.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <Image
                            src={stakeholder.avatar || "/placeholder.svg"}
                            alt={stakeholder.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{stakeholder.name}</div>
                          <div className="text-sm text-muted-foreground">{stakeholder.idNumber}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{stakeholder.email}</div>
                        <div>{stakeholder.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{stakeholder.commissionPercentage || 0}%</TableCell>
                    <TableCell>
                      {stakeholder.blocked ? "Blocked" : "Active"}
                    </TableCell>
                    <TableCell>
                      {new Date(stakeholder.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

