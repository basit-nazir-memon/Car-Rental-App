"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Filter } from "lucide-react";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import AddCar from "./add-car";

interface Car {
  id: number;
  name: string;
  image: string;
  availableColors: string[];
  availableCount: number;
  totalCount: number;
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [date, setDate] = useState<{
    from: Date | null;
    to: Date | null;
  } | null>(null);

  useEffect(() => {
    // Check for admin role on client side
    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
  }, []);

  const fetchCars = async (startDate?: Date | null, endDate?: Date | null) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      let url = `${config.backendUrl}/cars`;
      if (startDate && endDate) {
        url += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      }
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCars(data.cars || []);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setCars([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    if (date?.from && date?.to) {
      fetchCars(date.from, date.to);
    }
  }, [date]);
  

  // Function to add a new car
  const onCarAdded = () => {
    fetchCars();
  };

  // Filter cars based on search query
  const filteredCars = cars.filter((car) =>
    car?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Car Models</h1>
        <div className="flex items-center gap-2">
          <DatePicker
            selectsRange={true}
            startDate={date?.from}
            endDate={date?.to}
            onChange={(update) => {
              if (update) {
                const [start, end] = update;
                setDate({ from: start, to: end });
              } else {
                setDate(null);
                fetchCars(); // Fetch all cars when date range is cleared
              }
            }}
            dateFormat="MMM dd, yyyy"
            placeholderText="Select date range"
            className="flex h-10 w-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            monthsShown={2}
            showPopperArrow={false}
            isClearable
            calendarClassName="rounded-md border shadow-md"
          />
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
          {isAdmin && (
          <AddCar onCarAdded={onCarAdded}/>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredCars.map((car) => (
            <Link 
              href={{
                pathname: `/dashboard/cars/${car.name.toLowerCase().replace(/\s+/g, '-')}`,
                query: {
                  startDate: date?.from?.toISOString(),
                  endDate: date?.to?.toISOString()
                }
              }}
              key={car.id}
            >
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
          ))
        )}
      </div>
    </div>
  );
}
