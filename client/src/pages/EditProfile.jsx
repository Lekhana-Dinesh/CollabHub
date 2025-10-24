import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import { api } from "../api/client";

export const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setLocation(user.location || "");
      setSkills(user.skills.join(", "));
      setGithub(user.links.github || "");
      setLinkedin(user.links.linkedin || "");
      setPortfolio(user.links.portfolio || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updates = {
        name,
        location,
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        links: {
          github: github || undefined,
          linkedin: linkedin || undefined,
          portfolio: portfolio || undefined,
        },
      };

      const updated = await api.users.updateMe(updates);
      updateUser(updated);
      toast.success("Profile updated successfully!");
      navigate(`/profile/${user?.id}`);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., San Francisco, CA"
            />
          </div>

          <div>
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Textarea
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g., React, Node.js, Python"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Links</h3>

            <div>
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>

            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div>
              <Label htmlFor="portfolio">Portfolio</Label>
              <Input
                id="portfolio"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://yoursite.com"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit">Save Changes</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/profile/${user.id}`)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
