"use client";
import React, { useCallback, useMemo, useState } from "react";
import {
    ReactFlow,
    Background,
    MiniMap,
    addEdge,
    Position,
    Panel,
    type Edge,
    type Node,
    type NodeChange,
    type EdgeChange,
    type Connection,
    applyNodeChanges,
    applyEdgeChanges,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import { Sidebar } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { nodeTypes } from "@/components/project/nodes";
import { ZoomSlider } from "@/components/react-flow/zoom-slider";
import { NodeSearch } from "@/components/react-flow/node-search";
import WorkflowSidebar, {
    workflowNodeCatalog,
    WorkflowNodeType,
} from "@/components/project/nodeselector";

const nodeDefaults = {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
};

const initialEdges: Edge[] = [];

const Flow = () => {
    const [sideBarOpen, setSidebarOpen] = useState(false);

    const initialNodes = useMemo<Node[]>(
        () => [
            {
                id: "1",
                position: { x: 0, y: 150 },
                type: "initialNode",
                data: {
                    label: "add node",
                    onOpenNodeSelector: () => setSidebarOpen(true),
                },
                ...nodeDefaults,
            },
        ],
        [],
    );

    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) =>
            setNodes((nodesSnapshot) =>
                applyNodeChanges(changes, nodesSnapshot),
            ),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) =>
            setEdges((edgesSnapshot) =>
                applyEdgeChanges(changes, edgesSnapshot),
            ),
        [],
    );
    const onConnect = useCallback(
        (params: Connection) =>
            setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );
    const onAddNode = useCallback((type: WorkflowNodeType) => {
        const catalogItem = workflowNodeCatalog.find(
            (item) => item.type === type,
        );
        if (!catalogItem) return;

        setNodes((prev) => {
            const initial = prev.find((n) => n.type === "initialNode");
            const baseX = initial?.position.x ?? 0;
            const baseY = initial?.position.y ?? 150;

            const nextNode: Node = {
                id: crypto.randomUUID(),
                type,
                position: { x: baseX + 280, y: baseY },
                data: { ...catalogItem.defaultData },
                ...nodeDefaults,
            };

            const withoutInitial = prev.filter((n) => n.type !== "initialNode");
            return [...withoutInitial, nextNode];
        });

        setSidebarOpen(false);
    }, []);
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
                        setSidebarOpen((open) => !open);
                    }}
                >
                    <HugeiconsIcon icon={Sidebar} className="h-6 w-6" />
                </button>
            </Panel>
            <WorkflowSidebar
                open={sideBarOpen}
                onOpenChange={setSidebarOpen}
                onAddNode={onAddNode}
            />
        </ReactFlow>
    );
};

export default Flow;
