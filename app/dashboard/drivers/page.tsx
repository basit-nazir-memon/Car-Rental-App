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
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import config from "../../../config";

// Mock data for drivers
const drivers = [
  {
    id: 1,
    name: "John Smith",
    idCard: "12345-6789012-3",
    address: "123 Main Street, Karachi, Pakistan",
    age: 35,
    status: "available",
    totalTrips: 45,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "David Johnson",
    idCard: "98765-4321098-7",
    address: "456 Park Avenue, Lahore, Pakistan",
    age: 42,
    status: "on-trip",
    totalTrips: 78,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Michael Brown",
    idCard: "45678-9012345-6",
    address: "789 Garden Road, Islamabad, Pakistan",
    age: 28,
    status: "available",
    totalTrips: 32,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "Robert Williams",
    idCard: "78901-2345678-9",
    address: "321 River View, Karachi, Pakistan",
    age: 38,
    status: "on-trip",
    totalTrips: 56,
    image: "/placeholder.svg?height=100&width=100",
  },
];

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
  });

  // Filter drivers based on search query
  const filteredDrivers = drivers.filter(
    (driver: any) =>
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.idCard.includes(searchQuery)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewDriver((prev) => ({ ...prev, [id]: value }));
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
      });

      fetchDrivers();

      setOpen(false);

      toast.success("Driver added successfully!");
    } catch (error: any) {
      console.error("Error adding driver:", error);
      toast.error(error?.response?.data?.error);
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
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newDriver.name}
                  onChange={handleInputChange}
                  placeholder="Enter driver's full name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="idCard">ID Card Number</Label>
                  <Input
                    id="idCard"
                    value={newDriver.idCard}
                    onChange={handleInputChange}
                    placeholder="Enter driver's CNIC number"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newDriver.phone}
                    onChange={handleInputChange}
                    placeholder="Enter driver's Phone number"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newDriver.address}
                  onChange={handleInputChange}
                  placeholder="Enter driver's address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lisenceNumber">Lisence Number</Label>
                <Input
                  id="lisenceNumber"
                  value={newDriver.lisenceNumber}
                  onChange={handleInputChange}
                  placeholder="Enter driver's lisence number"
                />
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
              {/* </div> */}
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
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.map((driver: any) => (
                <TableRow key={driver.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <Image
                          src={driver.image || "/placeholder.svg"}
                          alt={driver.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{driver.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {driver.address}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{driver.idCard}</TableCell>
                  <TableCell>{driver.lisenceNumber}</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
