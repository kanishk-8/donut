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
  ReactFlowProvider,
} from "@xyflow/react";
import { Save, Download, Play, Sidebar, Brain, Server } from "lucide-react";

import { nodeTypes } from "@/components/project/workflow/nodes";
import NodesSidebar from "@/components/project/workflow/panels/NodesSidebar";
import ConfigPanel from "@/components/project/workflow/panels/ConfigPanel";
import {
  validateConnection,
  validateWorkflow,
} from "@/utils/workflow/connectionValidation";
import {
  initialNodes,
  initialEdges,
  defaultEdgeOptions,
  connectionLineStyle,
  defaultViewport,
  flowSettings,
  createNode,
  exportWorkflow,
  generateNodeId,
  cloneNode,
} from "@/utils/workflow/workflowData";

import "@xyflow/react/dist/style.css";

function WorkflowPage() {
  const { theme } = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeId, setNodeId] = useState(4);
  const [selectedNode, setSelectedNode] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("nodes");
  const [workflowType, setWorkflowType] = useState("agent"); // 'agent' or 'backend'
  const reactFlowWrapper = useRef(null);

  const onConnect = useCallback(
    (params) => {
      // Find the source and target nodes
      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);

      if (sourceNode && targetNode) {
        // Validate the connection
        const validation = validateConnection(sourceNode, targetNode, edges);

        if (!validation.isValid) {
          alert(validation.message);
          return;
        }
      }

      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            style: { stroke: "#6b7280", strokeWidth: 2 },
          },
          eds,
        ),
      );
    },
    [nodes, edges, setEdges],
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

      // Check if the dropped element is valid
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

      const newNode = createNode(nodeId, type, position, label, description);

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
    const workflowData = exportWorkflow(nodes, edges, {
      name: `${workflowType === "agent" ? "Agent" : "Backend"} Workflow`,
      type: workflowType,
    });
    console.log("Saving workflow:", workflowData);

    // Here you would typically save to your backend
    localStorage.setItem("workflow", JSON.stringify(workflowData));
    alert("Workflow saved successfully!");
  }, [nodes, edges, workflowType]);

  const handleExport = useCallback(() => {
    const workflowData = exportWorkflow(nodes, edges, {
      name: `${workflowType === "agent" ? "Agent" : "Backend"} Workflow`,
      type: workflowType,
    });
    const dataStr = JSON.stringify(workflowData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${workflowType}-workflow.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  }, [nodes, edges, workflowType]);

  const handleTestFlow = useCallback(() => {
    const validation = validateWorkflow(nodes, edges);

    if (validation.isValid) {
      alert("✅ Workflow validation passed! Ready to test.");
      console.log("Testing workflow with nodes:", nodes, "and edges:", edges);
    } else {
      alert(`❌ Workflow validation failed:\n${validation.errors.join("\n")}`);
    }
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
      const newNode = cloneNode(selectedNode, nodes);
      setNodes((nds) => nds.concat(newNode));
      setNodeId((id) => id + 1);
      setActiveTab("nodes");
    }
  }, [selectedNode, nodes, setNodes]);

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

  const switchWorkflowType = (type) => {
    setWorkflowType(type);
    // Don't clear nodes when switching types to allow mixed workflows
    setSelectedNode(null);
    setActiveTab("nodes");
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
              snapToGrid={flowSettings.snapToGrid}
              snapGrid={flowSettings.snapGrid}
              defaultViewport={defaultViewport}
              minZoom={flowSettings.minZoom}
              maxZoom={flowSettings.maxZoom}
              attributionPosition={flowSettings.attributionPosition}
              connectionLineStyle={connectionLineStyle}
              defaultEdgeOptions={defaultEdgeOptions}
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
                      {workflowType === "agent"
                        ? "Agent Builder"
                        : "Backend Builder"}{" "}
                      Active
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
                    Workflow Builder
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

                {/* Workflow Type Toggle */}
                <div className="mb-4">
                  <div
                    className={`flex p-1 rounded-xl ${theme === "dark" ? "bg-black/20" : "bg-gray-100"}`}
                  >
                    <button
                      onClick={() => switchWorkflowType("agent")}
                      className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg flex items-center justify-center gap-2 ${
                        workflowType === "agent"
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                          : theme === "dark"
                            ? "text-indigo-200 hover:text-white hover:bg-white/10"
                            : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                      }`}
                    >
                      <Brain className="w-4 h-4" />
                      Agent Builder
                    </button>
                    <button
                      onClick={() => switchWorkflowType("backend")}
                      className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg flex items-center justify-center gap-2 ${
                        workflowType === "backend"
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                          : theme === "dark"
                            ? "text-indigo-200 hover:text-white hover:bg-white/10"
                            : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                      }`}
                    >
                      <Server className="w-4 h-4" />
                      Backend Builder
                    </button>
                  </div>
                </div>

                {/* Toolbar Actions */}
                <div className="grid grid-cols-3 gap-2">
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
              <div
                className={`p-4 border-t ${theme === "dark" ? "border-white/10" : "border-gray-200"}`}
              >
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
              <div className="flex-1 flex flex-col overflow-hidden">
                {activeTab === "nodes" ? (
                  <NodesSidebar
                    workflowType={workflowType}
                    onDragStart={onDragStart}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />
                ) : (
                  <ConfigPanel
                    selectedNode={selectedNode}
                    onUpdateNodeData={handleUpdateNodeData}
                    onDeleteNode={handleDeleteNode}
                    onDuplicateNode={handleDuplicateNode}
                  />
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
