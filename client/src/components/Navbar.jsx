import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, Compass, Bookmark, User, LogOut } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-primary">
          CollabHub
        </Link>

        {/* Navigation links */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-sm hover:text-primary transition">
            <Home size={18} />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <Link
            to="/explore"
            className="flex items-center gap-2 text-sm hover:text-primary transition"
          >
            <Compass size={18} />
            <span className="hidden sm:inline">Explore</span>
          </Link>

          {user && (
            <>
              <Link
                to="/bookmarks"
                className="flex items-center gap-2 text-sm hover:text-primary transition"
              >
                <Bookmark size={18} />
                <span className="hidden sm:inline">Bookmarks</span>
              </Link>
              <Link
                to={`/profile/${user.id}`}
                className="flex items-center gap-2 text-sm hover:text-primary transition"
              >
                <User size={18} />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm hover:text-destructive transition"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
