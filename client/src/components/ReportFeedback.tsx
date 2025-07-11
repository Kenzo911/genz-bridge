"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { toast } from "sonner";

const tagOptions = [
  "Feature Bug",
  "Slang Suggestion",
  "Feature Suggestion",
  "Advice / General Feedback",
  "Other",
];

export default function ReportFeedback() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState(tagOptions[0]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Message is required.");
      return;
    }
    try {
      setSubmitting(true);
      await api.post("/report-feedback", {
        title: title.trim() || undefined,
        tags: [tag],
        message: message.trim(),
      });
      setOpen(false);
      setTitle("");
      setTag(tagOptions[0]);
      setMessage("");
      toast.success("Thanks for your feedback, unc/twin! We&#39;ll look into it!");
    } catch (err: unknown) { 
      console.error(err);
      const errorMessage = (err as any)?.response?.data?.error || "Something went wrong.";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
        >
          Report Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Report Ambiguous Translation</DialogTitle>
          <DialogDescription>
            Help us improve by describing what's incorrect or unclear.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title / Subject</Label>
            <Input
              id="title"
              placeholder="e.g., Misleading 'gng' translation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="tag">Category</Label>
            <select
              id="tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full border-input bg-background dark:bg-input/30 rounded-md px-3 py-2 mt-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {tagOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what's off about the translation..."
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Sending..." : "Send Report"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 