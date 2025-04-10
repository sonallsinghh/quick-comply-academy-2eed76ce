
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  department?: string;
  coursesCompleted: number;
  totalCourses: number;
  lastActivity?: string; // Make this optional since we're removing it from display
}

interface UsersListProps {
  users: User[];
  title: string;
}

const UsersList = ({ users: initialUsers, title }: UsersListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users] = useState<User[]>(initialUsers);
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (completed: number, total: number) => {
    const ratio = completed / total;
    if (ratio === 1) return "bg-green-500";
    if (ratio >= 0.7) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleViewReport = (userId: string, userName: string) => {
    // In a real app, this would navigate to a detailed report page
    // For now, we'll just show a toast and log to console
    toast({
      title: "Report Opened",
      description: `Viewing report for ${userName}`,
      duration: 3000,
    });
    console.log(`Viewing report for user ID: ${userId}`);
    // You could navigate to a report page like this:
    // navigate(`/admin/reports/user/${userId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-8 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-complybrand-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md overflow-hidden bg-card/80 backdrop-blur-sm border-border/50">
        <div className="overflow-x-auto animate-fade-in">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/70">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow 
                    key={user.id} 
                    className="hover:bg-muted/20 transition-colors animate-fade-in"
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.department || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0 h-2 w-2 rounded-full mt-0.5 mr-1.5">
                          <div className={`h-2 w-2 rounded-full ${getStatusColor(user.coursesCompleted, user.totalCourses)}`}></div>
                        </div>
                        <span>
                          {user.coursesCompleted}/{user.totalCourses}
                        </span>
                        {user.coursesCompleted === user.totalCourses && (
                          <Badge variant="outline" className="ml-2 text-green-700 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                            Completed
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/50">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="animate-scale-in">
                          <DropdownMenuItem 
                            className="cursor-pointer hover:bg-muted/80"
                            onClick={() => handleViewReport(user.id, user.name)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            <span>View Report</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
