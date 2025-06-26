"use client";
import React, { useState } from "react";
import { useTheme } from "@/context/themecontext";
import { Key, Copy, Eye, EyeOff, Plus, Trash2, Calendar, Shield } from "lucide-react";

const APIKeysPage = () => {
  const { theme } = useTheme();
  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: "Production API Key",
      key: "dk_live_abcd1234efgh5678ijkl9012mnop3456",
      createdAt: "2024-01-15",
      lastUsed: "2 hours ago",
      permissions: ["read", "write"],
      hidden: true,
    },
    {
      id: 2,
      name: "Development Key",
      key: "dk_test_zyxw9876vuts5432ponm1098lkji7654",
      createdAt: "2024-01-10",
      lastUsed: "1 day ago",
      permissions: ["read"],
      hidden: true,
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState(["read"]);

  const toggleKeyVisibility = (id) => {
    setApiKeys(keys => 
      keys.map(key => 
        key.id === id ? { ...key, hidden: !key.hidden } : key
      )
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const generateNewKey = () => {
    const newKey = {
      id: Date.now(),
      name: newKeyName,
      key: `dk_live_${Math.random().toString(36).substring(2, 50)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: "Never",
      permissions: selectedPermissions,
      hidden: false,
    };
    setApiKeys([...apiKeys, newKey]);
    setShowCreateModal(false);
    setNewKeyName("");
    setSelectedPermissions(["read"]);
  };

  const deleteKey = (id) => {
    setApiKeys(keys => keys.filter(key => key.id !== id));
  };

  return (
    <div
      className={`p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto min-h-screen ${
        theme === "dark" ? "bg-black" : "bg-gray-50/50"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1
                className={`text-3xl font-bold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                API Keys
              </h1>
              <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                Manage your API keys to integrate with the Donut customer service platform
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create API Key
            </button>
          </div>
        </div>

        {/* API Keys List */}
        <div
          className={`backdrop-blur-sm rounded-2xl shadow-lg border ${
            theme === "dark"
              ? "bg-zinc-800/50 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="p-6">
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className={`p-4 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700/30 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3
                        className={`font-semibold text-lg ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {apiKey.name}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Created: {apiKey.createdAt}
                        </span>
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Last used: {apiKey.lastUsed}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          theme === "dark"
                            ? "hover:bg-gray-600 text-gray-400"
                            : "hover:bg-gray-200 text-gray-600"
                        }`}
                      >
                        {apiKey.hidden ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(apiKey.key)}
                        className={`p-2 rounded-lg transition-colors ${
                          theme === "dark"
                            ? "hover:bg-gray-600 text-gray-400"
                            : "hover:bg-gray-200 text-gray-600"
                        }`}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteKey(apiKey.id)}
                        className="p-2 rounded-lg transition-colors hover:bg-red-500/10 text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div
                    className={`p-3 rounded-lg font-mono text-sm ${
                      theme === "dark"
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {apiKey.hidden 
                      ? "••••••••••••••••••••••••••••••••••••••••"
                      : apiKey.key
                    }
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex space-x-2">
                      {apiKey.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div
          className={`mt-8 backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${
            theme === "dark"
              ? "bg-zinc-800/50 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Quick Start
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3
                className={`font-medium mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Initialize Chat
              </h3>
              <div
                className={`p-4 rounded-lg font-mono text-sm ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {`curl -X POST https://api.donut.dev/v1/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello, I need help"}'`}
              </div>
            </div>
            <div>
              <h3
                className={`font-medium mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Start Voice Call
              </h3>
              <div
                className={`p-4 rounded-lg font-mono text-sm ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {`curl -X POST https://api.donut.dev/v1/voice/call \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"phone": "+1234567890"}'`}
              </div>
            </div>
          </div>
        </div>

        {/* Create API Key Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className={`p-6 rounded-2xl max-w-md w-full mx-4 ${
                theme === "dark"
                  ? "bg-zinc-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Create New API Key
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Key Name
                  </label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production API Key"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Permissions
                  </label>
                  <div className="space-y-2">
                    {["read", "write", "admin"].map((permission) => (
                      <label key={permission} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPermissions([...selectedPermissions, permission]);
                            } else {
                              setSelectedPermissions(selectedPermissions.filter(p => p !== permission));
                            }
                          }}
                          className="mr-2"
                        />
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {permission}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                    theme === "dark"
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={generateNewKey}
                  disabled={!newKeyName.trim()}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  Create Key
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default APIKeysPage;