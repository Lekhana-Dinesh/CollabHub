
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { api } from "../api/client";
import { Navbar } from "../components/Navbar";
import { FilterBar } from "../components/FilterBar";
import { ProjectCard } from "../components/ProjectCard";
import { LeaderboardList } from "../components/LeaderboardList";
import { Button } from "../components/ui/button";

export const Explore = () => {
  const { projects, setProjects, filters } = useApp();
  const [topProjects, setTopProjects] = useState([]);
  const [sortBy, setSortBy] = useState("newest"); // 'newest' | 'active' | 'top'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allProjects, leaderboard] = await Promise.all([
          api.projects.list(),
          api.leaderboard.getProjects(),
        ]);
        setProjects(allProjects);
        setTopProjects(leaderboard);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [setProjects]);

  // Apply filters
  let filteredProjects = projects.filter((p) => {
    if (filters.search && !p.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.category && !p.tags.some((t) => t.toLowerCase().includes(filters.category.toLowerCase()))) return false;
    if (filters.status && p.status !== filters.status) return false;
    if (filters.techStack.length > 0 && !filters.techStack.some((tech) => p.techStack.includes(tech))) return false;
    return true;
  });

  // Apply sorting
  if (sortBy === "newest") {
    filteredProjects = [...filteredProjects].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else if (sortBy === "active") {
    filteredProjects = [...filteredProjects].sort(
      (a, b) => b.metrics.tasksDone + b.team.length - (a.metrics.tasksDone + a.team.length)
    );
  } else if (sortBy === "top") {
    filteredProjects = [...filteredProjects].sort((a, b) => b.metrics.tasksDone - a.metrics.tasksDone);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Explore Projects</h1>

        {/* Sort buttons */}
        <div className="flex gap-2 mb-6">
          <Button variant={sortBy === "newest" ? "default" : "outline"} onClick={() => setSortBy("newest")}>
            Newest
          </Button>
          <Button variant={sortBy === "active" ? "default" : "outline"} onClick={() => setSortBy("active")}>
            Most Active
          </Button>
          <Button variant={sortBy === "top" ? "default" : "outline"} onClick={() => setSortBy("top")}>
            Top This Month
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FilterBar />
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Top Projects This Month</h3>
              <LeaderboardList entries={topProjects.slice(0, 5)} type="projects" />
            </div>
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
