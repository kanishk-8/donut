"use client";
import React from "react";
import { Handle, NodeToolbar, Position } from "@xyflow/react";
import { Globe } from "lucide-react";
import { useTheme } from "next-themes";
import {
    BaseNode,
    BaseNodeHeaderTitle,
} from "@/components/react-flow/base-node";
import WorkFlowNode from "../workFlowNode";
import { NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";

const APINode = React.memo(function APINode({
    data,
    selected,
}: {
    data: { label: string; description?: string };
    selected: boolean;
}) {
    const { theme } = useTheme();

    return (
        <NodeStatusIndicator status="loading">
            <WorkFlowNode
                showToolbar={selected}
                name={data.label}
                description={data.description}
            >
                <BaseNode className="w-10 aspect-square bg-card">
                    <BaseNodeHeaderTitle>
                        <Globe className="size-4" />
                        {data.label}
                    </BaseNodeHeaderTitle>
                </BaseNode>
            </WorkFlowNode>
        </NodeStatusIndicator>
    );
});

export default APINode;
