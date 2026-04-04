"use client";

import React from "react";
import { SettingsIcon, TrashIcon } from "lucide-react";
import { NodeToolbar, Position } from "@xyflow/react";
import { Button } from "../../ui/button";

interface WorkFlowNodeProps {
    children: React.ReactNode;
    showToolbar?: boolean;
    name?: string;
    description?: string;
    onSettings?: () => void;
    onDelete?: () => void;
}
const WorkFlowNodeWrapper = ({
    children,
    showToolbar,
    name,
    description,
    onSettings,
    onDelete,
}: WorkFlowNodeProps) => {
    return (
        <>
            {showToolbar && (
                <NodeToolbar>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-0.5 rounded "
                        onClick={() => onSettings}
                    >
                        <SettingsIcon className="size-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-0.5 rounded "
                        onClick={() => onDelete}
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

export default WorkFlowNodeWrapper;
