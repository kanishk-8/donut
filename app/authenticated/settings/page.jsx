"use client";
import React, { useState } from "react";
import { useTheme } from "@/context/themecontext";
import { Building, Globe, Shield, Bell, Save, Plus, Trash2, CheckCircle, XCircle } from "lucide-react";

const SettingsPage = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("business");

  const [businessInfo, setBusinessInfo] = useState({
    companyName: "Acme Corporation",
    contactEmail: "support@acme.com",
    phoneNumber: "+1 (555) 123-4567",
    website: "https://www.acme.com",
    address: "123 Business Street, City, State 12345",
    timezone: "America/New_York",
    industry: "E-commerce",
  });

  const [domains, setDomains] = useState([
    {
      id: 1,
      domain: "acme.com",
      status: "verified",
      addedAt: "2024-01-10",
      verifiedAt: "2024-01-10",
    },
    {
      id: 2,
      domain: "app.acme.com",
      status: "verified",
      addedAt: "2024-01-12",
      verifiedAt: "2024-01-12",
    },
    {
      id: 3,
      domain: "staging.acme.com",
      status: "pending",
      addedAt: "2024-01-14",
      verifiedAt: null,
    },
  ]);

  const [newDomain, setNewDomain] = useState("");
  const [notifications, setNotifications] = useState({
    emailEnabled: true,
    webhookEnabled: true,
    apiLimitAlerts: true,
    securityAlerts: true,
    usageReports: false,
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    ipWhitelist: ["192.168.1.0/24", "10.0.0.0/8"],
    allowedOrigins: ["https://acme.com", "https://app.acme.com"],
  });

  const addDomain = () => {
    if (newDomain.trim()) {
      const domain = {
        id: Date.now(),
        domain: newDomain.trim(),
        status: "pending",
        addedAt: new Date().toISOString().split('T')[0],
        verifiedAt: null,
      };
      setDomains([...domains, domain]);
      setNewDomain("");
    }
  };

  const removeDomain = (id) => {
    setDomains(domains.filter(d => d.id !== id));
  };

  const verifyDomain = (id) => {
    setDomains(domains.map(d => 
      d.id === id 
        ? { ...d, status: "verified", verifiedAt: new Date().toISOString().split('T')[0] }
        : d
    ));
  };

  const tabs = [
    { id: "business", label: "Business Info", icon: Building },
    { id: "domains", label: "Allowed Domains", icon: Globe },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div
      className={`p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto min-h-screen ${
        theme === "dark" ? "bg-black" : "bg-gray-50/50"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Settings
          </h1>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            Configure your account, security, and integration settings
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
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

        {/* Business Information */}
        {activeTab === "business" && (
          <div
            className={`backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${
              theme === "dark"
                ? "bg-zinc-800/50 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h2
              className={`text-xl font-semibold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Business Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Company Name
                </label>
                <input
                  type="text"
                  value={businessInfo.companyName}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, companyName: e.target.value })}
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
                  Contact Email
                </label>
                <input
                  type="email"
                  value={businessInfo.contactEmail}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, contactEmail: e.target.value })}
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
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={businessInfo.phoneNumber}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, phoneNumber: e.target.value })}
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
                  Website
                </label>
                <input
                  type="url"
                  value={businessInfo.website}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
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
                  Industry
                </label>
                <select
                  value={businessInfo.industry}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, industry: e.target.value })}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="E-commerce">E-commerce</option>
                  <option value="SaaS">SaaS</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Timezone
                </label>
                <select
                  value={businessInfo.timezone}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, timezone: e.target.value })}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">GMT</option>
                  <option value="Europe/Berlin">CET</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Business Address
                </label>
                <textarea
                  value={businessInfo.address}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                  rows={3}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>
            </div>

            <div className="mt-6">
              <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Allowed Domains */}
        {activeTab === "domains" && (
          <div
            className={`backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${
              theme === "dark"
                ? "bg-zinc-800/50 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h2
              className={`text-xl font-semibold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Allowed Domains
            </h2>

            <p
              className={`text-sm mb-6 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Add domains where your chat widget and API calls are allowed to originate from.
            </p>

            {/* Add Domain */}
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                placeholder="example.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className={`flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
              <button
                onClick={addDomain}
                className="flex items-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Domain
              </button>
            </div>

            {/* Domains List */}
            <div className="space-y-3">
              {domains.map((domain) => (
                <div
                  key={domain.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    theme === "dark"
                      ? "border-gray-600 bg-gray-700/30"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div>
                      <p
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {domain.domain}
                      </p>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Added: {domain.addedAt}
                        {domain.verifiedAt && ` • Verified: ${domain.verifiedAt}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        domain.status === "verified"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {domain.status}
                    </span>
                    {domain.status === "pending" && (
                      <button
                        onClick={() => verifyDomain(domain.id)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        Verify
                      </button>
                    )}
                    <button
                      onClick={() => removeDomain(domain.id)}
                      className="p-2 rounded-lg transition-colors hover:bg-red-500/10 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === "security" && (
          <div
            className={`backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${
              theme === "dark"
                ? "bg-zinc-800/50 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h2
              className={`text-xl font-semibold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Security Settings
            </h2>

            <div className="space-y-6">
              {/* Two-Factor Authentication */}
              <div
                className={`p-4 rounded-lg border ${
                  theme === "dark"
                    ? "border-gray-600 bg-gray-700/30"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Two-Factor Authentication
                    </h3>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={security.twoFactorEnabled}
                      onChange={(e) => setSecurity({ ...security, twoFactorEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              {/* IP Whitelist */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  IP Whitelist (Optional)
                </label>
                <p
                  className={`text-sm mb-3 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Restrict API access to specific IP addresses or ranges
                </p>
                <textarea
                  value={security.ipWhitelist.join('\n')}
                  onChange={(e) => setSecurity({ 
                    ...security, 
                    ipWhitelist: e.target.value.split('\n').filter(ip => ip.trim())
                  })}
                  rows={4}
                  placeholder="192.168.1.0/24&#10;10.0.0.0/8"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 font-mono ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              {/* Allowed Origins */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Allowed CORS Origins
                </label>
                <p
                  className={`text-sm mb-3 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Define which origins can make cross-origin requests to the API
                </p>
                <textarea
                  value={security.allowedOrigins.join('\n')}
                  onChange={(e) => setSecurity({ 
                    ...security, 
                    allowedOrigins: e.target.value.split('\n').filter(origin => origin.trim())
                  })}
                  rows={4}
                  placeholder="https://yourdomain.com&#10;https://app.yourdomain.com"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 font-mono ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>
            </div>

            <div className="mt-6">
              <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <Save className="w-4 h-4 mr-2" />
                Save Security Settings
              </button>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === "notifications" && (
          <div
            className={`backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${
              theme === "dark"
                ? "bg-zinc-800/50 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h2
              className={`text-xl font-semibold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Notification Preferences
            </h2>

            <div className="space-y-4">
              {[
                {
                  key: "emailEnabled",
                  title: "Email Notifications",
                  description: "Receive email alerts for important events"
                },
                {
                  key: "webhookEnabled",
                  title: "Webhook Notifications",
                  description: "Send real-time notifications to your webhooks"
                },
                {
                  key: "apiLimitAlerts",
                  title: "API Limit Alerts",
                  description: "Get notified when approaching API rate limits"
                },
                {
                  key: "securityAlerts",
                  title: "Security Alerts",
                  description: "Receive alerts for suspicious account activity"
                },
                {
                  key: "usageReports",
                  title: "Weekly Usage Reports",
                  description: "Get weekly summaries of your API usage"
                },
              ].map((setting) => (
                <div
                  key={setting.key}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    theme === "dark"
                      ? "border-gray-600 bg-gray-700/30"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div>
                    <h3
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {setting.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {setting.description}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[setting.key]}
                      onChange={(e) => setNotifications({ 
                        ...notifications, 
                        [setting.key]: e.target.checked 
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <Save className="w-4 h-4 mr-2" />
                Save Notification Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
