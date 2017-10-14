#############################################
# Imports
#############################################
__ = require './utils'
beautify = require('js-beautify').js_beautify
Parser = require './parser'

inconsolata = Utils.loadWebFont("Inconsolata")

Parser.test()

lg = console.log

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
    _.each @tokens, (token) ->
      if not visitedTokenById[token.id]
        visitedTokenById[token.id] = true
        token.select(siblingIndex, parentIndex)
  deselect: (visitedTokenById, siblingIndex, parentIndex) ->
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
    # console.log "'#{@text}'\n\t-->\t(#{siblingIndex}, #{parentIndex})"
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
    body = _.dropRight(exps).concat("return #{_.last(exps)};")
    bodyStr = body.join(";\n")
    "(function () { #{bodyStr} })()"
  else if _.first(program) == 'var'
    "var #{program[1]} = (#{compile(program[2])})"
  else if program[0] == 'func'
    args = program[1].join(', ')
    rest = _.chain(program).drop(2).map(compile).value()
    "function (#{args}) { return #{rest}; }"
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
  # console.log "walking from: ", sexp.toString()
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
# CODE EDITION
set = (program, position, value) ->
  lg "set(#{program}, #{position}, #{value})"
  idx = position.pop()
  if idx?
    if _.isEmpty? position
      program[idx] = value
    else
      set(program[idx], position, value)

getSexp = (sexp, position) ->
  lg "getSexp<#{sexp}><#{position}>"
  idx = position.pop()
  if idx?
    getSexp(sexp.children[idx], position)
  else
    sexp

############################################
# EDITOR
class Editor
  constructor: () ->
    @tokenGroup = new Layer
    @compiledBox = new TextLayer
      text: 'compiled'
      fontSize: 13
      fontFamily: inconsolata
      textAlign: 'left'
      x: 0
      y: Screen.height / 2
      width: Screen.width / 2
      height: Screen.height / 2
      color: '#000'
      backgroundColor: '#F6F6F6'
      padding: 10
      borderColor: '#000'
      borderWidth: 1
    @outputBox = new TextLayer
      text: 'output'
      fontSize: 13
      fontFamily: inconsolata
      textAlign: 'left'
      x: Screen.width / 2
      y: Screen.height / 2
      width: Screen.width / 2
      height: Screen.height / 2
      color: '#000'
      backgroundColor: '#F6F6F6'
      padding: 10
      borderColor: '#000'
      borderWidth: 1
  build: (program) ->
    @program = program
    @currentPosition = []
    @currentSExp = null
    @rootSExp = render @program, 0, 0, [], null, @tokenGroup
    @tokenGroup.height = @rootSExp.tokens[0].height
    @tokenGroup.width = _.reduce(_.map(@rootSExp.tokens, (t) -> t.width), _.add, 0)
    @tokenGroup.x = Align.center
    @tokenGroup.y = (Screen.height / 2) - @tokenGroup.height - 10
  jump: (pos) ->
    @currentPosition = _.clone(pos)
    newSexp = getSexp(@rootSExp, pos)
    @setCurrentSExp(newSexp)
  go: (dir) ->
    return false if _.isNil(@currentSExp) and dir isnt 'in'
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
      # walk @rootSExp, (sexp, visitedTokenById, siblingIndex, parentIndex) -> sexp.deselect(visitedTokenById, siblingIndex, parentIndex)
      # @currentSExp = targetSExp
      # walk @currentSExp, (sexp, visitedTokenById, siblingIndex, parentIndex) -> sexp.select(visitedTokenById, siblingIndex, parentIndex)
      @setCurrentSExp(targetSExp)
      return true
    else if @currentSExp == @rootSExp and dir == 'out'
      @setCurrentSExp(null)
      # walk @rootSExp, (sexp, visitedTokenById, siblingIndex, parentIndex) -> sexp.deselect(visitedTokenById, siblingIndex, parentIndex)
      # @currentSExp = null
      return true
    else
      return false
  setCurrentSExp: (newSexp) ->
    walk @rootSExp, (sexp, visitedTokenById, siblingIndex, parentIndex) -> sexp.deselect(visitedTokenById, siblingIndex, parentIndex)
    if newSexp?
      @currentSExp = newSexp
      walk @currentSExp, (sexp, visitedTokenById, siblingIndex, parentIndex) -> sexp.select(visitedTokenById, siblingIndex, parentIndex)
    else
      @currentSExp = null
  goNext: () ->
    if @go('next')
      @currentPosition[0] += 1
  goPrevious: () ->
    if @go('previous')
      @currentPosition[0] -= 1
  goIn: () ->
    if @go('in') && @currentSExp != @rootSExp
      @currentPosition.unshift(0)
  goOut: () ->
    if @go('out') && @currentSExp != null
      @currentPosition.shift()
  compile: () ->
    if @currentSExp?
      compiledSource = compile(@currentSExp.program)
      beautifulSource = beautify(compiledSource, { indent_size: 2 })
      @compiledBox.text = compiledSource
      console.log("[*] INPUT\n", @currentSExp.program)
      console.log("[*] COMPILED\n", compiledSource)
      try
        output = eval(compiledSource)
        @outputBox.text = output
        console.log "[*] RUN OK\n", output
      catch error
        console.log "[!] RUN ERROR\n", error
        @outputBox.text = error.toString()
    else
      console.log '[!] No expression selected.'
  replace: () ->
    sexp = @currentSExp
    if sexp?
      rawValue = prompt("Replace '#{sexp}' with what?")
      if rawValue?
        value = Parser.parse(rawValue)
        lg 'Value: ', value
        window.prog = @program
        pos = _.clone(@currentPosition)
        set(@program, _.clone(pos), value)
        lg 'currentPosition: ', pos
        @build(@program)
        @jump(_.clone(pos))
        lg @program

editor = new Editor

editor.build [
  'do',
  ['var', "size", '32'],
  ['var', "square",
    ['func', ['x'], ['*', 'x', 'x']]],
  ['square', 'size']
]

key =
  h: 72
  i: 73
  j: 74
  k: 75
  l: 76
  r: 82
  space: 32
  enter: 13
  shift: 16

KeyForCommand =
  GO_IN: key.j
  GO_OUT: key.k
  GO_PREVIOUS: key.h
  GO_NEXT: key.l
  COMPILE: key.enter
  REPLACE: key.r

class KeyHandler
  constructor: (@editor) ->
    @isDown = {}
    Events.wrap(window).addEventListener 'keyup', (event) =>
      # console.log 'key up', event.keyCode
      delete @isDown[event.keyCode]
    Events.wrap(window).addEventListener 'keydown', (event) =>
      console.log 'key down', event.keyCode
      currPos = _.clone(editor.currentPosition)
      @isDown[event.keyCode] = true
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
      if event.keyCode is KeyForCommand.REPLACE
        @editor.replace()
      lg "current position",  editor.currentPosition

keyHandler = new KeyHandler(editor)

console.log 'running...'
