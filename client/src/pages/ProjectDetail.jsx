import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { Navbar } from "../components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { KanbanBoard } from "../components/KanbanBoard";
import { TeamList } from "../components/TeamList";
import { JoinRequestPanel } from "../components/JoinRequestPanel";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Bookmark, UserPlus, GitPullRequest } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

export const ProjectDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [joinMessage, setJoinMessage] = useState("");
  const [contributeMessage, setContributeMessage] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showContributeDialog, setShowContributeDialog] = useState(false);

  useEffect(() => {
    if (id) {
      loadProject(id);
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      setIsBookmarked(bookmarks.includes(id));
    }
  }, [id]);

  const loadProject = async (projectId) => {
    try {
      const [proj, taskList, chatMsgs] = await Promise.all([
        api.projects.getById(projectId),
        api.tasks.getByProject(projectId),
        api.chat.getMessages(projectId),
      ]);
      setProject(proj);
      setTasks(taskList);
      setMessages(chatMsgs);
    } catch (error) {
      toast.error("Failed to load project");
    }
  };

  const toggleBookmark = () => {
    if (!id) return;
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");

    if (isBookmarked) {
      const updated = bookmarks.filter((bookmarkId) => bookmarkId !== id);
      localStorage.setItem("bookmarks", JSON.stringify(updated));
      setIsBookmarked(false);
      toast.success("Removed from bookmarks");
    } else {
      bookmarks.push(id);
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      setIsBookmarked(true);
      toast.success("Added to bookmarks");
    }
  };

  const handleJoinRequest = async () => {
    if (!project || !joinMessage.trim()) return;
    try {
      await api.projects.requestJoin(project.id, joinMessage);
      toast.success("Join request sent!");
      setShowJoinDialog(false);
      setJoinMessage("");
      if (id) loadProject(id);
    } catch (error) {
      toast.error("Failed to send join request");
    }
  };

  const handleContributeRequest = async () => {
    if (!project || !contributeMessage.trim()) return;
    try {
      await api.projects.requestJoin(project.id, `[CONTRIBUTOR] ${contributeMessage}`);
      toast.success("Contribution request sent!");
      setShowContributeDialog(false);
      setContributeMessage("");
      if (id) loadProject(id);
    } catch (error) {
      toast.error("Failed to send contribution request");
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this project? This cannot be undone."
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:4000/api/projects/${project.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Delete failed:", res.status, errData);
        toast.error("Failed to delete project");
        return;
      }

      toast.success("Project deleted successfully");
      navigate("/");
    } catch (err) {
      console.error("Failed to delete project:", err);
      toast.error("Failed to delete project");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !project) return;
    try {
      const msg = await api.chat.sendMessage(project.id, newMessage);
      setMessages([...messages, msg]);
      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  if (!project) return <div>Loading...</div>;

  const progress =
    project.metrics.tasksTotal > 0
      ? Math.round((project.metrics.tasksDone / project.metrics.tasksTotal) * 100)
      : 0;

  const isTeamMember = user && project.team.some((member) => member.user.id === user.id);
  const isOwner = user && project.owner.id === user.id;
  const hasAlreadyRequested =
    user && project.joinRequests.some((req) => req.user.id === user.id && req.status === "PENDING");

  // Handle cover image with fallback
  const fallbackCover = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80";
  const coverImageUrl = (project.coverUrl && project.coverUrl.trim() !== "") 
    ? project.coverUrl 
    : fallbackCover;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Cover Image - Always show with fallback */}
        <img 
          src={coverImageUrl} 
          alt={project.title} 
          className="w-full h-64 object-cover rounded-lg mb-6"
          onError={(e) => {
            e.target.src = fallbackCover;
          }}
        />

        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <p className="text-muted-foreground mt-2">{project.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={toggleBookmark}>
              <Bookmark size={18} className={isBookmarked ? "fill-current" : ""} />
            </Button>
            {isOwner && (
              <Button 
                variant="destructive" 
                onClick={handleDeleteProject} 
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete Project
              </Button>
            )}
            {!isTeamMember && !isOwner && (
              <>
                {project.needsTeamMembers && (
                  <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
                    <DialogTrigger asChild>
                      <Button disabled={hasAlreadyRequested}>
                        <UserPlus size={18} className="mr-2" />
                        {hasAlreadyRequested ? "Request Pending" : "Ask to Join"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request to Join Team</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Message to Team Leader</Label>
                          <Textarea
                            value={joinMessage}
                            onChange={(e) => setJoinMessage(e.target.value)}
                            placeholder="Tell them why you'd like to join..."
                            rows={4}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowJoinDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleJoinRequest}>Send Request</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {project.needsContributors && (
                  <Dialog open={showContributeDialog} onOpenChange={setShowContributeDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <GitPullRequest size={18} className="mr-2" />
                        Contribute
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request to Contribute</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>How would you like to contribute?</Label>
                          <Textarea
                            value={contributeMessage}
                            onChange={(e) => setContributeMessage(e.target.value)}
                            placeholder="Describe your contribution..."
                            rows={4}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowContributeDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleContributeRequest}>Send Request</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </>
            )}
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {isTeamMember && <TabsTrigger value="tasks">Tasks</TabsTrigger>}
            <TabsTrigger value="team">Team</TabsTrigger>
            {isTeamMember && <TabsTrigger value="chat">Chat</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Progress</h3>
              <div className="w-full bg-secondary rounded-full h-3 mb-2">
                <div className="bg-primary rounded-full h-3" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-sm text-muted-foreground">{progress}% Complete</p>
            </div>

            <div className="bg-card border rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-secondary rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Roles Needed</h3>
                <div className="flex flex-wrap gap-2">
                  {project.rolesNeeded.map((role, idx) => (
                    <span key={idx} className="px-3 py-1 bg-secondary rounded">
                      {role.role} ({role.count})
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Team Size</h3>
                <p className="text-muted-foreground">
                  {project.team.length} / {project.teamMembersRequired} members
                </p>
              </div>

              {project.needsContributors && project.contributionRequirements && (
                <div>
                  <h3 className="font-semibold mb-2">Contribution Requirements</h3>
                  <p className="text-muted-foreground">{project.contributionRequirements}</p>
                </div>
              )}
            </div>
          </TabsContent>

          {isTeamMember && (
            <TabsContent value="tasks">
              <KanbanBoard
                tasks={tasks}
                onUpdateTask={async (taskId, updates) => {
                  const updated = await api.tasks.update(taskId, updates);
                  setTasks(tasks.map((t) => (t.id === taskId ? updated : t)));
                }}
                onCreateTask={async (title, desc) => {
                  const task = await api.tasks.create({
                    projectId: project.id,
                    title,
                    description: desc,
                  });
                  setTasks([...tasks, task]);
                }}
              />
            </TabsContent>
          )}

          <TabsContent value="team">
            <TeamList members={project.team} />
            {isOwner && project.joinRequests.filter((r) => r.status === "PENDING").length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Join Requests</h3>
                <JoinRequestPanel
                  requests={project.joinRequests.filter((r) => r.status === "PENDING")}
                  onAccept={async (reqId) => {
                    await api.projects.acceptRequest(project.id, reqId);
                    loadProject(project.id);
                  }}
                  onReject={async (reqId) => {
                    await api.projects.rejectRequest(project.id, reqId);
                    loadProject(project.id);
                  }}
                />
              </div>
            )}
          </TabsContent>

          {isTeamMember && (
            <TabsContent value="chat">
              <div className="bg-card border rounded-lg p-4 h-96 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex gap-2">
                      <img 
                        src={msg.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.user.name}`} 
                        alt={msg.user.name}
                        className="w-8 h-8 rounded-full" 
                      />
                      <div>
                        <p className="text-sm font-medium">{msg.user.name}</p>
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded"
                    placeholder="Type a message..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
                  >
                    Send
                  </button>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};