import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Upload, Search, Trash2, Loader2, Pencil } from "lucide-react";
import { apiUploadDocument, apiGetDocuments, apiGetDocument, apiDeleteDocument, apiUpdateDocument, type ApiDocument } from "@/lib/api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Custom date formatter to output exactly "May 25th, 7:12 PM" layout
const formatUploadDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const day = date.getDate();
    
    // Add ordinal suffix (st, nd, rd, th)
    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";
    
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 hour should be 12
    
    return `${month} ${day}${suffix}, ${hours}:${minutes} ${ampm}`;
  } catch {
    return dateStr;
  }
};

const UploadCheck = () => {
  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingFileName, setAnalyzingFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [editingDoc, setEditingDoc] = useState<ApiDocument | null>(null);
  const [editName, setEditName] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
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

  const handleUpload = async (f: File) => {
    setAnalyzingFileName(f.name);
    setIsAnalyzing(true);
    setProgress(0);
    const timer = setInterval(() => setProgress((p) => p >= 90 ? 90 : p + 10), 120);
    try {
      await apiUploadDocument(f);
      clearInterval(timer);
      setProgress(100);
      setTimeout(() => {
        setIsAnalyzing(false);
        toast.success("Document uploaded successfully!");
        loadDocuments();
      }, 500);
    } catch (err: unknown) {
      clearInterval(timer);
      setIsAnalyzing(false);
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    }
  };

  const handleView = async (doc: ApiDocument) => {
    try {
      const full = await apiGetDocument(doc.id);
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
      toast.success("Document deleted.");
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
    setEditName(doc.fileName ?? "");
    setEditFile(null);
  };

  const handleEdit = async () => {
    if (!editingDoc) return;
    if (!editName.trim() && !editFile) { toast.error("Provide a new name or file."); return; }
    setEditLoading(true);
    try {
      await apiUpdateDocument(editingDoc.id, {
        ...(editFile ? { file: editFile } : {}),
        ...(editName.trim() ? { fileName: editName.trim() } : {}),
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

  return (
    <DashboardLayout title="Document Upload">
      <div className="mx-auto max-w-6xl py-4">
        {/* Header section matching screenshot layout */}
        <div className="flex items-center justify-between border-b border-border pb-6 mb-6">
          <h1 className="font-heading text-2xl font-bold text-foreground">Document Upload</h1>
          <Button
            onClick={() => fileRef.current?.click()}
            className="gap-2 border border-border bg-white text-foreground hover:bg-muted font-medium hover:text-foreground shadow-sm h-10 px-4 rounded-md"
          >
            <Upload className="h-4 w-4 text-foreground stroke-[2.5]" />
            Upload A File
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleUpload(e.target.files[0]);
                e.target.value = "";
              }
            }}
          />
        </div>

        {/* Table list of documents */}
        <div className="overflow-hidden bg-background">
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-muted rounded-2xl bg-muted/10">
              <Upload className="h-12 w-12 text-muted-foreground mb-4 opacity-50 animate-pulse" />
              <p className="font-semibold text-base text-foreground">No documents uploaded yet</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Click "Upload A File" above to scan and check assignments for similarity.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-sm font-bold text-foreground w-1/2">File name</th>
                    <th className="pb-3 text-left text-sm font-bold text-foreground w-1/4">Upload Date</th>
                    <th className="pb-3 text-left text-sm font-bold text-foreground">Size</th>
                    <th className="pb-3 text-right text-sm font-bold text-foreground"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="group transition-colors hover:bg-muted/30">
                      <td className="py-4 text-sm font-medium text-foreground pr-4">
                        {doc.fileName ?? doc.id}
                      </td>
                      <td className="py-4 text-sm text-muted-foreground font-medium">
                        {formatUploadDate(doc.createdAt)}
                      </td>
                      <td className="py-4 text-sm text-muted-foreground">
                        {(doc.fileSize / 1024).toFixed(1)} KB
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={() => openEdit(doc)}
                            className="border border-border text-foreground hover:bg-muted rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5 stroke-[2.5]" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleView(doc)}
                            className="bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-colors"
                          >
                            <Search className="h-3.5 w-3.5 stroke-[2.5]" />
                            View
                          </button>
                          <button
                            onClick={() => setDeletingId(doc.id)}
                            className="border border-destructive text-destructive hover:bg-destructive/5 rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5 stroke-[2.5]" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Upload/Analysis Loader Overlay */}
      {isAnalyzing && (
        <Dialog open={isAnalyzing}>
          <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-8 text-center rounded-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <h3 className="font-semibold text-lg text-foreground">Analyzing Document</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs truncate font-medium">
              {analyzingFileName}
            </p>
            <div className="w-full mt-6 space-y-2">
              <Progress value={progress} className="h-2 w-full" />
              <div className="flex justify-between text-xs text-muted-foreground font-medium">
                <span>Running N-gram comparisons...</span>
                <span>{progress}%</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}


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

      <Dialog open={!!editingDoc} onOpenChange={(open) => !open && setEditingDoc(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">File Name</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter new file name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Replace File <span className="text-muted-foreground font-normal">(optional)</span></label>
              <div className="flex items-center gap-2">
                <input
                  ref={editFileRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(e) => { setEditFile(e.target.files?.[0] ?? null); e.target.value = ""; }}
                />
                <Button variant="outline" className="w-full" onClick={() => editFileRef.current?.click()}>
                  {editFile ? editFile.name : "Choose file"}
                </Button>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={handleEdit} disabled={editLoading}>
                {editLoading ? "Saving…" : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={() => setEditingDoc(null)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UploadCheck;
