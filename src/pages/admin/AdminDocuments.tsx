import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiGetAdminDocuments, type ApiAdminDocument } from "@/lib/api";
import { safeFormat } from "@/lib/utils";
import { toast } from "sonner";

const AdminDocuments = () => {
  const [documents, setDocuments] = useState<ApiAdminDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetAdminDocuments()
      .then(setDocuments)
      .catch((e) => toast.error(e?.message || "Failed to load documents."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Documents">
      <div className="mb-8">
        <h2 className="font-heading text-2xl font-bold text-foreground">Documents</h2>
        <p className="text-sm text-muted-foreground">All uploaded academic research documents across the platform</p>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Uploaded Documents ({documents.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-center text-sm text-muted-foreground">Loading...</p>
          ) : documents.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No documents found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead>File Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium max-w-[220px] truncate">{doc.fileName}</TableCell>
                      <TableCell className="text-muted-foreground uppercase text-xs">{doc.fileType}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{(doc.fileSize / 1024).toFixed(1)} KB</TableCell>
                      <TableCell className="text-muted-foreground">{doc.uploadedBy ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{safeFormat(doc.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminDocuments;
