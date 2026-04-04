"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Plus, Search } from "lucide-react";
import { nodeTypes } from "./nodes";

export type WorkflowNodeType = keyof typeof nodeTypes;

export type WorkflowNodeCatalogItem = {
    type: WorkflowNodeType;
    title: string;
    description: string;
    defaultData: {
        label: string;
    };
};

export const workflowNodeCatalog: WorkflowNodeCatalogItem[] = [
    {
        type: "triggerNode",
        title: "Trigger",
        description: "Starts the workflow based on an event.",
        defaultData: {
            label: "Trigger",
        },
    },
    {
        type: "apiNode",
        title: "API",
        description: "Calls an external API and handles the response.",
        defaultData: {
            label: "API Call",
        },
    },
];
type NodeSelectorProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddNode?: (type: WorkflowNodeType) => void;
};

const NodeSelector = ({ open, onOpenChange, onAddNode }: NodeSelectorProps) => {
    const [query, setQuery] = useState("");

    const filteredNodes = useMemo(() => {
        const normalized = query.trim().toLowerCase();

        if (!normalized) return workflowNodeCatalog;

        return workflowNodeCatalog.filter((node) => {
            return (
                node.title.toLowerCase().includes(normalized) ||
                node.description.toLowerCase().includes(normalized) ||
                node.type.toLowerCase().includes(normalized)
            );
        });
    }, [query]);

    return (
        <>
            {/* Overlay */}
            <div
                className={`absolute inset-0 z-40 bg-black/30 transition-opacity duration-200 ${
                    open
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0"
                }`}
                onClick={() => onOpenChange(false)}
                aria-hidden={!open}
            />

            {/* Sidebar */}
            <aside
                className={`absolute right-0 top-0 z-50 h-full w-xs border-l bg-background shadow-xl transition-transform duration-200 ${
                    open ? "translate-x-0" : "translate-x-full"
                }`}
                aria-hidden={!open}
            >
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <div>
                            <h2 className="text-sm font-semibold">Add Node</h2>
                            <p className="text-xs text-muted-foreground">
                                Search and add workflow nodes
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onOpenChange(false)}
                            aria-label="Close sidebar"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="border-b p-3">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search nodes..."
                                className="pl-8"
                            />
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="space-y-2 p-3">
                            {filteredNodes.map((node) => (
                                <div
                                    key={node.type}
                                    className="rounded-lg border bg-card p-3 text-card-foreground"
                                >
                                    <div className="mb-1 flex items-center justify-between gap-2">
                                        <h3 className="text-sm font-medium leading-none">
                                            {node.title}
                                        </h3>
                                        <span className="rounded-md border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                            {node.type}
                                        </span>
                                    </div>

                                    <p className="mb-3 text-xs text-muted-foreground">
                                        {node.description}
                                    </p>

                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="secondary"
                                        className="h-7 gap-1.5 text-xs"
                                        onClick={() => onAddNode?.(node.type)}
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Add
                                    </Button>
                                </div>
                            ))}

                            {filteredNodes.length === 0 && (
                                <div className="rounded-lg border border-dashed p-4 text-center">
                                    <p className="text-xs text-muted-foreground">
                                        No nodes found for “{query}”.
                                    </p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </aside>
        </>
    );
};

export default NodeSelector;
