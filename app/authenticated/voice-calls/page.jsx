"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/themecontext";
import {
  Phone,
  Play,
  Pause,
  Square,
  Volume2,
  Mic,
  Clock,
  User,
} from "lucide-react";

const VoiceCallsPage = () => {
  const { theme } = useTheme();
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [customerPhone, setCustomerPhone] = useState("+1 (555) 123-4567");

  const mockTranscript = [
    {
      id: 1,
      speaker: "customer",
      text: "Hello, I'm having trouble with my recent order",
      timestamp: "00:00:05",
    },
    {
      id: 2,
      speaker: "ai",
      text: "Hi there! I'd be happy to help you with your order. Could you please provide your order number?",
      timestamp: "00:00:08",
    },
    {
      id: 3,
      speaker: "customer",
      text: "Yes, it's order number 12345",
      timestamp: "00:00:15",
    },
    {
      id: 4,
      speaker: "ai",
      text: "Thank you! I can see your order here. It looks like it was shipped yesterday and should arrive tomorrow. Would you like me to provide tracking details?",
      timestamp: "00:00:18",
    },
  ];

  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const startCall = () => {
    setIsCallActive(true);
    setIsRecording(true);
    setCallDuration(0);
    setTranscript([]);

    // Simulate conversation
    setTimeout(() => {
      setTranscript([mockTranscript[0]]);
    }, 5000);

    setTimeout(() => {
      setTranscript((prev) => [...prev, mockTranscript[1]]);
    }, 8000);

    setTimeout(() => {
      setTranscript((prev) => [...prev, mockTranscript[2]]);
    }, 15000);

    setTimeout(() => {
      setTranscript((prev) => [...prev, mockTranscript[3]]);
    }, 18000);
  };

  const endCall = () => {
    setIsCallActive(false);
    setIsRecording(false);
  };

  const recentCalls = [
    {
      id: 1,
      phone: "+1 (555) 123-4567",
      duration: "3:45",
      status: "completed",
      timestamp: "2 hours ago",
      resolution: "Order status inquiry - Resolved",
    },
    {
      id: 2,
      phone: "+1 (555) 987-6543",
      duration: "1:23",
      status: "completed",
      timestamp: "4 hours ago",
      resolution: "Technical support - Escalated to human",
    },
    {
      id: 3,
      phone: "+1 (555) 456-7890",
      duration: "5:12",
      status: "completed",
      timestamp: "6 hours ago",
      resolution: "Billing inquiry - Resolved",
    },
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
            Voice Call Simulator
          </h1>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            Test and simulate customer calls with your AI voice agent
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Call Simulator */}
          <div>
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
                Call Simulator
              </h2>

              {/* Phone Number Input */}
              <div className="mb-6">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Customer Phone Number
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  disabled={isCallActive}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white disabled:bg-gray-800"
                      : "bg-white border-gray-300 text-gray-900 disabled:bg-gray-100"
                  }`}
                />
              </div>

              {/* Call Status */}
              <div className="text-center mb-6">
                <div
                  className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
                    isCallActive ? "bg-green-500 animate-pulse" : "bg-gray-400"
                  }`}
                >
                  <Phone className="w-10 h-10 text-white" />
                </div>

                <div
                  className={`text-lg font-semibold mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {isCallActive ? "Call in Progress" : "Ready to Call"}
                </div>

                {isCallActive && (
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-green-500" />
                      <span
                        className={`font-mono ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {formatDuration(callDuration)}
                      </span>
                    </div>
                    {isRecording && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1"></div>
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Recording
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Call Controls */}
              <div className="flex justify-center space-x-4">
                {!isCallActive ? (
                  <button
                    onClick={startCall}
                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Start Call
                  </button>
                ) : (
                  <button
                    onClick={endCall}
                    className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    End Call
                  </button>
                )}
              </div>

              {/* Audio Controls */}
              {isCallActive && (
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    className={`p-3 rounded-full transition-colors ${
                      theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <button
                    className={`p-3 rounded-full transition-colors ${
                      isRecording
                        ? "bg-red-600 text-white"
                        : theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Live Transcript */}
          <div>
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
                Live Transcript
              </h2>

              <div
                className={`h-96 overflow-y-auto border rounded-lg p-4 ${
                  theme === "dark"
                    ? "border-gray-600 bg-gray-800/30"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                {transcript.length === 0 ? (
                  <div
                    className={`text-center text-gray-500 mt-20 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <Mic className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>Transcript will appear here during the call</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transcript.map((entry) => (
                      <div
                        key={entry.id}
                        className={`flex ${
                          entry.speaker === "customer"
                            ? "justify-start"
                            : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            entry.speaker === "customer"
                              ? theme === "dark"
                                ? "bg-gray-700 text-gray-200"
                                : "bg-gray-200 text-gray-800"
                              : "bg-indigo-600 text-white"
                          }`}
                        >
                          <div className="flex items-center mb-1">
                            <User className="w-3 h-3 mr-1" />
                            <span className="text-xs font-medium">
                              {entry.speaker === "customer"
                                ? "Customer"
                                : "AI Agent"}
                            </span>
                            <span
                              className={`text-xs ml-2 ${
                                entry.speaker === "customer"
                                  ? theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                  : "text-indigo-200"
                              }`}
                            >
                              {entry.timestamp}
                            </span>
                          </div>
                          <p className="text-sm">{entry.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Calls */}
        <div
          className={`mt-8 backdrop-blur-sm rounded-2xl shadow-lg p-6 border ${
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
            Recent Voice Calls
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
                    Phone Number
                  </th>
                  <th
                    className={`text-left p-4 font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Duration
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
                    Time
                  </th>
                  <th
                    className={`text-left p-4 font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Resolution
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentCalls.map((call) => (
                  <tr
                    key={call.id}
                    className={`border-b ${
                      theme === "dark" ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <td
                      className={`p-4 font-mono ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {call.phone}
                    </td>
                    <td
                      className={`p-4 font-mono ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {call.duration}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        {call.status}
                      </span>
                    </td>
                    <td
                      className={`p-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {call.timestamp}
                    </td>
                    <td
                      className={`p-4 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {call.resolution}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCallsPage;
