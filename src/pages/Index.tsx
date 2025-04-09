
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import ContactForm from "@/components/landing/ContactForm";
import { UserRole } from "../App";

interface IndexProps {
  setUserRole: (role: UserRole) => void;
}

const Index = ({ setUserRole }: IndexProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onLogin={setUserRole} />
      <main className="flex-grow">
        <Hero />
        <Features />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
