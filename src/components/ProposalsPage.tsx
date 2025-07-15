
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Building, Calendar, MapPin, Mail, FileText } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const ProposalsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [businessRequests, setBusinessRequests] = useState<any[]>([]);
  const [proposals, setProposals] = useState<{[key: string]: {name: string, proposal: string}}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinessRequests();
  }, []);

  const fetchBusinessRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('business_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBusinessRequests(data || []);
    } catch (error) {
      console.error('Error fetching business requests:', error);
      toast.error("Failed to load business requests");
    } finally {
      setLoading(false);
    }
  };

  const handleProposalChange = (requestId: string, field: string, value: string) => {
    setProposals(prev => ({
      ...prev,
      [requestId]: {
        ...prev[requestId],
        [field]: value
      }
    }));
  };

  const handleSubmitProposal = async (requestId: string) => {
    if (!user) {
      toast.error("Please login to submit a proposal");
      navigate("/auth");
      return;
    }

    const proposal = proposals[requestId];
    if (!proposal?.name || !proposal?.proposal) {
      toast.error("Please fill in both your name and proposal details");
      return;
    }

    try {
      const { error } = await supabase
        .from('proposals')
        .insert({
          business_request_id: requestId,
          title: `Proposal for ${businessRequests.find(r => r.id === requestId)?.business_name}`,
          description: proposal.proposal,
          created_by: user.id,
        });

      if (error) throw error;

      toast.success("Your proposal has been submitted successfully!");
      
      // Reset form for this request
      setProposals(prev => ({
        ...prev,
        [requestId]: { name: "", proposal: "" }
      }));
    } catch (error) {
      console.error('Error submitting proposal:', error);
      toast.error("Failed to submit proposal. Please try again.");
    }
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
        {loading ? (
          <div className="text-center py-8">Loading business requests...</div>
        ) : businessRequests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No business requests available</div>
        ) : (
          businessRequests.map((request) => (
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
                    Preferred Date: {request.preferred_date ? new Date(request.preferred_date).toLocaleDateString() : 'Not specified'}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 mr-2" />
                    {request.contact_email}
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
          ))
        )}
      </div>
    </div>
  );
};

export default ProposalsPage;
