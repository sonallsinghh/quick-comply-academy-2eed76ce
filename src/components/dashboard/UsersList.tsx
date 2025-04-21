import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  coursesCompleted: number;
  totalCourses: number;
  lastActivity: string;
}

interface UsersListProps {
  users: User[];
  title?: string;
}

const UsersList = ({ users, title = "Users" }: UsersListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>View and manage organization users</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">
                      {user.coursesCompleted}/{user.totalCourses} Courses
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  {user.coursesCompleted === user.totalCourses ? (
                    <Badge variant="default">Completed</Badge>
                  ) : user.coursesCompleted > 0 ? (
                    <Badge variant="outline">In Progress</Badge>
                  ) : (
                    <Badge variant="secondary">Not Started</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UsersList;
