'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import toast, { Toaster } from 'react-hot-toast';
import { Trash2, Loader2 } from 'lucide-react';
import { getAllUsersWithPagination, toggleUserBlockStatus } from '@/lib/db/user';
import ReusableTable from '../shared/reusableTable';

type User = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  dob: string | null;
  gender: string | null;
  phone: string | null;
};

type UsersData = {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalUsers: number;
  users: User[];
};

type UsersTableProps = {
  initialData: UsersData;
};

export default function UsersTable({ initialData ,role='user'}: UsersTableProps|any) {
  const [userData, setUserData] = useState<any>(initialData);
  const [currentPage, setCurrentPage] = useState<any>(initialData.currentPage);
  const [isLoading, setIsLoading] = useState(false);
console.log(userData)

const fetchUsers = async () => {


  setIsLoading(true);
  try {
    const response = await getAllUsersWithPagination(currentPage, 5, role);

    if (response) {
      setUserData(response);
    } else {
      throw new Error('Failed to fetch users');
    }
  } catch (error) {
    toast.error((error as Error).message || 'Failed to fetch users');
  } finally {
    setIsLoading(false);
  }
};
  useEffect(() => {


    fetchUsers();
  }, [currentPage, userData.pageSize]);

  const handleBlockUser = async (userId: string, isBlocked: boolean) => {
    toast.loading(isBlocked ? 'Unblocking user...' : 'Blocking user...', { id: 'block-toast' });

    try {
      const response = await toggleUserBlockStatus(userId, !isBlocked);
      if (!response?.success) throw new Error('Operation failed');


      toast.success(isBlocked ? 'User unblocked successfully' : 'User blocked successfully', { id: 'block-toast' });

      // Refresh user data after status update
      const updatedUsers = userData.users.map((user:any) =>
        user.id === userId ? { ...user, isBlocked: !isBlocked } : user
      );
      setUserData({ ...userData, users: updatedUsers });

    } catch (error) {

      toast.error((error as Error).message || 'Failed to update user status', { id: 'block-toast' });
    }
  };




  const goToNextPage = () => {
    if (currentPage < userData.totalPages) {
      setCurrentPage((prev :any)=> prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev:any) => prev - 1);
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-6">


      <div className="flex justify-between items-center">

      <ReusableTable
  headers={["Name", "Email", "Role"]}
  rows={[
    ["John Doe", "john@example.com", <Button>hi</Button>],
    ["Jane Smith", "jane@example.com", "User"]
  ]}
  onClickRow={(id) => console.log(`Clicked row with ID: ${id}`)}
/>
        <h1 className="text-2xl font-bold">Users ({userData.totalUsers})</h1>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading users...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : userData.users.length > 0 ? (
              userData.users.map((user:any) => (
                <TableRow key={user.id}>
                  <TableCell className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
                      <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name || 'Anonymous'}</span>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                      <Button
  variant={user.isBlocked ? "outline" : "destructive"}
  size="sm"
>
  <Trash2 className="h-4 w-4 mr-1" />
  {user.isBlocked ? "Unblock" : "Block"}
</Button>

                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{user?.isBlocked ?"Unblock user":"Block User"}</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to {user?.isBlocked ?"Unblock ":"Block "} this user? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleBlockUser(user.id,user?.isBlocked)}
                          >
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {userData.totalPages > 1 && (
        <div className="flex justify-end">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Page {userData.currentPage} of {userData.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={userData.currentPage === 1 || isLoading}
              onClick={goToPreviousPage}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={userData.currentPage === userData.totalPages || isLoading}
              onClick={goToNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}