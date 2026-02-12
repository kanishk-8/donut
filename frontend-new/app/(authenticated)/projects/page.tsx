"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProject } from "@/context/projectcontext";
import {
    Plus,
    FolderOpen,
    Calendar,
    ArrowRight,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const ProjectsPage = () => {
    const router = useRouter();
    const { projects, loading, error, createProject, fetchProjects } =
        useProject();

    const [newProject, setNewProject] = useState({
        name: "",
        description: "",
        type: "Chatbot",
    });
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState("");

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProject.name.trim()) return;

        try {
            setCreateError("");
            const result = await createProject({
                name: newProject.name,
                description: newProject.description,
                type: newProject.type,
            });

            if (result.success) {
                setNewProject({ name: "", description: "", type: "Chatbot" });
                setIsCreating(false);
            } else {
                setCreateError(result.error || "Failed to create project");
            }
        } catch (err) {
            console.error("Error:", err);
            setCreateError("Failed to create project");
        }
    };

    const navigateToProject = (projectId: string) => {
        router.push(`/projects/${projectId}/dashboard`);
    };

    const getStatusVariant = (
        status: string,
    ): "default" | "secondary" | "outline" => {
        switch (status) {
            case "Active":
                return "default";
            case "Development":
                return "secondary";
            default:
                return "outline";
        }
    };

    const getTypeVariant = (
        type: string,
    ): "default" | "secondary" | "outline" => {
        switch (type) {
            case "Chatbot":
                return "default";
            case "Voice AI":
                return "secondary";
            case "API Integration":
                return "outline";
            default:
                return "outline";
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8  pt-16 md:pt-20 bg-background">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                            My Projects
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            Create and manage your AI customer service projects
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsCreating(true)}
                        size="lg"
                        className="w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        <span className="sm:hidden">New Project</span>
                        <span className="hidden sm:inline">
                            Create New Project
                        </span>
                    </Button>
                </div>

                {/* Create Project Modal */}
                {isCreating && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <Card className="w-full max-w-md mx-4">
                            <CardHeader>
                                <CardTitle className="text-lg sm:text-xl">
                                    Create New Project
                                </CardTitle>
                                {createError && (
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                                        <AlertCircle className="h-4 w-4" />
                                        {createError}
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleCreateProject}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="project-name">
                                            Project Name *
                                        </Label>
                                        <Input
                                            id="project-name"
                                            type="text"
                                            value={newProject.name}
                                            onChange={(e) =>
                                                setNewProject({
                                                    ...newProject,
                                                    name: e.target.value,
                                                })
                                            }
                                            placeholder="Enter project name"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="project-type">
                                            Project Type
                                        </Label>
                                        <select
                                            id="project-type"
                                            value={newProject.type}
                                            onChange={(e) =>
                                                setNewProject({
                                                    ...newProject,
                                                    type: e.target.value,
                                                })
                                            }
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="Chatbot">
                                                Chatbot
                                            </option>
                                            <option value="Voice AI">
                                                Voice AI
                                            </option>
                                            <option value="API Integration">
                                                API Integration
                                            </option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="project-description">
                                            Description
                                        </Label>
                                        <textarea
                                            id="project-description"
                                            value={newProject.description}
                                            onChange={(e) =>
                                                setNewProject({
                                                    ...newProject,
                                                    description: e.target.value,
                                                })
                                            }
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Enter project description"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                        <Button
                                            type="submit"
                                            className="flex-1"
                                        >
                                            Create Project
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setIsCreating(false);
                                                setCreateError("");
                                                setNewProject({
                                                    name: "",
                                                    description: "",
                                                    type: "Chatbot",
                                                });
                                            }}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Projects Grid */}
                {loading ? (
                    <Card className="text-center py-12">
                        <CardContent className="flex flex-col items-center gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">
                                Loading your projects...
                            </p>
                        </CardContent>
                    </Card>
                ) : error ? (
                    <Card className="text-center py-12">
                        <CardContent className="flex flex-col items-center gap-4">
                            <AlertCircle className="w-12 h-12 text-destructive" />
                            <div>
                                <h3 className="text-xl font-medium mb-2 text-foreground">
                                    {error}
                                </h3>
                                <Button
                                    onClick={fetchProjects}
                                    variant="default"
                                    className="mt-4"
                                >
                                    Try Again
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : projects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {projects.map((project) => (
                            <Card
                                key={project.id}
                                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                                onClick={() => navigateToProject(project.id)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="p-2 sm:p-3 rounded-full bg-primary text-primary-foreground">
                                            <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2">
                                            <Badge
                                                variant={getTypeVariant(
                                                    project.type,
                                                )}
                                            >
                                                {project.type}
                                            </Badge>
                                            <Badge
                                                variant={getStatusVariant(
                                                    project.status,
                                                )}
                                            >
                                                {project.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg sm:text-xl">
                                        {project.name}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {project.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span>
                                                {new Date(
                                                    project.created_at,
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-primary font-medium text-sm">
                                            <span>Open Dashboard</span>
                                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="text-center py-12">
                        <CardContent className="flex flex-col items-center gap-4">
                            <div className="text-6xl mb-4">📁</div>
                            <div>
                                <h3 className="text-xl font-medium mb-2">
                                    No Projects yet
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Create your first AI customer service
                                    project to get started
                                </p>
                                <Button
                                    onClick={() => setIsCreating(true)}
                                    size="lg"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Create Your First Project
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ProjectsPage;
