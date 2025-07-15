
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, MapPin, User } from "lucide-react";
import { toast } from "sonner";

// Mock data - will be replaced with Supabase data
const mockCamps = [
  {
    id: 1,
    title: "Free Eye Checkup Camp",
    description: "Comprehensive eye examination and free glasses distribution",
    date: "2024-02-15",
    location: "Community Center, Downtown",
    doctor_name: "Dr. Sarah Johnson",
    sponsorship_goal: 5000,
    current_sponsorship: 3200
  },
  {
    id: 2,
    title: "Diabetes Screening Camp",
    description: "Free blood sugar testing and diabetes consultation",
    date: "2024-02-20",
    location: "City Hall, Main Street",
    doctor_name: "Dr. Michael Chen",
    sponsorship_goal: 3000,
    current_sponsorship: 1800
  }
];

const SponsorCamp = () => {
  const [sponsorshipData, setSponsorshipData] = useState<{[key: number]: {name: string, amount: string}}>({});

  const handleSponsorshipChange = (campId: number, field: string, value: string) => {
    setSponsorshipData(prev => ({
      ...prev,
      [campId]: {
        ...prev[campId],
        [field]: value
      }
    }));
  };

  const handleSponsor = async (campId: number) => {
    const sponsorship = sponsorshipData[campId];
    if (!sponsorship?.name || !sponsorship?.amount) {
      toast.error("Please fill in both sponsor name and amount");
      return;
    }

    // TODO: Replace with Supabase integration
    console.log("Sponsorship data:", { campId, ...sponsorship });
    
    toast.success(`Thank you for sponsoring $${sponsorship.amount}!`);
    
    // Reset form for this camp
    setSponsorshipData(prev => ({
      ...prev,
      [campId]: { name: "", amount: "" }
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sponsor a Medical Camp</h2>
        <p className="text-muted-foreground">
          Help fund medical camps to provide free healthcare to communities in need
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {mockCamps.map((camp) => {
          const progressPercentage = (camp.current_sponsorship / camp.sponsorship_goal) * 100;
          const isFullySponsored = progressPercentage >= 100;
          const remaining = camp.sponsorship_goal - camp.current_sponsorship;

          return (
            <Card key={camp.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{camp.title}</CardTitle>
                  {isFullySponsored && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Heart className="w-3 h-3 mr-1" />
                      Fully Sponsored
                    </Badge>
                  )}
                </div>
                <CardDescription>{camp.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(camp.date).toLocaleDateString()}
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
                    <span>Funding Progress</span>
                    <span className="font-medium">
                      ${camp.current_sponsorship} / ${camp.sponsorship_goal}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    ${remaining > 0 ? remaining : 0} still needed
                  </p>
                </div>

                {!isFullySponsored && (
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-medium">Sponsor This Camp</h4>
                    <div className="space-y-2">
                      <Label htmlFor={`sponsor-name-${camp.id}`}>Your Name/Organization</Label>
                      <Input
                        id={`sponsor-name-${camp.id}`}
                        value={sponsorshipData[camp.id]?.name || ""}
                        onChange={(e) => handleSponsorshipChange(camp.id, "name", e.target.value)}
                        placeholder="Enter your name or organization"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`sponsor-amount-${camp.id}`}>Amount ($)</Label>
                      <Input
                        id={`sponsor-amount-${camp.id}`}
                        type="number"
                        value={sponsorshipData[camp.id]?.amount || ""}
                        onChange={(e) => handleSponsorshipChange(camp.id, "amount", e.target.value)}
                        placeholder="Enter amount"
                        min="1"
                        max={remaining}
                      />
                    </div>
                    <Button 
                      onClick={() => handleSponsor(camp.id)}
                      className="w-full"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Sponsor Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SponsorCamp;
