source = '(map (list 1 2 3) Math.sqrt)'
parser = new Parser()
parser.parse(source)
# => ['map', ['list', 1, 2, 3], 'Math.sqrt']
compiler = new Compiler
program = ['map', ['list', 1, 2, 3], 'Math.sqrt']
compiler.compile(program)
# => '[1, 2, 3].map(Math.sqrt)'

editor = new Editor
  parser: parser
  program: program
  cursor: [0]

keyBinder = new KeyBinder()

editorController = new EditorController
  keyBinder: keyBinder
  editor: editor

Events.wrap(window).addEventListener 'keydown', (event) =>
  editorController.handleKeyDown(event.keyCode)
