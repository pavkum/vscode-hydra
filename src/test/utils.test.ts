import * as vscode from 'vscode';

export async function updateConfiguration(key: string, value: any) {
    const settings = vscode.workspace.getConfiguration('hydra');
    await settings.update(key, value);
}