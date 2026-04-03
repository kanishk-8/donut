import APINode from "./apiNode";
import InitialNode from "./initialNode";
import { TriggerNode } from "./triggerNode";

export const nodeTypes = {
    // add custom node types here
    initialNode: InitialNode,
    triggerNode: TriggerNode,
    apiNode: APINode,
};
