import { format } from "date-fns";
import { HiOutlineEye } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminDocument } from "@/lib/adminData";
import { cn } from "@/lib/utils";

const statusStyles: Record<AdminDocument["status"], string> = {
  pending: "bg-slate-100 text-slate-700",
  processing: "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
  failed: "bg-red-50 text-red-700",
};

interface DocumentsTableProps {
  documents: AdminDocument[];
  compact?: boolean;
}

const DocumentsTable = ({ documents, compact = false }: DocumentsTableProps) => (
  <div className="overflow-x-auto rounded-lg border border-border/60">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/40 hover:bg-muted/40">
          <TableHead className="font-semibold">Document ID</TableHead>
          <TableHead className="font-semibold">Title</TableHead>
          {!compact && <TableHead className="font-semibold">Uploaded By</TableHead>}
          <TableHead className="font-semibold">Upload Date</TableHead>
          <TableHead className="font-semibold">Status</TableHead>
          <TableHead className="text-right font-semibold">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow key={doc.id} className="transition-colors">
            <TableCell className="font-mono text-xs font-medium text-primary">{doc.id}</TableCell>
            <TableCell className="max-w-[200px] truncate font-medium">{doc.title}</TableCell>
            {!compact && <TableCell className="text-muted-foreground">{doc.uploadedBy}</TableCell>}
            <TableCell className="text-muted-foreground">
              {format(new Date(doc.uploadDate), "MMM d, yyyy")}
            </TableCell>
            <TableCell>
              <span
                className={cn(
                  "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                  statusStyles[doc.status]
                )}
              >
                {doc.status}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary">
                <HiOutlineEye className="h-4 w-4" />
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default DocumentsTable;
