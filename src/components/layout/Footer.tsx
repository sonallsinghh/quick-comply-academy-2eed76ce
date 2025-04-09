
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-complybrand-800">CompliQuick</span>
            </Link>
            <p className="mt-4 text-gray-600">
              Modern compliance training for modern organizations.
            </p>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900">Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#features" className="text-gray-600 hover:text-complybrand-600">
                  Features
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-600 hover:text-complybrand-600">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-gray-600">
                <span>Email: info@complyquick.com</span>
              </li>
              <li className="text-gray-600">
                <span>Phone: (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col items-center">
          <p className="text-gray-600 text-sm">
            &copy; {currentYear} CompliQuick. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
