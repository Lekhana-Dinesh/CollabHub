import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { api } from "../api/client";
import { Navbar } from "../components/Navbar";
import { ProjectCard } from "../components/ProjectCard";
import { NewProjectDialog } from "../components/NewProjectDialog";
import { Inbox } from "lucide-react";
import { toast } from "sonner";

// Home page - user's dashboard
export const Home = () => {
  const { user } = useAuth();
  const { setProjects } = useApp();
  const [myProjects, setMyProjects] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();

  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load all projects
      const allProjects = await api.projects.list();
      setProjects(allProjects);

      // Filter projects where user is a member
      const myProjectsList = allProjects.filter((p) =>
        p.team.some((m) => m.user.id === user?.id)
      );
      setMyProjects(myProjectsList);

      // Get suggested projects
      const suggestedProjects = await api.match.getSuggested();
      setSuggested(suggestedProjects);

      // Get projects with pending invites for current user
      const projectsWithInvites = allProjects.filter((p) =>
        p.joinRequests.some(
          (r) => r.user.id === user?.id && r.status === "PENDING"
        )
      );
      setInvites(projectsWithInvites);
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = () => {
    loadData();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground mt-1">
              Here&apos;s what&apos;s happening with your projects
            </p>
          </div>
          <NewProjectDialog onProjectCreated={handleProjectCreated} />
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="space-y-8">
            {/* Invitations */}
            {invites.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Inbox size={24} />
                  Pending Invitations ({invites.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {invites.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </section>
            )}

            {/* My Projects */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">My Projects</h2>
              {myProjects.length === 0 ? (
                <div className="text-center py-12 bg-card border rounded-lg">
                  <p className="text-muted-foreground mb-4">
                    You haven&apos;t joined any projects yet
                  </p>
                  <Link to="/explore" className="text-primary hover:underline">
                    Explore projects
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </section>

            {/* Suggested Projects */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Suggested for You</h2>
              {suggested.length === 0 ? (
                <p className="text-muted-foreground">No suggestions at the moment</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggested.slice(0, 6).map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
