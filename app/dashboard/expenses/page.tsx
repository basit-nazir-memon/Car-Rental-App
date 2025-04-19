"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Plus, Filter, Download, Upload } from "lucide-react"
import { format } from "date-fns"

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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import config from "../../../config"

interface Expense {
  id: string
  title: string
  description: string
  amount: number
  date: string
  category: string
}

// Expense categories
const expenseCategories = ["Maintenance", "Rent", "Fuel", "Salary", "Insurance", "Utilities", "Marketing", "Other"]

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAddingExpense, setIsAddingExpense] = useState(false)
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const [newExpense, setNewExpense] = useState({
    title: "",
    description: "",
    amount: "",
    date: "",
    category: ""
  })

  useEffect(() => {
    fetchExpenses()
  }, [selectedMonth, selectedYear, selectedCategory])

  const fetchExpenses = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const token = localStorage.getItem("token")
      
      let url = `${config.backendUrl}/expenses`
      const params = new URLSearchParams()
      
      // Handle date filtering
      if (selectedMonth !== "all" || selectedYear !== "all") {
        let startDate: Date
        let endDate: Date

        if (selectedMonth !== "all" && selectedYear !== "all") {
          // Both month and year are selected
          startDate = new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, 1)
          endDate = new Date(parseInt(selectedYear), parseInt(selectedMonth), 1)
        } else if (selectedMonth !== "all") {
          // Only month is selected (all years)
          // For month-only filtering, we'll use the current year
          const currentYear = new Date().getFullYear()
          startDate = new Date(currentYear, parseInt(selectedMonth) - 1, 1)
          endDate = new Date(currentYear, parseInt(selectedMonth), 1)
        } else {
          // Only year is selected (all months)
          startDate = new Date(parseInt(selectedYear), 0, 1)
          endDate = new Date(parseInt(selectedYear), 11, 31)
        }

        params.append("startDate", format(startDate, "yyyy-MM-dd"))
        params.append("endDate", format(endDate, "yyyy-MM-dd"))
      }
      
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory)
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch expenses")
      }

      const data = await response.json()
      setExpenses(data.expenses)
    } catch (error) {
      console.error("Error fetching expenses:", error)
      setError("Failed to load expenses. Please try again later.")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load expenses. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddExpense = async () => {
    if (!newExpense.title || !newExpense.amount || !newExpense.date || !newExpense.category) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields.",
      })
      return
    }

    try {
      setIsAddingExpense(true)
      const token = localStorage.getItem("token")
      
      const response = await fetch(`${config.backendUrl}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newExpense.title,
          description: newExpense.description,
          amount: parseFloat(newExpense.amount),
          date: newExpense.date,
          category: newExpense.category
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add expense")
      }

      toast({
        title: "Success",
        description: "Expense added successfully.",
      })

      // Reset form and refresh expenses
    setNewExpense({
      title: "",
      description: "",
      amount: "",
        date: "",
        category: ""
      })
      fetchExpenses()
    } catch (error) {
      console.error("Error adding expense:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add expense. Please try again later.",
      })
    } finally {
      setIsAddingExpense(false)
    }
  }

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      setIsDeleting(expenseId)
      const token = localStorage.getItem("token")
      
      const response = await fetch(`${config.backendUrl}/expenses/${expenseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete expense")
      }

      const data = await response.json()
      
      toast({
        title: "Success",
        description: data.message || "Expense deleted successfully",
      })

      // Refresh expenses list
      fetchExpenses()
    } catch (error) {
      console.error("Error deleting expense:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete expense. Please try again later.",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const filteredExpenses = Array.isArray(expenses) 
    ? searchQuery ? expenses.filter((expense) =>
        expense.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.category?.toLowerCase().includes(searchQuery.toLowerCase())
      ) : expenses
    : []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>Enter the expense details below to add it to the system.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Expense Title</Label>
                <Input
                  id="title"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                  placeholder="Enter expense title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  placeholder="Enter expense description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="Enter amount"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={newExpense.date} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={newExpense.category} onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddExpense} disabled={isAddingExpense}>
                {isAddingExpense ? "Adding..." : "Add Expense"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search expenses..."
            className="w-full bg-background pl-8 md:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              <SelectItem value="1">January</SelectItem>
              <SelectItem value="2">February</SelectItem>
              <SelectItem value="3">March</SelectItem>
              <SelectItem value="4">April</SelectItem>
              <SelectItem value="5">May</SelectItem>
              <SelectItem value="6">June</SelectItem>
              <SelectItem value="7">July</SelectItem>
              <SelectItem value="8">August</SelectItem>
              <SelectItem value="9">September</SelectItem>
              <SelectItem value="10">October</SelectItem>
              <SelectItem value="11">November</SelectItem>
              <SelectItem value="12">December</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {expenseCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense List</CardTitle>
          <CardDescription>Manage and track all business expenses.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.title}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{expense.description}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{format(new Date(expense.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>${expense.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteExpense(expense.id)}
                      disabled={isDeleting === expense.id}
                    >
                      {isDeleting === expense.id ? "Deleting..." : "Delete"}
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

