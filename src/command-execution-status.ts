import { HydraExecutionStatus } from "./hydra-execution-status";

export interface CommandExecutionStatus {
    status: HydraExecutionStatus;
    response: string;
}