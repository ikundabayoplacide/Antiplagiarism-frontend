import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Search, Trash2, Eye, Pencil } from "lucide-react";
import { apiGetDocuments, apiGetDocument, apiDeleteDocument, apiUpdateDocument, type ApiDocument } from "@/lib/api";
import { toast } from "sonner";
import { format } from "date-fns";

const ScanHistory = () => {
  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [search, setSearch] = useState("");
  const [editingDoc, setEditingDoc] = useState<ApiDocument | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const editFileRef = useRef<HTMLInputElement>(null);

  const loadDocuments = async () => {
    try {
      const docs = await apiGetDocuments();
      setDocuments(docs);
    } catch {
      toast.error("Failed to load documents.");
    }
  };

  useEffect(() => { loadDocuments(); }, []);

  const handleView = async (id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;
    try {
      const full = await apiGetDocument(id);
      if (!full.content) { toast.error("No content available."); return; }
      const byteChars = atob(full.content);
      const bytes = new Uint8Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);
      const blob = new Blob([bytes], { type: full.fileType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.fileName ?? doc.id;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download document.");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleteLoading(true);
    try {
      await apiDeleteDocument(deletingId);
      toast.success("Document removed.");
      setDeletingId(null);
      loadDocuments();
    } catch {
      toast.error("Failed to delete document.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEdit = (doc: ApiDocument) => {
    setEditingDoc(doc);
    setEditFile(null);
  };

  const handleEdit = async () => {
    if (!editingDoc || !editFile) return;
    setEditLoading(true);
    try {
      await apiUpdateDocument(editingDoc.id, {
        file: editFile,
        fileName: editFile.name,
      });
      toast.success("Document updated.");
      setEditingDoc(null);
      loadDocuments();
    } catch {
      toast.error("Failed to update document.");
    } finally {
      setEditLoading(false);
    }
  };

  const filtered = documents.filter((d) =>
    (d.fileName ?? d.id).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="My Documents">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">My Documents</h2>
          <p className="text-sm text-muted-foreground">View, manage, and download your uploaded documents</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <p className="p-12 text-center text-sm text-muted-foreground">
              No documents yet. Upload a file from Upload Document.
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Document</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Size</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-border transition-colors last:border-0 hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium text-foreground">{item.fileName ?? item.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {format(new Date(item.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {(item.fileSize / 1024).toFixed(1)} KB
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(item)} title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleView(item.id)} title="Download">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeletingId(item.id)} title="Remove">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingDoc} onOpenChange={(open) => !open && setEditingDoc(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Replace File</label>
              <input ref={editFileRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden"
                onChange={(e) => { setEditFile(e.target.files?.[0] ?? null); e.target.value = ""; }} />
              <Button variant="outline" className="w-full" onClick={() => editFileRef.current?.click()}>
                {editFile ? editFile.name : "Choose file"}
              </Button>
            </div>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={handleEdit} disabled={editLoading || !editFile}>
                {editLoading ? "Saving…" : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={() => setEditingDoc(null)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this document? This action cannot be undone.</p>
          <div className="flex gap-2 pt-2">
            <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? "Deleting…" : "Delete"}
            </Button>
            <Button variant="outline" onClick={() => setDeletingId(null)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
};

export default ScanHistory;
