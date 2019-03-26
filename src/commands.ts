import {HydraCommandInterface, HydraCommandRuntimeInterface, HydraExecutionStatusInterface } from './hydra-command-interface';
import {HydraExecutionStatus} from './hydra-execution-status';
import * as vscode from 'vscode';

export default class CommandExecuter {
    private availableCommands: HydraCommandInterface[] = [];
    private executionContext: HydraCommandInterface[] = [];

    constructor() {
        this.refresh();
    }

    clear() {
        this.executionContext = [];
    }

    public refresh(): void {
        const rawCommands: HydraCommandInterface[]= vscode.workspace.getConfiguration().get('hydra.commands') || [];

        this.availableCommands = rawCommands;
    }

    public execute(command:string): HydraExecutionStatusInterface {
        if (!this.availableCommands.length) {
            return {
                status: HydraExecutionStatus.NO_CONFIG
            };
        }

        const fullCommand = command;
        if (!this.executionContext.length) {
            this.executionContext = this.availableCommands;
        }

        const chars = fullCommand.split('');

        let currentCommandLevel: HydraCommandInterface | undefined;
        let i = 0;
        for (i = 0; i < chars.length; i++) {
            const char = chars[i];
            currentCommandLevel = undefined;
            currentCommandLevel = this.executionContext.find(function(command) {
                return command.key === char;
            });

            // expect command to be found at each level. Else throw error
            if (!currentCommandLevel) {
                break;
            } else {
                this.executionContext = currentCommandLevel.children || [];
            }
        }

        if (i < chars.length || !currentCommandLevel) {
            // command not found
            this.executionContext = [];
            return {
                status: HydraExecutionStatus.COMMAND_NOT_FOUND
            };
        }

        if (currentCommandLevel && currentCommandLevel.children) {
            // partial command
            this.executionContext = currentCommandLevel.children;
            return {
                status: HydraExecutionStatus.PARTIAL_COMMAND,
                children: currentCommandLevel.children
            };
        }

        if (currentCommandLevel && currentCommandLevel.commands) {
            // execute commands
            const commands = currentCommandLevel.commands || [];

            // TODO handle async execution
            commands.forEach(command => {
                vscode.commands.executeCommand(command);
            });

            this.executionContext = [];
            return {
                status: HydraExecutionStatus.SUCCESS
            };
        } else {
            // both commands and children are absent. Nothing to execute
            this.executionContext = [];
            return { 
                status: HydraExecutionStatus.COMMAND_NOT_FOUND 
            };
        }
    }
}