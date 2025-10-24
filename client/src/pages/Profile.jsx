import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { Navbar } from "../components/Navbar";
import { ProfileCard } from "../components/ProfileCard";
import { Button } from "../components/ui/button";

export const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (id) {
      api.users.getById(id).then(setUser);
    }
  }, [id]);

  if (!user) return <div>Loading...</div>;

  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ProfileCard user={user} />
        {isOwnProfile && (
          <Button onClick={() => navigate("/profile/edit")} className="mt-4">
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};
