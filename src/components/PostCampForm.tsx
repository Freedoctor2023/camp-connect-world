
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const PostCampForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    doctor_name: "",
    contact: "",
    sponsorship_goal: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Replace with Supabase integration
    console.log("Camp data to submit:", formData);
    
    toast.success("Medical camp posted successfully!");
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      doctor_name: "",
      contact: "",
      sponsorship_goal: ""
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Post a New Medical Camp</CardTitle>
          <CardDescription>
            Create a new medical camp event and invite sponsors to support it
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Camp Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Free Eye Checkup Camp"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor_name">Doctor Name *</Label>
                <Input
                  id="doctor_name"
                  name="doctor_name"
                  value={formData.doctor_name}
                  onChange={handleChange}
                  placeholder="Dr. John Smith"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the medical services that will be provided..."
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Community Center, 123 Main St"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Email *</Label>
                <Input
                  id="contact"
                  name="contact"
                  type="email"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="doctor@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sponsorship_goal">Sponsorship Goal ($)</Label>
                <Input
                  id="sponsorship_goal"
                  name="sponsorship_goal"
                  type="number"
                  value={formData.sponsorship_goal}
                  onChange={handleChange}
                  placeholder="5000"
                  min="0"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Post Medical Camp
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostCampForm;
