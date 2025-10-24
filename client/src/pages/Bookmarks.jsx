import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { ProjectCard } from '../components/ProjectCard';
import { api } from '../api/client';

export const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const bookmarkedIds = JSON.parse(localStorage.getItem('bookmarks') || '[]');

        if (bookmarkedIds.length === 0) {
          setBookmarks([]);
          setLoading(false);
          return;
        }

        // fetch each project by id from backend
        const results = await Promise.all(
          bookmarkedIds.map((id) => api.projects.getById(id).catch(() => null))
        );

        // filter out null / failed ones
        setBookmarks(results.filter(Boolean));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Bookmarks</h1>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No bookmarked projects yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Bookmark projects you're interested in to see them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
