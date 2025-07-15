
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const BusinessRequest = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    business_name: "",
    camp_type: "",
    preferred_date: "",
    address: "",
    contact: "",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to submit a business request");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('business_requests')
        .insert({
          business_name: formData.business_name,
          camp_type: formData.camp_type,
          preferred_date: formData.preferred_date || null,
          address: formData.address,
          contact_email: formData.contact,
          notes: formData.notes || null,
          created_by: user.id,
        });

      if (error) throw error;

      toast.success("Your request has been submitted successfully! We'll contact you soon.");
      
      // Reset form
      setFormData({
        business_name: "",
        camp_type: "",
        preferred_date: "",
        address: "",
        contact: "",
        notes: ""
      });
    } catch (error) {
      console.error('Error submitting business request:', error);
      toast.error("Failed to submit request. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      camp_type: value
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Request a Medical Camp for Your Business</CardTitle>
          <CardDescription>
            Partner with us to provide free healthcare services to your employees and community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business_name">Business/Organization Name *</Label>
              <Input
                id="business_name"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                placeholder="Your Company Name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="camp_type">Type of Medical Camp *</Label>
              <Select value={formData.camp_type} onValueChange={handleSelectChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select camp type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Health Checkup</SelectItem>
                  <SelectItem value="eye">Eye Care Camp</SelectItem>
                  <SelectItem value="diabetes">Diabetes Screening</SelectItem>
                  <SelectItem value="dental">Dental Care</SelectItem>
                  <SelectItem value="cardiology">Heart Health</SelectItem>
                  <SelectItem value="women">Women's Health</SelectItem>
                  <SelectItem value="pediatric">Children's Health</SelectItem>
                  <SelectItem value="mental">Mental Health Awareness</SelectItem>
                  <SelectItem value="vaccination">Vaccination Drive</SelectItem>
                  <SelectItem value="custom">Custom Requirements</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferred_date">Preferred Date</Label>
                <Input
                  id="preferred_date"
                  name="preferred_date"
                  type="date"
                  value={formData.preferred_date}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Email *</Label>
                <Input
                  id="contact"
                  name="contact"
                  type="email"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="contact@yourcompany.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Business Address *</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address where the camp should be conducted"
                className="min-h-[80px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any specific requirements, expected number of participants, or other details..."
                className="min-h-[100px]"
              />
            </div>

            <Button type="submit" className="w-full">
              Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessRequest;
