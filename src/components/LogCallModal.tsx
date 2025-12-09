import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Phone, Link as LinkIcon, FileText } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { api } from "../utils/supabase/client";

interface LogCallModalProps {
  open: boolean;
  onClose: () => void;
  clientId: string;
  onSuccess?: () => void;
}

export function LogCallModal({ open, onClose, clientId, onSuccess }: LogCallModalProps) {
  const [callTitle, setCallTitle] = useState("");
  const [callLink, setCallLink] = useState("");
  const [callNotes, setCallNotes] = useState("");
  const [duration, setDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!callTitle.trim()) {
      toast.error("Please enter a call title");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create the recording entry
      const recordingData = {
        title: callTitle,
        type: "audio" as const,
        date: new Date().toISOString(),
        duration: duration || "00:00",
        url: callLink || undefined,
        clientId: clientId,
      };

      const response = await api.createRecording(recordingData);

      if (response.success) {
        // If notes were added, add them to the recording
        if (callNotes.trim()) {
          await api.addRecordingNote(response.data.id, callNotes);
        }

        // Also add to data archive for client view
        const archiveData = {
          title: callTitle,
          type: "call" as const,
          date: new Date().toISOString(),
          description: callNotes || "Call recording",
          url: callLink || undefined,
          clientId: clientId,
          tags: ["call", "recording"],
        };

        await api.createArchiveItem(archiveData);

        toast.success("Call logged successfully");
        
        // Reset form
        setCallTitle("");
        setCallLink("");
        setCallNotes("");
        setDuration("");
        
        onSuccess?.();
        onClose();
      } else {
        toast.error("Failed to log call");
      }
    } catch (error) {
      console.error("Error logging call:", error);
      toast.error("An error occurred while logging the call");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setCallTitle("");
      setCallLink("");
      setCallNotes("");
      setDuration("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-dark-bg border-border-subtle">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Phone className="h-5 w-5 text-cyan-accent" />
            Log Call
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="callTitle" className="text-white">
              Call Title *
            </Label>
            <Input
              id="callTitle"
              value={callTitle}
              onChange={(e) => setCallTitle(e.target.value)}
              placeholder="e.g., Strategy Review Call"
              className="bg-card-bg border-border-subtle text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-white">
              Duration
            </Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 45:30"
              className="bg-card-bg border-border-subtle text-white"
            />
            <p className="text-xs text-text-secondary">Format: MM:SS or HH:MM:SS</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="callLink" className="text-white flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Recording Link (Optional)
            </Label>
            <Input
              id="callLink"
              type="url"
              value={callLink}
              onChange={(e) => setCallLink(e.target.value)}
              placeholder="https://..."
              className="bg-card-bg border-border-subtle text-white"
            />
            <p className="text-xs text-text-secondary">
              Link to Zoom recording, Google Meet, Loom, etc.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="callNotes" className="text-white flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes (Optional)
            </Label>
            <Textarea
              id="callNotes"
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
              placeholder="Add call notes, key discussion points, action items..."
              className="bg-card-bg border-border-subtle text-white min-h-[120px]"
              rows={5}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-border-subtle text-white hover:bg-cyan-accent/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-cyan-accent hover:bg-cyan-accent/80 text-dark-bg"
            >
              {isSubmitting ? "Logging..." : "Log Call"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
