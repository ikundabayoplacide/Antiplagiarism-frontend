import AdminLayout from "@/components/admin/AdminLayout";
import SimilarityResultsTable from "@/components/admin/SimilarityResultsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllSimilarityResults } from "@/lib/adminData";

const AdminSimilarity = () => {
  const results = getAllSimilarityResults();

  return (
    <AdminLayout title="Similarity Results">
      <div className="mb-8">
        <h2 className="font-heading text-2xl font-bold text-foreground">Similarity Results</h2>
        <p className="text-sm text-muted-foreground">
          Document comparison results with plagiarism level classification
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm">
          <span className="font-semibold text-emerald-700">Low (0–20%)</span>
          <span className="ml-2 text-emerald-600">
            {results.filter((r) => r.similarityPercent <= 20).length} documents
          </span>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm">
          <span className="font-semibold text-amber-700">Medium (21–49%)</span>
          <span className="ml-2 text-amber-600">
            {results.filter((r) => r.similarityPercent > 20 && r.similarityPercent <= 49).length} documents
          </span>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm">
          <span className="font-semibold text-red-700">High (50%+)</span>
          <span className="ml-2 text-red-600">
            {results.filter((r) => r.similarityPercent >= 50).length} documents
          </span>
        </div>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-lg">All Similarity Results ({results.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <SimilarityResultsTable results={results} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminSimilarity;
