#############################################
# Imports
#############################################
__ = require './utils'
Parser = require './parser'

inconsolata = Utils.loadWebFont("Inconsolata")

Parser.test()

class SExpression
  constructor: (@tokens, @parent, @program) ->
    @id = _.uniqueId('sexp_')
    @children = []
    @previous = null
    @next = null
    if not _.isNil(@parent)
      if not _.isEmpty(@parent.children)
        sibling = _.last(@parent.children)
        @previous = sibling
        sibling.next = this
      @parent.children.push(this)
  toString: () ->
    if @tokens? then @tokens.map((t) -> t.text).join(' ') else "NULL"
  select: (visitedTokenById, siblingIndex, parentIndex) ->
    console.log "sel"
    _.each @tokens, (token) ->
      if not visitedTokenById[token.id]
        visitedTokenById[token.id] = true
        token.select(siblingIndex, parentIndex)
  deselect: (visitedTokenById, siblingIndex, parentIndex) ->
    console.log "desel"
    _.each @tokens, (token) ->
      if not visitedTokenById[token.id]
        visitedTokenById[token.id] = true
        token.deselect()

class SAtom extends SExpression
  constructor: (token, parent, program) ->
    @isAtom = true
    @isList = false
    super [token], parent, program

class SList extends SExpression
  constructor: (tokens, parent, program) ->
    @isAtom = false
    @isList = true
    super tokens, parent, program

class Token extends TextLayer
  BACKGROUND_COLOR_DESELECTED: '#FFFFFF'
  TEXT_COLOR_DESELECTED: '#AAA'
  BACKGROUND_COLOR_SELECTED: '#F8F8F8'
  TEXT_COLOR_SELECTED: '#000000'
  constructor: (txt, x, y, tokenGroup) ->
    super
      parent: tokenGroup
      text: txt
      fontSize: 12
      fontFamily: inconsolata
      textAlign: 'center'
      x: x
      y: y
      color: @TEXT_COLOR_DESELECTED
      backgroundColor: @BACKGROUND_COLOR_DESELECTED
      padding: 10
  select: (siblingIndex, parentIndex) ->
    console.log "select: #{@text} (#{siblingIndex}, #{parentIndex})"
    if siblingIndex == 0 && parentIndex == 0
      @backgroundColor = '#000'
      @color = '#FFF'
    else if siblingIndex == 0 && parentIndex == -1
      @backgroundColor = '#555'
      @color = '#AAA'
      @fontWeight = 'bold'
    else if siblingIndex != 0 && parentIndex == 0
      @backgroundColor = '#F2F2F2'
      @color = '#000'
    else
      @backgroundColor = '#FFF'
      @color = '#BBB'
  deselect: () ->
    @backgroundColor = @BACKGROUND_COLOR_DESELECTED
    @color = @TEXT_COLOR_DESELECTED

############################################
# EVALUATE
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

############################################
# RENDER
compile = (program) ->
  return program unless _.isArray(program)
  if _.first(program) == 'do'
    exps = _.chain(program).drop(1).map(compile).value()
    body = _.dropRight(exps).concat("return #{_.last(exps)}")
    bodyStr = body.join(";\n")
    "(function () { #{bodyStr} })()"
  else if _.first(program) == 'var'
    "var #{program[1]} = (#{compile(program[2])})"
  else if program[0] == 'func'
    args = program[1].join(', ')
    rest = _.chain(program).drop(2).map(compile).value()
    "function (#{args}) { return (#{rest}); }"
  else if program[0] == '*'
    "(#{program[1]}) * (#{program[2]})"
  else
    arglist = _.chain(program).tail().map(compile).value()
    "#{program[0]}(#{arglist})"

############################################
# RENDER
render = (exp, x, y, tokens, parentSExp, tokenGroup) ->
  if _.isString(exp)
    str = new Token(exp, x, y, tokenGroup)
    tokens.push(str)
    return new SAtom(str, parentSExp, exp)
  else
    leftParens = new Token("(", x, y, tokenGroup)
    tokens.push(leftParens)
    leftParensIndex = tokens.length - 1
    slist = new SList([], parentSExp, exp)
    _.each exp, (e) ->
      lastToken = _.last(tokens)
      render(e, __.xRight(lastToken), y, tokens, slist, tokenGroup)
    lastToken = _.last(tokens)
    rightParens = new Token(")", __.xRight(lastToken), y, tokenGroup)
    tokens.push(rightParens)
    slist.tokens = tokens.slice(leftParensIndex)
    return slist

############################################
# WALK
#   TODO: remove these variables from the function header: visitedSExpressionById visitedTokenById
walk = (sexp, callback) ->
  console.log "walking from: ", sexp.toString()
  visitedSExpressionById = {}
  visitedTokenById = {}
  _walk(sexp, callback, visitedSExpressionById, visitedTokenById, [0, 0])

_walk = (sexp, callback, visitedSExpressionById, visitedTokenById, indexPair) ->
  return unless sexp?
  return if visitedSExpressionById[sexp.id]
  visitedSExpressionById[sexp.id] = true
  siblingIndex = indexPair[0]
  parentIndex = indexPair[1]
  callback(sexp, visitedTokenById, siblingIndex, parentIndex)
  nextIndex = if siblingIndex? then siblingIndex + 1 else null
  previousIndex = if siblingIndex? then siblingIndex - 1 else null
  upIndex = if parentIndex? then parentIndex - 1 else null
  # downIndex = if parentIndex? then parentIndex + 1 else null
  _walk(sexp.next, callback, visitedSExpressionById, visitedTokenById, [nextIndex, parentIndex])
  _walk(sexp.previous, callback, visitedSExpressionById, visitedTokenById, [previousIndex, parentIndex])
  if not sexp.previous?
    _walk(sexp.parent, callback, visitedSExpressionById, visitedTokenById, [0, upIndex])
  # _walk(_.first(sexp.children), callback, visited, [null, downIndex])

############################################
# EDITOR
class Editor
  constructor: () ->
    @program = [
      'do',
      ['var', "size", '32'],
      ['var', "square",
        ['func', ['x'], ['*', 'x', 'x']]],
      ['square', 'size']
    ]
    @tokenGroup = new Layer
    @rootSExp = render @program, 0, 0, [], null, @tokenGroup
    @tokenGroup.height = @rootSExp.tokens[0].height
    @tokenGroup.width = _.reduce(_.map(@rootSExp.tokens, (t) -> t.width), _.add, 0)
    @tokenGroup.x = Align.center
    @tokenGroup.y = Align.center
    @currentSExp = null
    console.log(@rootSExp)
  go: (dir) ->
    targetSExp = if _.isNil(@currentSExp)
      @rootSExp
    else
      {
        next: @currentSExp.next
        previous: @currentSExp.previous
        in: _.first(@currentSExp.children)
        out: @currentSExp.parent
      }[dir]
    if targetSExp?
      walk @rootSExp, (sexp, visitedTokenById, siblingIndex, parentIndex) -> sexp.deselect(visitedTokenById, siblingIndex, parentIndex)
      @currentSExp = targetSExp
      walk @currentSExp, (sexp, visitedTokenById, siblingIndex, parentIndex) -> sexp.select(visitedTokenById, siblingIndex, parentIndex)
    else if @currentSExp == @rootSExp
      walk @rootSExp, (sexp, visitedTokenById, siblingIndex, parentIndex) -> sexp.deselect(visitedTokenById, siblingIndex, parentIndex)
      @currentSExp = null
  goNext: () ->
    @go('next')
  goPrevious: () ->
    @go('previous')
  goIn: () ->
    @go('in')
  goOut: () ->
    @go('out')
  compile: () ->
    if @currentSExp?
      console.log("[*] INPUT\n", @currentSExp.program)
      console.log("[*] OUTPUT\n", compile(@currentSExp.program))
    else
      console.log '[!] No expression selected.'

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
  COMPILE: key.enter

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
      if event.keyCode is KeyForCommand.COMPILE
        @editor.compile()

keyHandler = new KeyHandler(editor)

console.log 'running...'
