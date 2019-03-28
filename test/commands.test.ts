import * as vscode from 'vscode';
import * as assert from 'assert';
import CommandExecutor from '../src/commands';
import { HydraExecutionStatus } from '../src/hydra-execution-status';
import { updateConfiguration } from './utils.test';


suite('Hydra commands', function () {

    test('should return status no config when not defined', async function () {
        await updateConfiguration('commands', []);

        const commandExecutor = new CommandExecutor();
        const response = await commandExecutor.execute('w');

        assert.equal(response.status, HydraExecutionStatus.NO_CONFIG);
    });

    test('should execute single valid command', async function () {
        await updateConfiguration('commands', [{
            "key": "w",
            "desc": "single command test",
            "commands": [
                "workbench.view.scm"
            ]
        }]);

        const commandExecutor = new CommandExecutor();
        const response = await commandExecutor.execute('w');

        assert.equal(response.status, HydraExecutionStatus.SUCCESS);
    });

    test('should execute multiple valid commands', async () => {
        await updateConfiguration('commands', [{
            "key": "w",
            "desc": "single command test",
            "commands": [
                "workbench.view.scm",
                "workbench.view.explorer"
            ]
        }]);

        const commandExecutor = new CommandExecutor();
        const response = await commandExecutor.execute('w');

        assert.equal(response.status, HydraExecutionStatus.SUCCESS);
    });

    test('should prefer children when both children and commands are present', async () => {
        await updateConfiguration('commands', [{
            "key": "w",
            "desc": "single command test",
            "children": [
                {
                    "key": "x",
                    "desc": "dummy command",
                    "commands": [
                        "workbench.view.scm"
                    ]
                }
            ],
            "commands": [
                "workbench.view.scm"
            ]
        }]);

        const commandExecutor = new CommandExecutor();
        const response = await commandExecutor.execute('w');

        assert.equal(response.status, HydraExecutionStatus.PARTIAL_COMMAND);
    });

    test('should throw error when trying to execute with wrong keys', async () => {
        await updateConfiguration('commands', [{
            "key": "w",
            "desc": "single command test",
            "commands": [
                "workbench.view.scm"
            ]
        }]);

        const commandExecutor = new CommandExecutor();
        const response = await commandExecutor.execute('s');

        assert.equal(response.status, HydraExecutionStatus.COMMAND_NOT_FOUND);
    });

    test('should throw error when invalid command is configured', async () => {
        await updateConfiguration('commands', [{
            "key": "w",
            "desc": "invalid command test",
            "commands": [
                "wrong.command"
            ]
        }]);

        const commandExecutor = new CommandExecutor();
        const response = await commandExecutor.execute('w');

        assert.equal(response.status, HydraExecutionStatus.ERROR);
    });

    test('when children and commands are preset and partial command executed, give pref to children', async () => {
        await updateConfiguration('commands', [{
            "key": "w",
            "desc": "invalid command test",
            "children": [{
                "key": "s",
                "desc": "open scm",
                "commands": [
                    "workbench.view.scm"
                ]
            }],
            "commands": [
                "wrong.command"
            ]
        }]);

        const commandExecutor = new CommandExecutor();
        const response = await commandExecutor.execute('w');

        assert.equal(response.status, HydraExecutionStatus.PARTIAL_COMMAND);
    });

    test('command not found if children and commands are not configured', async () => {
        await updateConfiguration('commands', [{
            "key": "w",
            "desc": "empty config"
        }]);

        const commandExecutor = new CommandExecutor();
        const response = await commandExecutor.execute('w');

        assert.equal(response.status, HydraExecutionStatus.COMMAND_NOT_FOUND);
    });

    test('command not found if children are empty', async () => {
        await updateConfiguration('commands', [{
            "key": "w",
            "desc": "empty config",
            "children": []
        }]);

        const commandExecutor = new CommandExecutor();
        const response = await commandExecutor.execute('w');

        assert.equal(response.status, HydraExecutionStatus.COMMAND_NOT_FOUND);
    });

    test('should support execution of deep commands', async () => {
        await updateConfiguration('commands', [{
            "key": "w",
            "desc": "invalid command test",
            "children": [{
                "key": "e",
                "desc": "open explorer",
                "commands": [
                    "workbench.view.explorer"
                ]
            }],
            "commands": [
                "wrong.command"
            ]
        }]);

        const commandExecutor = new CommandExecutor();
        const response = await commandExecutor.execute('we');

        assert.equal(response.status, HydraExecutionStatus.SUCCESS);
    });
});