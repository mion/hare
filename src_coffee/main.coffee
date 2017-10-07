#############################################
# Imports
#############################################
__ = require './utils'
Parser = require './parser'

inconsolata = Utils.loadWebFont("Inconsolata")

Parser.test()

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
  BACKGROUND_COLOR_DESELECTED: '#FFFFFF'
  TEXT_COLOR_DESELECTED: '#AAA'
  BACKGROUND_COLOR_SELECTED: '#F8F8F8'
  TEXT_COLOR_SELECTED: '#000000'
  constructor: (txt, x, y) ->
    super
      text: txt
      fontSize: 15
      fontFamily: inconsolata
      textAlign: 'center'
      x: x
      y: y
      color: @TEXT_COLOR_DESELECTED
      backgroundColor: @BACKGROUND_COLOR_DESELECTED
      borderWidth: 1
      borderColor: '#FEFEFE'
      padding: 10
  select: () ->
    @backgroundColor = @BACKGROUND_COLOR_SELECTED
    @color = @TEXT_COLOR_SELECTED
  deselect: () ->
    @backgroundColor = @BACKGROUND_COLOR_DESELECTED
    @color = @TEXT_COLOR_DESELECTED

# work in progress
evaluate = (sexp) ->
  return sexp unless _.isArray(sexp) && sexp.length > 0
  operator = _.head(sexp)
  args = _.tail(sexp)
  if operator is 'quote'
    if args.length == 1
      return args[0]
    else
      return "ERROR: wrong numbers of arguments"
  if operator is 'atom'
    if args.length == 1
      thing = evaluate(args[0])
      return if (_.isArray(thing) and _.isEmpty(thing)) or _.isString(thing) then 't' else []
    else
      return "ERROR: wrong numbers of arguments"

window.evaluate = evaluate

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

class Walker
  constructor: (@node) ->

class Editor
  constructor: () ->
    @program = [
      'do',
      ['let', "'size", '32'],
      ['let', "'square",
        ['func', ['x'], ['*', 'x', 'x']]],
      ['square', 'size']
    ]
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

# editor.goIn()

key =
  h: 72
  i: 73
  j: 74
  k: 75
  l: 76
  space: 32
  enter: 13
  shift: 16

KeyForCommand =
  GO_IN: key.j
  GO_OUT: key.k
  GO_PREVIOUS: key.h
  GO_NEXT: key.l

class KeyHandler
  constructor: (@editor) ->
    @isDown = {}
    Events.wrap(window).addEventListener 'keyup', (event) =>
      console.log 'key up', event.keyCode
      delete @isDown[event.keyCode]
    Events.wrap(window).addEventListener 'keydown', (event) =>
      console.log 'key down', event.keyCode
      @isDown[event.keyCode] = true
    # Events.wrap(window).addEventListener 'keypress', (event) =>
    #   console.log 'key press', event.keyCode
      if event.keyCode is KeyForCommand.GO_IN
        @editor.goIn()
      if event.keyCode is KeyForCommand.GO_OUT
        @editor.goOut()
      if event.keyCode is KeyForCommand.GO_NEXT
        @editor.goNext()
      if event.keyCode is KeyForCommand.GO_PREVIOUS
        @editor.goPrevious()

keyHandler = new KeyHandler(editor)

console.log 'running...'
