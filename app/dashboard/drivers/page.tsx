"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Loader2, Search, UserPlus, Download, Trash2, X } from "lucide-react";
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
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import config from "../../../config";

export default function DriversPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: "",
    idCard: "",
    address: "",
    image:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    lisenceNumber: "",
    phone: "",
    status: "",
    emergencyPhone: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Filter drivers based on search query
  const filteredDrivers = drivers.filter(
    (driver: any) =>
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.idCard.includes(searchQuery)
  );

  const formatCNIC = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");
    
    // Format as XXXXX-XXXXXXX-X
    if (digits.length <= 5) return digits;
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    if (id === "idCard") {
      setNewDriver(prev => ({
        ...prev,
        idCard: formatCNIC(value)
      }));
    } else {
      setNewDriver(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${config.backendUrl}/drivers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDrivers(response.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      toast.error("Error fetching drivers: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDriver = async () => {
    // Validate required fields
    if (!newDriver.name || !newDriver.idCard || !newDriver.phone || !newDriver.lisenceNumber) {
      toast.error("Name, ID Card, Phone, and License Number are required");
      return;
    }

    // Validate ID card format
    if (!/^\d{5}-\d{7}-\d{1}$/.test(newDriver.idCard)) {
      toast.error("Please enter a valid ID card number (XXXXX-XXXXXXX-X)");
      return;
    }

    // Validate phone number format
    if (!/^03\d{9}$/.test(newDriver.phone)) {
      toast.error("Phone number must start with 03 and have 11 digits");
      return;
    }

    // Validate emergency phone if provided
    if (newDriver.emergencyPhone && !/^03\d{9}$/.test(newDriver.emergencyPhone)) {
      toast.error("Emergency phone number must start with 03 and have 11 digits");
      return;
    }

    setUploading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${config.backendUrl}/drivers`,
        newDriver,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Reset form
      setNewDriver({
        name: "",
        idCard: "",
        address: "",
        lisenceNumber: "",
        image:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        phone: "",
        status: "",
        emergencyPhone: "",
      });

      fetchDrivers();
      setOpen(false);
      toast.success("Driver added successfully!");
    } catch (error: any) {
      console.error("Error adding driver:", error);
      toast.error(error?.response?.data?.error || "Failed to add driver");
    } finally {
      setUploading(false);
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

      setNewDriver((prev) => ({
        ...prev,
        image: response.data.image_url, // Save image URL in state
      }));

      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error?.response?.data?.error || "Failed to upload image.");
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
    doc.text("Driver List", 105, 20, { align: "center" });

    // Add date
    doc.setFontSize(9);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 205, 10, {
      align: "right",
    });

    // Reset text color for table
    doc.setTextColor(0, 0, 0);

    // Add table
    const tableData = drivers.map((driver: any) => [
      driver.name,
      driver.idCard,
      driver.address,
      driver.lisenceNumber,
      driver.phone,
      driver.emergencyPhone || "N/A",
      driver.status,
    ]);

    autoTable(doc, {
      startY: 40,
      head: [["Name", "ID Card", "Address", "License", "Phone", "Emergency", "Status"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [23, 37, 63] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 30 },
        2: { cellWidth: 40 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 20 },
      },
    });

    doc.save("driver-list.pdf");
  };

  const handleDeleteDriver = async (driverId: string) => {
    if (!confirm("Are you sure you want to delete this driver?")) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${config.backendUrl}/drivers/${driverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Driver deleted successfully");
      fetchDrivers();
    } catch (error: any) {
      console.error("Error deleting driver:", error);
      toast.error(error?.response?.data?.error || "Failed to delete driver");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
          <p className="mt-2 text-gray-600 text-lg font-medium">
            Loading drivers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ToastContainer />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Drivers</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={downloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Driver
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Driver</DialogTitle>
                <DialogDescription>
                  Enter the driver details below to add them to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={newDriver.name}
                    onChange={handleInputChange}
                    placeholder="Enter driver's full name"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="idCard">ID Card Number *</Label>
                    <Input
                      id="idCard"
                      value={newDriver.idCard}
                      onChange={handleInputChange}
                      placeholder="XXXXX-XXXXXXX-X"
                      maxLength={15}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={newDriver.phone}
                      onChange={handleInputChange}
                      placeholder="03XXXXXXXXX"
                      maxLength={11}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={newDriver.address}
                    onChange={handleInputChange}
                    placeholder="Enter driver's address"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="lisenceNumber">License Number *</Label>
                    <Input
                      id="lisenceNumber"
                      value={newDriver.lisenceNumber}
                      onChange={handleInputChange}
                      placeholder="Enter driver's license number"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="emergencyPhone">Emergency Number</Label>
                    <Input
                      id="emergencyPhone"
                      value={newDriver.emergencyPhone}
                      onChange={handleInputChange}
                      placeholder="03XXXXXXXXX"
                      maxLength={11}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="profilePicture">Profile Picture</Label>
                  <div style={{ display: "flex" }}>
                    <div className="w-11 h-10 rounded-full overflow-hidden border-2 border-gray-300 mb-2 mr-2">
                      {uploading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="animate-spin h-5 w-5 text-gray-500" />
                        </div>
                      ) : (
                        <img
                          src={newDriver.image}
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
              <DialogFooter>
                <Button onClick={handleAddDriver} disabled={uploading}>
                  {uploading ? (
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  ) : (
                    "Add Driver"
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
          <CardTitle>Driver List</CardTitle>
          <CardDescription>
            Manage your drivers and view their trip history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead>ID Card</TableHead>
                <TableHead>Liscence Number</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Emergency Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.map((driver: any) => (
                <TableRow key={driver.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-10 w-10 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                        onClick={() => setSelectedImage(driver.image)}
                      >
                        <Image
                          src={driver.image || "/placeholder.svg"}
                          alt={driver.name}
                          width={40}
                          height={40}
                          loading="lazy"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{driver.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {driver.address}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="min-w-[130px]">{driver.idCard}</div>
                  </TableCell>
                  <TableCell>{driver.lisenceNumber}</TableCell>
                  <TableCell>{driver.phone}</TableCell>
                  <TableCell>{driver.emergencyPhone || "N/A"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        driver.status === "available" ? "default" : "secondary"
                      }
                    >
                      {driver.status === "available"
                        ? "Available"
                        : "Not Available"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {driver.status === "available" && (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDriver(driver.id)}
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

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Driver Photo</DialogTitle>
            {/* <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-4 w-4" />
            </Button> */}
          </DialogHeader>
          <div className="relative aspect-square w-full max-h-[80vh]">
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Driver photo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
