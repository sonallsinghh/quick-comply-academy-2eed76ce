
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn } from "lucide-react";
import { UserRole } from "../../App";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface NavbarProps {
  userRole?: UserRole;
  onLogin?: (role: UserRole) => void;
}

const Navbar = ({ userRole, onLogin }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Mock login handler for demonstration purposes
  const handleLogin = (role: UserRole) => {
    if (onLogin) {
      onLogin(role);
      
      // Navigate based on role (in a real app, we'd use React Router's navigate)
      if (role === "superuser") {
        window.location.href = "/superuser/dashboard";
      } else if (role === "admin") {
        window.location.href = "/admin/dashboard";
      } else if (role === "employee") {
        window.location.href = "/dashboard";
      }
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-complybrand-800 dark:text-complybrand-300">
                CompliQuick
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isHomePage ? (
              <>
                <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-complybrand-600 dark:hover:text-complybrand-400 px-3 py-2">
                  Features
                </a>
                <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-complybrand-600 dark:hover:text-complybrand-400 px-3 py-2">
                  Contact
                </a>
                {!userRole && (
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleLogin("employee")}
                      className="flex items-center space-x-1"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Employee Login</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleLogin("admin")}
                      className="flex items-center space-x-1"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Admin Login</span>
                    </Button>
                    <Button 
                      onClick={() => handleLogin("superuser")}
                      className="bg-complybrand-700 hover:bg-complybrand-800 text-white flex items-center space-x-1"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Super User</span>
                    </Button>
                  </div>
                )}
              </>
            ) : (
              userRole && (
                <div className="flex items-center space-x-2">
                  <ThemeToggle />
                  <Button variant="outline" onClick={() => window.location.href = "/"}>
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
                    onClick={() => handleLogin("employee")}
                  >
                    Employee Login
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleLogin("admin")}
                  >
                    Admin Login
                  </Button>
                  <Button 
                    className="w-full justify-start bg-complybrand-700"
                    onClick={() => handleLogin("superuser")}
                  >
                    Super User
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
    </nav>
  );
};

export default Navbar;
