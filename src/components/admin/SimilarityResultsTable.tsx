import { HiOutlineDocumentReport } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SimilarityResult } from "@/lib/adminData";
import { cn } from "@/lib/utils";
import PlagiarismBadge from "./PlagiarismBadge";

interface SimilarityResultsTableProps {
  results: SimilarityResult[];
  compact?: boolean;
}

const SimilarityResultsTable = ({ results, compact = false }: SimilarityResultsTableProps) => (
  <div className="overflow-x-auto rounded-lg border border-border/60">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/40 hover:bg-muted/40">
          <TableHead className="font-semibold">Document Name</TableHead>
          <TableHead className="font-semibold">Compared With</TableHead>
          <TableHead className="font-semibold">Similarity</TableHead>
          <TableHead className="font-semibold">Plagiarism Level</TableHead>
          <TableHead className="text-right font-semibold">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((result) => (
          <TableRow key={result.id} className="transition-colors">
            <TableCell className="max-w-[180px] truncate font-medium">{result.documentName}</TableCell>
            <TableCell className={cn("text-muted-foreground", compact && "max-w-[150px] truncate")}>
              {result.comparedWith}
            </TableCell>
            <TableCell>
              <span className="font-heading text-sm font-bold">{result.similarityPercent}%</span>
            </TableCell>
            <TableCell>
              <PlagiarismBadge percent={result.similarityPercent} showPercent={false} />
            </TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" className="gap-1.5">
                <HiOutlineDocumentReport className="h-4 w-4" />
                Report
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default SimilarityResultsTable;
