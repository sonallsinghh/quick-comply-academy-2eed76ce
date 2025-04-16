import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  enrollments: {
    courseId: string;
    completed: boolean;
  }[];
}

interface UsersListProps {
  users?: User[];
  title?: string;
}

export default function UsersList({ users = [], title = "Users" }: UsersListProps) {
  if (!users || users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>No users found</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>View and manage user details</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.enrollments?.map((enrollment) => (
                      <Badge key={enrollment.courseId} variant="outline">
                        Course {enrollment.courseId}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {user.enrollments?.some(e => !e.completed) ? (
                    <Badge variant="warning">In Progress</Badge>
                  ) : user.enrollments?.length > 0 ? (
                    <Badge variant="success">Completed</Badge>
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
}
