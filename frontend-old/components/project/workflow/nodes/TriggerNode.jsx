"use client";
import React from "react";
import { useTheme } from "@/context/themecontext";
import { Handle, Position } from "@xyflow/react";
import { Zap, Play } from "lucide-react";

const TriggerNode = React.memo(function TriggerNode({ data, selected }) {
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
      {/* No target handle - HTTP triggers are starting points */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center opacity-75">
        <Play className="w-2 h-2 text-white" />
      </div>

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
        className="w-3 h-3 bg-green-600 border-2 border-white rounded-full opacity-75 group-hover:opacity-100 transition-opacity hover:bg-green-500"
        isConnectable={true}
      />
    </div>
  );
});

export default TriggerNode;
