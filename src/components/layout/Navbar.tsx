
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn } from "lucide-react";
import { UserRole } from "../../App";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface NavbarProps {
  userRole?: UserRole;
  onLogin?: (role: UserRole) => void;
}

const Navbar = ({ userRole, onLogin }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [loginType, setLoginType] = useState<"admin" | "employee">("employee");
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const openLoginDialog = (type: "admin" | "employee") => {
    setLoginType(type);
    setLoginDialogOpen(true);
    setCredentials({ email: "", password: "" });
  };

  const handleCredentialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  // Mock login handler for demonstration purposes
  const handleLogin = (type: "sso" | "credentials" = "credentials") => {
    if (loginType === "employee" && type === "sso") {
      // Mock SSO login for employees
      toast.success("Redirecting to SSO provider...");
      setTimeout(() => {
        if (onLogin) {
          onLogin("employee");
          window.location.href = "/dashboard";
        }
      }, 1500);
      return;
    }
    
    if (loginType === "admin" && credentials.email && credentials.password) {
      // Mock credential validation logic for admin/superuser
      if (credentials.email === "admin@example.com" && credentials.password === "admin123") {
        if (onLogin) {
          onLogin("admin");
          window.location.href = "/admin/dashboard";
          setLoginDialogOpen(false);
        }
      } else if (credentials.email === "super@example.com" && credentials.password === "super123") {
        if (onLogin) {
          onLogin("superuser");
          window.location.href = "/superuser/dashboard";
          setLoginDialogOpen(false);
        }
      } else {
        // Show error for invalid credentials
        setErrorMessage("Invalid email or password. Please try again.");
        setErrorDialogOpen(true);
      }
    } else if (loginType === "employee" && credentials.email && credentials.password) {
      // Mock credential validation for employees
      if (credentials.email.includes("@") && credentials.password.length >= 6) {
        if (onLogin) {
          onLogin("employee");
          window.location.href = "/dashboard";
          setLoginDialogOpen(false);
        }
      } else {
        // Show error for invalid employee credentials
        setErrorMessage("Invalid email or password. Please try again.");
        setErrorDialogOpen(true);
      }
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm fixed w-full top-0 z-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-complybrand-800 dark:text-complybrand-300 hover:scale-105 transition-transform">
                CompliQuick
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isHomePage ? (
              <>
                <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-complybrand-600 dark:hover:text-complybrand-400 px-3 py-2 hover:scale-105 transition-transform">
                  Features
                </a>
                <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-complybrand-600 dark:hover:text-complybrand-400 px-3 py-2 hover:scale-105 transition-transform">
                  Contact
                </a>
                <ThemeToggle />
                {!userRole && (
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => openLoginDialog("employee")}
                      className="flex items-center space-x-1 hover:scale-105 transition-transform"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Employee Login</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => openLoginDialog("admin")}
                      className="flex items-center space-x-1 hover:scale-105 transition-transform"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Admin Login</span>
                    </Button>
                  </div>
                )}
              </>
            ) : (
              userRole && (
                <div className="flex items-center space-x-2">
                  <ThemeToggle />
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = "/"} 
                    className="hover:scale-105 transition-transform"
                  >
                    Logout
                  </Button>
                </div>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-complybrand-600 dark:hover:text-complybrand-400 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 pt-2 pb-3 space-y-1 shadow-lg animate-slide-up">
          {isHomePage ? (
            <>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-complybrand-600 dark:hover:text-complybrand-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Features
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-complybrand-600 dark:hover:text-complybrand-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Contact
              </a>
              {!userRole && (
                <div className="px-3 py-2 space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openLoginDialog("employee");
                    }}
                  >
                    Employee Login
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openLoginDialog("admin");
                    }}
                  >
                    Admin Login
                  </Button>
                </div>
              )}
            </>
          ) : (
            userRole && (
              <div className="px-3 py-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = "/"}
                >
                  Logout
                </Button>
              </div>
            )
          )}
        </div>
      )}
      
      {/* Admin/Superuser Login Dialog */}
      <Dialog open={loginDialogOpen && loginType === "admin"} onOpenChange={(open) => {
        setLoginDialogOpen(open);
        if (!open) setLoginType("employee");
      }}>
        <DialogContent className="sm:max-w-[425px] animate-scale-in">
          <DialogHeader>
            <DialogTitle>Admin Login</DialogTitle>
            <DialogDescription>
              Enter your admin credentials to access dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                placeholder="admin@example.com" 
                value={credentials.email}
                onChange={handleCredentialChange}
                autoComplete="email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password"
                type="password" 
                value={credentials.password}
                onChange={handleCredentialChange}
                autoComplete="current-password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLoginDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => handleLogin()} className="bg-complybrand-700 hover:bg-complybrand-800">Login</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Employee Login Dialog */}
      <Dialog open={loginDialogOpen && loginType === "employee"} onOpenChange={(open) => {
        setLoginDialogOpen(open);
        if (!open) setLoginType("employee");
      }}>
        <DialogContent className="sm:max-w-[425px] animate-scale-in">
          <DialogHeader>
            <DialogTitle>Employee Login</DialogTitle>
            <DialogDescription>
              Login to access your training courses.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                placeholder="employee@company.com" 
                value={credentials.email}
                onChange={handleCredentialChange}
                autoComplete="email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password"
                type="password" 
                value={credentials.password}
                onChange={handleCredentialChange}
                autoComplete="current-password"
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto" 
              onClick={() => handleLogin("sso")}
            >
              Login with SSO
            </Button>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setLoginDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => handleLogin()} className="bg-complybrand-700 hover:bg-complybrand-800">Login</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <AlertDialogContent className="animate-scale-in">
          <AlertDialogHeader>
            <AlertDialogTitle>Authentication Error</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Try Again</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
};

export default Navbar;
