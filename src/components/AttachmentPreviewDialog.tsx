import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { X, Download, ExternalLink } from "lucide-react";

type AttachmentPreviewDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  attachment: {
    name: string;
    type: string;
    url: string;
    size?: string;
    uploadedAt?: string;
  } | null;
};

export function AttachmentPreviewDialog({
  isOpen,
  onClose,
  attachment,
}: AttachmentPreviewDialogProps) {
  if (!attachment) return null;

  const isImage = attachment.type?.startsWith("image/");
  const isPDF = attachment.type === "application/pdf";
  const isVideo = attachment.type?.startsWith("video/");
  const isAudio = attachment.type?.startsWith("audio/");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-hidden border-border-subtle"
        style={{ backgroundColor: "#1A1A1A" }}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white">{attachment.name}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(attachment.url, "_blank")}
                className="text-text-secondary hover:text-cyan-accent"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in new tab
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = attachment.url;
                  a.download = attachment.name;
                  a.click();
                }}
                className="text-text-secondary hover:text-cyan-accent"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          {attachment.size && attachment.uploadedAt && (
            <div className="flex items-center gap-3 text-xs text-text-secondary mt-2">
              <span>{attachment.size}</span>
              <span>•</span>
              <span>Uploaded {new Date(attachment.uploadedAt).toLocaleDateString()}</span>
            </div>
          )}
        </DialogHeader>

        <div
          className="mt-4 rounded-lg border border-border-subtle overflow-auto"
          style={{ backgroundColor: "#0A0A0B", maxHeight: "calc(90vh - 150px)" }}
        >
          {isImage ? (
            <img
              src={attachment.url}
              alt={attachment.name}
              className="w-full h-auto"
            />
          ) : isPDF ? (
            <iframe
              src={attachment.url}
              className="w-full h-full"
              style={{ minHeight: "600px" }}
              title={attachment.name}
            />
          ) : isVideo ? (
            <video controls className="w-full h-auto">
              <source src={attachment.url} type={attachment.type} />
              Your browser does not support the video tag.
            </video>
          ) : isAudio ? (
            <div className="p-8 flex items-center justify-center">
              <audio controls className="w-full max-w-md">
                <source src={attachment.url} type={attachment.type} />
                Your browser does not support the audio tag.
              </audio>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-text-secondary mb-4">
                Preview not available for this file type
              </p>
              <Button
                onClick={() => window.open(attachment.url, "_blank")}
                className="bg-cyan-accent hover:bg-cyan-accent/80 text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in new tab
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
