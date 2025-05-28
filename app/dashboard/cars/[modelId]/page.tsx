"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import config from "../../../../config";

interface CarStats {
  totalBookings: number;
  totalRevenue: number;
}

interface CarInstance {
  id: string;
  color: string;
  registrationNumber: string;
  chassisNumber: string;
  engineNumber: string;
  year: number;
  available: boolean;
  image: string;
  variant: string;
  stats: CarStats;
}

interface CarModel {
  id: number;
  name: string;
  image: string;
  availableColors: string[];
  availableCount: number;
  totalCount: number;
  instances: CarInstance[];
}

export default function CarModelPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [carModel, setCarModel] = useState<CarModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      setUserRole(role);
    }
  }, []);

  useEffect(() => {
    const fetchCarModel = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        let url = `${config.backendUrl}/cars/${params.modelId}`;
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        if (startDate && endDate) {
          url += `?startDate=${startDate}&endDate=${endDate}`;
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCarModel(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching car model:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarModel();
  }, [params.modelId, searchParams]);

  // Filter instances based on search query
  const filteredInstances =
    carModel?.instances.filter(
      (instance) =>
        instance.registrationNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        instance.chassisNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        instance.color.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="relative">
          <Skeleton className="h-10 w-full md:w-[300px]" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!carModel) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/cars">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Car Model Not Found
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/cars">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{carModel.name}</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by registration, chassis, or color..."
          className="w-full bg-background pl-8 md:w-[300px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredInstances.map((instance) => (
          <Link
            href={`/dashboard/cars/${params.modelId}/${instance.id}`}
            key={instance.id}
          >
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <div className="relative h-48">
                <Image
                  src={instance.image || carModel.image || "/placeholder.svg"}
                  alt={`${carModel.name} - ${instance.color}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2 left-2">
                  <Badge variant="default">
                    {instance.available ? "Available" : "Booked"}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold">
                    {carModel.name} {instance.variant} ({instance.year})
                  </h3>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-full border"
                      style={{ backgroundColor: instance.color }}
                    />
                    <span className="text-sm capitalize">{instance.color}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Reg: {instance.registrationNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Chassis: {instance.chassisNumber}
                  </p>
                  {userRole === "admin" && (
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          asChild
                        >
                          <Link href={`/dashboard/my-cars/${instance?.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
