
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

interface User {
  id: string;
  name: string;
  email: string;
  department?: string;
  coursesCompleted: number;
  totalCourses: number;
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
    toast({
      title: "Report Opened",
      description: `Viewing report for ${userName}`,
      duration: 3000,
    });
    console.log(`Viewing report for user ID: ${userId}`);
    navigate(`/admin/reports/user/${userId}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.h3 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-lg font-medium bg-gradient-to-r from-pink-300 to-purple-400 dark:from-pink-400 dark:to-purple-500 bg-clip-text text-transparent"
        >
          {title}
        </motion.h3>
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative w-full sm:w-64"
        >
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-8 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-300 dark:focus:ring-purple-400 transition-all rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="border rounded-xl overflow-hidden bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-pink-200 dark:border-purple-800/30 shadow-lg shadow-pink-200/10 dark:shadow-purple-900/10"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-pink-50/70 dark:bg-purple-900/20 hover:bg-pink-100/70 dark:hover:bg-purple-900/30">
                <TableHead className="font-medium text-gray-700 dark:text-gray-200">Name</TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-200">Email</TableHead>
                <TableHead className="hidden md:table-cell font-medium text-gray-700 dark:text-gray-200">Department</TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-200">Progress</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
                    className="hover:bg-pink-50/50 dark:hover:bg-purple-900/10 transition-colors"
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.department || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <motion.div 
                          whileHover={{ scale: 1.2 }}
                          className="flex-shrink-0 h-2 w-2 rounded-full mt-0.5 mr-1.5"
                        >
                          <div className={`h-2 w-2 rounded-full ${getStatusColor(user.coursesCompleted, user.totalCourses)}`}></div>
                        </motion.div>
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
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-pink-100/50 dark:hover:bg-purple-800/30 rounded-full">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="animate-scale-in bg-white/80 dark:bg-gray-800/90 backdrop-blur-md border-pink-200 dark:border-purple-800/30">
                          <DropdownMenuItem 
                            className="cursor-pointer hover:bg-pink-50 dark:hover:bg-purple-900/20"
                            onClick={() => handleViewReport(user.id, user.name)}
                          >
                            <FileText className="mr-2 h-4 w-4 text-pink-500 dark:text-purple-400" />
                            <span>View Report</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <Search className="h-8 w-8 mb-2 opacity-40" />
                      No users found.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UsersList;
