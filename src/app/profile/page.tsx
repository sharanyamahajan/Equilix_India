'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { JournalingStreak } from '@/components/app/journaling-streak';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type UserData = {
  firstName: string;
  lastName: string;
  dob: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    if (!loggedInUserEmail) {
      router.push('/login');
      return;
    }

    const storedUser = localStorage.getItem(loggedInUserEmail);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUserEmail');
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    router.push('/login');
  };
  
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
  }

  if (!isClient || !user) {
    return (
      <div className="flex-grow container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-md mx-auto space-y-8">
            <div className="flex items-center gap-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
            <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 pt-28 pb-12">
      <div className="max-w-md mx-auto space-y-8">
        <section className="flex flex-col items-center text-center space-y-4">
          <Avatar className="w-28 h-28 text-4xl">
            <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
            <p className="text-muted-foreground">
                Born on {format(new Date(user.dob), 'MMMM d, yyyy')}
            </p>
          </div>
        </section>

        <section>
          <JournalingStreak />
        </section>
        
        <Card>
            <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleLogout} variant="outline" className="w-full">
                    Log Out
                </Button>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
