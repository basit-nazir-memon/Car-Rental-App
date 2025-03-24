"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { Badge } from "@/components/ui/badge";
import config from "../../../config"

import { Plus, BarChart3 } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddCar from "./add-car";

// Mock data for car models
const carModels = [
  {
    id: 1,
    name: "Toyota Corolla",
    image: "/placeholder.svg?height=200&width=300",
    availableColors: ["red", "blue", "white", "black", "silver"],
    availableCount: 3,
    totalCount: 5,
  },
  {
    id: 2,
    name: "Honda Civic",
    image: "/placeholder.svg?height=200&width=300",
    availableColors: ["blue", "white", "black"],
    availableCount: 2,
    totalCount: 3,
  },
  {
    id: 3,
    name: "Suzuki Swift",
    image: "/placeholder.svg?height=200&width=300",
    availableColors: ["red", "silver"],
    availableCount: 0,
    totalCount: 2,
  },
  {
    id: 4,
    name: "Nissan Altima",
    image: "/placeholder.svg?height=200&width=300",
    availableColors: ["white", "black", "silver"],
    availableCount: 1,
    totalCount: 2,
  },
  {
    id: 5,
    name: "Hyundai Elantra",
    image: "/placeholder.svg?height=200&width=300",
    availableColors: ["red", "blue", "white"],
    availableCount: 2,
    totalCount: 3,
  },
  {
    id: 6,
    name: "Kia Sportage",
    image: "/placeholder.svg?height=200&width=300",
    availableColors: ["black", "silver", "white"],
    availableCount: 1,
    totalCount: 2,
  },
];

export default function CarsPage() {
  const [cars, setCars] = useState(carModels);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCars = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from local storage (or from context)
      
      const response = await fetch(`${config.backendUrl}/cars`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Send token in headers
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // setCars(data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);
  

  // Function to add a new car
  const onCarAdded = () => {
    fetchCars();
  };

  // Filter cars based on search query
  const filteredCars = cars.filter((car: any) =>
    car?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Car Models</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <DatePickerWithRange className="w-auto" />
        </div>
      </div>

      <div className="relative">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* <h1 className="text-3xl font-bold tracking-tight">My Cars</h1> */}
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search cars..."
            className="w-full bg-background pl-8 md:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <AddCar onCarAdded={onCarAdded}/>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCars.map((car) => (
          <Link href={`/dashboard/cars/${car.id}`} key={car.id}>
            <Card
              className={`overflow-hidden transition-all hover:shadow-md ${
                car.availableCount === 0 ? "opacity-60" : ""
              }`}
            >
              <div className="relative h-48">
                <Image
                  src={car.image || "/placeholder.svg"}
                  alt={car.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2 left-2">
                  <Badge
                    variant={car.availableCount > 0 ? "default" : "destructive"}
                  >
                    {car.availableCount > 0
                      ? `${car.availableCount}/${car.totalCount} Available`
                      : "Not Available"}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{car.name}</h3>
                  <div className="flex gap-1">
                    {car.availableColors.map((color) => (
                      <div
                        key={color}
                        className="h-4 w-4 rounded-full border"
                        style={{ backgroundColor: color }}
                        title={color.charAt(0).toUpperCase() + color.slice(1)}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
