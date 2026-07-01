import { useState, useRef } from "react";
import { PageContainer } from "../../components/common/PageContainer";
import { PageHeader } from "../../components/common/PageHeader";
import { PageContent } from "../../components/common/PageContent";
import { 
  Camera, 
  User, 
  Briefcase, 
  Mail, 
  MapPin, 
  Github, 
  Linkedin, 
  Globe, 
  Save,
  X
} from "lucide-react";
import { useProfile, ProfileData } from "../../contexts/ProfileContext";
import { toast } from "sonner";

export default function ProfilePage() {
  const { profile, updateProfile, saveProfile } = useProfile();
  const [skillInput, setSkillInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    saveProfile();
    toast.success("Profile saved successfully!");
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    updateProfile({ [field]: value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange("photo", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    handleChange("photo", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim() !== "") {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (!profile.skills.includes(newSkill)) {
        updateProfile({ skills: [...profile.skills, newSkill] });
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    updateProfile({ skills: profile.skills.filter((s) => s !== skillToRemove) });
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Profile" 
        description="Manage your professional identity and portfolio details."
        action={
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
          >
            <Save size={16} />
            Save Changes
          </button>
        }
      />
      
      <PageContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">
          
          <div className="space-y-6">
            <div className="p-6 bg-card text-card-foreground rounded-xl border border-border shadow-sm flex flex-col items-center text-center">
              <div className="relative group mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-muted bg-muted flex items-center justify-center relative">
                  {profile.photo ? (
                    <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-muted-foreground" />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-white hover:text-gray-200 transition-colors"
                      title="Upload Photo"
                    >
                      <Camera size={24} />
                    </button>
                  </div>
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
              
              <div className="flex gap-3 mt-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md text-xs font-medium hover:opacity-80 transition-opacity"
                >
                  Upload Photo
                </button>
                {profile.photo && (
                  <button 
                    onClick={handleRemovePhoto}
                    className="px-3 py-1.5 bg-destructive/10 text-destructive rounded-md text-xs font-medium hover:bg-destructive/20 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="mt-6 w-full">
                <h2 className="text-xl font-semibold truncate">{profile.fullName || "Your Name"}</h2>
                <p className="text-muted-foreground text-sm truncate">{profile.title || "Your Title"}</p>
              </div>
            </div>
            
            <div className="p-6 bg-card text-card-foreground rounded-xl border border-border shadow-sm space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Connections</h3>
              
              <div className="flex items-center gap-3 text-sm">
                <Github size={18} className="text-muted-foreground" />
                <input 
                  type="text" 
                  value={profile.github}
                  onChange={(e) => handleChange("github", e.target.value)}
                  placeholder="GitHub username"
                  className="flex-1 bg-transparent outline-none border-b border-transparent focus:border-border transition-colors truncate"
                />
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <Linkedin size={18} className="text-muted-foreground" />
                <input 
                  type="text" 
                  value={profile.linkedin}
                  onChange={(e) => handleChange("linkedin", e.target.value)}
                  placeholder="LinkedIn profile URL"
                  className="flex-1 bg-transparent outline-none border-b border-transparent focus:border-border transition-colors truncate"
                />
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <Globe size={18} className="text-muted-foreground" />
                <input 
                  type="text" 
                  value={profile.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  placeholder="Portfolio website URL"
                  className="flex-1 bg-transparent outline-none border-b border-transparent focus:border-border transition-colors truncate"
                />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 bg-card text-card-foreground rounded-xl border border-border shadow-sm space-y-6">
              <h3 className="text-lg font-medium border-b border-border pb-4">Personal Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User size={16} className="text-muted-foreground" />
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    value={profile.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    placeholder="e.g. Jane Doe"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Briefcase size={16} className="text-muted-foreground" />
                    Professional Title
                  </label>
                  <input 
                    type="text" 
                    value={profile.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    placeholder="e.g. Full Stack Developer"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail size={16} className="text-muted-foreground" />
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    placeholder="e.g. jane@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin size={16} className="text-muted-foreground" />
                    Location
                  </label>
                  <input 
                    type="text" 
                    value={profile.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    placeholder="e.g. New York, NY"
                  />
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium">Short Bio</label>
                <textarea 
                  value={profile.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-y"
                  placeholder="Write a brief introduction about yourself..."
                />
              </div>
            </div>
            
            <div className="p-6 bg-card text-card-foreground rounded-xl border border-border shadow-sm space-y-6">
              <h3 className="text-lg font-medium border-b border-border pb-4">Skills</h3>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span 
                      key={`${skill}-${index}`} 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {skill}
                      <button 
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-primary hover:text-primary/70 transition-colors focus:outline-none"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  
                  {profile.skills.length === 0 && (
                    <span className="text-sm text-muted-foreground italic py-1.5">No skills added yet.</span>
                  )}
                </div>
                
                <input 
                  type="text" 
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  className="w-full max-w-sm px-3 py-2 bg-background border border-input rounded-md text-sm outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  placeholder="Type a skill and press Enter..."
                />
              </div>
            </div>
          </div>
          
        </div>
      </PageContent>
    </PageContainer>
  );
}
