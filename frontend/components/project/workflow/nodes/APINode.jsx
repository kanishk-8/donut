"use client";
import React from "react";
import { useTheme } from "@/context/themecontext";
import { Handle, Position } from "@xyflow/react";
import { Globe } from "lucide-react";

const APINode = React.memo(function APINode({ data, selected }) {
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
        isConnectable={true}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-400 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-500"
        isConnectable={true}
      />

      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
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
              API
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
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-400 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-500"
        isConnectable={true}
      />
    </div>
  );
});

export default APINode;
