import { commands } from "vscode";
import { type } from "os";
import { HydraExecutionStatus } from "./hydra-execution-status";

export interface HydraCommandInterface {
    key: string;
    desc: string;
    commands?: string[];
    children?: HydraCommandInterface[];
}

export interface HydraExecutionStatusInterface {
    status: HydraExecutionStatus;
    children?: HydraCommandInterface[];
}