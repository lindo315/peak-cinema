import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useWatchlist } from "@/components/WatchlistContext";
import { Bookmark, User, Mail, Edit, LogOut } from "lucide-react";
import MovieGrid from "@/components/MovieGrid";
import { Movie } from "@/lib/api";

const Profile = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const { watchlist, clearWatchlist } = useWatchlist();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    const success = await updateUserProfile(name, email);
    if (success) {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-12 mt-8 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Profile</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Information */}
            <div className="bg-zinc-900 rounded-xl shadow-lg p-6 border border-zinc-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-zinc-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-zinc-800 text-white disabled:opacity-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-zinc-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-zinc-800 text-white disabled:opacity-50"
                  />
                </div>

                {isEditing && (
                  <Button
                    onClick={handleSaveProfile}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    Save Changes
                  </Button>
                )}
              </div>
            </div>

            {/* Watchlist */}
            <div className="bg-zinc-900 rounded-xl shadow-lg p-6 border border-zinc-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Bookmark className="h-5 w-5" />
                  My Watchlist
                </h2>
                {watchlist.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearWatchlist}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Clear Watchlist
                  </Button>
                )}
              </div>

              {watchlist.length > 0 ? (
                <MovieGrid movies={watchlist} loading={false} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">Your watchlist is empty.</p>
                </div>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-8 flex justify-end">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
