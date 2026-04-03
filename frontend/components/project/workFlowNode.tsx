"use client";

import React from "react";
import { Settings, SettingsIcon, TrashIcon } from "lucide-react";
import { NodeToolbar, Position } from "@xyflow/react";
import { Button } from "../ui/button";

interface WorkFlowNodeProps {
    children: React.ReactNode;
    showToolbar?: boolean;
    name?: string;
    description?: string;
}
const WorkFlowNode = ({
    children,
    showToolbar,
    name,
    description,
}: WorkFlowNodeProps) => {
    return (
        <>
            {showToolbar && (
                <NodeToolbar>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-0.5 rounded "
                    >
                        <SettingsIcon className="size-4" />
                    </Button>{" "}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-0.5 rounded "
                    >
                        <TrashIcon className="size-4" color="red" />
                    </Button>
                </NodeToolbar>
            )}
            {children}
            {name && (
                <NodeToolbar position={Position.Bottom}>
                    <div className="text-xs text-muted-foreground">{name}</div>
                </NodeToolbar>
            )}

            {description && (
                <NodeToolbar position={Position.Bottom}>
                    <div className="text-xs text-muted-foreground">
                        {description}
                    </div>
                </NodeToolbar>
            )}
        </>
    );
};

export default WorkFlowNode;
