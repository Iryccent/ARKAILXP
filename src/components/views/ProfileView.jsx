import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Camera, Loader2, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileView = ({ onLogout }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // ✅ CORRECCIÓN APLICADA: Conexión a la tabla 'profiles'
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, role, avatar_url')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load profile",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // ✅ CORRECCIÓN APLICADA: Update funcional
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated!",
        description: "Your changes have been saved successfully.",
      });
      setProfile(prev => ({...prev, full_name: fullName}));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) {
        setUploading(false);
        return;
      };

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // ✅ CORRECCIÓN APLICADA: Subida a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast({ title: "Avatar updated!" });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-transparent">
        <Sidebar user={user} onLogout={onLogout} />
        <main className="flex-1 p-8 md:pl-20 lg:pl-64 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="flex-1 p-4 sm:p-6 md:p-8 md:pl-20 lg:pl-64 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-8 text-text-primary">User Profile</h1>

          <div className="glass-panel p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <img
                  alt="User profile picture"
                  className="w-32 h-32 rounded-full object-cover border-4 border-glass-border"
                  src={avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`} />
                <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  {uploading ? <Loader2 className="h-8 w-8 animate-spin text-white" /> : <Camera className="h-8 w-8 text-white" />}
                </label>
                <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-text-primary">{profile?.full_name || 'New Learner'}</h2>
                <p className="text-lg text-text-secondary">{user.email}</p>
                <span className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                  profile?.role === 'admin' ? 'bg-pink-500/20 text-pink-300' : 'bg-cyan-500/20 text-cyan-300'
                }`}>
                  {profile?.role || 'student'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveChanges} className="mt-8 border-t border-glass-border pt-8">
               <h3 className="text-xl font-bold mb-4 text-text-primary">Your Information</h3>
               <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full max-w-md bg-background/50 border border-glass-border p-2 rounded-lg text-text-primary focus:ring-2 focus:ring-accent-primary focus:outline-none"
                  />
                </div>
               </div>
               <Button type="submit" disabled={saving} className="mt-6">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
               </Button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProfileView;