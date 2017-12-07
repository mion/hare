class Editor
  constructor: (opts) ->
    @parser = opts.parser
    @programStack = [ opts.program ]
    @cursorStack = [ opts.cursor ]
  # latest version of the program
  currentProgram: () ->
    _.last(@programStack)
  currentCursor: () ->
    _.last(@cursorStack)
  # if successful, pushes the result the @programStack
  # and the @cursorStack
  doCommand: (cmd) ->
    result = cmd.execute(@currentProgram, @cursor)
    if result.error === null
      @programStack.push(result.updatedProgram)
      @cursorStack.push(result.updatedCursor)
      return true
    else
      console.warn("Command failed:", cmd)
      return false

class DoNothingCommand
  constructor: () ->
  execute: (program, cursor) ->
    result =
      updatedProgram: program
      updatedCursor: cursor
    return result

class MoveRightCommand
  constructor: () ->
  execute: (program, cursor) ->
    result =
      updatedProgram: program
      updatedCursor: cursor
    return result

class CommandCreator
  constructor: () ->
  create: (name) ->
    if name === 'MOVE_RIGHT'
      return new MoveRightCommand()
    else
      return new DoNothingCommand()

class KeyBinder
  constructor: () ->
    @commandCreator = new CommandCreator()
    @defaultBindings = {
      'l': 'MOVE_RIGHT'
    }
    @keyStringForKeyCode =
      76: 'l'
  commandFor: (keyCode) ->
    key = @keyStringForKeyCode[keyCode]
    commandName = @defaultBindings[key]
    return @commandCreator.create(commandName)

class EditorController
  constructor: (opts) ->
    @keyBinder = opts.keyBinder
    @editor = opts.editor
  handleKeyDown: (keyCode) ->
    cmd = @keyBinder.commandFor(keyCode)
    result = editor.doCommand(cmd)
    editorView = new EditorView
      program: editor.currentProgram()
      cursor: editor.currentCursor()
    editorView.render()
