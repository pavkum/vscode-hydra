import * as vscode from 'vscode';

export class HydraQuickPick implements vscode.QuickPickItem {
    label: string;
    description: string;

    constructor(label: string, description: string) {
        this.label = label;
        this.description = description;
    }
}