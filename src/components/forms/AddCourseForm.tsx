
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { BookOpen, FileText, Upload } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];

const courseFormSchema = z.object({
  title: z.string().min(3, { message: "Course title is required" }),
  description: z.string().min(10, { message: "Please provide a more detailed description" }),
  duration: z.string().min(1, { message: "Duration is required" }),
  tags: z.string().optional(),
  objectives: z.string().optional(),
  targetAudience: z.string().optional(),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

interface AddCourseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddCourseForm: React.FC<AddCourseFormProps> = ({
  open,
  onOpenChange,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: "",
      tags: "",
      objectives: "",
      targetAudience: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const selectedFiles = e.target.files;
    
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    const file = selectedFiles[0];
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setFileError("File size should be less than 5MB");
      return;
    }
    
    // Validate file type
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setFileError("Only PDF and PowerPoint files are accepted");
      return;
    }
    
    setFiles([file]);
  };

  function onSubmit(data: CourseFormValues) {
    if (files.length === 0) {
      setFileError("Please upload course materials");
      return;
    }
    
    const courseData = {
      ...data,
      files,
    };
    
    console.log("Course form submitted:", courseData);
    // Here you would typically save the data to your backend
    toast.success("Course added successfully!");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Course</DialogTitle>
          <DialogDescription>
            Create a new compliance training course for your organizations.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Course Details</h3>
                <div className="h-px bg-border" />
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" /> Course Title
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Data Privacy Compliance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Course Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Comprehensive training on GDPR, CCPA and other privacy regulations..."
                        className="min-h-24 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed description of what the course covers.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="2 hours" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="privacy, compliance, GDPR" {...field} />
                      </FormControl>
                      <FormDescription>
                        Comma separated keywords
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Course Content</h3>
                <div className="h-px bg-border" />
              </div>

              <FormField
                control={form.control}
                name="objectives"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Learning Objectives</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="1. Understand core privacy principles 2. Learn about compliance requirements"
                        className="min-h-24 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List the key learning objectives of this course.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Input placeholder="All employees, HR team, IT department" {...field} />
                    </FormControl>
                    <FormDescription>
                      Who should take this course?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel className="flex items-center gap-2">
                  <Upload className="h-4 w-4" /> Course Materials
                </FormLabel>
                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="course-file" className="cursor-pointer flex items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <div className="text-center flex flex-col items-center space-y-2">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {files.length > 0 ? files[0].name : "Click to upload course material"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF or PowerPoint (max 5MB)
                        </p>
                      </div>
                    </div>
                    <Input
                      id="course-file"
                      type="file"
                      className="hidden"
                      accept=".pdf,.ppt,.pptx"
                      onChange={handleFileChange}
                    />
                  </label>
                  {fileError && (
                    <p className="text-sm font-medium text-destructive">
                      {fileError}
                    </p>
                  )}
                  {files.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      File size: {(files[0].size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                </div>
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
                Create Course
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourseForm;
