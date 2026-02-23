// Workflow data utilities and initial configurations

/**
 * Initial nodes for the workflow canvas
 */
export const initialNodes = [
  {
    id: "1",
    type: "triggerNode",
    position: { x: 100, y: 100 },
    data: {
      label: "Start",
      description: "When a customer sends a message",
    },
  },
  {
    id: "2",
    type: "aiNode",
    position: { x: 100, y: 250 },
    data: {
      label: "AI Agent",
      description: "Process customer message with AI",
    },
  },
  {
    id: "3",
    type: "chatNode",
    position: { x: 100, y: 400 },
    data: {
      label: "Send Response",
      description: "Reply to customer",
    },
  },
];

/**
 * Initial edges for the workflow canvas
 */
export const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "smoothstep",
    style: { stroke: "#6b7280", strokeWidth: 2 },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    type: "smoothstep",
    style: { stroke: "#6b7280", strokeWidth: 2 },
  },
];

/**
 * Default edge options for new connections
 */
export const defaultEdgeOptions = {
  type: "smoothstep",
  style: { stroke: "#6b7280", strokeWidth: 2 },
};

/**
 * Connection line style for dragging connections
 */
export const connectionLineStyle = {
  stroke: "#6b7280",
  strokeWidth: 2,
};

/**
 * React Flow default viewport settings
 */
export const defaultViewport = { x: 0, y: 0, zoom: 1 };

/**
 * React Flow zoom and pan settings
 */
export const flowSettings = {
  minZoom: 0.1,
  maxZoom: 2,
  snapToGrid: true,
  snapGrid: [20, 20],
  attributionPosition: "bottom-left",
};

/**
 * Creates a new node with default properties
 * @param {string} id - Unique identifier for the node
 * @param {string} type - Type of the node
 * @param {Object} position - Position {x, y} on the canvas
 * @param {string} label - Display label for the node
 * @param {string} description - Description of the node's purpose
 * @returns {Object} - New node object
 */
export function createNode(id, type, position, label, description) {
  return {
    id: id.toString(),
    type,
    position,
    data: {
      label,
      description,
      // Add any additional default data based on node type
      ...getDefaultNodeData(type),
    },
  };
}

/**
 * Gets default data for specific node types
 * @param {string} nodeType - Type of the node
 * @returns {Object} - Default data object
 */
export function getDefaultNodeData(nodeType) {
  const defaults = {
    triggerNode: {
      method: "POST",
    },
    aiNode: {
      model: "GPT-4",
      temperature: 0.7,
    },
    apiNode: {
      method: "GET",
      timeout: 30000,
    },
    databaseNode: {
      timeout: 5000,
    },
    authNode: {
      provider: "JWT",
    },
    emailNode: {
      provider: "SendGrid",
    },
    responseNode: {
      statusCode: "200",
      contentType: "application/json",
    },
    cronNode: {
      schedule: "0 0 * * *", // Daily at midnight
      timezone: "UTC",
    },
    webhookNode: {
      method: "POST",
    },
  };

  return defaults[nodeType] || {};
}

/**
 * Creates a new edge with default properties
 * @param {string} source - Source node ID
 * @param {string} target - Target node ID
 * @param {string} id - Optional edge ID
 * @returns {Object} - New edge object
 */
export function createEdge(source, target, id = null) {
  return {
    id: id || `e${source}-${target}`,
    source,
    target,
    ...defaultEdgeOptions,
  };
}

/**
 * Exports workflow data to JSON
 * @param {Array} nodes - Current nodes
 * @param {Array} edges - Current edges
 * @param {Object} metadata - Additional workflow metadata
 * @returns {Object} - Complete workflow data
 */
export function exportWorkflow(nodes, edges, metadata = {}) {
  return {
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    metadata: {
      name: metadata.name || "Untitled Workflow",
      description: metadata.description || "",
      type: metadata.type || "mixed",
      tags: metadata.tags || [],
      ...metadata,
    },
    workflow: {
      nodes,
      edges,
    },
    statistics: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      nodeTypes: getNodeTypeStatistics(nodes),
    },
  };
}

/**
 * Imports workflow data from JSON
 * @param {Object} workflowData - Imported workflow data
 * @returns {Object} - { nodes, edges, metadata }
 */
export function importWorkflow(workflowData) {
  try {
    const { workflow, metadata } = workflowData;

    if (!workflow || !workflow.nodes || !workflow.edges) {
      throw new Error("Invalid workflow format");
    }

    return {
      nodes: workflow.nodes,
      edges: workflow.edges,
      metadata: metadata || {},
    };
  } catch (error) {
    console.error("Failed to import workflow:", error);
    throw new Error("Failed to import workflow: " + error.message);
  }
}

/**
 * Gets statistics about node types in the workflow
 * @param {Array} nodes - Current nodes
 * @returns {Object} - Node type counts
 */
export function getNodeTypeStatistics(nodes) {
  const stats = {};

  nodes.forEach(node => {
    stats[node.type] = (stats[node.type] || 0) + 1;
  });

  return stats;
}

/**
 * Generates a unique node ID
 * @param {Array} existingNodes - Current nodes to avoid ID conflicts
 * @returns {string} - Unique node ID
 */
export function generateNodeId(existingNodes = []) {
  const existingIds = new Set(existingNodes.map(node => node.id));
  let id = 1;

  while (existingIds.has(id.toString())) {
    id++;
  }

  return id.toString();
}

/**
 * Generates a unique edge ID
 * @param {Array} existingEdges - Current edges to avoid ID conflicts
 * @param {string} source - Source node ID
 * @param {string} target - Target node ID
 * @returns {string} - Unique edge ID
 */
export function generateEdgeId(existingEdges = [], source, target) {
  const baseId = `e${source}-${target}`;
  const existingIds = new Set(existingEdges.map(edge => edge.id));

  if (!existingIds.has(baseId)) {
    return baseId;
  }

  let counter = 1;
  while (existingIds.has(`${baseId}-${counter}`)) {
    counter++;
  }

  return `${baseId}-${counter}`;
}

/**
 * Clones a node with a new ID and position
 * @param {Object} node - Node to clone
 * @param {Array} existingNodes - Current nodes
 * @param {Object} positionOffset - Offset for new position {x, y}
 * @returns {Object} - Cloned node
 */
export function cloneNode(node, existingNodes, positionOffset = { x: 50, y: 50 }) {
  const newId = generateNodeId(existingNodes);

  return {
    ...node,
    id: newId,
    position: {
      x: node.position.x + positionOffset.x,
      y: node.position.y + positionOffset.y,
    },
    data: {
      ...node.data,
      label: `${node.data.label} Copy`,
    },
  };
}

/**
 * Validates workflow data structure
 * @param {Object} workflowData - Workflow data to validate
 * @returns {Object} - { isValid: boolean, errors: Array<string> }
 */
export function validateWorkflowData(workflowData) {
  const errors = [];

  if (!workflowData || typeof workflowData !== 'object') {
    errors.push("Workflow data must be an object");
    return { isValid: false, errors };
  }

  if (!workflowData.workflow) {
    errors.push("Missing workflow property");
  } else {
    if (!Array.isArray(workflowData.workflow.nodes)) {
      errors.push("Workflow nodes must be an array");
    }

    if (!Array.isArray(workflowData.workflow.edges)) {
      errors.push("Workflow edges must be an array");
    }
  }

  // Validate node structure
  if (workflowData.workflow?.nodes) {
    workflowData.workflow.nodes.forEach((node, index) => {
      if (!node.id) {
        errors.push(`Node at index ${index} missing required 'id' property`);
      }

      if (!node.type) {
        errors.push(`Node at index ${index} missing required 'type' property`);
      }

      if (!node.position || typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
        errors.push(`Node at index ${index} missing or invalid position`);
      }
    });
  }

  // Validate edge structure
  if (workflowData.workflow?.edges) {
    workflowData.workflow.edges.forEach((edge, index) => {
      if (!edge.id) {
        errors.push(`Edge at index ${index} missing required 'id' property`);
      }

      if (!edge.source) {
        errors.push(`Edge at index ${index} missing required 'source' property`);
      }

      if (!edge.target) {
        errors.push(`Edge at index ${index} missing required 'target' property`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
