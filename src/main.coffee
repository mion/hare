#############################################
# Imports
#############################################
__ = require './utils'

inconsolata = Utils.loadWebFont("Inconsolata")

class SExpression
  constructor: (@tokens, @parent) ->
    @children = []
    if not _.isNil(@parent)
      @parent.children.push(this)

class SAtom extends SExpression
  constructor: (token, parent) ->
    super [token], parent

class SList extends SExpression
  constructor: (tokens, parent) ->
    super tokens, parent

class Token extends TextLayer
  constructor: (txt, x, y) ->
    super
      text: txt
      fontSize: 20
      fontFamily: inconsolata
      textAlign: 'center'
      x: x
      y: y
      color: '#000000'
      backgroundColor: '#EEEEEE'
      borderWidth: 1
      borderColor: '#666666'
      padding: 10

render = (exp, x, y, tokens, parentSExp) ->
  if _.isString(exp)
    str = new Token(exp, x, y)
    tokens.push(str)
    return new SAtom(str, parentSExp)
  else
    leftParens = new Token("(", x, y)
    tokens.push(leftParens)
    leftParensIndex = tokens.length - 1
    slist = new SList([], parentSExp)
    _.each exp, (e) ->
      lastToken = _.last(tokens)
      render(e, __.xRight(lastToken), y, tokens, slist)
    lastToken = _.last(tokens)
    rightParens = new Token(")", __.xRight(lastToken), y)
    tokens.push(rightParens)
    slist.tokens = tokens.slice(leftParensIndex)
    return slist

class Editor
  constructor: () ->
    # (run (def (square x) (* x x)) (square 5))
    @program = ['run', ['def', ['square', 'x'], ['*', 'x', 'x']], ['square', '5']]
    sexp = render @program, 50, 100, []
    console.log(sexp)

editor = new Editor

Key =
  SPACE: 32
  ENTER: 13

class KeyHandler
  constructor: (@editor) ->
    Events.wrap(window).addEventListener 'keydown', (event) ->
      if event.keyCode is Key.SPACE
        console.log 'space'

keyHandler = new KeyHandler(editor)
