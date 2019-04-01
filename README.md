# hydra README
Welcome to Hydra!! A new way to use vscode with semantic keyboard shortcuts. This extension is inspired by emacs hydra https://github.com/abo-abo/hydra although it defers from it a lot.

## Features

- semantic keyboard shortcuts
- no need to remember all the shortcuts, invoke partially and get hints along the way
- no limitation on the number of keys used to define a keyboard shortcuts
- execute multiple commands for a shortcut

## Small demo

- suggestions for partial commands
  ![partial](images/hydra-suggestions.gif)

- full command execution
  ![full command](images/hydra-full.gif)

## Extension Settings

The extension provides the following commands

* `hydra.show`: opens quick input for taking input from users. Default shortcut `alt+p`

## Configurations

* `hydra.commands`: Property for configuring hydra shortcuts

Please refer to following files for sample configuration

* `File operations`: [file operations](sample-config/file.json)
* `Workbench operations`: [workbench operations](sample-config/workbench.json)

## Roadmap

- [x] Show suggestions in quick open menu
- [ ] Ability to pass static arguments to commands
- [ ] Ability to pass dynamic arguments to commands

## Release Notes (Beta)

The extension is in beta phase and the following features are supported

- Autoreload of configuration
- providing descriptive hint for shortcuts when partial commands are invoked
- execution of commands via quick input
