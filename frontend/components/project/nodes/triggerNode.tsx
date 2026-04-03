import { memo } from "react";

import { Button } from "@/components/ui/button";
import {
    BaseNode,
    BaseNodeContent,
    BaseNodeFooter,
    BaseNodeHeader,
    BaseNodeHeaderTitle,
} from "@/components/react-flow/base-node";
import { Play, Rocket } from "lucide-react";
import { Handle, Position } from "@xyflow/react";

export const TriggerNode = memo(() => {
    return (
        <BaseNode className="w-auto h-auto  bg-card">
            <BaseNodeContent className="border-b">
                <Play className="size-4" />
            </BaseNodeContent>
            <Handle
                type="source"
                position={Position.Right}
                id="trigger-output"
            />
        </BaseNode>
    );
});

TriggerNode.displayName = "TriggerNode";
