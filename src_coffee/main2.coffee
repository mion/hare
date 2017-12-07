hareSourceCode = '(map (list 1 2 3) Math.sqrt)'
parser = new Parser()
# parser.parse(hareSourceCode)
# => ['map', ['list', 1, 2, 3], 'Math.sqrt']
compiler = new Compiler
  parser: parser
# compiler.compile(source)
# => '[1, 2, 3].map(Math.sqrt)'

cursor = new Cursor
  position: [0]

editor = new Editor
  compiler: compiler
  hareSourceCode: '(console.log "Hello, world!")'
  cursor: cursor

keyBinder = new KeyBinder()

editorController = new EditorController
  keyBinder: keyBinder
  editor: editor

class EditorController
  constructor: (opts) ->
    @keyBinder = opts.keyBinder
    @editor = opts.editor
  handleKeyDown: (keyCode) ->
    command = @keyBinder.commandBoundFor(keyCode)
    result = editor.execute(command)
    editorView = new EditorView
      editor: editor
      lastResult: lastResult
    editorView.render()

Events.wrap(window).addEventListener 'keydown', (event) =>
  editorController.handleKeyDown(event.keyCode)
