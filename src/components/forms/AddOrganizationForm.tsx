
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Building, Mail, Phone, UserCircle, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

// Define the form schema with validations
const organizationFormSchema = z.object({
  name: z.string().min(2, { message: "Organization name is required" }),
  domain: z.string().min(2, { message: "Domain is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  presidingOfficerEmail: z.string().email({ message: "Invalid email address" }),
  poshCommitteeEmail: z.string().email({ message: "Invalid email address" }),
  hrContactName: z.string().min(2, { message: "HR contact name is required" }),
  hrContactEmail: z.string().email({ message: "Invalid email address" }),
  hrContactPhone: z.string().min(10, { message: "Valid phone number required" }),
  ceoName: z.string().min(2, { message: "CEO name is required" }),
  ceoEmail: z.string().email({ message: "Invalid email address" }),
  ceoContact: z.string().min(10, { message: "Valid phone number required" }),
  ctoName: z.string().min(2, { message: "CTO name is required" }),
  ctoEmail: z.string().email({ message: "Invalid email address" }),
  ctoContact: z.string().min(10, { message: "Valid phone number required" }),
  ccoEmail: z.string().email({ message: "Invalid email address" }),
  ccoContact: z.string().min(10, { message: "Valid phone number required" }),
  croName: z.string().min(2, { message: "CRO name is required" }),
  croEmail: z.string().email({ message: "Invalid email address" }),
  croContact: z.string().min(10, { message: "Valid phone number required" }),
  legalOfficerName: z.string().min(2, { message: "Legal officer name is required" }),
  legalOfficerEmail: z.string().email({ message: "Invalid email address" }),
  legalOfficerContact: z.string().min(10, { message: "Valid phone number required" }),
});

type OrganizationFormValues = z.infer<typeof organizationFormSchema>;

interface AddOrganizationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddOrganizationForm: React.FC<AddOrganizationFormProps> = ({
  open,
  onOpenChange,
}) => {
  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: "",
      domain: "",
      email: "",
      password: "",
      presidingOfficerEmail: "",
      poshCommitteeEmail: "",
      hrContactName: "",
      hrContactEmail: "",
      hrContactPhone: "",
      ceoName: "",
      ceoEmail: "",
      ceoContact: "",
      ctoName: "",
      ctoEmail: "",
      ctoContact: "",
      ccoEmail: "",
      ccoContact: "",
      croName: "",
      croEmail: "",
      croContact: "",
      legalOfficerName: "",
      legalOfficerEmail: "",
      legalOfficerContact: "",
    },
  });

  function onSubmit(data: OrganizationFormValues) {
    console.log("Organization form submitted:", data);
    // Here you would typically save the data to your backend
    toast.success("Organization added successfully!");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Organization</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new organization on CompliQuick.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Organization Details</h3>
                  <div className="h-px bg-border" />
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Building className="h-4 w-4" /> Organization Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Corp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <AtSign className="h-4 w-4" /> Domain
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="acmecorp.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Admin Email
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="admin@acmecorp.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">POSH Committee Details</h3>
                  <div className="h-px bg-border" />
                </div>

                <FormField
                  control={form.control}
                  name="presidingOfficerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Presiding Officer Email</FormLabel>
                      <FormControl>
                        <Input placeholder="officer@acmecorp.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="poshCommitteeEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>POSH Committee Email</FormLabel>
                      <FormControl>
                        <Input placeholder="posh@acmecorp.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">HR Details</h3>
                  <div className="h-px bg-border" />
                </div>

                <FormField
                  control={form.control}
                  name="hrContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4" /> HR Contact Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hrContactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> HR Contact Email
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="hr@acmecorp.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hrContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" /> HR Contact Phone
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Executive Details</h3>
                  <div className="h-px bg-border" />
                </div>

                <FormField
                  control={form.control}
                  name="ceoName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEO Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ceoEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEO Email</FormLabel>
                      <FormControl>
                        <Input placeholder="ceo@acmecorp.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ceoContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEO Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Technical & Compliance</h3>
                  <div className="h-px bg-border" />
                </div>

                <FormField
                  control={form.control}
                  name="ctoName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTO Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Alex Johnson" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ctoEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTO Email</FormLabel>
                      <FormControl>
                        <Input placeholder="cto@acmecorp.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ctoContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTO Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="8765432109" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ccoEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CCO Email</FormLabel>
                      <FormControl>
                        <Input placeholder="cco@acmecorp.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ccoContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CCO Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="7654321098" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Risk & Legal</h3>
                  <div className="h-px bg-border" />
                </div>

                <FormField
                  control={form.control}
                  name="croName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CRO Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Sam Wilson" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="croEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CRO Email</FormLabel>
                      <FormControl>
                        <Input placeholder="cro@acmecorp.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="croContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CRO Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="6543210987" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="legalOfficerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal Officer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Morgan Lee" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="legalOfficerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal Officer Email</FormLabel>
                      <FormControl>
                        <Input placeholder="legal@acmecorp.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="legalOfficerContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal Officer Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="5432109876" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-complybrand-700 hover:bg-complybrand-800"
              >
                Create Organization
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrganizationForm;
