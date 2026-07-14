import { FaFileLines } from "react-icons/fa6";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { LecturerProject } from "@/lib/api";

interface ProjectDetailsModalProps {
  project: LecturerProject | null;
  isOpen: boolean;
  onClose: () => void;
}

const deriveStatus = (p?: number): string => {
  if (p === undefined) return "—";
  if (p <= 20) return "Low";
  if (p <= 49) return "Medium";
  return "High";
};

const statusColor = (p?: number) => {
  if (p === undefined) return "bg-muted/30 text-muted-foreground border-border";
  if (p <= 20) return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  if (p <= 49) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  return "bg-rose-500/10 text-rose-600 border-rose-500/20";
};

const formatDate = (val?: string) => {
  if (!val) return "—";
  const d = new Date(val);
  return isNaN(d.getTime()) ? "—" : d.toLocaleString();
};

const ProjectDetailsModal = ({ project, isOpen, onClose }: ProjectDetailsModalProps) => {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <FaFileLines className="h-4 w-4 text-blue-500 shrink-0" />
            <DialogTitle className="font-heading text-lg font-bold text-foreground truncate">
              {project.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            Submission details for this document.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3.5 rounded-xl bg-muted/30 p-5 border border-border/40 text-sm">
          <div className="flex justify-between border-b border-border/50 pb-2">
            <span className="text-muted-foreground">Student</span>
            <span className="font-medium text-foreground">{project.studentName}</span>
          </div>
          <div className="flex justify-between border-b border-border/50 pb-2">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium text-foreground">{project.studentEmail}</span>
          </div>
          <div className="flex justify-between border-b border-border/50 pb-2">
            <span className="text-muted-foreground">Similarity</span>
            <span className="font-bold text-foreground">
              {project.similarityPercent !== undefined ? `${project.similarityPercent}%` : "—"}
            </span>
          </div>
          <div className="flex justify-between border-b border-border/50 pb-2">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="outline" className={`rounded-lg text-[10px] font-bold ${statusColor(project.similarityPercent)}`}>
              {project.status ?? deriveStatus(project.similarityPercent)}
            </Badge>
          </div>
          <div className="flex justify-between border-b border-border/50 pb-2">
            <span className="text-muted-foreground">Word Count</span>
            <span className="font-medium text-foreground">{project.wordCount?.toLocaleString() ?? "—"}</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-muted-foreground">Submitted</span>
            <span className="font-medium text-foreground">{formatDate(project.dateSubmitted)}</span>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <Button variant="ghost" onClick={onClose} className="rounded-xl border border-border">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;
