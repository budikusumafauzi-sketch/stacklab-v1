import { EmptyState } from "../../components/common/EmptyState";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "../../config/icons";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col p-8 items-center justify-center min-h-[60vh]">
      <EmptyState
        title="404 - Page Not Found"
        description="The laboratory or page you are looking for does not exist or has been moved."
        icon={AlertCircle}
        action={{
          label: "Return to Dashboard",
          onClick: () => navigate("/")
        }}
      />
    </div>
  );
}
