import APINode from "./api/apiNode";
import InitialNode from "./trigger/initialNode";
import TriggerNode from "./trigger/triggerNode";

export const nodeTypes = {
    // add custom node types here
    initialNode: InitialNode,
    triggerNode: TriggerNode,
    apiNode: APINode,
};
