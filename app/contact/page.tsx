"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successOpen, setSuccessOpen] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      e.email = "Please enter a valid email.";
    if (subject.trim().length < 3) e.subject = "Please enter a subject.";
    if (message.trim().length < 10)
      e.message = "Message must be at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      // Replace this with a real POST to your backend (fetch / axios)
      await new Promise((res) => setTimeout(res, 800)); // demo delay

      // reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setErrors({});
      setSuccessOpen(true);
    } catch (err) {
      // handle submission error (show toast / inline message)
      setErrors({ submit: "Failed to send. Try again later." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="p-4 md:p-6 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Contact Us</h1>
        <p className="text-sm text-muted-foreground mt-1">
          We're here to help — contact the concierge, reservations or support.
          Fill the form or use the details on the right.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form (spans 2 columns on large) */}
        <section className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex flex-col">
                    <span className="text-sm font-medium">Your name</span>
                    <Input
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "err-name" : undefined}
                    />
                    {errors.name && (
                      <span id="err-name" className="text-xs text-red-600 mt-1">
                        {errors.name}
                      </span>
                    )}
                  </label>

                  <label className="flex flex-col">
                    <span className="text-sm font-medium">Email</span>
                    <Input
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "err-email" : undefined}
                    />
                    {errors.email && (
                      <span
                        id="err-email"
                        className="text-xs text-red-600 mt-1"
                      >
                        {errors.email}
                      </span>
                    )}
                  </label>
                </div>

                <label className="flex flex-col">
                  <span className="text-sm font-medium">Subject</span>
                  <Input
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    aria-invalid={!!errors.subject}
                    aria-describedby={
                      errors.subject ? "err-subject" : undefined
                    }
                  />
                  {errors.subject && (
                    <span
                      id="err-subject"
                      className="text-xs text-red-600 mt-1"
                    >
                      {errors.subject}
                    </span>
                  )}
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium">Message</span>
                  <textarea
                    placeholder="Write your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="mt-2 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 resize-vertical"
                    aria-invalid={!!errors.message}
                    aria-describedby={
                      errors.message ? "err-message" : undefined
                    }
                  />
                  {errors.message && (
                    <span
                      id="err-message"
                      className="text-xs text-red-600 mt-1"
                    >
                      {errors.message}
                    </span>
                  )}
                </label>

                {errors.submit && (
                  <div className="text-sm text-red-600">{errors.submit}</div>
                )}

                <div className="flex items-center gap-3">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Sending..." : "Send message"}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      // quick demo helper: prefill with sample
                      setName("Guest Support");
                      setEmail("guest@example.com");
                      setSubject("Inquiry about reservation");
                      setMessage("Hi, I have a question about my booking...");
                    }}
                  >
                    Use sample
                  </Button>

                  <div className="ml-auto text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <Badge className="text-xs py-0.5 px-2">
                        Response time
                      </Badge>
                      Usually within 24 hours
                    </span>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Right: Contact details */}
        <aside className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Contact details</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-medium">Address</div>
                  <div className="text-muted-foreground">
                    123 Seaside Boulevard, Beach City, Country
                  </div>
                </div>

                <div>
                  <div className="font-medium">Phone</div>
                  <a className="text-blue-600 block" href="tel:+8801712345678">
                    +880 1712 345 678
                  </a>
                </div>

                <div>
                  <div className="font-medium">Email</div>
                  <a
                    className="text-blue-600 block"
                    href="mailto:concierge@otithee.example"
                  >
                    concierge@otithee.example
                  </a>
                </div>

                <div>
                  <div className="font-medium">Hours</div>
                  <div className="text-muted-foreground">
                    Reception: 24/7 • Concierge: 07:00 — 22:00
                  </div>
                </div>

                <div>
                  <div className="font-medium">Social</div>
                  <div className="flex gap-2 mt-1">
                    <a
                      className="text-xs px-2 py-1 border rounded"
                      href="#"
                      aria-label="Instagram"
                    >
                      Instagram
                    </a>
                    <a
                      className="text-xs px-2 py-1 border rounded"
                      href="#"
                      aria-label="Facebook"
                    >
                      Facebook
                    </a>
                    <a
                      className="text-xs px-2 py-1 border rounded"
                      href="#"
                      aria-label="Twitter"
                    >
                      Twitter
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="text-sm">
                <div className="font-medium">Security</div>
                <div className="text-muted-foreground mb-2">
                  Dial 0 from room or{" "}
                  <a className="text-blue-600" href="tel:+8801700000000">
                    +880 1700 000 000
                  </a>
                </div>

                <div className="font-medium">Housekeeping</div>
                <div className="text-muted-foreground">
                  Press the housekeeping button or call{" "}
                  <a className="text-blue-600" href="tel:+8801711111111">
                    +880 1711 111 111
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Success dialog */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Message sent</DialogTitle>
          </DialogHeader>

          <div className="p-2">
            <p className="text-sm">
              Thanks! Your message has been sent. Our team will contact you
              soon.
            </p>

            <div className="mt-4 text-right">
              <Button onClick={() => setSuccessOpen(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
