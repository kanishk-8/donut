"use client";

import type { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { PlaceholderNode } from "@/components/react-flow/placeholder-node";

type InitialNodeData = {
    label?: string;
    onOpenNodeSelector?: () => void;
};

const InitialNode = ({ data }: NodeProps) => {
    const nodeData = data as InitialNodeData;
    return (
        <PlaceholderNode onClick={() => nodeData.onOpenNodeSelector?.()}>
            <div className="cursor-pointer flex items-center justify-center">
                <PlusIcon className="size-4" />
            </div>
        </PlaceholderNode>
    );
};

export default InitialNode;
