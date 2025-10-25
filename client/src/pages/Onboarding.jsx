import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft } from "lucide-react";

// Onboarding 
export const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    skills: [],
    location: "",
    gender: "",
    github: "",
    linkedin: "",
    portfolio: "",
    categories: [],
    roles: [],
  });

  const availableSkills = [
    "React",
    "Node.js",
    "Python",
    "JavaScript",
    "TypeScript",
    "UI/UX",
    "Django",
    "MongoDB",
  ];
  const availableCategories = [
    "Web Development",
    "Mobile Apps",
    "Backend",
    "DevOps",
    "Design",
  ];
  const availableRoles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack",
    "Designer",
    "DevOps",
  ];

  const toggleArrayItem = (array, item) => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
  };

  const handleNext = () => {
    if (step === 1 && formData.skills.length === 0) {
      toast.error("Please select at least one skill");
      return;
    }
    if (
      step === 3 &&
      (formData.categories.length === 0 || formData.roles.length === 0)
    ) {
      toast.error("Please select at least one category and role");
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await updateUser({
        skills: formData.skills,
        location: formData.location,
        gender: formData.gender,
        links: {
          github: formData.github,
          linkedin: formData.linkedin,
          portfolio: formData.portfolio,
        },
        preferences: {
          categories: formData.categories,
          roles: formData.roles,
        },
      });
      toast.success("Profile completed!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Step {step} of 3 - Help us match you with the right projects
          </p>
        </div>

        <div className="w-full bg-secondary rounded-full h-2 mb-8">
          <div
            className="bg-primary rounded-full h-2 transition-all"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="bg-card border rounded-lg p-6">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Skills *
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map((skill) => {
                    const isSelected = formData.skills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            skills: toggleArrayItem(formData.skills, skill),
                          })
                        }
                        className={`px-4 py-2 rounded-full border transition ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background hover:border-primary"
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Location (optional)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g. San Francisco, CA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Gender (optional)
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">
                Connect Your Profiles
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Add links to your online profiles (all optional)
              </p>

              {["github", "linkedin", "portfolio"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {field}
                  </label>
                  <input
                    type="url"
                    value={formData[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder={`https://${field}.com/yourusername`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">
                Project Preferences
              </h2>

              <div>
                <label className="block text-sm font-medium mb-2">
                  What type of projects interest you? *
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map((cat) => {
                    const isSelected = formData.categories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            categories: toggleArrayItem(
                              formData.categories,
                              cat
                            ),
                          })
                        }
                        className={`px-4 py-2 rounded-full border transition ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background hover:border-primary"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  What roles do you want to take? *
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableRoles.map((role) => {
                    const isSelected = formData.roles.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            roles: toggleArrayItem(formData.roles, role),
                          })
                        }
                        className={`px-4 py-2 rounded-full border transition ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background hover:border-primary"
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="flex items-center gap-1 px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={loading}
              className="flex items-center gap-1 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition disabled:opacity-50"
            >
              {step === 3 ? (loading ? "Completing..." : "Complete") : "Next"}
              {step < 3 && <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
