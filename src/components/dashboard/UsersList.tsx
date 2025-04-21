import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  enrollments: {
    course: {
      id: string;
      title: string;
    };
    completed: boolean;
  }[];
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
                    {user.enrollments.length > 0 ? (
                      user.enrollments.map((enrollment) => (
                        <Badge key={enrollment.course.id} variant="outline">
                          {enrollment.course.title}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No courses</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {user.enrollments.length > 0 ? (
                    user.enrollments.every(e => e.completed) ? (
                      <Badge variant="success">Completed</Badge>
                    ) : (
                      <Badge variant="warning">In Progress</Badge>
                    )
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
