import * as vscode from 'vscode';
import { HydraCommandInterface } from './hydra-command-interface';

export default class HydraAction extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        private readonly key: string,
        public readonly actions: HydraCommandInterface[] | string[]
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);
    }

    get description(): string {
        return `Press key: ${this.key}`;
    }

    get tooltip(): string {
        return this.label;
    }

    isLeaf(): boolean {
        const actions = this.actions || []
        const firstChild = actions[0];

        if (typeof firstChild === 'string' || actions.length === 0) {
            return true;
        } else {
            return false;
        }
    }

    contextValue = "hydra";
}