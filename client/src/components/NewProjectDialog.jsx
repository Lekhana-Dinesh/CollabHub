import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Plus } from "lucide-react";
import { api } from "../api/client";
import { toast } from "sonner";

export const NewProjectDialog = ({ onProjectCreated }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rolesNeeded, setRolesNeeded] = useState("");
  const [teamMembersRequired, setTeamMembersRequired] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [needsTeamMembers, setNeedsTeamMembers] = useState(true);
  const [needsContributors, setNeedsContributors] = useState(false);
  const [contributionRequirements, setContributionRequirements] = useState("");
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const rolesArray = rolesNeeded
        .split(",")
        .map((r) => r.trim())
        .filter((r) => r);
      const skillsArray = skillsRequired
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);

      // Create FormData instead of JSON
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("rolesNeeded", JSON.stringify(rolesArray.map((role) => ({ role, count: 1 }))));
      formData.append("teamMembersRequired", parseInt(teamMembersRequired) || 1);
      formData.append("skillsRequired", JSON.stringify(skillsArray));
      formData.append("needsTeamMembers", needsTeamMembers);
      formData.append("needsContributors", needsContributors);
      formData.append("techStack", JSON.stringify(skillsArray));
      formData.append("tags", JSON.stringify([]));
      
      if (needsContributors && contributionRequirements) {
        formData.append("contributionRequirements", contributionRequirements);
      }

      // Append the actual file
      if (coverImageFile) {
        formData.append("coverImage", coverImageFile);
      }

      await api.projects.create(formData);

      toast.success("Project created successfully!");
      setOpen(false);

      // Reset form
      setTitle("");
      setDescription("");
      setRolesNeeded("");
      setTeamMembersRequired("");
      setSkillsRequired("");
      setNeedsTeamMembers(true);
      setNeedsContributors(false);
      setContributionRequirements("");
      setCoverImageFile(null);
      setCoverImagePreview("");

      if (onProjectCreated) onProjectCreated();
    } catch (error) {
      console.error("Create project error:", error);
      toast.error("Failed to create project");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={18} />
          New Project
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Project Name *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="coverImage">Project Thumbnail / Cover Image</Label>
            <Input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {coverImagePreview && (
              <div className="mt-2">
                <img src={coverImagePreview} alt="Cover preview" className="w-full h-32 object-cover rounded" />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="roles">Team Members / Roles (comma-separated)</Label>
            <Input
              id="roles"
              value={rolesNeeded}
              onChange={(e) => setRolesNeeded(e.target.value)}
              placeholder="e.g., Frontend Developer, Designer, Backend Developer"
            />
          </div>

          <div>
            <Label htmlFor="teamSize">Number of Team Members Required</Label>
            <Input
              id="teamSize"
              type="number"
              min="1"
              value={teamMembersRequired}
              onChange={(e) => setTeamMembersRequired(e.target.value)}
              placeholder="e.g., 3"
            />
          </div>

          <div>
            <Label htmlFor="skills">Skills Required (comma-separated)</Label>
            <Input
              id="skills"
              value={skillsRequired}
              onChange={(e) => setSkillsRequired(e.target.value)}
              placeholder="e.g., React, Node.js, MongoDB"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="needsTeam"
                checked={needsTeamMembers}
                onCheckedChange={(checked) => setNeedsTeamMembers(!!checked)}
              />
              <Label htmlFor="needsTeam" className="cursor-pointer">
                Looking for Team Members
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="needsContributors"
                checked={needsContributors}
                onCheckedChange={(checked) => setNeedsContributors(!!checked)}
              />
              <Label htmlFor="needsContributors" className="cursor-pointer">
                Looking for Contributors
              </Label>
            </div>
          </div>

          {needsContributors && (
            <div>
              <Label htmlFor="contributions">What type of Contributions are needed?</Label>
              <Textarea
                id="contributions"
                value={contributionRequirements}
                onChange={(e) => setContributionRequirements(e.target.value)}
                rows={3}
                placeholder="Describe what kind of contributions you're looking for..."
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};