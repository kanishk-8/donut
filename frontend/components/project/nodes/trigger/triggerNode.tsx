"use client";
import React from "react";
import { Handle, NodeToolbar, Position } from "@xyflow/react";
import { Globe, Play } from "lucide-react";
import {
    BaseNode,
    BaseNodeContent,
    BaseNodeHeaderTitle,
} from "@/components/react-flow/base-node";
import { NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";
import WorkFlowNodeWrapper from "../workFlowNode";

const TriggerNode = React.memo(function TriggerNode({
    data,
    selected,
}: {
    data: { label: string; description?: string; name: string };
    selected: boolean;
}) {
    return (
        <NodeStatusIndicator
            className="rounded-l-2xl"
            status="loading"
            variant="border"
        >
            <WorkFlowNodeWrapper
                showToolbar={selected}
                name={data.label}
                description={data.description}
            >
                <BaseNode className="w-10 rounded-l-2xl aspect-square bg-card">
                    <BaseNodeContent>
                        <Globe className="size-3" />
                        <div className="text-sm">{data.name}</div>
                    </BaseNodeContent>
                </BaseNode>
            </WorkFlowNodeWrapper>
        </NodeStatusIndicator>
    );
});

export default TriggerNode;
