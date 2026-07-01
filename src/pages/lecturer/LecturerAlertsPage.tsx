import { useState } from "react";
import { FaTriangleExclamation, FaFileLines, FaRegCalendar, FaUser } from "react-icons/fa6";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_PROJECTS, MockProject } from "@/data/lecturerData";
import ProjectDetailsModal from "@/components/lecturer/ProjectDetailsModal";

const LecturerAlertsPage = () => {
  const [selectedProject, setSelectedProject] = useState<MockProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // High similarity alerts (projects with >= 50% similarity)
  const highSimilarityAlerts = MOCK_PROJECTS.filter((p) => p.similarityPercent >= 50);

  const handleOpenDetails = (project: MockProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">High Similarity Alerts</h2>
        <p className="text-sm text-muted-foreground">Critical alerts for research papers exceeding the 50% plagiarism threshold.</p>
      </div>

      {highSimilarityAlerts.length === 0 ? (
        <Card className="border-border/60 shadow-sm rounded-2xl">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No active high-similarity alerts. All supervised projects are within the safe threshold limit.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {highSimilarityAlerts.map((alert) => (
            <Card key={alert.id} className="border-rose-500/20 bg-rose-500/5 shadow-sm rounded-2xl overflow-hidden relative group transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
              {/* Highlight indicator */}
              <div className="absolute inset-y-0 left-0 w-1.5 bg-rose-500" />
              
              <CardHeader className="pb-3 pl-8 flex flex-row items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <FaTriangleExclamation className="h-4 w-4 text-rose-500 shrink-0" />
                    <span className="font-mono text-[10px] font-bold text-rose-600 uppercase tracking-widest bg-rose-500/10 px-2 py-0.5 rounded">
                      Critically Flagged
                    </span>
                  </div>
                  <CardTitle className="font-heading text-base font-extrabold text-foreground leading-snug truncate max-w-[280px]" title={alert.title}>
                    {alert.title}
                  </CardTitle>
                </div>
                <Badge variant="outline" className="bg-rose-500/20 text-rose-700 font-extrabold border-rose-500/30 rounded-xl shrink-0 px-3 py-1">
                  {alert.similarityPercent}% Match
                </Badge>
              </CardHeader>
              <CardContent className="pl-8 space-y-4">
                {/* Meta details */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <FaUser className="h-3.5 w-3.5 text-rose-500/60" />
                    <span>Student: <strong className="text-foreground">{alert.studentName}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <FaRegCalendar className="h-3.5 w-3.5 text-rose-500/60" />
                    <span>Checked: <strong className="text-foreground">{alert.dateSubmitted}</strong></span>
                  </div>
                </div>

                <div className="text-xs text-rose-700 bg-rose-500/10 p-3 rounded-xl border border-rose-500/10 leading-relaxed italic">
                  Matched sources found in academic repositories. Review recommended prior to formal grading.
                </div>

                <div className="flex justify-end pt-1">
                  <Button
                    onClick={() => handleOpenDetails(alert)}
                    className="gap-2 bg-rose-600 text-white shadow-sm shadow-rose-500/20 hover:bg-rose-700 rounded-xl text-xs font-semibold px-4 py-2"
                  >
                    <FaFileLines className="h-3.5 w-3.5" />
                    Audit Similarity Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ProjectDetailsModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => {
          setSelectedProject(null);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default LecturerAlertsPage;
