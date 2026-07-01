import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactSection = () => (
  <section id="contact" className="py-20">
    <div className="container">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
          Get In <span className="text-accent">Touch</span>
        </h2>
        <p className="text-muted-foreground">Have questions? We'd love to hear from you.</p>
      </div>
      <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
        {/* Contact info */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <Mail className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="font-medium text-foreground">Email</p>
              <p className="text-sm text-muted-foreground">support@antiplagiarism.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <Phone className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="font-medium text-foreground">Phone</p>
              <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <MapPin className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="font-medium text-foreground">Address</p>
              <p className="text-sm text-muted-foreground">123 Academic Drive, Innovation City</p>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <form className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea placeholder="How can we help?" rows={4} />
          </div>
          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            Send Message
          </Button>
        </form>
      </div>
    </div>
  </section>
);

export default ContactSection;
