
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SendIcon } from "lucide-react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you for your message! We'll be in touch soon.", {
        duration: 5000,
      });
      setFormData({
        name: "",
        email: "",
        organization: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <div id="contact" className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center animate-fade-in">
          <h2 className="text-base font-semibold uppercase tracking-wide text-complybrand-700 dark:text-complybrand-400">
            Contact Us
          </h2>
          <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Ready to get started?
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
            Fill out the form below and one of our team members will get in touch with you shortly.
          </p>
        </div>

        <div className="mt-12 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 sm:p-10 hover:shadow-xl transition-shadow duration-300">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="dark:text-gray-300">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Smith"
                  className="hover:border-complybrand-400 transition-colors focus:ring-complybrand-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@company.com"
                  className="hover:border-complybrand-400 transition-colors focus:ring-complybrand-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization" className="dark:text-gray-300">Organization</Label>
                <Input
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  required
                  placeholder="Company Inc."
                  className="hover:border-complybrand-400 transition-colors focus:ring-complybrand-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="dark:text-gray-300">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Please tell us about your compliance training needs..."
                  className="h-32 hover:border-complybrand-400 transition-colors focus:ring-complybrand-400"
                />
              </div>

              <Button
                type="submit"
                className="w-full py-6 bg-complybrand-700 hover:bg-complybrand-800 hover:scale-[1.02] transition-transform"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    Submit Request <SendIcon className="ml-2 h-4 w-4 animate-[pulse_2s_infinite]" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
