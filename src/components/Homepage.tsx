
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, User, Heart } from "lucide-react";

// Mock data - will be replaced with Supabase data
const mockCamps = [
  {
    id: 1,
    title: "Free Eye Checkup Camp",
    description: "Comprehensive eye examination and free glasses distribution",
    date: "2024-02-15",
    time: "09:00",
    location: "Community Center, Downtown",
    doctor_name: "Dr. Sarah Johnson",
    contact: "sarah@healthcare.com",
    sponsorship_goal: 5000,
    current_sponsorship: 3200
  },
  {
    id: 2,
    title: "Diabetes Screening Camp",
    description: "Free blood sugar testing and diabetes consultation",
    date: "2024-02-20",
    time: "10:00",
    location: "City Hall, Main Street",
    doctor_name: "Dr. Michael Chen",
    contact: "mchen@medcenter.com",
    sponsorship_goal: 3000,
    current_sponsorship: 1800
  },
  {
    id: 3,
    title: "Children's Health Camp",
    description: "Vaccination and general health checkup for children",
    date: "2024-02-25",
    time: "08:30",
    location: "School Auditorium, Oak Avenue",
    doctor_name: "Dr. Emily Rodriguez",
    contact: "emily.r@pediatrics.org",
    sponsorship_goal: 4000,
    current_sponsorship: 4000
  }
];

const Homepage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Upcoming Medical Camps</h2>
        <p className="text-muted-foreground">
          Join us in providing free healthcare to those in need
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockCamps.map((camp) => {
          const progressPercentage = (camp.current_sponsorship / camp.sponsorship_goal) * 100;
          const isFullySponsored = progressPercentage >= 100;

          return (
            <Card key={camp.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{camp.title}</CardTitle>
                  {isFullySponsored && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Heart className="w-3 h-3 mr-1" />
                      Sponsored
                    </Badge>
                  )}
                </div>
                <CardDescription>{camp.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(camp.date).toLocaleDateString()} at {camp.time}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {camp.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="w-4 h-4 mr-2" />
                    {camp.doctor_name}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sponsorship Progress</span>
                    <span className="font-medium">
                      ${camp.current_sponsorship} / ${camp.sponsorship_goal}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {Math.round(progressPercentage)}% funded
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Homepage;
