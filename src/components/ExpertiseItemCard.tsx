import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ExpertiseItemCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ExpertiseItemCard: React.FC<ExpertiseItemCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <Card className="bg-brand-light dark:bg-brand-dark shadow-lg border-brand-secondary p-6 text-left">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="flex items-center gap-3 text-xl text-brand-primary">
          <Icon className="h-6 w-6" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-brand-dark/80 dark:text-brand-light/80 p-0">
        {description}
      </CardContent>
    </Card>
  );
};

export default ExpertiseItemCard;