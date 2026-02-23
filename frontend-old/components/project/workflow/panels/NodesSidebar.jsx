"use client";
import React from "react";
import { useTheme } from "@/context/themecontext";
import {
  MessageSquare,
  Phone,
  Bot,
  Database,
  Zap,
  Filter,
  Code,
  Globe,
  Shield,
  Container,
  Webhook,
  Clock,
  Mail,
  CheckCircle,
  Users,
  CreditCard,
  Search,
  BarChart3,
  Upload,
  HardDrive,
  Key,
  AlertTriangle,
  Radio,
  Layers,
  ExternalLink,
  GitBranch,
  Network,
  Lock,
} from "lucide-react";

const NodesSidebar = ({
  workflowType,
  onDragStart,
  activeTab,
  setActiveTab,
}) => {
  const { theme } = useTheme();

  const agentNodeCategories = [
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

  const backendNodeCategories = [
    {
      category: "Entry Points",
      nodes: [
        {
          type: "triggerNode",
          label: "HTTP Trigger",
          icon: Zap,
          description: "HTTP endpoint trigger",
        },
        {
          type: "webhookNode",
          label: "Webhook",
          icon: Webhook,
          description: "Webhook endpoint",
        },
        {
          type: "cronNode",
          label: "Cron Job",
          icon: Clock,
          description: "Scheduled trigger",
        },
      ],
    },
    {
      category: "Endpoints",
      nodes: [
        {
          type: "responseNode",
          label: "HTTP Response",
          icon: CheckCircle,
          description: "Send HTTP response",
        },
        {
          type: "emailNode",
          label: "Email Service",
          icon: Mail,
          description: "Send emails",
        },
      ],
    },
    {
      category: "API & Routing",
      nodes: [
        {
          type: "apiNode",
          label: "API Gateway",
          icon: Globe,
          description: "Route and manage APIs",
        },
        {
          type: "apiNode",
          label: "REST Endpoint",
          icon: ExternalLink,
          description: "REST API endpoint",
        },
        {
          type: "apiNode",
          label: "GraphQL",
          icon: GitBranch,
          description: "GraphQL endpoint",
        },
        {
          type: "apiNode",
          label: "Load Balancer",
          icon: Network,
          description: "Distribute traffic",
        },
      ],
    },
    {
      category: "Data Storage",
      nodes: [
        {
          type: "databaseNodeBackend",
          label: "SQL Database",
          icon: Database,
          description: "Relational database",
        },
        {
          type: "databaseNodeBackend",
          label: "NoSQL Database",
          icon: Database,
          description: "Document database",
        },
        {
          type: "databaseNodeBackend",
          label: "Redis Cache",
          icon: HardDrive,
          description: "In-memory cache",
        },
        {
          type: "databaseNodeBackend",
          label: "File Storage",
          icon: Upload,
          description: "File storage service",
        },
      ],
    },
    {
      category: "Authentication & Security",
      nodes: [
        {
          type: "authNode",
          label: "JWT Auth",
          icon: Key,
          description: "JWT authentication",
        },
        {
          type: "authNode",
          label: "OAuth",
          icon: Shield,
          description: "OAuth provider",
        },
        {
          type: "authNode",
          label: "API Key",
          icon: Lock,
          description: "API key validation",
        },
        {
          type: "authNode",
          label: "Rate Limiter",
          icon: AlertTriangle,
          description: "Rate limiting",
        },
      ],
    },
    {
      category: "Processing & Logic",
      nodes: [
        {
          type: "codeNode",
          label: "Function",
          icon: Code,
          description: "Custom function",
        },
        {
          type: "aiNode",
          label: "AI Service",
          icon: Bot,
          description: "AI/ML processing",
        },
        {
          type: "conditionNode",
          label: "Condition",
          icon: Filter,
          description: "Conditional logic",
        },
      ],
    },
    {
      category: "Microservices",
      nodes: [
        {
          type: "microserviceNode",
          label: "User Service",
          icon: Users,
          description: "User management service",
        },
        {
          type: "microserviceNode",
          label: "Payment Service",
          icon: CreditCard,
          description: "Payment processing",
        },
        {
          type: "microserviceNode",
          label: "Search Service",
          icon: Search,
          description: "Search functionality",
        },
        {
          type: "microserviceNode",
          label: "Analytics Service",
          icon: BarChart3,
          description: "Analytics and reporting",
        },
      ],
    },
    {
      category: "Communication",
      nodes: [
        {
          type: "chatNode",
          label: "Notification",
          icon: Radio,
          description: "Push notifications",
        },
        {
          type: "voiceNode",
          label: "SMS Service",
          icon: Phone,
          description: "SMS messaging",
        },
        {
          type: "webhookNode",
          label: "Event Publisher",
          icon: Webhook,
          description: "Publish events",
        },
      ],
    },
  ];

  const getCurrentNodeCategories = () => {
    return workflowType === "agent"
      ? agentNodeCategories
      : backendNodeCategories;
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {activeTab === "nodes" && (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Connection Rules:
            </h4>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>🟢 Starting points: HTTP triggers, webhooks, cron jobs</li>
              <li>🔵 Processing nodes: Can have multiple inputs/outputs</li>
              <li>🔴 End points: Email, response nodes (no outputs)</li>
              <li>⚡ Conditions: Max 2 outputs (true/false branches)</li>
            </ul>
          </div>

          {getCurrentNodeCategories().map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-8">
              <h3
                className={`text-xs font-medium uppercase tracking-wider mb-4 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.nodes.map((node, nodeIndex) => (
                  <div
                    key={node.type + node.label + nodeIndex}
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
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {node.label}
                      </h4>
                      <p
                        className={`text-xs mt-1 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
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
    </div>
  );
};

export default NodesSidebar;
