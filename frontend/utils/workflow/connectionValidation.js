// Connection validation utilities for workflow nodes

/**
 * Node types that can start workflows (no incoming connections allowed)
 */
export const STARTING_NODE_TYPES = ["triggerNode", "webhookNode", "cronNode"];

/**
 * Node types that end workflows (no outgoing connections allowed)
 */
export const ENDPOINT_NODE_TYPES = ["emailNode", "responseNode"];

/**
 * Connection limits for specific node types
 */
export const CONNECTION_LIMITS = {
  conditionNode: {
    maxOutgoing: 2, // true/false branches
    description: "Condition nodes can only have 2 outgoing connections (true/false)"
  },
  triggerNode: {
    maxOutgoing: 3,
    description: "Trigger nodes can have maximum 3 outgoing connections"
  },
  emailNode: {
    maxOutgoing: 0,
    description: "Email nodes are endpoints and cannot have outgoing connections"
  },
  responseNode: {
    maxOutgoing: 0,
    description: "Response nodes are endpoints and cannot have outgoing connections"
  }
};

/**
 * Validates if a connection between two nodes is allowed
 * @param {Object} sourceNode - The source node
 * @param {Object} targetNode - The target node
 * @param {Array} existingEdges - Current edges in the workflow
 * @returns {Object} - { isValid: boolean, message: string }
 */
export function validateConnection(sourceNode, targetNode, existingEdges) {
  // Check if connecting to starting nodes
  if (STARTING_NODE_TYPES.includes(targetNode.type)) {
    return {
      isValid: false,
      message: "❌ Cannot connect to starting nodes (triggers, webhooks, cron jobs)"
    };
  }

  // Check if connecting from endpoint nodes
  if (ENDPOINT_NODE_TYPES.includes(sourceNode.type)) {
    return {
      isValid: false,
      message: "❌ Cannot connect from endpoint nodes (email, response)"
    };
  }

  // Check for duplicate connections
  const existingConnection = existingEdges.find(
    (edge) => edge.source === sourceNode.id && edge.target === targetNode.id
  );
  if (existingConnection) {
    return {
      isValid: false,
      message: "⚠️ Connection already exists between these nodes"
    };
  }

  // Check connection limits
  const sourceConnections = existingEdges.filter(
    (edge) => edge.source === sourceNode.id
  );

  const sourceLimit = CONNECTION_LIMITS[sourceNode.type];
  if (sourceLimit && sourceConnections.length >= sourceLimit.maxOutgoing) {
    return {
      isValid: false,
      message: `⚠️ ${sourceLimit.description}`
    };
  }

  // Check for self-connections
  if (sourceNode.id === targetNode.id) {
    return {
      isValid: false,
      message: "❌ Cannot connect a node to itself"
    };
  }

  return {
    isValid: true,
    message: "✅ Valid connection"
  };
}

/**
 * Gets the maximum number of input connections allowed for a node type
 * @param {string} nodeType - The type of the node
 * @returns {number} - Maximum input connections (-1 for unlimited)
 */
export function getMaxInputConnections(nodeType) {
  const limits = {
    triggerNode: 0, // Starting nodes don't accept inputs
    webhookNode: 0,
    cronNode: 0,
  };

  return limits[nodeType] ?? -1; // -1 means unlimited
}

/**
 * Gets the maximum number of output connections allowed for a node type
 * @param {string} nodeType - The type of the node
 * @returns {number} - Maximum output connections (-1 for unlimited)
 */
export function getMaxOutputConnections(nodeType) {
  const limits = {
    emailNode: 0, // Endpoint nodes don't have outputs
    responseNode: 0,
    conditionNode: 2, // True/false branches
    triggerNode: 3,
  };

  return limits[nodeType] ?? -1; // -1 means unlimited
}

/**
 * Checks if a node can accept more incoming connections
 * @param {Object} node - The target node
 * @param {Array} existingEdges - Current edges in the workflow
 * @returns {boolean} - Whether the node can accept more inputs
 */
export function canAcceptInput(node, existingEdges) {
  const maxInputs = getMaxInputConnections(node.type);
  if (maxInputs === -1) return true; // Unlimited

  const currentInputs = existingEdges.filter(edge => edge.target === node.id);
  return currentInputs.length < maxInputs;
}

/**
 * Checks if a node can create more outgoing connections
 * @param {Object} node - The source node
 * @param {Array} existingEdges - Current edges in the workflow
 * @returns {boolean} - Whether the node can create more outputs
 */
export function canCreateOutput(node, existingEdges) {
  const maxOutputs = getMaxOutputConnections(node.type);
  if (maxOutputs === -1) return true; // Unlimited

  const currentOutputs = existingEdges.filter(edge => edge.source === node.id);
  return currentOutputs.length < maxOutputs;
}

/**
 * Gets connection rules description for a node type
 * @param {string} nodeType - The type of the node
 * @returns {string} - Human-readable description of connection rules
 */
export function getConnectionRules(nodeType) {
  if (STARTING_NODE_TYPES.includes(nodeType)) {
    return "🟢 Starting point: No incoming connections allowed";
  }

  if (ENDPOINT_NODE_TYPES.includes(nodeType)) {
    return "🔴 Endpoint: No outgoing connections allowed";
  }

  const limit = CONNECTION_LIMITS[nodeType];
  if (limit) {
    return `⚡ ${limit.description}`;
  }

  return "🔵 Processing node: Multiple inputs/outputs allowed";
}

/**
 * Validates an entire workflow for connection consistency
 * @param {Array} nodes - All nodes in the workflow
 * @param {Array} edges - All edges in the workflow
 * @returns {Object} - { isValid: boolean, errors: Array<string> }
 */
export function validateWorkflow(nodes, edges) {
  const errors = [];

  // Check for orphaned nodes (no connections)
  const connectedNodeIds = new Set();
  edges.forEach(edge => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });

  const orphanedNodes = nodes.filter(node => !connectedNodeIds.has(node.id));
  if (orphanedNodes.length > 0) {
    errors.push(`Warning: ${orphanedNodes.length} unconnected nodes found`);
  }

  // Check for starting nodes
  const startingNodes = nodes.filter(node => STARTING_NODE_TYPES.includes(node.type));
  if (startingNodes.length === 0) {
    errors.push("Error: Workflow must have at least one starting node (trigger, webhook, or cron job)");
  }

  // Check for endpoint nodes
  const endpointNodes = nodes.filter(node => ENDPOINT_NODE_TYPES.includes(node.type));
  if (endpointNodes.length === 0) {
    errors.push("Warning: Workflow should have at least one endpoint node (email or response)");
  }

  // Validate each connection
  edges.forEach(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);

    if (!sourceNode || !targetNode) {
      errors.push(`Error: Invalid connection - missing source or target node`);
      return;
    }

    const validation = validateConnection(sourceNode, targetNode, edges);
    if (!validation.isValid) {
      errors.push(`Error: ${validation.message}`);
    }
  });

  return {
    isValid: errors.filter(e => e.startsWith('Error:')).length === 0,
    errors
  };
}
