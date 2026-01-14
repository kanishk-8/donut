# Workflow Builder Components

This directory contains the modular components for the visual workflow builder that supports both Agent Builder and Backend Builder functionality.

## 📁 Structure

```
components/project/workflow/
├── nodes/           # Individual node components
│   ├── index.js     # Node exports and configuration
│   ├── ChatNode.jsx      # Chat interaction nodes
│   ├── VoiceNode.jsx     # Voice interaction nodes
│   ├── AINode.jsx        # AI processing nodes
│   ├── TriggerNode.jsx   # Workflow triggers
│   ├── DatabaseNode.jsx  # Database operations
│   ├── APINode.jsx       # API endpoints
│   ├── AuthNode.jsx      # Authentication
│   ├── WebhookNode.jsx   # Webhook handlers
│   ├── EmailNode.jsx     # Email services
│   ├── CronNode.jsx      # Scheduled tasks
│   ├── ResponseNode.jsx  # HTTP responses
│   ├── ConditionNode.jsx # Logic conditions
│   ├── CodeNode.jsx      # Custom code
│   └── MicroserviceNode.jsx # Microservices
├── panels/          # Sidebar panels
│   ├── NodesSidebar.jsx  # Component library
│   └── ConfigPanel.jsx   # Node configuration
└── README.md        # This file
```

## 🎯 Node Types

### Agent Builder Nodes
- **ChatNode**: Handle chat interactions and messaging
- **VoiceNode**: Manage voice calls and audio processing
- **AINode**: AI agent processing and LLM integration
- **TriggerNode**: Manual workflow triggers
- **ConditionNode**: Conditional logic branching
- **CodeNode**: Custom code execution

### Backend Builder Nodes
- **APINode**: REST/GraphQL endpoints and gateways
- **DatabaseNode**: Database queries and operations
- **AuthNode**: Authentication and authorization
- **WebhookNode**: Webhook endpoints and handlers
- **CronNode**: Scheduled tasks and jobs
- **EmailNode**: Email service integration
- **ResponseNode**: HTTP response formatting
- **MicroserviceNode**: Microservice components

## 🔧 Usage

### Adding a New Node Type

1. Create a new component file in `nodes/`
2. Follow the existing pattern with proper Handle components
3. Add the component to `nodes/index.js`
4. Add configuration to the appropriate sidebar category

### Node Component Structure

```jsx
import React from "react";
import { useTheme } from "@/context/themecontext";
import { Handle, Position } from "@xyflow/react";
import { IconName } from "lucide-react";

const YourNode = React.memo(function YourNode({ data, selected }) {
  const { theme } = useTheme();

  return (
    <div className={/* styling */}>
      <Handle type="target" position={Position.Top} />

      <div className="p-4">
        {/* Node content */}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

export default YourNode;
```

## 📊 Connection Rules

- **Starting Points** (🟢): No incoming connections
  - TriggerNode, WebhookNode, CronNode

- **Processing Nodes** (🔵): Multiple inputs/outputs allowed
  - AINode, APINode, DatabaseNode, AuthNode, etc.

- **Endpoints** (🔴): No outgoing connections
  - EmailNode, ResponseNode

- **Special Rules**:
  - ConditionNode: Max 2 outputs (true/false)
  - TriggerNode: Max 3 outputs

## 🛠 Utils Location

Utility functions are located in `/utils/workflow/`:
- `connectionValidation.js` - Connection validation logic
- `workflowData.js` - Data management and export/import

## 🎨 Styling

All nodes use:
- Consistent backdrop-blur glass morphism design
- Theme-aware styling (dark/light mode)
- Hover effects and animations
- Color-coded connection handles
- Visual indicators for node types

## 🚀 Features

- **Drag & Drop**: Visual workflow construction
- **Mixed Workflows**: Combine agent and backend nodes
- **Real-time Validation**: Smart connection rules
- **Export/Import**: Save and load workflows
- **Live Configuration**: Edit node properties instantly
- **Visual Feedback**: Clear connection indicators
