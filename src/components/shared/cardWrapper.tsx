
'use client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface CardWrapperProps {
  title: React.ReactNode;
  description: string;
  children: React.ReactNode;
}

export function CardWrapper({ title, description, children }: CardWrapperProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
