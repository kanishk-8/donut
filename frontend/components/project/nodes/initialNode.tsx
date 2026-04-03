import { PlaceholderNode } from "@/components/react-flow/placeholder-node";
import { memo } from "react";

const InitialNode = memo(() => {
    return (
        <PlaceholderNode>
            <div>+</div>
        </PlaceholderNode>
    );
});

export default InitialNode;
