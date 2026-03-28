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
import { API_CONFIG } from "@/lib/api-config";
import api from "@/lib/api-client";
import axios from "axios";

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

            const res = await api.get(API_CONFIG.ENDPOINTS.PROJECTS.LIST);
            const data = res.data;
            setProjects(Array.isArray(data) ? data : []);
        } catch (err: unknown) {
            console.error("Error fetching projects:", err);
            setError("Failed to load projects");
            setProjects([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Fetch specific project by ID (memoized to stabilize reference)
    const fetchProject = useCallback(
        async (projectId: string) => {
            if (!user || !projectId) return null;

            try {
                // First check if we already have it in our projects array
                const existingProject = projects.find(
                    (p) => p.id === projectId,
                );
                if (existingProject) {
                    setCurrentProject(existingProject);
                    return existingProject;
                }

                // Fetch from backend via centralized api client
                const res = await api.get(
                    API_CONFIG.ENDPOINTS.PROJECTS.GET(projectId),
                );
                const data = res.data;
                setCurrentProject(data);
                return data;
            } catch (err: unknown) {
                // If the backend returns 404, provide a fallback as before.
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    console.log("Project not found (404), creating fallback");
                } else {
                    console.log(
                        "Project fetch error or backend unavailable:",
                        err,
                    );
                }

                // Create fallback project data
                const fallbackProject: Project = {
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
        },
        [user, projects],
    );

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

            const res = await api.post(
                API_CONFIG.ENDPOINTS.PROJECTS.CREATE,
                newProjectData,
            );
            const data: Project = res.data;

            // Add to local state (use functional update to avoid stale closures)
            setProjects((prev) => [data, ...prev]);
            return { success: true, project: data };
        } catch (err: unknown) {
            console.error("Error creating project:", err);
            let message = "Failed to create project";
            if (axios.isAxiosError(err)) {
                message = (err.response?.data as any)?.error ?? message;
            }
            return { success: false, error: message };
        }
    };

    // Update project
    const updateProject = async (
        projectId: string,
        updates: Partial<Project>,
    ) => {
        if (!user) return { success: false, error: "User not authenticated" };

        try {
            const res = await api.put(
                API_CONFIG.ENDPOINTS.PROJECTS.UPDATE(projectId),
                updates,
            );
            const data: Project = res.data;

            // Update local state
            setProjects((prev) =>
                prev.map((p) => (p.id === projectId ? data : p)),
            );
            setCurrentProject((curr) =>
                curr && curr.id === projectId ? data : curr,
            );
            return { success: true, project: data };
        } catch (err: unknown) {
            console.error("Error updating project:", err);
            let message = "Failed to update project";
            if (axios.isAxiosError(err)) {
                message = (err.response?.data as any)?.error ?? message;
            }
            return { success: false, error: message };
        }
    };

    // Delete project
    const deleteProject = async (projectId: string) => {
        if (!user) return { success: false, error: "User not authenticated" };

        try {
            await api.delete(API_CONFIG.ENDPOINTS.PROJECTS.DELETE(projectId));

            // Update local state
            setProjects((prev) => prev.filter((p) => p.id !== projectId));
            setCurrentProject((curr) =>
                curr && curr.id === projectId ? null : curr,
            );

            return { success: true };
        } catch (err: unknown) {
            console.error("Error deleting project:", err);
            let message = "Failed to delete project";
            if (axios.isAxiosError(err)) {
                message = (err.response?.data as any)?.error ?? message;
            }
            return { success: false, error: message };
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (context === undefined) {
        throw new Error("useProject must be used within a ProjectProvider");
    }
    return context;
};
