// Import all node components
import ChatNode from "./ChatNode";
import VoiceNode from "./VoiceNode";
import AINode from "./AINode";
import TriggerNode from "./TriggerNode";
import DatabaseNode from "./DatabaseNode";
import APINode from "./APINode";
import WebhookNode from "./WebhookNode";
import EmailNode from "./EmailNode";
import ConditionNode from "./ConditionNode";
import CodeNode from "./CodeNode";
import AuthNode from "./AuthNode";
import MicroserviceNode from "./MicroserviceNode";
import CronNode from "./CronNode";
import ResponseNode from "./ResponseNode";

// Export individual components
export {
  ChatNode,
  VoiceNode,
  AINode,
  TriggerNode,
  DatabaseNode,
  APINode,
  WebhookNode,
  EmailNode,
  ConditionNode,
  CodeNode,
  AuthNode,
  MicroserviceNode,
  CronNode,
  ResponseNode,
};

// Node Types Configuration
export const nodeTypes = {
  // Agent Builder
  chatNode: ChatNode,
  voiceNode: VoiceNode,
  aiNode: AINode,
  triggerNode: TriggerNode,
  dataNode: DatabaseNode,

  // Backend Builder
  apiNode: APINode,
  webhookNode: WebhookNode,
  emailNode: EmailNode,
  databaseNodeBackend: DatabaseNode,

  // Shared
  conditionNode: ConditionNode,
  codeNode: CodeNode,
  authNode: AuthNode,
  microserviceNode: MicroserviceNode,
  cronNode: CronNode,
  responseNode: ResponseNode,
};
