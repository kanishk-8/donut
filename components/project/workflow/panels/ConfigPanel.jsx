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
  Settings,
  Copy,
  Trash2,
  Key,
  Edit3,
  Calendar,
  Link,
  FileText,
  FileJson,
  Network,
  XCircle,
} from "lucide-react";

const ConfigPanel = ({
  selectedNode,
  onUpdateNodeData,
  onDeleteNode,
  onDuplicateNode,
}) => {
  const { theme } = useTheme();

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
      databaseNodeBackend: {
        title: "Backend Database Configuration",
        fields: [
          {
            key: "connection",
            label: "Connection String",
            type: "text",
            icon: Database,
          },
          {
            key: "type",
            label: "Database Type",
            type: "select",
            options: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
            icon: Settings,
          },
        ],
      },
      apiNode: {
        title: "API Configuration",
        fields: [
          { key: "route", label: "Route Path", type: "text", icon: Globe },
          {
            key: "middleware",
            label: "Middleware",
            type: "textarea",
            icon: Code,
          },
        ],
      },
      authNode: {
        title: "Authentication Configuration",
        fields: [
          {
            key: "provider",
            label: "Auth Provider",
            type: "select",
            options: ["JWT", "OAuth", "API Key", "Basic Auth"],
            icon: Shield,
          },
          { key: "secret", label: "Secret Key", type: "password", icon: Key },
        ],
      },
      microserviceNode: {
        title: "Microservice Configuration",
        fields: [
          { key: "name", label: "Service Name", type: "text", icon: Container },
          { key: "port", label: "Port", type: "number", icon: Network },
        ],
      },
      webhookNode: {
        title: "Webhook Configuration",
        fields: [
          { key: "url", label: "Webhook URL", type: "text", icon: Webhook },
          { key: "secret", label: "Secret", type: "password", icon: Key },
        ],
      },
      cronNode: {
        title: "Cron Job Configuration",
        fields: [
          {
            key: "schedule",
            label: "Cron Schedule",
            type: "text",
            icon: Clock,
          },
          { key: "timezone", label: "Timezone", type: "text", icon: Globe },
        ],
      },
      emailNode: {
        title: "Email Service Configuration",
        fields: [
          {
            key: "provider",
            label: "Email Provider",
            type: "select",
            options: ["SendGrid", "Mailgun", "AWS SES"],
            icon: Mail,
          },
          { key: "apiKey", label: "API Key", type: "password", icon: Key },
        ],
      },
      responseNode: {
        title: "Response Configuration",
        fields: [
          {
            key: "statusCode",
            label: "Status Code",
            type: "select",
            options: ["200", "201", "400", "401", "403", "404", "500"],
            icon: CheckCircle,
          },
          {
            key: "body",
            label: "Response Body",
            type: "textarea",
            icon: FileText,
          },
          {
            key: "contentType",
            label: "Content Type",
            type: "select",
            options: [
              "application/json",
              "text/html",
              "text/plain",
              "application/xml",
            ],
            icon: FileJson,
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

  const getNodeIcon = (nodeType) => {
    const icons = {
      chatNode: MessageSquare,
      voiceNode: Phone,
      aiNode: Bot,
      dataNode: Database,
      databaseNodeBackend: Database,
      triggerNode: Zap,
      conditionNode: Filter,
      codeNode: Code,
      apiNode: Globe,
      authNode: Shield,
      microserviceNode: Container,
      webhookNode: Webhook,
      cronNode: Clock,
      emailNode: Mail,
      responseNode: CheckCircle,
    };
    return icons[nodeType] || Settings;
  };

  if (!selectedNode) {
    return (
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
    );
  }

  const config = getNodeTypeConfig(selectedNode.type);
  const NodeIcon = getNodeIcon(selectedNode.type);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Node Header */}
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm ${
            theme === "dark"
              ? "bg-black/20 border-white/10"
              : "bg-white/70 border-gray-200"
          }`}
        >
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
            <NodeIcon className="w-6 h-6 text-white" />
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
              {config.title}
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
              onClick={onDuplicateNode}
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
              onClick={onDeleteNode}
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
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Node Label
              </label>
              <input
                type="text"
                value={selectedNode.data.label || ""}
                onChange={(e) => onUpdateNodeData("label", e.target.value)}
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
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Description
              </label>
              <textarea
                value={selectedNode.data.description || ""}
                onChange={(e) =>
                  onUpdateNodeData("description", e.target.value)
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
            {config.fields.map((field, index) => (
              <div key={index}>
                <label
                  className={`flex items-center gap-2 text-xs font-medium mb-2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
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
                      onUpdateNodeData(field.key, e.target.value)
                    }
                    className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 backdrop-blur-sm ${
                      theme === "dark"
                        ? "bg-black/20 border-white/10 text-white placeholder-gray-400"
                        : "bg-white/70 border-gray-200 text-gray-900 placeholder-gray-500"
                    }`}
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                  />
                )}
                {field.type === "password" && (
                  <input
                    type="password"
                    value={selectedNode.data[field.key] || ""}
                    onChange={(e) =>
                      onUpdateNodeData(field.key, e.target.value)
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
                      onUpdateNodeData(field.key, e.target.value)
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
                      onUpdateNodeData(field.key, e.target.value)
                    }
                    className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 backdrop-blur-sm ${
                      theme === "dark"
                        ? "bg-black/20 border-white/10 text-white"
                        : "bg-white/70 border-gray-200 text-gray-900"
                    }`}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option, optionIndex) => (
                      <option key={optionIndex} value={option}>
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
                      onUpdateNodeData(field.key, e.target.value)
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;
