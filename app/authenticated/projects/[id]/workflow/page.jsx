"use client";
import React, { useCallback, useState, useRef } from "react";
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
  ReactFlowProvider,
} from "@xyflow/react";
import {
  MessageSquare,
  Phone,
  Bot,
  Database,
  Zap,
  Filter,
  Play,
  Save,
  Download,
  Settings,
  Code,
  Edit3,
  Trash2,
  Copy,
  Link,
  Globe,
  Key,
  Calendar,
  Sidebar,
} from "lucide-react";

import "@xyflow/react/dist/style.css";

// Custom node types with proper theming
const nodeTypes = {
  chatNode: React.memo(function ChatNode({ data, selected }) {
    const { theme } = useTheme();
    return (
      <div
        className={`group relative backdrop-blur-3xl rounded-2xl shadow-lg transition-all duration-200 min-w-[180px] hover:scale-105 border ${
          selected
            ? theme === "dark"
              ? "ring-2 ring-indigo-500 bg-black/20 border-indigo-500/50"
              : "ring-2 ring-indigo-500 bg-white/90 border-indigo-500/50"
            : theme === "dark"
              ? "bg-black/20 border-white/10"
              : "bg-white/90 border-gray-200"
        }`}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-gray-400 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-500"
        />

        <div className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3
                className={`font-medium text-sm ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {data.label}
              </h3>
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Chat Input
              </p>
            </div>
          </div>

          {data.description && (
            <p
              className={`text-xs mt-2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {data.description}
            </p>
          )}
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-gray-400 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-500"
        />
      </div>
    );
  }),

  voiceNode: React.memo(function VoiceNode({ data, selected }) {
    const { theme } = useTheme();
    return (
      <div
        className={`group relative backdrop-blur-3xl rounded-2xl shadow-lg transition-all duration-200 min-w-[180px] hover:scale-105 border ${
          selected
            ? theme === "dark"
              ? "ring-2 ring-purple-500 bg-black/20 border-purple-500/50"
              : "ring-2 ring-purple-500 bg-white/90 border-purple-500/50"
            : theme === "dark"
              ? "bg-black/20 border-white/10"
              : "bg-white/90 border-gray-200"
        }`}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-gray-400 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-500"
        />

        <div className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3
                className={`font-medium text-sm ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {data.label}
              </h3>
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Voice Input
              </p>
            </div>
          </div>

          {data.description && (
            <p
              className={`text-xs mt-2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {data.description}
            </p>
          )}
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-gray-400 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-500"
        />
      </div>
    );
  }),

  aiNode: React.memo(function AiNode({ data, selected }) {
    const { theme } = useTheme();
    return (
      <div
        className={`group relative backdrop-blur-3xl rounded-2xl shadow-lg transition-all duration-200 min-w-[180px] hover:scale-105 border ${
          selected
            ? theme === "dark"
              ? "ring-2 ring-emerald-500 bg-black/20 border-emerald-500/50"
              : "ring-2 ring-emerald-500 bg-white/90 border-emerald-500/50"
            : theme === "dark"
              ? "bg-black/20 border-white/10"
              : "bg-white/90 border-gray-200"
        }`}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-gray-400 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-500"
        />

        <div className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3
                className={`font-medium text-sm ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {data.label}
              </h3>
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                AI Agent
              </p>
            </div>
          </div>

          {data.description && (
            <p
              className={`text-xs mt-2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {data.description}
            </p>
          )}
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-gray-400 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-500"
        />
      </div>
    );
  }),

  dataNode: React.memo(function DataNode({ data, selected }) {
    const { theme } = useTheme();
    return (
      <div
        className={`group relative backdrop-blur-3xl rounded-2xl shadow-lg transition-all duration-200 min-w-[180px] hover:scale-105 border ${
          selected
            ? theme === "dark"
              ? "ring-2 ring-blue-500 bg-black/20 border-blue-500/50"
              : "ring-2 ring-blue-500 bg-white/90 border-blue-500/50"
            : theme === "dark"
              ? "bg-black/20 border-white/10"
              : "bg-white/90 border-gray-200"
        }`}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-gray-400 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-500"
        />

        <div className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3
                className={`font-medium text-sm ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {data.label}
              </h3>
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Database
              </p>
            </div>
          </div>

          {data.description && (
            <p
              className={`text-xs mt-2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {data.description}
            </p>
          )}
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-gray-400 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-500"
        />
      </div>
    );
  }),

  triggerNode: React.memo(function TriggerNode({ data, selected }) {
    const { theme } = useTheme();
    return (
      <div
        className={`group relative backdrop-blur-3xl rounded-2xl shadow-lg transition-all duration-200 min-w-[180px] hover:scale-105 border ${
          selected
            ? theme === "dark"
              ? "ring-2 ring-indigo-500 bg-black/20 border-indigo-500/50"
              : "ring-2 ring-indigo-500 bg-white/90 border-indigo-500/50"
            : theme === "dark"
              ? "bg-black/20 border-white/10"
              : "bg-white/90 border-gray-200"
        }`}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-gray-400 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-500"
        />

        <div className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3
                className={`font-medium text-sm ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {data.label}
              </h3>
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Trigger
              </p>
            </div>
          </div>

          {data.description && (
            <p
              className={`text-xs mt-2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {data.description}
            </p>
          )}
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-gray-400 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-500"
        />
      </div>
    );
  }),

  conditionNode: React.memo(function ConditionNode({ data, selected }) {
    const { theme } = useTheme();
    return (
      <div
        className={`group relative backdrop-blur-3xl rounded-2xl shadow-lg transition-all duration-200 min-w-[180px] hover:scale-105 border ${
          selected
            ? theme === "dark"
              ? "ring-2 ring-purple-500 bg-black/20 border-purple-500/50"
              : "ring-2 ring-purple-500 bg-white/90 border-purple-500/50"
            : theme === "dark"
              ? "bg-black/20 border-white/10"
              : "bg-white/90 border-gray-200"
        }`}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-gray-400 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-500"
        />

        <div className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3
                className={`font-medium text-sm ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {data.label}
              </h3>
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Condition
              </p>
            </div>
          </div>

          {data.description && (
            <p
              className={`text-xs mt-2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {data.description}
            </p>
          )}
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-gray-400 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-500"
        />
        <Handle
          type="source"
          position={Position.Right}
          id="true"
          className="w-3 h-3 bg-gray-400 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-500"
        />
        <Handle
          type="source"
          position={Position.Left}
          id="false"
          className="w-3 h-3 bg-gray-400 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-500"
        />
      </div>
    );
  }),

  codeNode: React.memo(function CodeNode({ data, selected }) {
    const { theme } = useTheme();
    return (
      <div
        className={`group relative backdrop-blur-3xl rounded-2xl shadow-lg transition-all duration-200 min-w-[180px] hover:scale-105 border ${
          selected
            ? theme === "dark"
              ? "ring-2 ring-emerald-500 bg-black/20 border-emerald-500/50"
              : "ring-2 ring-emerald-500 bg-white/90 border-emerald-500/50"
            : theme === "dark"
              ? "bg-black/20 border-white/10"
              : "bg-white/90 border-gray-200"
        }`}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-gray-400 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-500"
        />

        <div className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3
                className={`font-medium text-sm ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {data.label}
              </h3>
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Code
              </p>
            </div>
          </div>

          {data.description && (
            <p
              className={`text-xs mt-2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {data.description}
            </p>
          )}
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-gray-400 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-500"
        />
      </div>
    );
  }),
};

const initialNodes = [
  {
    id: "1",
    type: "triggerNode",
    position: { x: 100, y: 100 },
    data: {
      label: "Start",
      description: "When a customer sends a message",
    },
  },
  {
    id: "2",
    type: "aiNode",
    position: { x: 100, y: 250 },
    data: {
      label: "AI Agent",
      description: "Process customer message with AI",
    },
  },
  {
    id: "3",
    type: "chatNode",
    position: { x: 100, y: 400 },
    data: {
      label: "Send Response",
      description: "Reply to customer",
    },
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "smoothstep",
    style: { stroke: "#6b7280", strokeWidth: 2 },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    type: "smoothstep",
    style: { stroke: "#6b7280", strokeWidth: 2 },
  },
];

const nodeCategories = [
  {
    category: "Triggers",
    nodes: [
      {
        type: "triggerNode",
        label: "Manual Trigger",
        icon: Zap,
        description: "Manually trigger workflow",
      },
      {
        type: "chatNode",
        label: "Chat Webhook",
        icon: MessageSquare,
        description: "Receive chat messages",
      },
      {
        type: "voiceNode",
        label: "Voice Webhook",
        icon: Phone,
        description: "Receive voice calls",
      },
    ],
  },
  {
    category: "Actions",
    nodes: [
      {
        type: "aiNode",
        label: "AI Agent",
        icon: Bot,
        description: "Process with AI",
      },
      {
        type: "codeNode",
        label: "Code",
        icon: Code,
        description: "Execute custom code",
      },
      {
        type: "dataNode",
        label: "Database",
        icon: Database,
        description: "Query database",
      },
    ],
  },
  {
    category: "Logic",
    nodes: [
      {
        type: "conditionNode",
        label: "IF",
        icon: Filter,
        description: "Conditional logic",
      },
    ],
  },
  {
    category: "Communication",
    nodes: [
      {
        type: "chatNode",
        label: "Send Message",
        icon: MessageSquare,
        description: "Send chat message",
      },
      {
        type: "voiceNode",
        label: "Make Call",
        icon: Phone,
        description: "Make voice call",
      },
    ],
  },
];

function WorkflowPage() {
  const { theme } = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeId, setNodeId] = useState(4);
  const [selectedNode, setSelectedNode] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("nodes");
  const reactFlowWrapper = useRef(null);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            style: { stroke: "#6b7280", strokeWidth: 2 },
          },
          eds,
        ),
      ),
    [setEdges],
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
      const description = event.dataTransfer.getData("application/description");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      // Calculate position relative to the ReactFlow wrapper
      const position = {
        x: event.clientX - reactFlowBounds.left - 200,
        y: event.clientY - reactFlowBounds.top - 100,
      };

      const newNode = {
        id: `${nodeId}`,
        type,
        position,
        data: { label, description },
      };

      setNodes((nds) => nds.concat(newNode));
      setNodeId((id) => id + 1);
    },
    [nodeId, setNodes],
  );

  const onDragStart = useCallback((event, nodeType, label, description) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("application/label", label);
    event.dataTransfer.setData("application/description", description);
    event.dataTransfer.effectAllowed = "move";
  }, []);

  const handleSave = useCallback(() => {
    const flowData = { nodes, edges };
    console.log("Saving workflow:", flowData);
  }, [nodes, edges]);

  const handleExport = useCallback(() => {
    const flowData = { nodes, edges };
    const dataStr = JSON.stringify(flowData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "workflow.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  }, [nodes, edges]);

  const handleTestFlow = useCallback(() => {
    console.log("Testing workflow with nodes:", nodes, "and edges:", edges);
  }, [nodes, edges]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setActiveTab("config");
    setSidebarCollapsed(false);
  }, []);

  const onPaneClick = useCallback(() => {
    if (activeTab === "config") {
      setActiveTab("nodes");
      setSelectedNode(null);
    }
  }, [activeTab]);

  const handleDeleteNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            edge.source !== selectedNode.id && edge.target !== selectedNode.id,
        ),
      );
      setActiveTab("nodes");
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  const handleDuplicateNode = useCallback(() => {
    if (selectedNode) {
      const newNode = {
        ...selectedNode,
        id: `${nodeId}`,
        position: {
          x: selectedNode.position.x + 50,
          y: selectedNode.position.y + 50,
        },
        data: {
          ...selectedNode.data,
          label: `${selectedNode.data.label} Copy`,
        },
      };
      setNodes((nds) => nds.concat(newNode));
      setNodeId((id) => id + 1);
      setActiveTab("nodes");
    }
  }, [selectedNode, nodeId, setNodes]);

  const handleUpdateNodeData = useCallback(
    (field, value) => {
      if (selectedNode) {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === selectedNode.id
              ? {
                  ...node,
                  data: { ...node.data, [field]: value },
                }
              : node,
          ),
        );
        setSelectedNode((prev) => ({
          ...prev,
          data: { ...prev.data, [field]: value },
        }));
      }
    },
    [selectedNode, setNodes],
  );

  const getNodeTypeConfig = (nodeType) => {
    const configs = {
      triggerNode: {
        title: "Trigger Configuration",
        fields: [
          { key: "webhookUrl", label: "Webhook URL", type: "text", icon: Link },
          {
            key: "method",
            label: "HTTP Method",
            type: "select",
            options: ["POST", "GET", "PUT"],
            icon: Globe,
          },
        ],
      },
      chatNode: {
        title: "Chat Configuration",
        fields: [
          {
            key: "message",
            label: "Message Template",
            type: "textarea",
            icon: MessageSquare,
          },
          { key: "channelId", label: "Channel ID", type: "text", icon: Key },
        ],
      },
      voiceNode: {
        title: "Voice Configuration",
        fields: [
          {
            key: "phoneNumber",
            label: "Phone Number",
            type: "text",
            icon: Phone,
          },
          {
            key: "script",
            label: "Voice Script",
            type: "textarea",
            icon: MessageSquare,
          },
        ],
      },
      aiNode: {
        title: "AI Agent Configuration",
        fields: [
          {
            key: "model",
            label: "AI Model",
            type: "select",
            options: ["GPT-4", "GPT-3.5", "Claude"],
            icon: Bot,
          },
          {
            key: "prompt",
            label: "System Prompt",
            type: "textarea",
            icon: Edit3,
          },
        ],
      },
      dataNode: {
        title: "Database Configuration",
        fields: [
          {
            key: "query",
            label: "SQL Query",
            type: "textarea",
            icon: Database,
          },
          {
            key: "timeout",
            label: "Timeout (ms)",
            type: "number",
            icon: Calendar,
          },
        ],
      },
      conditionNode: {
        title: "Condition Configuration",
        fields: [
          {
            key: "condition",
            label: "Condition Logic",
            type: "textarea",
            icon: Filter,
          },
        ],
      },
      codeNode: {
        title: "Code Configuration",
        fields: [
          {
            key: "language",
            label: "Language",
            type: "select",
            options: ["JavaScript", "Python", "Go"],
            icon: Code,
          },
          { key: "code", label: "Code", type: "textarea", icon: Edit3 },
        ],
      },
    };
    return configs[nodeType] || { title: "Node Configuration", fields: [] };
  };

  return (
    <ReactFlowProvider>
      <div
        className={`h-screen overflow-hidden ${
          theme === "dark" ? "bg-gray-950" : "bg-gray-50"
        }`}
      >
        {/* Floating Sidebar Toggle - Only when closed */}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className={`fixed top-4 right-4 z-30 p-3 rounded-xl shadow-lg transition-all duration-200 hover:scale-110 backdrop-blur-3xl border ${
              theme === "dark"
                ? "bg-black/20 border-white/10 text-white hover:bg-white/20"
                : "bg-white/90 border-gray-200 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Sidebar className="w-5 h-5" />
          </button>
        )}

        <div className="flex h-screen relative">
          {/* Main Flow Area */}
          <div className="flex-1 relative" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              className={theme === "dark" ? "dark" : ""}
              style={{
                backgroundColor: theme === "dark" ? "#030712" : "#f9fafb",
              }}
              fitView
              snapToGrid={true}
              snapGrid={[20, 20]}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              minZoom={0.1}
              maxZoom={2}
              attributionPosition="bottom-left"
              connectionLineStyle={{ stroke: "#6b7280", strokeWidth: 2 }}
              defaultEdgeOptions={{
                type: "smoothstep",
                style: { stroke: "#6b7280", strokeWidth: 2 },
              }}
            >
              <Controls
                className={`${
                  theme === "dark"
                    ? "!bg-black/20 !border-white/10"
                    : "!bg-white/90 !border-gray-200"
                } backdrop-blur-3xl rounded-xl border shadow-lg`}
              />
              <MiniMap
                className={`${
                  theme === "dark"
                    ? "!bg-black/20 !border-white/10"
                    : "!bg-white/90 !border-gray-200"
                } backdrop-blur-3xl rounded-xl border shadow-lg`}
                nodeColor={() => "#6366f1"}
                maskColor={
                  theme === "dark"
                    ? "rgba(0, 0, 0, 0.6)"
                    : "rgba(255, 255, 255, 0.6)"
                }
                pannable
                zoomable
              />
              <Background
                variant="dots"
                gap={20}
                size={1}
                color={theme === "dark" ? "#1f2937" : "#d1d5db"}
              />
              <Panel position="top-left">
                <div
                  className={`backdrop-blur-3xl rounded-xl p-3 border shadow-lg ${
                    theme === "dark"
                      ? "bg-black/20 border-white/10"
                      : "bg-white/90 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Workflow Active
                    </span>
                  </div>
                </div>
              </Panel>
            </ReactFlow>
          </div>

          {/* Right Sidebar */}
          {!sidebarCollapsed && (
            <div
              className={`w-80 backdrop-blur-3xl border-l overflow-hidden flex flex-col transition-all duration-300 ${
                theme === "dark"
                  ? "bg-black text-white border-white/10"
                  : "bg-white text-gray-900 border-gray-200"
              }`}
            >
              {/* Sidebar Header */}
              <div
                className={`p-4 border-b ${theme === "dark" ? "border-white/10" : "border-gray-200"}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className={`text-lg font-semibold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Workflow Tools
                  </h2>
                  <button
                    onClick={() => setSidebarCollapsed(true)}
                    className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                      theme === "dark"
                        ? "hover:bg-white/10 text-white"
                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Sidebar className="w-4 h-4" />
                  </button>
                </div>

                {/* Toolbar Actions */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button
                    onClick={handleSave}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                      theme === "dark"
                        ? "text-white hover:bg-white/10"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    <span className="text-xs font-medium">Save</span>
                  </button>
                  <button
                    onClick={handleExport}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                      theme === "dark"
                        ? "text-white hover:bg-white/10"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-xs font-medium">Export</span>
                  </button>
                  <button
                    onClick={handleTestFlow}
                    className="flex flex-col items-center gap-1 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    <Play className="w-4 h-4" />
                    <span className="text-xs font-medium">Test</span>
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="p-4">
                <div
                  className={`flex p-1 rounded-xl ${theme === "dark" ? "bg-black/20" : "bg-gray-100"}`}
                >
                  <button
                    onClick={() => setActiveTab("nodes")}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                      activeTab === "nodes"
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                        : theme === "dark"
                          ? "text-indigo-200 hover:text-white hover:bg-white/10"
                          : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                    }`}
                  >
                    Nodes
                  </button>
                  <button
                    onClick={() => setActiveTab("config")}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                      activeTab === "config"
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                        : theme === "dark"
                          ? "text-indigo-200 hover:text-white hover:bg-white/10"
                          : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                    } ${!selectedNode ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!selectedNode}
                  >
                    Configure
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto">
                {activeTab === "nodes" && (
                  <div className="p-6">
                    {nodeCategories.map((category) => (
                      <div key={category.category} className="mb-8">
                        <h3
                          className={`text-xs font-medium uppercase tracking-wider mb-4 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {category.category}
                        </h3>
                        <div className="space-y-2">
                          {category.nodes.map((node) => (
                            <div
                              key={node.type + node.label}
                              className={`flex items-start gap-3 p-3 rounded-xl cursor-grab transition-all duration-200 hover:scale-105 ${
                                theme === "dark"
                                  ? "text-white hover:bg-white/10"
                                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                              }`}
                              draggable
                              onDragStart={(event) =>
                                onDragStart(
                                  event,
                                  node.type,
                                  node.label,
                                  node.description,
                                )
                              }
                            >
                              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <node.icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4
                                  className={`font-medium text-sm ${
                                    theme === "dark"
                                      ? "text-white"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {node.label}
                                </h4>
                                <p
                                  className={`text-xs mt-1 ${
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {node.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "config" && selectedNode && (
                  <div className="p-6 space-y-6">
                    {/* Node Header */}
                    <div
                      className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm ${
                        theme === "dark"
                          ? "bg-black/20 border-white/10"
                          : "bg-white/70 border-gray-200"
                      }`}
                    >
                      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                        {selectedNode.type === "chatNode" && (
                          <MessageSquare className="w-6 h-6 text-white" />
                        )}
                        {selectedNode.type === "voiceNode" && (
                          <Phone className="w-6 h-6 text-white" />
                        )}
                        {selectedNode.type === "aiNode" && (
                          <Bot className="w-6 h-6 text-white" />
                        )}
                        {selectedNode.type === "dataNode" && (
                          <Database className="w-6 h-6 text-white" />
                        )}
                        {selectedNode.type === "triggerNode" && (
                          <Zap className="w-6 h-6 text-white" />
                        )}
                        {selectedNode.type === "conditionNode" && (
                          <Filter className="w-6 h-6 text-white" />
                        )}
                        {selectedNode.type === "codeNode" && (
                          <Code className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h3
                          className={`font-semibold ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {selectedNode.data.label}
                        </h3>
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {getNodeTypeConfig(selectedNode.type).title}
                        </p>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h4
                        className={`text-sm font-medium mb-3 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Quick Actions
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={handleDuplicateNode}
                          className={`flex items-center gap-2 p-2 rounded-xl transition-all text-sm hover:scale-105 ${
                            theme === "dark"
                              ? "text-white hover:bg-white/10"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          <Copy className="w-4 h-4" />
                          Duplicate
                        </button>
                        <button
                          onClick={handleDeleteNode}
                          className="flex items-center gap-2 p-2 rounded-xl transition-all text-sm bg-red-500 hover:bg-red-600 text-white hover:scale-105 shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Configuration */}
                    <div>
                      <h4
                        className={`text-sm font-medium mb-4 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Configuration
                      </h4>
                      <div className="space-y-4">
                        {/* Node Label */}
                        <div>
                          <label
                            className={`block text-xs font-medium mb-2 ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            Node Label
                          </label>
                          <input
                            type="text"
                            value={selectedNode.data.label || ""}
                            onChange={(e) =>
                              handleUpdateNodeData("label", e.target.value)
                            }
                            className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 backdrop-blur-sm ${
                              theme === "dark"
                                ? "bg-black/20 border-white/10 text-white placeholder-gray-400"
                                : "bg-white/70 border-gray-200 text-gray-900 placeholder-gray-500"
                            }`}
                            placeholder="Enter node label..."
                          />
                        </div>

                        {/* Node Description */}
                        <div>
                          <label
                            className={`block text-xs font-medium mb-2 ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            Description
                          </label>
                          <textarea
                            value={selectedNode.data.description || ""}
                            onChange={(e) =>
                              handleUpdateNodeData(
                                "description",
                                e.target.value,
                              )
                            }
                            className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 backdrop-blur-sm ${
                              theme === "dark"
                                ? "bg-black/20 border-white/10 text-white placeholder-gray-400"
                                : "bg-white/70 border-gray-200 text-gray-900 placeholder-gray-500"
                            }`}
                            rows={2}
                            placeholder="Enter node description..."
                          />
                        </div>

                        {/* Node-specific Fields */}
                        {getNodeTypeConfig(selectedNode.type).fields.map(
                          (field) => (
                            <div key={field.key}>
                              <label
                                className={`flex items-center gap-2 text-xs font-medium mb-2 ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                <field.icon className="w-3 h-3" />
                                {field.label}
                              </label>
                              {field.type === "text" && (
                                <input
                                  type="text"
                                  value={selectedNode.data[field.key] || ""}
                                  onChange={(e) =>
                                    handleUpdateNodeData(
                                      field.key,
                                      e.target.value,
                                    )
                                  }
                                  className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 backdrop-blur-sm ${
                                    theme === "dark"
                                      ? "bg-black/20 border-white/10 text-white placeholder-gray-400"
                                      : "bg-white/70 border-gray-200 text-gray-900 placeholder-gray-500"
                                  }`}
                                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                                />
                              )}
                              {field.type === "textarea" && (
                                <textarea
                                  value={selectedNode.data[field.key] || ""}
                                  onChange={(e) =>
                                    handleUpdateNodeData(
                                      field.key,
                                      e.target.value,
                                    )
                                  }
                                  className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 backdrop-blur-sm ${
                                    theme === "dark"
                                      ? "bg-black/20 border-white/10 text-white placeholder-gray-400"
                                      : "bg-white/70 border-gray-200 text-gray-900 placeholder-gray-500"
                                  }`}
                                  rows={3}
                                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                                />
                              )}
                              {field.type === "select" && (
                                <select
                                  value={selectedNode.data[field.key] || ""}
                                  onChange={(e) =>
                                    handleUpdateNodeData(
                                      field.key,
                                      e.target.value,
                                    )
                                  }
                                  className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 backdrop-blur-sm ${
                                    theme === "dark"
                                      ? "bg-black/20 border-white/10 text-white"
                                      : "bg-white/70 border-gray-200 text-gray-900"
                                  }`}
                                >
                                  <option value="">Select {field.label}</option>
                                  {field.options?.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              )}
                              {field.type === "number" && (
                                <input
                                  type="number"
                                  value={selectedNode.data[field.key] || ""}
                                  onChange={(e) =>
                                    handleUpdateNodeData(
                                      field.key,
                                      e.target.value,
                                    )
                                  }
                                  className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 backdrop-blur-sm ${
                                    theme === "dark"
                                      ? "bg-black/20 border-white/10 text-white placeholder-gray-400"
                                      : "bg-white/70 border-gray-200 text-gray-900 placeholder-gray-500"
                                  }`}
                                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                                />
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "config" && !selectedNode && (
                  <div className="p-6 text-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                      }`}
                    >
                      <Settings
                        className={`w-8 h-8 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <h3
                      className={`text-lg font-medium mb-2 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      No Node Selected
                    </h3>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Click on a node to configure its settings
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default WorkflowPage;
