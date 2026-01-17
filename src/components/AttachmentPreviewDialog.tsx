import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogDivider } from "./ui/dialog";
import { Button } from "./ui/button";
import { X, Download, ExternalLink, Calendar, FileText } from "lucide-react";

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>CIELO</DialogTitle>
          <DialogDescription>File preview</DialogDescription>
        </DialogHeader>

        <DialogDivider />

        <DialogBody>
          {/* File Info Section */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-1">File Name</p>
                <p className="text-white text-lg">{attachment.name}</p>
              </div>
            </div>

            {attachment.uploadedAt && (
              <>
                <DialogDivider />
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">Uploaded</p>
                    <p className="text-white text-lg">
                      {new Date(attachment.uploadedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </>
            )}

            {attachment.size && (
              <>
                <DialogDivider />
                <div className="space-y-1">
                  <p className="text-sm text-gray-400"># File Size</p>
                  <p className="text-white text-2xl">{attachment.size}</p>
                </div>
              </>
            )}
          </div>

          <DialogDivider />

          {/* Preview Section */}
          <div className="rounded-xl border border-white/10 overflow-hidden bg-black/40">
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
              <div className="p-12 flex items-center justify-center">
                <audio controls className="w-full max-w-md">
                  <source src={attachment.url} type={attachment.type} />
                  Your browser does not support the audio tag.
                </audio>
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-gray-400 mb-4">
                  Preview not available for this file type
                </p>
                <Button
                  onClick={() => window.open(attachment.url, "_blank")}
                  className="bg-cyan-400 hover:bg-cyan-500 text-black"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in new tab
                </Button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => window.open(attachment.url, "_blank")}
              className="flex-1 border-white/10 text-white hover:bg-white/5"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in new tab
            </Button>
            <Button
              onClick={() => {
                const a = document.createElement("a");
                a.href = attachment.url;
                a.download = attachment.name;
                a.click();
              }}
              className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-black"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
