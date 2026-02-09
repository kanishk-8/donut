"use client";
import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import { useAuth } from "@/context/authcontext";
import { API_CONFIG, getApiUrl, getAuthHeaders } from "@/lib/api-config";

interface Project {
    id: string;
    name: string;
    description: string;
    type: string;
    status: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

interface ProjectContextType {
    projects: Project[];
    currentProject: Project | null;
    loading: boolean;
    error: string;
    fetchProjects: () => Promise<void>;
    fetchProject: (projectId: string) => Promise<Project | null>;
    createProject: (projectData: Partial<Project>) => Promise<{
        success: boolean;
        project?: Project;
        error?: string;
    }>;
    updateProject: (
        projectId: string,
        updates: Partial<Project>,
    ) => Promise<{
        success: boolean;
        project?: Project;
        error?: string;
    }>;
    deleteProject: (projectId: string) => Promise<{
        success: boolean;
        error?: string;
    }>;
    clearCurrentProject: () => void;
    setCurrentProject: (project: Project | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [currentProject, setCurrentProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch all user projects
    const fetchProjects = useCallback(async () => {
        if (!user) {
            setProjects([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                getApiUrl(API_CONFIG.ENDPOINTS.PROJECTS.LIST),
                {
                    method: "GET",
                    headers: getAuthHeaders(),
                },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Error fetching projects:", errorData);
                setError("Failed to load projects");
                setProjects([]);
                setLoading(false);
                return;
            }

            const data = await response.json();
            setProjects(data || []);
        } catch (err) {
            console.error("Error:", err);
            setError("Failed to load projects");
            setProjects([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Fetch specific project by ID
    const fetchProject = async (projectId: string) => {
        if (!user || !projectId) return null;

        try {
            // First check if we already have it in our projects array
            const existingProject = projects.find((p) => p.id === projectId);
            if (existingProject) {
                setCurrentProject(existingProject);
                return existingProject;
            }

            // Fetch from backend
            const response = await fetch(
                getApiUrl(API_CONFIG.ENDPOINTS.PROJECTS.GET(projectId)),
                {
                    method: "GET",
                    headers: getAuthHeaders(),
                },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.log("Project not found:", errorData.message);
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
            }

            const data = await response.json();
            setCurrentProject(data);
            return data;
        } catch (_err) {
            console.log("Backend connection issue, using fallback data");
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
    const createProject = async (projectData: Partial<Project>) => {
        if (!user) return { success: false, error: "User not authenticated" };

        try {
            const newProjectData = {
                name: projectData.name,
                description: projectData.description || "",
                type: projectData.type || "Chatbot",
                status: "Development",
            };

            const response = await fetch(
                getApiUrl(API_CONFIG.ENDPOINTS.PROJECTS.CREATE),
                {
                    method: "POST",
                    headers: getAuthHeaders(),
                    body: JSON.stringify(newProjectData),
                },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Error creating project:", errorData);
                return {
                    success: false,
                    error: errorData.error || "Failed to create project",
                };
            }

            const data = await response.json();

            // Add to local state
            setProjects([data, ...projects]);
            return { success: true, project: data };
        } catch (err) {
            console.error("Error:", err);
            return { success: false, error: "Failed to create project" };
        }
    };

    // Update project
    const updateProject = async (
        projectId: string,
        updates: Partial<Project>,
    ) => {
        if (!user) return { success: false, error: "User not authenticated" };

        try {
            const response = await fetch(
                getApiUrl(API_CONFIG.ENDPOINTS.PROJECTS.UPDATE(projectId)),
                {
                    method: "PUT",
                    headers: getAuthHeaders(),
                    body: JSON.stringify(updates),
                },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Error updating project:", errorData);
                return {
                    success: false,
                    error: errorData.error || "Failed to update project",
                };
            }

            const data = await response.json();

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
    const deleteProject = async (projectId: string) => {
        if (!user) return { success: false, error: "User not authenticated" };

        try {
            const response = await fetch(
                getApiUrl(API_CONFIG.ENDPOINTS.PROJECTS.DELETE(projectId)),
                {
                    method: "DELETE",
                    headers: getAuthHeaders(),
                },
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Error deleting project:", errorData);
                return {
                    success: false,
                    error: errorData.error || "Failed to delete project",
                };
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
    }, [user, fetchProjects]);

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
    if (context === undefined) {
        throw new Error("useProject must be used within a ProjectProvider");
    }
    return context;
};
