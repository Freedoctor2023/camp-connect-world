import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Clock, MapPin, User, Heart, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Mock data - replace with actual data fetching
const mockCamps = [
  {
    id: 1,
    title: "Free Eye Checkup Camp",
    description: "Comprehensive eye examination including vision testing, glaucoma screening, and basic eye health assessment. Free consultation and medicines for common eye problems.",
    date: "2025-01-20",
    time: "09:00",
    location: "Community Health Center, Shivaji Nagar, Pune",
    doctorName: "Dr. Priya Sharma",
    contactEmail: "dr.priya@freedoctor.world",
    contactPhone: "+91 98765 43210",
    campType: "free",
    requiresSponsorship: true,
    sponsorshipGoal: 50000,
    currentSponsorship: 32000,
    feeAmount: 0,
    status: "active"
  },
  {
    id: 2,
    title: "Diabetes Management Workshop",
    description: "Educational workshop on diabetes management, blood sugar monitoring, diet planning, and medication guidance. Includes free blood sugar testing.",
    date: "2025-01-25",
    time: "14:00",
    location: "Pune Medical Center, FC Road",
    doctorName: "Dr. Rajesh Kumar",
    contactEmail: "dr.rajesh@freedoctor.world",
    contactPhone: "+91 87654 32109",
    campType: "paid",
    requiresSponsorship: false,
    sponsorshipGoal: 0,
    currentSponsorship: 0,
    feeAmount: 500,
    status: "active"
  }
];

const CampDetailsPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const camp = mockCamps.find(c => c.id === parseInt(id || "0"));

  const [sponsorshipData, setSponsorshipData] = useState({
    name: "",
    amount: "",
  });

  if (!camp) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold text-muted-foreground">Camp Not Found</h2>
            <p className="text-muted-foreground mt-2">The requested medical camp could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressPercentage = camp.requiresSponsorship && camp.sponsorshipGoal > 0
    ? Math.min((camp.currentSponsorship / camp.sponsorshipGoal) * 100, 100)
    : 0;

  const handleSponsorshipChange = (field: string, value: string) => {
    setSponsorshipData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSponsor = async () => {
    if (!sponsorshipData.name || !sponsorshipData.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Sponsorship data:", {
        campId: camp.id,
        ...sponsorshipData,
      });

      toast({
        title: "Thank you for your sponsorship!",
        description: `₹${sponsorshipData.amount} has been contributed to ${camp.title}`,
      });

      setSponsorshipData({ name: "", amount: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process sponsorship. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Camp Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <CardTitle className="text-2xl">{camp.title}</CardTitle>
                <CardDescription className="mt-2">{camp.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant={camp.campType === "free" ? "default" : "secondary"}>
                  {camp.campType === "free" ? "Free Camp" : `₹${camp.feeAmount}`}
                </Badge>
                <Badge variant="outline">{camp.status}</Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Camp Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Camp Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(camp.date).toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              
              {camp.time && (
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{camp.time}</span>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{camp.location}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{camp.doctorName}</span>
              </div>
              
              {camp.contactEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${camp.contactEmail}`} className="text-primary hover:underline">
                    {camp.contactEmail}
                  </a>
                </div>
              )}
              
              {camp.contactPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${camp.contactPhone}`} className="text-primary hover:underline">
                    {camp.contactPhone}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sponsorship Section */}
          {camp.requiresSponsorship && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Support This Camp
                </CardTitle>
                <CardDescription>
                  Help us reach our sponsorship goal to make this camp possible
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>₹{camp.currentSponsorship.toLocaleString()} of ₹{camp.sponsorshipGoal.toLocaleString()}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {progressPercentage.toFixed(1)}% funded
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sponsorName">Your Name</Label>
                    <Input
                      id="sponsorName"
                      value={sponsorshipData.name}
                      onChange={(e) => handleSponsorshipChange("name", e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sponsorAmount">Sponsorship Amount (₹)</Label>
                    <Input
                      id="sponsorAmount"
                      type="number"
                      value={sponsorshipData.amount}
                      onChange={(e) => handleSponsorshipChange("amount", e.target.value)}
                      placeholder="Enter amount"
                      min="1"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSponsor} 
                    className="w-full"
                    disabled={!sponsorshipData.name || !sponsorshipData.amount}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Sponsor Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampDetailsPage;