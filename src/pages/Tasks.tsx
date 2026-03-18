import { Card, CardContent } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

const Tasks = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="p-4 rounded-full bg-primary/10 mb-4 text-primary">
        <Briefcase className="w-12 h-12" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Tasks Area Under Construction</h2>
      <p className="text-muted-foreground w-full max-w-md">
        This section is currently being updated to integrate the new Administration CPS categories. Please check back later.
      </p>
    </div>
  );
};

export default Tasks;
