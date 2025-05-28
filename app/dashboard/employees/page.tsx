"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Loader2, Search, UserPlus, Download, Trash2, Key } from "lucide-react";
import Image from "next/image";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  // Filter employees based on search query
  const filteredEmployees = employees.filter(
    (employee: any) =>
      employee?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee?.idCard.includes(searchQuery)
  );

  const formatCNIC = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");

    // Format as XXXXX-XXXXXXX-X
    if (digits.length <= 5) return digits;
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(
      12,
      13
    )}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "idCard") {
      setNewEmployee((prev) => ({
        ...prev,
        idCard: formatCNIC(value),
      }));
    } else {
      setNewEmployee((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
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
    // Validate required fields
    if (
      !newEmployee.name ||
      !newEmployee.idCard ||
      !newEmployee.email ||
      !newEmployee.password ||
      !newEmployee.age
    ) {
      toast.error("Name, ID Card, Email, Password, and Age are required");
      return;
    }

    // Validate ID card format
    if (!/^\d{5}-\d{7}-\d{1}$/.test(newEmployee.idCard)) {
      toast.error("Please enter a valid ID card number (XXXXX-XXXXXXX-X)");
      return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmployee.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate password length
    if (newEmployee.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    // Validate age
    const age = parseInt(newEmployee.age);
    if (isNaN(age) || age < 18 || age > 65) {
      toast.error("Age must be between 18 and 65");
      return;
    }

    try {
      const token = localStorage.getItem("token");
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
        profilePicture: response.data.image_url,
      }));

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add header with background
    doc.setFillColor(23, 37, 63);
    doc.rect(0, 0, 210, 30, "F");

    // Add title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("Employee List", 105, 20, { align: "center" });

    // Add date
    doc.setFontSize(9);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 205, 10, {
      align: "right",
    });

    // Reset text color for table
    doc.setTextColor(0, 0, 0);

    // Add table
    const tableData = employees.map((employee: any) => [
      employee.name,
      employee.idCard,
      employee.age,
      employee.address,
      employee.email,
      format(new Date(employee.dateOfJoining), "dd/MM/yyyy"),
      employee.status,
    ]);

    autoTable(doc, {
      startY: 40,
      head: [
        ["Name", "ID Card", "Age", "Address", "Email", "Join Date", "Status"],
      ],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [23, 37, 63] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 30 },
        2: { cellWidth: 10 },
        3: { cellWidth: 40 },
        4: { cellWidth: 45 },
        5: { cellWidth: 20 },
        6: { cellWidth: 15 },
      },
    });

    doc.save("employee-list.pdf");
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${config.backendUrl}/employees/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Employee deleted successfully");
      fetchEmployees();
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      toast.error(error?.response?.data?.error || "Failed to delete employee");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsChangingPassword(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${config.backendUrl}/employees/${selectedEmployee.id}/password`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Password changed successfully");
      setShowPasswordDialog(false);
      setNewPassword("");
      setSelectedEmployee(null);
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error?.response?.data?.error || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={downloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
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
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={newEmployee.name}
                    onChange={handleInputChange}
                    placeholder="Enter employee's full name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="idCard">ID Card Number *</Label>
                  <Input
                    id="idCard"
                    value={newEmployee.idCard}
                    onChange={handleInputChange}
                    placeholder="XXXXX-XXXXXXX-X"
                    maxLength={15}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={newEmployee.address}
                    onChange={handleInputChange}
                    placeholder="Enter employee's address"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={handleInputChange}
                    placeholder="Enter employee's email address"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newEmployee.password}
                    onChange={handleInputChange}
                    placeholder="Create employee's password (min. 6 characters)"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2 col-span-1">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={newEmployee.age}
                      onChange={handleInputChange}
                      placeholder="Enter age (18-65)"
                      min={18}
                      max={65}
                      required
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
                <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell className="text-right">
                    {employee.status === "active" && (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowPasswordDialog(true);
                          }}
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEmployee(employee.id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter new password for {selectedEmployee?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleChangePassword}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing Password...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
