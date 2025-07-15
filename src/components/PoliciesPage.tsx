import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const PoliciesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4">Legal Policies</h1>
        <p className="text-muted-foreground">
          Please read our policies carefully to understand your rights and responsibilities
        </p>
      </div>

      <Tabs defaultValue="terms" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="refund">Refund Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="terms" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Terms and Conditions</CardTitle>
              <CardDescription>Last updated: January 15, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full pr-4">
                <div className="space-y-4 text-sm">
                  <section>
                    <h3 className="font-semibold mb-2">1. Acceptance of Terms</h3>
                    <p>By accessing and using Freedoctor.World, you accept and agree to be bound by the terms and provision of this agreement.</p>
                  </section>
                  
                  <section>
                    <h3 className="font-semibold mb-2">2. Medical Camp Services</h3>
                    <p>Freedoctor.World provides a platform to connect medical professionals with communities through organized health camps. We facilitate the posting, sponsorship, and management of medical camps.</p>
                  </section>
                  
                  <section>
                    <h3 className="font-semibold mb-2">3. User Responsibilities</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Provide accurate and truthful information when posting medical camps</li>
                      <li>Ensure proper medical qualifications and certifications</li>
                      <li>Maintain professional conduct during all medical camp activities</li>
                      <li>Comply with local healthcare regulations and laws</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="font-semibold mb-2">4. Sponsorship Terms</h3>
                    <p>All sponsorships are subject to verification. Sponsors acknowledge that funds contributed are used for the stated medical camp purposes.</p>
                  </section>
                  
                  <section>
                    <h3 className="font-semibold mb-2">5. Limitation of Liability</h3>
                    <p>Freedoctor.World acts as a platform facilitator and is not responsible for the quality or outcomes of medical services provided during camps.</p>
                  </section>
                  
                  <section>
                    <h3 className="font-semibold mb-2">6. Contact Information</h3>
                    <p>For questions about these Terms and Conditions, please contact us at info@freedoctor.world</p>
                  </section>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
              <CardDescription>Last updated: January 15, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full pr-4">
                <div className="space-y-4 text-sm">
                  <section>
                    <h3 className="font-semibold mb-2">Information We Collect</h3>
                    <p>We collect information you provide directly to us, such as when you create an account, post a medical camp, or make a sponsorship.</p>
                  </section>
                  
                  <section>
                    <h3 className="font-semibold mb-2">How We Use Your Information</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>To provide and maintain our services</li>
                      <li>To facilitate medical camp organization and sponsorship</li>
                      <li>To communicate with you about your account and our services</li>
                      <li>To improve our platform and user experience</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="font-semibold mb-2">Information Sharing</h3>
                    <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
                  </section>
                  
                  <section>
                    <h3 className="font-semibold mb-2">Data Security</h3>
                    <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                  </section>
                  
                  <section>
                    <h3 className="font-semibold mb-2">Your Rights</h3>
                    <p>You have the right to access, update, or delete your personal information. Contact us at info@freedoctor.world for data-related requests.</p>
                  </section>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refund" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Refund Policy</CardTitle>
              <CardDescription>Last updated: January 15, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full pr-4">
                <div className="space-y-4 text-sm">
                  <section>
                    <h3 className="font-semibold mb-2">Sponsorship Refunds</h3>
                    <p>Sponsorship contributions may be refunded under the following circumstances:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Medical camp is cancelled by the organizer</li>
                      <li>Fraudulent activity is detected</li>
                      <li>Refund requested within 24 hours of contribution</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="font-semibold mb-2">Refund Process</h3>
                    <p>Refund requests must be submitted to info@freedoctor.world with proper justification. Refunds will be processed within 7-10 business days after approval.</p>
                  </section>
                  
                  <section>
                    <h3 className="font-semibold mb-2">Non-Refundable Items</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Sponsorships for completed medical camps</li>
                      <li>Administrative fees (if applicable)</li>
                      <li>Donations made beyond the 24-hour window without valid cause</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="font-semibold mb-2">Dispute Resolution</h3>
                    <p>If you disagree with a refund decision, you may appeal by contacting our support team at info@freedoctor.world with additional documentation.</p>
                  </section>
                  
                  <section>
                    <h3 className="font-semibold mb-2">Contact for Refunds</h3>
                    <p>For all refund-related inquiries, please contact us at info@freedoctor.world with your transaction details and reason for the refund request.</p>
                  </section>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PoliciesPage;