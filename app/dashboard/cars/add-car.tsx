"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import axios from "axios";
import config from "@/config";

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function AddCar({ onCarAdded }: { onCarAdded: () => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [newCar, setNewCar] = useState({
    model: "",
    year: "",
    color: "",
    registrationNumber: "",
    chassisNumber: "",
    engineNumber: "",
    image: "",
    variant: "",
    ownerId: "",
  });

  const [errors, setErrors] = useState({
    model: "",
    year: "",
    color: "",
    registrationNumber: "",
    chassisNumber: "",
    engineNumber: "",
    variant: "",
    ownerId: "",
  });

  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const models = [
    "Toyota Corolla",
    "Toyota Yaris",
    "Toyota Hilux",
    "Toyota Fortuner",
    "Toyota Prado",
    "Toyota Land Cruiser",
    "Toyota Camry",
    "Toyota Rush",
    "Toyota Avanza",
    "Toyota Hiace",

    "Honda Civic",
    "Honda City",
    "Honda BR-V",
    "Honda HR-V",
    "Honda Accord",

    "Suzuki Alto",
    "Suzuki Cultus",
    "Suzuki Wagon R",
    "Suzuki Swift",
    "Suzuki Bolan",
    "Suzuki Ravi",
    "Suzuki Ciaz",
    "Suzuki Vitara",
    "Suzuki Jimny",

    "Kia Picanto",
    "Kia Sportage",
    "Kia Sorento",
    "Kia Stonic",
    "Kia Carnival",

    "Hyundai Tucson",
    "Hyundai Elantra",
    "Hyundai Sonata",
    "Hyundai Santa Fe",
    "Hyundai Porter H-100",

    "Changan Alsvin",
    "Changan Karvaan",
    "Changan M9",
    "Changan Oshan X7",

    "Proton Saga",
    "Proton X70",

    "MG HS",
    "MG ZS",
    "MG ZS EV",

    "DFSK Glory 580 Pro",
    "DFSK Glory 500",

    "Haval H6",
    "Haval Jolion",

    "BAIC BJ40 Plus",
    "BAIC X25",

    "United Bravo",
    "United Alpha",

    "Prince Pearl",
    "Prince K07",

    "FAW V2",
    "FAW Carrier",
    "FAW XPV",

    "JAC X200",

    "Isuzu D-Max",

    "Land Rover Range Rover",
  ];

  const carColors = [
    "White",
    "Black",
    "Silver",
    "Grey",
    "Blue",
    "Red",
    "Green",
    "Yellow",
    "Brown",
    "Beige",
    "Maroon",
    "Gold",
    "Orange",
    "Purple",
    "Pink",
  ];

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${config.backendUrl}/stakeholders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();

      const myData: User = {
        _id: localStorage.getItem('id') || "self",
        name: localStorage.getItem('name') || "Admin",
        email: localStorage.getItem('email') || ""
      }
      console.log(myData);
      setUsers([myData, ...data]);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewCar({ ...newCar, [e.target.id]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    setImagePreview(URL.createObjectURL(file)); // Show preview

    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${config.backendUrl}/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewCar({ ...newCar, image: res.data.image_url });
    } catch (err) {
      console.error("Error uploading image", err);
    } finally {
      setImageUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {
      model: newCar.model ? "" : "Car model is required",
      year:
        newCar.year && /^\d{4}$/.test(newCar.year)
          ? ""
          : "Enter a valid 4-digit year",
      color: newCar.color ? "" : "Color is required",
      registrationNumber: newCar.registrationNumber
        ? ""
        : "Registration number is required",
      chassisNumber: newCar.chassisNumber ? "" : "Chassis number is required",
      engineNumber: newCar.engineNumber ? "" : "Engine number is required",
      variant: newCar.variant ? "" : "Variant is required",
      ownerId: newCar.ownerId ? "" : "Owner is required",
      // commission: newCar.ownerId && newCar.ownerId !== localStorage.getItem("id") && !newCar.commission 
      //   ? "Commission is required for external owners" 
      //   : "",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };

  const handleAddCar = async () => {
    if (!validateForm()) return; // Prevent submission if invalid

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${config.backendUrl}/cars`, newCar, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onCarAdded(); // Refresh car list
      setOpen(false);
    } catch (err) {
      console.error("Error adding car", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Car
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Car</DialogTitle>
          <DialogDescription>
            Enter the car details below to add it to your fleet.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="model">Car Model</Label>
              <Select
                onValueChange={(value) =>
                  setNewCar({ ...newCar, model: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select car model" />
                </SelectTrigger>
                <SelectContent>
                  {models &&
                    models.map((model, idx) => {
                      return (
                        <SelectItem key={idx} value={model}>
                          {model}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
              {errors.model && (
                <p className="text-red-500 text-sm">{errors.model}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="variant">Variant *</Label>
              <Input
                id="variant"
                value={newCar.variant}
                onChange={handleInputChange}
                placeholder="Enter variant (e.g., GLI, XLI, etc.)"
              />
              {errors.variant && (
                <p className="text-red-500 text-sm">{errors.variant}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={newCar.year}
                onChange={handleInputChange}
                placeholder="Enter year"
              />
              {errors.year && (
                <p className="text-red-500 text-sm">{errors.year}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="color">Color</Label>
              <Select
                onValueChange={(value) =>
                  setNewCar({ ...newCar, color: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {carColors.map((color, idx) => (
                    <SelectItem key={idx} value={color}>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: color.toLowerCase() }}
                        ></span>
                        {color}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.color && (
                <p className="text-red-500 text-sm">{errors.color}</p>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="registrationNumber">Registration Number</Label>
            <Input
              id="registrationNumber"
              value={newCar.registrationNumber}
              onChange={handleInputChange}
              placeholder="Registration Number"
            />
            {errors.registrationNumber && (
              <p className="text-red-500 text-sm">
                {errors.registrationNumber}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="chassisNumber">Chasis Number</Label>
              <Input
                id="chassisNumber"
                value={newCar.chassisNumber}
                onChange={handleInputChange}
                placeholder="Chassis Number"
              />
              {errors.chassisNumber && (
                <p className="text-red-500 text-sm">{errors.chassisNumber}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="engineNumber">Engine Number</Label>
              <Input
                id="engineNumber"
                value={newCar.engineNumber}
                onChange={handleInputChange}
                placeholder="Engine Number"
              />
              {errors.engineNumber && (
                <p className="text-red-500 text-sm">{errors.engineNumber}</p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">Car Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {imageUploading && (
              <Loader2 className="animate-spin h-5 w-5 mx-auto" />
            )}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Car Preview"
                className="h-24 w-auto mt-2 rounded-md"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="ownerId">Owner</Label>
              <Select
                onValueChange={(value) => setNewCar({ ...newCar, ownerId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.ownerId && (
                <p className="text-red-500 text-sm">{errors.ownerId}</p>
              )}
            </div>

            {/* {newCar.ownerId && newCar.ownerId !== localStorage.getItem("userId") && (
              <div className="grid gap-2">
                <Label htmlFor="commission">Commission (%)</Label>
                <Input
                  id="commission"
                  type="number"
                  min="0"
                  max="100"
                  value={newCar.commission}
                  onChange={handleInputChange}
                  placeholder="Enter commission percentage"
                />
                {errors.commission && (
                  <p className="text-red-500 text-sm">{errors.commission}</p>
                )}
              </div>
            )} */}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddCar} disabled={loading}>
            {loading ? "Adding..." : "Add Car"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
