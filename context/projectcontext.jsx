"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/authcontext";
import { supabase } from "@/lib/supabase/client";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all user projects
  const fetchProjects = async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects");
        setProjects([]);
      } else {
        setProjects(data || []);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to load projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific project by ID
  const fetchProject = async (projectId) => {
    if (!user || !projectId) return null;

    try {
      // First check if we already have it in our projects array
      const existingProject = projects.find((p) => p.id === projectId);
      if (existingProject) {
        setCurrentProject(existingProject);
        return existingProject;
      }

      // If not found locally, fetch from database
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.log("Project not found in database:", error.message);
        // Create fallback project data
        const fallbackProject = {
          id: projectId,
          name: `Project ${projectId}`,
          type: "Chatbot",
          status: "Development",
          description: "",
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setCurrentProject(fallbackProject);
        return fallbackProject;
      } else {
        setCurrentProject(data);
        return data;
      }
    } catch (err) {
      console.log("Database connection issue, using fallback data");
      const fallbackProject = {
        id: projectId,
        name: `Project ${projectId}`,
        type: "Chatbot",
        status: "Development",
        description: "",
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setCurrentProject(fallbackProject);
      return fallbackProject;
    }
  };

  // Create new project
  const createProject = async (projectData) => {
    if (!user) return { success: false, error: "User not authenticated" };

    try {
      const newProjectData = {
        name: projectData.name,
        description: projectData.description || "",
        type: projectData.type || "Chatbot",
        user_id: user.id,
        status: "Development",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("projects")
        .insert([newProjectData])
        .select()
        .single();

      if (error) {
        console.error("Error creating project:", error);
        return { success: false, error: "Failed to create project" };
      }

      // Add to local state
      setProjects([data, ...projects]);
      return { success: true, project: data };
    } catch (err) {
      console.error("Error:", err);
      return { success: false, error: "Failed to create project" };
    }
  };

  // Update project
  const updateProject = async (projectId, updates) => {
    if (!user) return { success: false, error: "User not authenticated" };

    try {
      const { data, error } = await supabase
        .from("projects")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating project:", error);
        return { success: false, error: "Failed to update project" };
      }

      // Update local state
      setProjects(projects.map((p) => (p.id === projectId ? data : p)));
      if (currentProject?.id === projectId) {
        setCurrentProject(data);
      }

      return { success: true, project: data };
    } catch (err) {
      console.error("Error:", err);
      return { success: false, error: "Failed to update project" };
    }
  };

  // Delete project
  const deleteProject = async (projectId) => {
    if (!user) return { success: false, error: "User not authenticated" };

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error deleting project:", error);
        return { success: false, error: "Failed to delete project" };
      }

      // Update local state
      setProjects(projects.filter((p) => p.id !== projectId));
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
      }

      return { success: true };
    } catch (err) {
      console.error("Error:", err);
      return { success: false, error: "Failed to delete project" };
    }
  };

  // Clear current project
  const clearCurrentProject = () => {
    setCurrentProject(null);
  };

  // Fetch projects when user changes
  useEffect(() => {
    if (user) {
      fetchProjects();
    } else {
      setProjects([]);
      setCurrentProject(null);
      setLoading(false);
    }
  }, [user]);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        loading,
        error,
        fetchProjects,
        fetchProject,
        createProject,
        updateProject,
        deleteProject,
        clearCurrentProject,
        setCurrentProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
