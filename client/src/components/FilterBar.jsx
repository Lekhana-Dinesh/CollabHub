import { Search, X } from "lucide-react";
import { useApp } from "../context/AppContext";

export const FilterBar = () => {
  const { filters, setFilters, resetFilters } = useApp();

  const categories = ["Web Development", "Mobile Apps", "Backend", "DevOps", "Design"];
  const statuses = ["OPEN", "ACTIVE", "COMPLETED"];
  const techOptions = ["React", "Node.js", "Python", "JavaScript", "TypeScript"];

  return (
    <div className="bg-card rounded-lg border p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text"
          placeholder="Search projects..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
        />
      </div>

      {/* Category */}
      <div>
        <label className="text-sm font-medium mb-2 block">Category</label>
        <select
          value={filters.category}
          onChange={(e) => setFilters({ category: e.target.value })}
          className="w-full px-3 py-2 border rounded-md bg-background"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="text-sm font-medium mb-2 block">Status</label>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value })}
          className="w-full px-3 py-2 border rounded-md bg-background"
        >
          <option value="">All Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Tech */}
      <div>
        <label className="text-sm font-medium mb-2 block">Tech Stack</label>
        <div className="flex flex-wrap gap-2">
          {techOptions.map((tech) => {
            const isSelected = filters.techStack.includes(tech);
            return (
              <button
                key={tech}
                onClick={() => {
                  const newTech = isSelected
                    ? filters.techStack.filter((t) => t !== tech)
                    : [...filters.techStack, tech];
                  setFilters({ techStack: newTech });
                }}
                className={`text-sm px-3 py-1 rounded-full border transition ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:border-primary"
                }`}
              >
                {tech}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={resetFilters}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <X size={16} />
        Reset Filters
      </button>
    </div>
  );
};
