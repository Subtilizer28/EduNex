import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Rocket className="h-16 w-16 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-3xl">Coming Soon</CardTitle>
          <CardDescription className="text-lg mt-2">
            This feature is currently under development
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            We're working hard to bring you this exciting new feature. 
            Stay tuned for updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
