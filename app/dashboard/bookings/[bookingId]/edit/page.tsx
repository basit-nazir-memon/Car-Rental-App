"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarIcon, ChevronLeft, Save, ChevronRight, X } from "lucide-react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DayPicker, DateRange } from "react-day-picker";
import type { DayPickerProps } from "react-day-picker";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import config from "../../../../../config";
interface Booking {
  id: string;
  status: string;
  customer: {
    id: string;
    name: string;
    phone: string;
    idCard: string;
  };
  car: {
    id: string;
    model: string;
    year: number;
    color: string;
    registrationNumber: string;
    meterReading: number;
  };
  trip: {
    type: string;
    city: string;
    startDate: string;
    endDate: string;
    startTime: string;
  };
  billing: {
    totalAmount: number;
    advancePaid: number;
    discount: number;
    discountReference: string;
    remaining: number;
  };
}

export default function EditBookingPage({
  params,
}: {
  params: { bookingId: string };
}) {
  const router = useRouter();
  const { bookingId } = useParams();
  const [bookingData, setBookingData] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    tripType: "",
    city: "",
    dateRange: {
      from: new Date() as Date | undefined,
      to: new Date() as Date | undefined,
    },
    totalAmount: "",
    advancePaid: "",
    discount: "",
    discountReference: "",
    meterReading: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/bookings/${bookingId}/edit`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch booking data");
        }
        const data = await response.json();
        setBookingData(data);

        // Set initial form data
        setFormData({
          tripType: data.trip.type,
          city: data.trip.city,
          dateRange: {
            from: new Date(data.trip.startDate) as Date | undefined,
            to: new Date(data.trip.endDate) as Date | undefined,
          },
          totalAmount: data.billing.totalAmount.toString(),
          advancePaid: data.billing.advancePaid.toString(),
          discount: data.billing.discount.toString(),
          discountReference: data.billing.discountReference,
          meterReading: data.car.meterReading.toString(),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range) {
      setFormData((prev) => ({
        ...prev,
        dateRange: {
          from: range.from,
          to: range.to,
        },
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${config.backendUrl}/bookings/${bookingId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          tripType: formData.tripType,
          cityName: formData.city,
          startDate: formData.dateRange.from,
          endDate: formData.dateRange.to,
          meterReading: Number(formData.meterReading),
          totalBill: Number(formData.totalAmount),
          advancePaid: Number(formData.advancePaid),
          discountPercentage: Number(formData.discount),
          discountReference: formData.discountReference,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking");
      }

      // Redirect back to booking details page
      router.push(`/dashboard/bookings/${bookingId}`);
    } catch (error) {
      console.error("Error updating booking:", error);
      setError("Failed to update booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/bookings/${bookingId}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Booking #{bookingId}
          </h1>
        </div>
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="h-8 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-8 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-8 w-full animate-pulse rounded-md bg-muted" />
            </div>
            <div className="space-y-4">
              <div className="h-8 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-8 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-8 w-full animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/bookings/${bookingId}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Booking #{bookingId}
          </h1>
        </div>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/bookings/${bookingId}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Booking #{bookingId}
          </h1>
        </div>
        <div className="rounded-lg border p-4 text-center">
          Booking not found
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/bookings/${bookingId}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          Edit Booking #{bookingId}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
              <CardDescription>Update trip information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Trip Type</Label>
                <RadioGroup
                  value={formData.tripType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, tripType: value }))
                  }
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="within-city" id="within-city" />
                    <Label htmlFor="within-city" className="cursor-pointer">
                      Within City
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="out-of-city" id="out-of-city" />
                    <Label htmlFor="out-of-city" className="cursor-pointer">
                      Out of City
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.tripType === "out-of-city" && (
                <div className="space-y-2">
                  <Label htmlFor="city">Destination City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter destination city"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Trip Duration</Label>
                <div className="relative">
                  <DatePicker
                    selectsRange={true}
                    startDate={formData.dateRange?.from}
                    endDate={formData.dateRange?.to}
                    onChange={(update) => {
                      if (update) {
                        setFormData((prev) => ({
                          ...prev,
                          dateRange: {
                            from: update[0] || undefined,
                            to: update[1] || undefined,
                          },
                        }));
                      }
                    }}
                    monthsShown={2}
                    minDate={new Date()}
                    dateFormat="MMM dd, yyyy"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholderText="Select date range"
                    showPopperArrow={false}
                    popperPlacement="bottom-start"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meterReading">Current Meter Reading (km)</Label>
                <Input
                  id="meterReading"
                  name="meterReading"
                  type="number"
                  value={formData.meterReading}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Update payment details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="totalAmount">Total Amount</Label>
                <Input
                  id="totalAmount"
                  name="totalAmount"
                  type="number"
                  value={formData.totalAmount}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="advancePaid">Advance Paid</Label>
                <Input
                  id="advancePaid"
                  name="advancePaid"
                  type="number"
                  value={formData.advancePaid}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountReference">Discount Reference</Label>
                <Input
                  id="discountReference"
                  name="discountReference"
                  value={formData.discountReference}
                  onChange={handleChange}
                  placeholder="Reason for discount (if any)"
                />
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between">
                <p className="font-medium">Remaining Amount</p>
                <p className="font-bold text-lg">
                  Rs.{(Number(formData.totalAmount) * (100 - Number(formData.discount)) / 100) - Number(formData.advancePaid) }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/bookings/${bookingId}`}>Back</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>

    </div>
  );
}
