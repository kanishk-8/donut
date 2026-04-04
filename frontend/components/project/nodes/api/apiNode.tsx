"use client";
import React from "react";
import { Handle, NodeToolbar, Position } from "@xyflow/react";
import { Globe } from "lucide-react";
import {
    BaseNode,
    BaseNodeHeaderTitle,
} from "@/components/react-flow/base-node";
import { NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";
import WorkFlowNodeWrapper from "../workFlowNode";

const APINode = React.memo(function APINode({
    data,
    selected,
}: {
    data: { label: string; description?: string };
    selected: boolean;
}) {
    return (
        <NodeStatusIndicator status="loading" variant="border">
            <WorkFlowNodeWrapper
                showToolbar={selected}
                name={data.label}
                description={data.description}
            >
                <BaseNode className="w-10 aspect-square bg-card">
                    <BaseNodeHeaderTitle>
                        <Globe className="size-2" />
                    </BaseNodeHeaderTitle>
                </BaseNode>
            </WorkFlowNodeWrapper>
        </NodeStatusIndicator>
    );
});

export default APINode;
