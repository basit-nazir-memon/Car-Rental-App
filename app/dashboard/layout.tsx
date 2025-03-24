"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Car,
  Users,
  User,
  Calendar,
  BarChart3,
  LogOut,
  Menu,
  Home,
  DollarSign,
  UserCog,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
import { useAuth } from "@/lib/auth";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role) {
      setUserRole(role);
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/cars"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
              >
                <Car className="h-5 w-5" />
                Cars
              </Link>
              <Link
                href="/dashboard/bookings"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
              >
                <Calendar className="h-5 w-5" />
                Bookings
              </Link>
              <Link
                href="/dashboard/customers"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
              >
                <Users className="h-5 w-5" />
                Customers
              </Link>
              {userRole === "admin" && (
                <>
                  <Link
                    href="/dashboard/employees"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
                  >
                    <User className="h-5 w-5" />
                    Employees
                  </Link>
                  <Link
                    href="/dashboard/drivers"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
                  >
                    <UserCog className="h-5 w-5" />
                    Drivers
                  </Link>
                  <Link
                    href="/dashboard/stakeholders"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
                  >
                    <Users className="h-5 w-5" />
                    Stakeholders
                  </Link>
                  <Link
                    href="/dashboard/expenses"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
                  >
                    <DollarSign className="h-5 w-5" />
                    Expenses
                  </Link>
                  <Link
                    href="/dashboard/analytics"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
                  >
                    <BarChart3 className="h-5 w-5" />
                    Analytics
                  </Link>
                </>
              )}
              {userRole === "stakeholder" && (
                <Link
                  href="/dashboard/my-cars"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
                >
                  <Car className="h-5 w-5" />
                  My Cars
                </Link>
              )}
            </nav>
            <div className="mt-auto">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <Car className="h-6 w-6" />
          <span>Car Rental</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <UserNav />
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <nav className="grid gap-2 p-4 text-sm">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/cars"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
            >
              <Car className="h-4 w-4" />
              Cars
            </Link>
            <Link
              href="/dashboard/bookings"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
            >
              <Calendar className="h-4 w-4" />
              Bookings
            </Link>
            <Link
              href="/dashboard/customers"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
            >
              <Users className="h-4 w-4" />
              Customers
            </Link>
            {userRole === "admin" && (
              <>
                <Link
                  href="/dashboard/employees"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
                >
                  <User className="h-4 w-4" />
                  Employees
                </Link>
                <Link
                  href="/dashboard/drivers"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
                >
                  <UserCog className="h-4 w-4" />
                  Drivers
                </Link>
                <Link
                  href="/dashboard/stakeholders"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
                >
                  <Users className="h-4 w-4" />
                  Stakeholders
                </Link>
                <Link
                  href="/dashboard/expenses"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
                >
                  <DollarSign className="h-4 w-4" />
                  Expenses
                </Link>
                <Link
                  href="/dashboard/analytics"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
                >
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Link>
                <Link
                  href="/dashboard/reports"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
                >
                  <FileText className="h-4 w-4" />
                  Reports
                </Link>
              </>
            )}
            {userRole === "stakeholder" && (
              <Link
                href="/dashboard/my-cars"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted"
              >
                <Car className="h-4 w-4" />
                My Cars
              </Link>
            )}
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
