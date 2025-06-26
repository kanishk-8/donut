"use client";
import React, { useState } from "react";
import { useTheme } from "@/context/themecontext";
import {
  Copy,
  Eye,
  Code,
  Palette,
  MessageSquare,
  Download,
} from "lucide-react";

const ChatWidgetPage = () => {
  const { theme } = useTheme();
  const [widgetConfig, setWidgetConfig] = useState({
    primaryColor: "#6366f1",
    position: "bottom-right",
    welcomeMessage: "Hi! How can I help you today?",
    placeholder: "Type your message...",
    title: "Customer Support",
    showAvatar: true,
    rounded: true,
    size: "medium",
  });

  const [showPreview, setShowPreview] = useState(true);
  const [activeTab, setActiveTab] = useState("customize");

  const generateEmbedCode = () => {
    return `<!-- Donut Customer Service Widget -->
<script>
  window.DonutConfig = {
    apiKey: "YOUR_API_KEY",
    primaryColor: "${widgetConfig.primaryColor}",
    position: "${widgetConfig.position}",
    welcomeMessage: "${widgetConfig.welcomeMessage}",
    placeholder: "${widgetConfig.placeholder}",
    title: "${widgetConfig.title}",
    showAvatar: ${widgetConfig.showAvatar},
    rounded: ${widgetConfig.rounded},
    size: "${widgetConfig.size}"
  };
</script>
<script src="https://cdn.donut.dev/widget/v1/donut-widget.js" async></script>`;
  };

  const generateReactCode = () => {
    return `import { DonutWidget } from '@donut/react-widget';

function App() {
  return (
    <div>
      {/* Your app content */}
      
      <DonutWidget
        apiKey="YOUR_API_KEY"
        primaryColor="${widgetConfig.primaryColor}"
        position="${widgetConfig.position}"
        welcomeMessage="${widgetConfig.welcomeMessage}"
        placeholder="${widgetConfig.placeholder}"
        title="${widgetConfig.title}"
        showAvatar={${widgetConfig.showAvatar}}
        rounded={${widgetConfig.rounded}}
        size="${widgetConfig.size}"
      />
    </div>
  );
}`;
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
  };

  const positions = [
    { value: "bottom-right", label: "Bottom Right" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "top-right", label: "Top Right" },
    { value: "top-left", label: "Top Left" },
  ];

  const sizes = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
  ];

  return (
    <div
      className={`p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto min-h-screen ${
        theme === "dark" ? "bg-black" : "bg-gray-50/50"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Chat Widget
          </h1>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            Customize and embed the customer service chat widget on your website
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div>
            {/* Tabs */}
            <div className="flex space-x-1 mb-6">
              {[
                { id: "customize", label: "Customize", icon: Palette },
                { id: "embed", label: "Embed Code", icon: Code },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white"
                      : theme === "dark"
                      ? "text-gray-400 hover:text-white hover:bg-gray-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "customize" && (
              <div
                className={`backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${
                  theme === "dark"
                    ? "bg-zinc-800/50 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Widget Configuration
                </h3>

                <div className="space-y-6">
                  {/* Primary Color */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Primary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={widgetConfig.primaryColor}
                        onChange={(e) =>
                          setWidgetConfig({
                            ...widgetConfig,
                            primaryColor: e.target.value,
                          })
                        }
                        className="w-12 h-12 border rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={widgetConfig.primaryColor}
                        onChange={(e) =>
                          setWidgetConfig({
                            ...widgetConfig,
                            primaryColor: e.target.value,
                          })
                        }
                        className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Position */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Position
                    </label>
                    <select
                      value={widgetConfig.position}
                      onChange={(e) =>
                        setWidgetConfig({
                          ...widgetConfig,
                          position: e.target.value,
                        })
                      }
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      {positions.map((pos) => (
                        <option key={pos.value} value={pos.value}>
                          {pos.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Size */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Size
                    </label>
                    <select
                      value={widgetConfig.size}
                      onChange={(e) =>
                        setWidgetConfig({
                          ...widgetConfig,
                          size: e.target.value,
                        })
                      }
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      {sizes.map((size) => (
                        <option key={size.value} value={size.value}>
                          {size.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Welcome Message */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Welcome Message
                    </label>
                    <input
                      type="text"
                      value={widgetConfig.welcomeMessage}
                      onChange={(e) =>
                        setWidgetConfig({
                          ...widgetConfig,
                          welcomeMessage: e.target.value,
                        })
                      }
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Widget Title
                    </label>
                    <input
                      type="text"
                      value={widgetConfig.title}
                      onChange={(e) =>
                        setWidgetConfig({
                          ...widgetConfig,
                          title: e.target.value,
                        })
                      }
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  {/* Placeholder */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Input Placeholder
                    </label>
                    <input
                      type="text"
                      value={widgetConfig.placeholder}
                      onChange={(e) =>
                        setWidgetConfig({
                          ...widgetConfig,
                          placeholder: e.target.value,
                        })
                      }
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  {/* Toggle Options */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Show Avatar
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={widgetConfig.showAvatar}
                          onChange={(e) =>
                            setWidgetConfig({
                              ...widgetConfig,
                              showAvatar: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <label
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Rounded Corners
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={widgetConfig.rounded}
                          onChange={(e) =>
                            setWidgetConfig({
                              ...widgetConfig,
                              rounded: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "embed" && (
              <div className="space-y-6">
                {/* HTML Embed */}
                <div
                  className={`backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${
                    theme === "dark"
                      ? "bg-zinc-800/50 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3
                      className={`text-lg font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      HTML Embed Code
                    </h3>
                    <button
                      onClick={() => copyCode(generateEmbedCode())}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === "dark"
                          ? "hover:bg-gray-600 text-gray-400"
                          : "hover:bg-gray-200 text-gray-600"
                      }`}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre
                    className={`p-4 rounded-lg font-mono text-sm overflow-x-auto ${
                      theme === "dark"
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {generateEmbedCode()}
                  </pre>
                </div>

                {/* React Component */}
                <div
                  className={`backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${
                    theme === "dark"
                      ? "bg-zinc-800/50 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3
                      className={`text-lg font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      React Component
                    </h3>
                    <button
                      onClick={() => copyCode(generateReactCode())}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === "dark"
                          ? "hover:bg-gray-600 text-gray-400"
                          : "hover:bg-gray-200 text-gray-600"
                      }`}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre
                    className={`p-4 rounded-lg font-mono text-sm overflow-x-auto ${
                      theme === "dark"
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {generateReactCode()}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div>
            <div
              className={`backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${
                theme === "dark"
                  ? "bg-zinc-800/50 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  className={`text-lg font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Live Preview
                </h3>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === "dark"
                      ? "hover:bg-gray-600 text-gray-400"
                      : "hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Mock Website Preview */}
              <div
                className={`relative h-96 rounded-lg border-2 overflow-hidden ${
                  theme === "dark"
                    ? "bg-gray-900 border-gray-600"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                {/* Mock Website Content */}
                <div className="p-6">
                  <div
                    className={`h-4 w-1/3 rounded mb-4 ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`h-3 w-full rounded mb-2 ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-3 w-2/3 rounded mb-4 ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-20 w-full rounded ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-200"
                    }`}
                  ></div>
                </div>

                {/* Chat Widget */}
                {showPreview && (
                  <div
                    className={`absolute ${
                      widgetConfig.position.includes("bottom")
                        ? "bottom-4"
                        : "top-4"
                    } ${
                      widgetConfig.position.includes("right")
                        ? "right-4"
                        : "left-4"
                    }`}
                  >
                    {/* Widget Button */}
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-transform hover:scale-110 ${
                        widgetConfig.rounded ? "rounded-full" : "rounded-lg"
                      }`}
                      style={{ backgroundColor: widgetConfig.primaryColor }}
                    >
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>

                    {/* Widget Chat Window (shown on hover) */}
                    <div
                      className={`absolute ${
                        widgetConfig.position.includes("bottom")
                          ? "bottom-16"
                          : "top-16"
                      } ${
                        widgetConfig.position.includes("right")
                          ? "right-0"
                          : "left-0"
                      } w-80 h-96 bg-white border shadow-xl ${
                        widgetConfig.rounded ? "rounded-2xl" : "rounded-lg"
                      } hidden group-hover:block`}
                    >
                      {/* Header */}
                      <div
                        className={`p-4 text-white ${
                          widgetConfig.rounded
                            ? "rounded-t-2xl"
                            : "rounded-t-lg"
                        }`}
                        style={{ backgroundColor: widgetConfig.primaryColor }}
                      >
                        <h4 className="font-semibold">{widgetConfig.title}</h4>
                        {widgetConfig.showAvatar && (
                          <div className="flex items-center mt-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full mr-2"></div>
                            <span className="text-sm opacity-90">
                              AI Assistant
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Messages */}
                      <div className="p-4 h-64 overflow-y-auto">
                        <div className="bg-gray-100 p-3 rounded-lg mb-4 max-w-xs">
                          <p className="text-sm text-gray-800">
                            {widgetConfig.welcomeMessage}
                          </p>
                        </div>
                      </div>

                      {/* Input */}
                      <div className="p-4 border-t">
                        <input
                          type="text"
                          placeholder={widgetConfig.placeholder}
                          className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                          style={{
                            "--tw-ring-color": widgetConfig.primaryColor,
                          }}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <p
                className={`text-sm mt-4 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                This is how the widget will appear on your website. Click the
                eye icon to toggle visibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWidgetPage;
