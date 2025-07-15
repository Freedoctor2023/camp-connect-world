
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Building, Calendar, MapPin, Mail, FileText } from "lucide-react";
import { toast } from "sonner";

// Mock data - will be replaced with Supabase data
const mockBusinessRequests = [
  {
    id: 1,
    business_name: "TechCorp Solutions",
    camp_type: "General Health Checkup",
    preferred_date: "2024-03-01",
    address: "123 Business Park, Tech District",
    contact: "hr@techcorp.com",
    notes: "Looking for comprehensive health screening for 200+ employees",
    created_at: "2024-01-15"
  },
  {
    id: 2,
    business_name: "Green Manufacturing Ltd",
    camp_type: "Eye Care Camp",
    preferred_date: "2024-03-15",
    address: "456 Industrial Avenue, Manufacturing Zone",
    contact: "wellness@greenmanuf.com",
    notes: "Many employees work with screens and machinery. Focus on eye strain and safety.",
    created_at: "2024-01-18"
  },
  {
    id: 3,
    business_name: "Downtown Retail Group",
    camp_type: "Diabetes Screening",
    preferred_date: "2024-02-28",
    address: "789 Shopping Center, Downtown",
    contact: "manager@retailgroup.com",
    notes: "Staff wellness initiative. Flexible with timing.",
    created_at: "2024-01-20"
  }
];

const ProposalsPage = () => {
  const [proposals, setProposals] = useState<{[key: number]: {name: string, proposal: string}}>({});

  const handleProposalChange = (requestId: number, field: string, value: string) => {
    setProposals(prev => ({
      ...prev,
      [requestId]: {
        ...prev[requestId],
        [field]: value
      }
    }));
  };

  const handleSubmitProposal = async (requestId: number) => {
    const proposal = proposals[requestId];
    if (!proposal?.name || !proposal?.proposal) {
      toast.error("Please fill in both your name and proposal details");
      return;
    }

    // TODO: Replace with Supabase integration
    console.log("Proposal data:", { requestId, ...proposal });
    
    toast.success("Your proposal has been submitted successfully!");
    
    // Reset form for this request
    setProposals(prev => ({
      ...prev,
      [requestId]: { name: "", proposal: "" }
    }));
  };

  const getCampTypeColor = (type: string) => {
    const colors: {[key: string]: string} = {
      "General Health Checkup": "bg-blue-100 text-blue-800",
      "Eye Care Camp": "bg-purple-100 text-purple-800",
      "Diabetes Screening": "bg-orange-100 text-orange-800",
      "Dental Care": "bg-green-100 text-green-800",
      "Heart Health": "bg-red-100 text-red-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Business Requests</h2>
        <p className="text-muted-foreground">
          Review business requests and submit your proposals to organize medical camps
        </p>
      </div>

      <div className="grid gap-6">
        {mockBusinessRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    {request.business_name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Requested on {new Date(request.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge className={getCampTypeColor(request.camp_type)}>
                  {request.camp_type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    Preferred Date: {new Date(request.preferred_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 mr-2" />
                    {request.contact}
                  </div>
                </div>
                <div className="flex items-start text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{request.address}</span>
                </div>
              </div>

              {request.notes && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Additional Notes:</h4>
                  <p className="text-sm text-muted-foreground">{request.notes}</p>
                </div>
              )}

              <div className="border-t pt-4 space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Submit Your Proposal
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`proposer-name-${request.id}`}>Your Name/Organization</Label>
                    <Input
                      id={`proposer-name-${request.id}`}
                      value={proposals[request.id]?.name || ""}
                      onChange={(e) => handleProposalChange(request.id, "name", e.target.value)}
                      placeholder="Dr. John Smith / Healthcare Org"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`proposal-text-${request.id}`}>Proposal Details</Label>
                  <Textarea
                    id={`proposal-text-${request.id}`}
                    value={proposals[request.id]?.proposal || ""}
                    onChange={(e) => handleProposalChange(request.id, "proposal", e.target.value)}
                    placeholder="Describe your proposed medical camp plan, services to be provided, timeline, requirements, and any other relevant details..."
                    className="min-h-[120px]"
                  />
                </div>
                <Button 
                  onClick={() => handleSubmitProposal(request.id)}
                  className="w-full md:w-auto"
                >
                  Submit Proposal
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProposalsPage;
