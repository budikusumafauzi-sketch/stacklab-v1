import { useParams, Link } from "react-router-dom";
import { PageContainer } from "../../components/common/PageContainer";
import { PageContent } from "../../components/common/PageContent";
import { getLabById } from "../../config/labs";
import { AlertCircle, ArrowLeft } from "../../config/icons";
import { Button } from "../../components/ui/button";

export default function LabsPlaceholder() {
  const { labId } = useParams<{ labId: string }>();
  const metadata = labId ? getLabById(labId) : null;

  return (
    <PageContainer className="h-full flex items-center justify-center py-20">
      <PageContent className="text-center max-w-md mx-auto space-y-6">
        <div className="bg-secondary/50 p-6 rounded-full inline-flex items-center justify-center">
          {metadata ? (
            <metadata.icon className="h-12 w-12 text-muted-foreground" />
          ) : (
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
          )}
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">
            {metadata ? metadata.title : "Lab Not Found"}
          </h2>
          <p className="text-muted-foreground">
            {metadata 
              ? "This laboratory is currently under construction or disabled. Please check back later."
              : `The laboratory "${labId}" does not exist in the current configuration.`}
          </p>
        </div>

        <Button asChild variant="outline" className="mt-4">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </PageContent>
    </PageContainer>
  );
}
