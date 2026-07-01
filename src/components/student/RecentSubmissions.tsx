import { format } from "date-fns";
import { Download, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PlagiarismBadge from "@/components/admin/PlagiarismBadge";
import type { ScanRecord } from "@/lib/types";
import { downloadScanReport } from "@/lib/report";
import { cn } from "@/lib/utils";

interface RecentSubmissionsProps {
  submissions: ScanRecord[];
  showActions?: boolean;
}

const RecentSubmissions = ({ submissions, showActions = true }: RecentSubmissionsProps) => {
  if (submissions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No submissions yet.{" "}
        <Link to="/dashboard/upload" className="font-medium text-primary hover:underline">
          Upload your first document
        </Link>
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border/60">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="font-semibold">Document</TableHead>
            <TableHead className="font-semibold">Submitted</TableHead>
            <TableHead className="font-semibold">Words</TableHead>
            <TableHead className="font-semibold">Similarity</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            {showActions && <TableHead className="text-right font-semibold">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((scan) => (
            <TableRow key={scan.id} className="transition-colors">
              <TableCell className="max-w-[200px] truncate font-medium">{scan.fileName}</TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(scan.createdAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-muted-foreground">{scan.wordCount.toLocaleString()}</TableCell>
              <TableCell>
                <PlagiarismBadge percent={scan.plagiarismPercent} />
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                    scan.status === "original"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  )}
                >
                  {scan.status}
                </span>
              </TableCell>
              {showActions && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/dashboard/results">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => downloadScanReport(scan)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentSubmissions;
