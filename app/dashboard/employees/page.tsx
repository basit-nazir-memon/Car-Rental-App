"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Loader2, Search, UserPlus } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import config from "../../../config";

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    idCard: "",
    address: "",
    age: "",
    email: "",
    password: "",
    profilePicture:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  });

  // Filter employees based on search query
  const filteredEmployees = employees.filter(
    (employee: any) =>
      employee?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee?.idCard.includes(searchQuery)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [id]: value }));
  };

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token"); 
      const response = await axios.get(`${config.backendUrl}/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Error fetching employees: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${config.backendUrl}/employees`,
        newEmployee,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Reset form
      setNewEmployee({
        name: "",
        idCard: "",
        address: "",
        age: "",
        email: "",
        password: "",
        profilePicture:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      });

      fetchEmployees();

      setOpen(false);

      toast.success("Employee added successfully!");
    } catch (error: any) {
      console.error("Error adding employee:", error);
      toast.error(error?.response?.data?.message || "Failed to add employee.");
    }
  };

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${config.backendUrl}/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setNewEmployee((prev) => ({
        ...prev,
        profilePicture: response.data.image_url, // Save image URL in state
      }));

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
          <p className="mt-2 text-gray-600 text-lg font-medium">
            Loading employees...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastContainer />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Enter the employee details below to add them to the system.
              </DialogDescription>
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
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  placeholder="Enter employee's email address"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  value={newEmployee.password}
                  onChange={handleInputChange}
                  placeholder="Create employee's password"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2 col-span-1">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={newEmployee.age}
                    onChange={handleInputChange}
                    placeholder="Enter age"
                  />
                </div>
                <div className="grid gap-2 col-span-2">
                  <Label htmlFor="profilePicture">Profile Picture</Label>

                  <div style={{ display: "flex" }}>
                    <div className="w-11 h-10 rounded-full overflow-hidden border-2 border-gray-300 mb-2 mr-2">
                      {uploading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="animate-spin h-5 w-5 text-gray-500" />
                        </div>
                      ) : (
                        <img
                          src={newEmployee.profilePicture}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <Input
                      id="profilePicture"
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddEmployee} disabled={uploading}>
                {uploading ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  "Add Employee"
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
          placeholder="Search by name or ID card..."
          className="w-full bg-background pl-8 md:w-[300px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
          <CardDescription>
            Manage your employees and their details.
          </CardDescription>
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
                {/* <TableHead className="text-right">Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee: any) => (
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
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {employee.address}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.idCard}</TableCell>
                  <TableCell>{employee.age}</TableCell>
                  <TableCell>{employee.dateOfJoining}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        employee.status === "active" ? "default" : "secondary"
                      }
                    >
                      {employee.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  {/* <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}