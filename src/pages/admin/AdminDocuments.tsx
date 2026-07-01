import AdminLayout from "@/components/admin/AdminLayout";
import DocumentsTable from "@/components/admin/DocumentsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllDocuments } from "@/lib/adminData";

const AdminDocuments = () => {
  const documents = getAllDocuments();

  return (
    <AdminLayout title="Documents">
      <div className="mb-8">
        <h2 className="font-heading text-2xl font-bold text-foreground">Documents</h2>
        <p className="text-sm text-muted-foreground">
          All uploaded academic research documents across the platform
        </p>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Uploaded Documents ({documents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentsTable documents={documents} />
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminDocuments;
