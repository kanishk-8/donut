"use client";
import React, { useCallback, useState } from "react";
import { useTheme } from "@/context/themecontext";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  MiniMap,
  Background,
  Panel,
  Handle,
  Position,
} from "@xyflow/react";
import {
  MessageSquare,
  Phone,
  Bot,
  Database,
  Zap,
  Filter,
  Plus,
  Play,
  Save,
  Download,
} from "lucide-react";

import "@xyflow/react/dist/style.css";

// Custom node types
const nodeTypes = {
  chatNode: ({ data }) => (
    <div className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg border-2 border-blue-600 relative">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        <span className="text-sm font-medium">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  ),
  voiceNode: ({ data }) => (
    <div className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow-lg border-2 border-purple-600 relative">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4" />
        <span className="text-sm font-medium">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  ),
  aiNode: ({ data }) => (
    <div className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg border-2 border-green-600 relative">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center gap-2">
        <Bot className="w-4 h-4" />
        <span className="text-sm font-medium">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  ),
  dataNode: ({ data }) => (
    <div className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow-lg border-2 border-orange-600 relative">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center gap-2">
        <Database className="w-4 h-4" />
        <span className="text-sm font-medium">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  ),
  triggerNode: ({ data }) => (
    <div className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-lg border-2 border-yellow-600 relative">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4" />
        <span className="text-sm font-medium">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  ),
  conditionNode: ({ data }) => (
    <div className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg border-2 border-red-600 relative">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      {/* Condition nodes can have multiple outputs */}
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        className="w-3 h-3"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="false"
        className="w-3 h-3"
      />
    </div>
  ),
};

const initialNodes = [
  {
    id: "1",
    type: "triggerNode",
    position: { x: 100, y: 100 },
    data: { label: "Customer Message" },
  },
  {
    id: "2",
    type: "aiNode",
    position: { x: 100, y: 200 },
    data: { label: "AI Processing" },
  },
  {
    id: "3",
    type: "chatNode",
    position: { x: 100, y: 300 },
    data: { label: "Send Response" },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", animated: true },
];

const nodeCategories = [
  {
    category: "Triggers",
    nodes: [
      {
        type: "triggerNode",
        label: "Trigger",
        icon: Zap,
        color: "bg-yellow-500",
      },
      {
        type: "chatNode",
        label: "Chat Input",
        icon: MessageSquare,
        color: "bg-blue-500",
      },
      {
        type: "voiceNode",
        label: "Voice Input",
        icon: Phone,
        color: "bg-purple-500",
      },
    ],
  },
  {
    category: "Processing",
    nodes: [
      { type: "aiNode", label: "AI Agent", icon: Bot, color: "bg-green-500" },
      {
        type: "conditionNode",
        label: "Condition",
        icon: Filter,
        color: "bg-red-500",
      },
      {
        type: "dataNode",
        label: "Database",
        icon: Database,
        color: "bg-orange-500",
      },
    ],
  },
];

export default function WorkflowPage() {
  const { theme } = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeId, setNodeId] = useState(4);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      const label = event.dataTransfer.getData("application/label");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = {
        x: event.clientX - 250,
        y: event.clientY - 100,
      };
      const newNode = {
        id: `${nodeId}`,
        type,
        position,
        data: { label },
      };

      setNodes((nds) => nds.concat(newNode));
      setNodeId((id) => id + 1);
    },
    [nodeId, setNodes]
  );

  const onDragStart = (event, nodeType, label) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("application/label", label);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={`h-screen overflow-hidden ${
        theme === "dark" ? "bg-black" : "bg-white"
      }`}
    >
      {/* Header */}
      <div
        className={`h-16 backdrop-blur-3xl border-b flex items-center justify-between px-6 ${
          theme === "dark"
            ? "bg-black/20 border-white/10"
            : "bg-white/90 border-gray-200"
        }`}
      >
        <div>
          <h1
            className={`text-xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Workflow Builder
          </h1>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Design your customer service automation flow
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm border ${
              theme === "dark"
                ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                : "bg-gray-100/70 border-gray-200 text-gray-700 hover:bg-gray-200/70"
            }`}
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm border ${
              theme === "dark"
                ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                : "bg-gray-100/70 border-gray-200 text-gray-700 hover:bg-gray-200/70"
            }`}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-lg">
            <Play className="w-4 h-4" />
            Test Flow
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div
          className={`w-64 backdrop-blur-3xl border-r overflow-y-auto ${
            theme === "dark"
              ? "bg-black/20 border-white/10"
              : "bg-white/90 border-gray-200"
          }`}
        >
          <div className="p-4">
            <h2
              className={`text-lg font-semibold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Components
            </h2>
            {nodeCategories.map((category) => (
              <div key={category.category} className="mb-6">
                <h3
                  className={`text-sm font-medium mb-3 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.nodes.map((node) => (
                    <div
                      key={node.type}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-grab backdrop-blur-sm border transition-all duration-200 hover:scale-105 ${
                        theme === "dark"
                          ? "bg-white/10 border-white/20 hover:bg-white/20"
                          : "bg-gray-100/70 border-gray-200 hover:bg-gray-200/70"
                      }`}
                      draggable
                      onDragStart={(event) =>
                        onDragStart(event, node.type, node.label)
                      }
                    >
                      <div className={`p-2 rounded ${node.color} text-white`}>
                        <node.icon className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {node.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Flow Area */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            className={theme === "dark" ? "dark" : ""}
            fitView
          >
            <Controls
              className={`${
                theme === "dark" ? "bg-black/20 border-white/10" : "bg-white/90"
              } backdrop-blur-3xl`}
            />
            <MiniMap
              className={`${
                theme === "dark" ? "bg-black/20 border-white/10" : "bg-white/90"
              } backdrop-blur-3xl`}
              nodeColor={(node) => {
                switch (node.type) {
                  case "chatNode":
                    return "#3b82f6";
                  case "voiceNode":
                    return "#8b5cf6";
                  case "aiNode":
                    return "#10b981";
                  case "dataNode":
                    return "#f59e0b";
                  case "triggerNode":
                    return "#eab308";
                  case "conditionNode":
                    return "#ef4444";
                  default:
                    return "#6b7280";
                }
              }}
            />
            <Background
              variant="dots"
              gap={20}
              size={1}
              color={theme === "dark" ? "#374151" : "#d1d5db"}
            />
            <Panel position="top-right">
              <div
                className={`backdrop-blur-3xl rounded-lg p-3 border ${
                  theme === "dark"
                    ? "bg-black/20 border-white/10"
                    : "bg-white/90 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span
                    className={`text-sm ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Flow Active
                  </span>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
