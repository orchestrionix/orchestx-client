import React, { useEffect, useState } from "react";
import { Settings, getRemoteSettings, updateRemoteSettings } from "../../actions";
import { toastError, toastSuccess } from "../../utils/toasts";
import BeatLoader from "react-spinners/BeatLoader";
import Breadcrumb from "../../components/tailwind/breadcrumbs";
import Button from "../../components/tailwind/button";
import { FiFolder, FiInfo, FiSave, FiUser } from "react-icons/fi";
import PathPicker from "../../components/tailwind/pathPicker";

interface SettingField {
  key: keyof Settings;
  label: string;
  description: string;
  icon: React.ReactNode;
  placeholder: string;
  validation?: (value: string) => string | undefined;
}

const settingsFields: SettingField[] = [
  {
    key: "NAME",
    label: "Application Name",
    description: "The name that appears throughout the application",
    icon: <FiUser className="w-4 h-4" />,
    placeholder: "Enter application name",
    validation: (value) => {
      if (!value) return "Name is required";
      if (value.length < 2) return "Name must be at least 2 characters";
      return undefined;
    }
  },
  {
    key: "PLAYER_DIRECTORY",
    label: "Player Directory",
    description: "Directory where the music player executable is located",
    icon: <FiFolder className="w-4 h-4" />,
    placeholder: "Enter player directory path",
    validation: (value) => !value ? "Player directory is required" : undefined
  },
  {
    key: "MUSIC_DIRECTORY",
    label: "Music Directory",
    description: "Root directory containing your music files",
    icon: <FiFolder className="w-4 h-4" />,
    placeholder: "Enter music directory path",
    validation: (value) => !value ? "Music directory is required" : undefined
  },
  {
    key: "PLAYER_PLAYLIST_DIRECTORY",
    label: "Playlist Directory",
    description: "Directory where playlists will be stored",
    icon: <FiFolder className="w-4 h-4" />,
    placeholder: "Enter playlist directory path",
    validation: (value) => !value ? "Playlist directory is required" : undefined
  }
];

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Settings, string>>>({});
  const [formData, setFormData] = useState<Settings>({
    NAME: "",
    PLAYER_DIRECTORY: "",
    MUSIC_DIRECTORY: "",
    PLAYER_PLAYLIST_DIRECTORY: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getRemoteSettings();
      setSettings(data);
      setFormData(data);
    } catch (error) {
      toastError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Settings, string>> = {};
    let isValid = true;

    settingsFields.forEach(field => {
      if (field.validation) {
        const error = field.validation(formData[field.key]);
        if (error) {
          newErrors[field.key] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toastError("Please fix the errors before saving");
      return;
    }

    setSaving(true);
    try {
      const response = await updateRemoteSettings(formData);
      setSettings(response.settings);
      toastSuccess("Settings updated successfully");
    } catch (error: any) {
      toastError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof Settings]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (loading) {
    return (
      <div className="grid place-items-center h-4/5">
        <div className="mx-auto inline">
          <BeatLoader color="#CCA483" size={25} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
    <header className="flex flex-col gap-5 border-b border-gray-800/5 dark:border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold text-white mb-4">Settings</h1>
            <Breadcrumb 
              home={{ href: "/", name: "home" }} 
              items={[{ name: "Settings", href: "/settings", current: true }]} 
            />
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-4 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <div className="bg-black/20 rounded p-3 mb-4">
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <FiInfo className="w-4 h-4" />
              <span>Configure your application settings below. All paths should be absolute.</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {settingsFields.map((field) => (
              <div
                key={field.key}
                className={`bg-black/20 rounded p-4 transition-all ${
                  errors[field.key] ? 'ring-1 ring-red-500/50' : 'hover:bg-black/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-gold/80">
                    {field.icon}
                  </div>
                  <label htmlFor={field.key} className="text-sm font-medium text-white">
                    {field.label}
                  </label>
                </div>
                
                <div className="text-xs text-white/40 mb-2 ml-6">
                  {field.description}
                </div>

                <div className="ml-6">
                  {field.key === "NAME" ? (
                    <input
                      type="text"
                      id={field.key}
                      name={field.key}
                      value={formData[field.key]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-1.5 bg-black/20 border border-white/10 rounded text-sm text-white 
                               placeholder-white/20 focus:outline-none focus:border-gold/50"
                    />
                  ) : (
                    <PathPicker
                      value={formData[field.key]}
                      onChange={(value) => handleInputChange({ 
                        target: { name: field.key, value } 
                      } as React.ChangeEvent<HTMLInputElement>)}
                      placeholder={field.placeholder}
                      error={errors[field.key]}
                    />
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-2">
              <Button 
                primary 
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 text-sm py-1.5"
              >
                <FiSave className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
