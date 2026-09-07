import { useNavigate } from "react-router-dom";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";

/** Catch-all 404 page for unmatched routes. */
function NotFound() {
  const navigate = useNavigate();

  return (
    <Card
      style={{ textAlign: "center", padding: "70px 20px", maxWidth: 480, margin: "40px auto" }}
    >
      <h1 className="page-title" style={{ marginBottom: 10 }}>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <div style={{ marginTop: 16 }}>
        <Button variant="primary" onClick={() => navigate("/")}>
          Go home
        </Button>
      </div>
    </Card>
  );
}

export default NotFound;
