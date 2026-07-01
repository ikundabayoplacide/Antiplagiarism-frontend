import { FaDownload, FaFilePdf, FaFileWord, FaFileCsv } from "react-icons/fa6";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface DownloadResource {
  id: string;
  name: string;
  type: "PDF" | "DOCX" | "CSV";
  size: string;
  description: string;
  category: "Guidelines" | "Templates" | "Logs";
}

const RESOURCES: DownloadResource[] = [
  {
    id: "res-1",
    name: "Academic Writing & Integrity Guidelines",
    type: "PDF",
    size: "1.8 MB",
    description: "Official university handbook detailing original writing rules and standard citation guides.",
    category: "Guidelines"
  },
  {
    id: "res-2",
    name: "Anti-Plagiarism System Policy Document (2026)",
    type: "PDF",
    size: "820 KB",
    description: "Rules regarding plagiarism thresholds, warnings, and escalation procedures.",
    category: "Guidelines"
  },
  {
    id: "res-3",
    name: "APA 7th Edition Citation Template",
    type: "DOCX",
    size: "450 KB",
    description: "Pre-formatted Microsoft Word document with APA citations and bibliography templates.",
    category: "Templates"
  },
  {
    id: "res-4",
    name: "Supervisory Student Sign-Off Sheet",
    type: "DOCX",
    size: "120 KB",
    description: "Formal checklist for signing off original student thesis submissions.",
    category: "Templates"
  },
  {
    id: "res-5",
    name: "Verified Plagiarism Audit Log Summary",
    type: "CSV",
    size: "42 KB",
    description: "Exported tabular history of all documents verified and approved under your supervisor account.",
    category: "Logs"
  }
];

const LecturerDownloadsPage = () => {
  const getIcon = (type: DownloadResource["type"]) => {
    switch (type) {
      case "PDF":
        return <FaFilePdf className="h-8 w-8 text-rose-500 shrink-0 animate-float" />;
      case "DOCX":
        return <FaFileWord className="h-8 w-8 text-blue-500 shrink-0 animate-float" />;
      case "CSV":
        return <FaFileCsv className="h-8 w-8 text-emerald-500 shrink-0 animate-float" />;
      default:
        return null;
    }
  };

  const handleDownload = (res: DownloadResource) => {
    // Generate a simple dummy file blob to simulate download
    const blobContent = `Anti-Plagiarism Resource: ${res.name}\nSize: ${res.size}\nDescription: ${res.description}`;
    const blob = new Blob([blobContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${res.name.replace(/\s+/g, "_")}.${res.type.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Resource downloaded: ${res.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Faculty & Student Downloads</h2>
        <p className="text-sm text-muted-foreground">Access templates, citation guidelines, policies, and exported log lists.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {RESOURCES.map((res) => (
          <Card key={res.id} className="border-border/60 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between">
            <CardHeader className="pb-3 flex flex-row items-start gap-4">
              {getIcon(res.type)}
              <div className="space-y-1 min-w-0">
                <Badge variant="secondary" className="rounded-lg text-[9px] font-bold uppercase tracking-wider">
                  {res.category}
                </Badge>
                <CardTitle className="font-heading text-sm font-bold text-foreground leading-snug truncate" title={res.name}>
                  {res.name}
                </CardTitle>
                <span className="text-[10px] font-mono text-muted-foreground">{res.type} · {res.size}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {res.description}
              </p>
              <div className="pt-2">
                <Button
                  onClick={() => handleDownload(res)}
                  className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  <FaDownload className="h-3.5 w-3.5" />
                  Download File
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LecturerDownloadsPage;
