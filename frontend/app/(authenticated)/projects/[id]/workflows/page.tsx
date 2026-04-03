"use client";
import React, { useCallback } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Position,
    Panel,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import { Sidebar } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { nodeTypes } from "@/components/project/nodes";
import { ZoomSlider } from "@/components/react-flow/zoom-slider";
import { NodeSearch } from "@/components/react-flow/node-search";

const nodeDefaults = {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
};

const initialNodes = [
    {
        id: "1",
        position: { x: 0, y: 150 },
        type: "triggerNode", // using the custom node type
        data: { label: "default style 1" },
        ...nodeDefaults,
    },
    {
        id: "2",
        position: { x: 250, y: 0 },
        type: "apiNode",
        data: { label: "api" },
        ...nodeDefaults,
    },
    {
        id: "3",
        position: { x: 250, y: 150 },
        type: "initialNode",
        data: { label: "default style 3" },
        ...nodeDefaults,
    },
    {
        id: "4",
        position: { x: 250, y: 300 },
        data: { label: "default style 4" },
        ...nodeDefaults,
    },
];

const initialEdges = [
    {
        id: "e1-2",
        source: "1",
        target: "2",
        animated: true,
    },
    {
        id: "e1-3",
        source: "1",
        target: "3",
    },
    {
        id: "e1-4",
        source: "1",
        target: "4",
    },
];

const Flow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: any) => setEdges((els) => addEdge(params, els)),
        [],
    );
    const { theme } = useTheme();
    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            colorMode={theme === "dark" ? "dark" : "light"}
            panOnScroll={false}
            selectionOnDrag
            snapGrid={[10, 10]}
            snapToGrid
        >
            <Background />
            <ZoomSlider position="bottom-center" orientation={"horizontal"} />
            <Panel position="top-left" className="w-max-10 w-5">
                <NodeSearch />
            </Panel>
            <MiniMap />
            <Panel position="top-right">
                <button
                    onClick={() => {
                        console.log("clicked");
                    }}
                >
                    <HugeiconsIcon icon={Sidebar} className="h-6 w-6" />
                </button>
            </Panel>
        </ReactFlow>
    );
};

export default Flow;
