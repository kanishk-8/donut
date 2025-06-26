"use client";
import React, { useState } from "react";
import { useTheme } from "@/context/themecontext";
import { Plus, Edit2, Trash2, Copy, CheckCircle, XCircle, Activity, Webhook } from "lucide-react";

const WebhooksPage = () => {
  const { theme } = useTheme();
  const [webhooks, setWebhooks] = useState([
    {
      id: 1,
      name: "Chat Conversation Webhook",
      url: "https://api.yoursite.com/webhooks/chat",
      events: ["chat.message.sent", "chat.session.ended"],
      status: "active",
      createdAt: "2024-01-10",
      lastTriggered: "2 hours ago",
      deliveries: 1247,
      failures: 3,
    },
    {
      id: 2,
      name: "Voice Call Webhook",
      url: "https://api.yoursite.com/webhooks/voice",
      events: ["voice.call.started", "voice.call.ended"],
      status: "active",
      createdAt: "2024-01-08",
      lastTriggered: "30 minutes ago",
      deliveries: 892,
      failures: 0,
    },
    {
      id: 3,
      name: "Support Ticket Webhook",
      url: "https://api.yoursite.com/webhooks/tickets",
      events: ["ticket.created", "ticket.updated"],
      status: "inactive",
      createdAt: "2024-01-05",
      lastTriggered: "3 days ago",
      deliveries: 156,
      failures: 12,
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    name: "",
    url: "",
    events: [],
  });

  const availableEvents = [
    { id: "chat.message.sent", name: "Chat Message Sent", description: "Triggered when a chat message is sent" },
    { id: "chat.session.started", name: "Chat Session Started", description: "Triggered when a new chat session begins" },
    { id: "chat.session.ended", name: "Chat Session Ended", description: "Triggered when a chat session ends" },
    { id: "voice.call.started", name: "Voice Call Started", description: "Triggered when a voice call begins" },
    { id: "voice.call.ended", name: "Voice Call Ended", description: "Triggered when a voice call ends" },
    { id: "ticket.created", name: "Ticket Created", description: "Triggered when a support ticket is created" },
    { id: "ticket.updated", name: "Ticket Updated", description: "Triggered when a support ticket is updated" },
    { id: "ticket.resolved", name: "Ticket Resolved", description: "Triggered when a support ticket is resolved" },
  ];

  const recentDeliveries = [
    {
      id: 1,
      webhookName: "Chat Conversation Webhook",
      event: "chat.message.sent",
      status: "success",
      timestamp: "2024-01-15 14:30:25",
      responseCode: 200,
      responseTime: "145ms",
    },
    {
      id: 2,
      webhookName: "Voice Call Webhook",
      event: "voice.call.ended",
      status: "success",
      timestamp: "2024-01-15 14:25:10",
      responseCode: 200,
      responseTime: "89ms",
    },
    {
      id: 3,
      webhookName: "Support Ticket Webhook",
      event: "ticket.created",
      status: "failed",
      timestamp: "2024-01-15 14:20:05",
      responseCode: 500,
      responseTime: "5000ms",
    },
    {
      id: 4,
      webhookName: "Chat Conversation Webhook",
      event: "chat.session.ended",
      status: "success",
      timestamp: "2024-01-15 14:15:30",
      responseCode: 200,
      responseTime: "201ms",
    },
  ];

  const createWebhook = () => {
    const webhook = {
      id: Date.now(),
      ...newWebhook,
      status: "active",
      createdAt: new Date().toISOString().split('T')[0],
      lastTriggered: "Never",
      deliveries: 0,
      failures: 0,
    };
    setWebhooks([...webhooks, webhook]);
    setShowCreateModal(false);
    setNewWebhook({ name: "", url: "", events: [] });
  };

  const deleteWebhook = (id) => {
    setWebhooks(webhooks.filter(w => w.id !== id));
  };

  const toggleWebhookStatus = (id) => {
    setWebhooks(webhooks.map(w => 
      w.id === id 
        ? { ...w, status: w.status === "active" ? "inactive" : "active" }
        : w
    ));
  };

  const testWebhook = (webhook) => {
    // Simulate webhook test
    alert(`Testing webhook: ${webhook.name}`);
  };

  return (
    <div
      className={`p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto min-h-screen ${
        theme === "dark" ? "bg-black" : "bg-gray-50/50"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1
                className={`text-3xl font-bold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Webhooks
              </h1>
              <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                Configure webhooks to receive real-time notifications about events
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Webhook
            </button>
          </div>
        </div>

        {/* Webhooks List */}
        <div
          className={`backdrop-blur-sm rounded-2xl shadow-lg border mb-8 ${
            theme === "dark"
              ? "bg-zinc-800/50 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="p-6">
            <h2
              className={`text-xl font-semibold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Configured Webhooks
            </h2>

            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <div
                  key={webhook.id}
                  className={`p-4 rounded-lg border ${
                    theme === "dark"
                      ? "border-gray-600 bg-gray-700/30"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3
                          className={`font-semibold text-lg ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {webhook.name}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            webhook.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {webhook.status}
                        </span>
                      </div>
                      <p
                        className={`font-mono text-sm mb-2 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {webhook.url}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {webhook.events.map((event) => (
                          <span
                            key={event}
                            className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800"
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span
                          className={
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          Created: {webhook.createdAt}
                        </span>
                        <span
                          className={
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          Last triggered: {webhook.lastTriggered}
                        </span>
                        <span
                          className={
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          Deliveries: {webhook.deliveries}
                        </span>
                        <span
                          className={
                            webhook.failures > 0
                              ? "text-red-500"
                              : theme === "dark"
                              ? "text-gray-400"
                              : "text-gray-600"
                          }
                        >
                          Failures: {webhook.failures}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => testWebhook(webhook)}
                        className={`p-2 rounded-lg transition-colors ${
                          theme === "dark"
                            ? "hover:bg-gray-600 text-gray-400"
                            : "hover:bg-gray-200 text-gray-600"
                        }`}
                      >
                        <Activity className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleWebhookStatus(webhook.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          theme === "dark"
                            ? "hover:bg-gray-600 text-gray-400"
                            : "hover:bg-gray-200 text-gray-600"
                        }`}
                      >
                        {webhook.status === "active" ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          theme === "dark"
                            ? "hover:bg-gray-600 text-gray-400"
                            : "hover:bg-gray-200 text-gray-600"
                        }`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteWebhook(webhook.id)}
                        className="p-2 rounded-lg transition-colors hover:bg-red-500/10 text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Deliveries */}
        <div
          className={`backdrop-blur-sm rounded-2xl shadow-lg border ${
            theme === "dark"
              ? "bg-zinc-800/50 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="p-6">
            <h2
              className={`text-xl font-semibold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Recent Deliveries
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className={`border-b ${
                      theme === "dark" ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <th
                      className={`text-left p-4 font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Webhook
                    </th>
                    <th
                      className={`text-left p-4 font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Event
                    </th>
                    <th
                      className={`text-left p-4 font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Status
                    </th>
                    <th
                      className={`text-left p-4 font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Timestamp
                    </th>
                    <th
                      className={`text-left p-4 font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Response
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentDeliveries.map((delivery) => (
                    <tr
                      key={delivery.id}
                      className={`border-b hover:bg-opacity-50 ${
                        theme === "dark"
                          ? "border-gray-700 hover:bg-gray-600"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <td
                        className={`p-4 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {delivery.webhookName}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                          {delivery.event}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            delivery.status === "success"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {delivery.status}
                        </span>
                      </td>
                      <td
                        className={`p-4 font-mono text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {delivery.timestamp}
                      </td>
                      <td
                        className={`p-4 font-mono text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {delivery.responseCode} ({delivery.responseTime})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Create Webhook Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className={`p-6 rounded-2xl max-w-2xl w-full mx-4 ${
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
                Create New Webhook
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Webhook Name
                  </label>
                  <input
                    type="text"
                    value={newWebhook.name}
                    onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                    placeholder="e.g., Order Notifications Webhook"
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
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    value={newWebhook.url}
                    onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                    placeholder="https://api.yoursite.com/webhooks/donut"
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
                    Events to Subscribe
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {availableEvents.map((event) => (
                      <label key={event.id} className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          checked={newWebhook.events.includes(event.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewWebhook({
                                ...newWebhook,
                                events: [...newWebhook.events, event.id]
                              });
                            } else {
                              setNewWebhook({
                                ...newWebhook,
                                events: newWebhook.events.filter(id => id !== event.id)
                              });
                            }
                          }}
                          className="mt-1"
                        />
                        <div>
                          <span
                            className={`text-sm font-medium ${
                              theme === "dark" ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {event.name}
                          </span>
                          <p
                            className={`text-xs ${
                              theme === "dark" ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {event.description}
                          </p>
                        </div>
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
                  onClick={createWebhook}
                  disabled={!newWebhook.name.trim() || !newWebhook.url.trim() || newWebhook.events.length === 0}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  Create Webhook
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebhooksPage;