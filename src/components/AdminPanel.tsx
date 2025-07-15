
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, Heart, Building, FileText, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";

// Mock data - will be replaced with Supabase data
const mockData = {
  camps: [
    {
      id: 1,
      title: "Free Eye Checkup Camp",
      doctor_name: "Dr. Sarah Johnson",
      date: "2024-02-15",
      location: "Community Center",
      status: "pending"
    },
    {
      id: 2,
      title: "Diabetes Screening Camp",
      doctor_name: "Dr. Michael Chen",
      date: "2024-02-20",
      location: "City Hall",
      status: "approved"
    }
  ],
  sponsorships: [
    {
      id: 1,
      camp_title: "Free Eye Checkup Camp",
      sponsor_name: "Local Business Group",
      amount: 2500,
      date: "2024-01-15"
    },
    {
      id: 2,
      camp_title: "Diabetes Screening Camp",
      sponsor_name: "Healthcare Foundation",
      amount: 1800,
      date: "2024-01-18"
    }
  ],
  businessRequests: [
    {
      id: 1,
      business_name: "TechCorp Solutions",
      camp_type: "General Health",
      status: "pending",
      date: "2024-01-15"
    },
    {
      id: 2,
      business_name: "Green Manufacturing",
      camp_type: "Eye Care",
      status: "approved",
      date: "2024-01-18"
    }
  ]
};

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with Supabase Auth
    if (credentials.email === "admin@freedoctor.world" && credentials.password === "admin123") {
      setIsAuthenticated(true);
      toast.success("Admin login successful!");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleApprove = (type: string, id: number) => {
    // TODO: Replace with Supabase update
    console.log(`Approving ${type} with ID:`, id);
    toast.success(`${type} approved successfully!`);
  };

  const handleReject = (type: string, id: number) => {
    // TODO: Replace with Supabase update
    console.log(`Rejecting ${type} with ID:`, id);
    toast.success(`${type} rejected successfully!`);
  };

  const handleDelete = (type: string, id: number) => {
    // TODO: Replace with Supabase delete
    console.log(`Deleting ${type} with ID:`, id);
    toast.success(`${type} deleted successfully!`);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6" />
              <CardTitle>Admin Login</CardTitle>
            </div>
            <CardDescription>
              Access the admin panel to manage medical camps and requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  placeholder="admin@freedoctor.world"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login to Admin Panel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Panel</h2>
          <p className="text-muted-foreground">
            Manage medical camps, sponsorships, and business requests
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsAuthenticated(false)}
        >
          Logout
        </Button>
      </div>

      <Tabs defaultValue="camps" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="camps" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Medical Camps
          </TabsTrigger>
          <TabsTrigger value="sponsorships" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Sponsorships
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Business Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="camps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical Camps Management</CardTitle>
              <CardDescription>View and manage submitted medical camps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.camps.map((camp) => (
                <div key={camp.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">{camp.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {camp.doctor_name} • {new Date(camp.date).toLocaleDateString()} • {camp.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={camp.status === "approved" ? "default" : "secondary"}>
                      {camp.status}
                    </Badge>
                    {camp.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => handleApprove("Camp", camp.id)}>
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject("Camp", camp.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleDelete("Camp", camp.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sponsorships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sponsorships Overview</CardTitle>
              <CardDescription>Track all sponsorship contributions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.sponsorships.map((sponsorship) => (
                <div key={sponsorship.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">{sponsorship.camp_title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Sponsored by {sponsorship.sponsor_name} • {new Date(sponsorship.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">
                      ${sponsorship.amount}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => handleDelete("Sponsorship", sponsorship.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Requests Management</CardTitle>
              <CardDescription>Review and manage business medical camp requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.businessRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">{request.business_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {request.camp_type} • Requested on {new Date(request.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={request.status === "approved" ? "default" : "secondary"}>
                      {request.status}
                    </Badge>
                    {request.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => handleApprove("Request", request.id)}>
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject("Request", request.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleDelete("Request", request.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
