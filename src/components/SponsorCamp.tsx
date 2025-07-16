
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, MapPin, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Mock data - will be replaced with Supabase data
const mockCamps = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    title: "Free Eye Checkup Camp",
    description: "Comprehensive eye examination and free glasses distribution",
    date: "2024-02-15",
    location: "Community Center, Downtown",
    doctor_name: "Dr. Sarah Johnson",
    sponsorship_goal: 5000,
    current_sponsorship: 3200
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sponsorshipData, setSponsorshipData] = useState<{[key: string]: {name: string, amount: string}}>({});

  const handleSponsorshipChange = (campId: string, field: string, value: string) => {
    setSponsorshipData(prev => ({
      ...prev,
      [campId]: {
        ...prev[campId],
        [field]: value
      }
    }));
  };

  const handleSponsor = async (campId: string) => {
    if (!user) {
      toast.error("Please login to sponsor a camp");
      navigate("/auth");
      return;
    }

    const sponsorship = sponsorshipData[campId];
    if (!sponsorship?.name || !sponsorship?.amount) {
      toast.error("Please fill in both sponsor name and amount");
      return;
    }

    try {
      console.log("Creating Razorpay order...", { campId, sponsorship });
      
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: parseFloat(sponsorship.amount),
          camp_id: campId,
          sponsor_name: sponsorship.name,
          currency: 'INR',
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      console.log("Razorpay order created:", data);

      // Check if Razorpay script is already loaded
      if (!(window as any).Razorpay) {
        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          console.log("Razorpay script loaded, opening gateway...");
          openRazorpayGateway(data, sponsorship, campId);
        };
        script.onerror = () => {
          console.error("Failed to load Razorpay script");
          toast.error("Failed to load payment gateway. Please try again.");
        };
        document.head.appendChild(script);
      } else {
        console.log("Razorpay script already loaded, opening gateway...");
        openRazorpayGateway(data, sponsorship, campId);
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error("Failed to initiate payment. Please try again.");
    }
  };

  const openRazorpayGateway = (data: any, sponsorship: any, campId: string) => {
    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      order_id: data.order_id,
      name: 'Medical Camp Sponsorship',
      description: `Sponsoring ${mockCamps.find(c => c.id === campId)?.title}`,
      handler: async (response: any) => {
        try {
          console.log("Payment successful, verifying...", response);
          
          const { error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
            body: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
          });

          if (verifyError) {
            console.error('Payment verification error:', verifyError);
            throw verifyError;
          }

          toast.success(`Thank you for your sponsorship! ₹${sponsorship.amount} has been contributed to ${mockCamps.find(c => c.id === campId)?.title}`);

          // Reset form
          setSponsorshipData(prev => ({
            ...prev,
            [campId]: { name: '', amount: '' }
          }));
        } catch (error) {
          console.error('Payment verification failed:', error);
          toast.error("Payment verification failed. Please contact support.");
        }
      },
      modal: {
        ondismiss: () => {
          console.log("Payment gateway closed by user");
          toast.info("Payment was cancelled");
        }
      },
      prefill: {
        name: sponsorship.name,
      },
      theme: {
        color: '#3399cc'
      }
    };

    console.log("Opening Razorpay gateway with options:", options);
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
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
                      ₹{camp.current_sponsorship} / ₹{camp.sponsorship_goal}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    ₹{remaining > 0 ? remaining : 0} still needed
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
                      <Label htmlFor={`sponsor-amount-${camp.id}`}>Amount (₹)</Label>
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
