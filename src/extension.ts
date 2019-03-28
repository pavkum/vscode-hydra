import * as vscode from 'vscode';
import CommandExecutor from './commands';
import { HydraExecutionStatus } from './hydra-execution-status';
import { HydraQuickPick } from './hydra-quickpick';

export function activate(context: vscode.ExtensionContext) {

	const commandExecutor = new CommandExecutor();

	async function handleInput(value: string | undefined | HydraQuickPick[]) {
		let userInput;
		if (Array.isArray(value)) {
			// means hydraQuickPick
			userInput = value[0].label;
		} else {
			// value is string or undefined
			userInput = value;
		}
		if (!userInput) {
			commandExecutor.clear();
			return;
		}

		const response = await commandExecutor.execute(userInput);
		switch (response.status) {
			case HydraExecutionStatus.SUCCESS:
				commandExecutor.clear();
				break;

			case HydraExecutionStatus.PARTIAL_COMMAND:
				const children = response.children || [];
				if (children.length === 0) {
					commandExecutor.clear();
				}

				const input = vscode.window.createQuickPick<HydraQuickPick>();

				input.items = children.map(function (child) {
					return new HydraQuickPick(child.key, child.desc);
				});

				input.onDidHide(function () {
					input.dispose();
				});

				input.onDidChangeSelection(function (items) {
					handleInput(items);
					input.hide();
				});

				input.show();

				break;

			case HydraExecutionStatus.COMMAND_NOT_FOUND:
				commandExecutor.clear();
				vscode.window.showErrorMessage(`Entered command ${userInput} not configured`);
				break;

			case HydraExecutionStatus.NO_CONFIG:
				commandExecutor.clear();
				vscode.window.showErrorMessage('Define `hydra.commands` before using');
				break;
		}
	}

	context.subscriptions.push(vscode.commands.registerCommand('hydra.show', () => {
		// clear before fresh start
		commandExecutor.clear();
		vscode.window.showInputBox({placeHolder: 'Enter command'}).then(handleInput);
	}));

	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(event => {
		commandExecutor.refresh();
	}));
}

// this method is called when your extension is deactivated
export function deactivate() {}
			