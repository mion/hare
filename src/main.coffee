#############################################
# Imports
#############################################
__ = require './utils'

inconsolata = Utils.loadWebFont("Inconsolata")

class SExpression
  constructor: (@tokens, @parent) ->
    @children = []
    @previous = null
    @next = null
    if not _.isNil(@parent)
      if not _.isEmpty(@parent.children)
        sibling = _.last(@parent.children)
        @previous = sibling
        sibling.next = this
      @parent.children.push(this)
  select: () ->
    _.each @tokens, (token) -> token.select()
  deselect: () ->
    _.each @tokens, (token) -> token.deselect()

class SAtom extends SExpression
  constructor: (token, parent) ->
    super [token], parent

class SList extends SExpression
  constructor: (tokens, parent) ->
    super tokens, parent

class Token extends TextLayer
  DESELECTED_COLOR: '#F5F5F5'
  SELECTED_COLOR: '#F5F500'

  constructor: (txt, x, y) ->
    super
      text: txt
      fontSize: 20
      fontFamily: inconsolata
      textAlign: 'center'
      x: x
      y: y
      color: '#000000'
      backgroundColor: @DESELECTED_COLOR
      borderWidth: 1
      borderColor: '#F2F2F2'
      padding: 10
  select: () ->
    @backgroundColor = @SELECTED_COLOR
  deselect: () ->
    @backgroundColor = @DESELECTED_COLOR

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
    @program = [['lambda', ['x'], ['cons', 'x', ['quote', ['b']]]]]
    @rootSExp = render @program, 50, 100, []
    @currentSExp = null
    console.log(@rootSExp)
  goNext: () ->
    return if _.isNil(@currentSExp)
    return if _.isNil(@currentSExp.next)
    @currentSExp.deselect()
    @currentSExp = @currentSExp.next
    @currentSExp.select()
  goPrevious: () ->
    return if _.isNil(@currentSExp)
    return if _.isNil(@currentSExp.previous)
    @currentSExp.deselect()
    @currentSExp = @currentSExp.previous
    @currentSExp.select()
  goIn: () ->
    if _.isNil(@currentSExp)
      @currentSExp = @rootSExp
      @currentSExp.select()
    else
      if not _.isEmpty(@currentSExp.children)
        @currentSExp.deselect()
        @currentSExp = _.first(@currentSExp.children)
        @currentSExp.select()
  goOut: () ->
    return if _.isNil(@currentSExp)
    @currentSExp.deselect()
    @currentSExp = @currentSExp.parent
    @currentSExp.select() unless _.isNil(@currentSExp)

editor = new Editor

Key =
  LEFT: 72
  RIGHT: 76
  UP: 75
  DOWN: 74
  SPACE: 32
  ENTER: 13

class KeyHandler
  constructor: (@editor) ->
    Events.wrap(window).addEventListener 'keydown', (event) =>
      console.log 'key code', event.keyCode
      if event.keyCode is Key.DOWN
        @editor.goIn()
      if event.keyCode is Key.UP
        @editor.goOut()
      if event.keyCode is Key.RIGHT
        @editor.goNext()
      if event.keyCode is Key.LEFT
        @editor.goPrevious()

keyHandler = new KeyHandler(editor)

console.log 'ok'
