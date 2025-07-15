
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data - will be replaced with Supabase data
const mockCamps = [
  {
    id: 1,
    title: "Free Eye Checkup Camp",
    description: "Comprehensive eye examination and free glasses distribution",
    date: "2025-01-20",
    time: "09:00",
    location: "Community Center, Shivajinagar, Pune",
    doctor_name: "Dr. Priya Sharma",
    contact: "dr.priya@freedoctor.world",
    campType: "free",
    requiresSponsorship: true,
    sponsorship_goal: 50000,
    current_sponsorship: 32000,
    feeAmount: 0
  },
  {
    id: 2,
    title: "Diabetes Management Workshop",
    description: "Educational workshop on diabetes management, blood sugar monitoring, diet planning, and medication guidance.",
    date: "2025-01-25",
    time: "14:00",
    location: "Pune Medical Center, FC Road",
    doctor_name: "Dr. Rajesh Kumar",
    contact: "dr.rajesh@freedoctor.world",
    campType: "paid",
    requiresSponsorship: false,
    sponsorship_goal: 0,
    current_sponsorship: 0,
    feeAmount: 500
  },
  {
    id: 3,
    title: "Heart Health Screening",
    description: "Complete cardiovascular health assessment including ECG, blood pressure monitoring, and cholesterol testing.",
    date: "2025-02-01",
    time: "10:00",
    location: "City Hospital, Koregaon Park",
    doctor_name: "Dr. Anil Patil",
    contact: "dr.anil@freedoctor.world",
    campType: "free",
    requiresSponsorship: true,
    sponsorship_goal: 100000,
    current_sponsorship: 100000,
    feeAmount: 0
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
          const progressPercentage = camp.requiresSponsorship && camp.sponsorship_goal > 0
            ? (camp.current_sponsorship / camp.sponsorship_goal) * 100
            : 0;
          const isFullySponsored = camp.requiresSponsorship && progressPercentage >= 100;

          return (
            <Card key={camp.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{camp.title}</CardTitle>
                    <CardDescription className="mt-2">{camp.description}</CardDescription>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge variant={camp.campType === "free" ? "default" : "secondary"}>
                      {camp.campType === "free" ? "Free" : `₹${camp.feeAmount}`}
                    </Badge>
                    {isFullySponsored && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Heart className="w-3 h-3 mr-1" />
                        Sponsored
                      </Badge>
                    )}
                  </div>
                </div>
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

                {camp.requiresSponsorship && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sponsorship Progress</span>
                      <span className="font-medium">
                        ₹{camp.current_sponsorship.toLocaleString()} / ₹{camp.sponsorship_goal.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {Math.round(progressPercentage)}% funded
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <Link to={`/camp/${camp.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  {camp.requiresSponsorship && (
                    <Link to={`/camp/${camp.id}`}>
                      <Button size="sm">
                        <Heart className="h-4 w-4 mr-2" />
                        Sponsor
                      </Button>
                    </Link>
                  )}
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
