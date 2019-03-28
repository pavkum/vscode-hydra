import * as assert from 'assert';
import * as vscode from 'vscode';
import CommandExecuter from '../src/commands';
import { updateConfiguration } from './utils.test';
import { HydraExecutionStatus } from '../src/hydra-execution-status';

// Defines a Mocha test suite to group tests of similar kind together
suite("Hydra commands", function () {
    test("should execute hydra.show", function(done) {
        const promise = vscode.commands.executeCommand("hydra.show");

        promise.then(function () {
            done();
        }, function (error) {
            done(error);
        });
    });

    test('should auto reload configuration', async () => {
        await updateConfiguration('commands', []);

        const commandExecutor = new CommandExecuter();
        const response1 = await commandExecutor.execute('w');

        assert.equal(response1.status, HydraExecutionStatus.NO_CONFIG);

        await updateConfiguration('commands', [{
            "key": "w",
            "desc": "auto reload test",
            "commands": [
                "workbench.view.scm"
            ]
        }]);

        commandExecutor.refresh();

        const response2 = await commandExecutor.execute('w');
        assert.equal(response2.status, HydraExecutionStatus.SUCCESS);
    });
});