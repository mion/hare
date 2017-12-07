class Compiler
  constructor: () ->
  compile: (program) ->
    if not _.isArray(program)
      directJavaScript(program)
    else if _.first(program) == 'do'
      exps = _.chain(program).drop(1).map(arguments.callee).value()
      body = _.dropRight(exps).concat("return #{_.last(exps)};")
      bodyStr = body.join(";\n")
      "(function () { #{bodyStr} })()"
    else if _.first(program) == 'get' # (get array 2) -> array[2]
      "#{program[1]}[#{arguments.callee(program[2])}]"
    else if _.first(program) == 'set' # (set array 2 "foo") -> array[2] = "foo"
      "#{program[1]}[#{arguments.callee(program[2])}] = #{arguments.callee(program[3])}"
    else if _.first(program) == 'var'
      "var #{program[1]} = #{arguments.callee(program[2])}"
    else if _.first(program) == 'if'
      "(#{arguments.callee(program[1])}) ? (#{arguments.callee(program[2])}) : (#{arguments.callee(program[3])})"
    else if program[0] == 'list'
      ["["] + _.map(program.slice(1), arguments.callee).join(", ") + ["]"]
    else if program[0] == 'func'
      args = program[1].join(', ')
      rest = _.chain(program).drop(2).map(arguments.callee).value()
      "function (#{args}) { return #{rest}; }"
    else if _.includes(['*', '+', '-', '%', '<', '>', '<=', '>=', '=', 'or', 'and'], program[0])
      op = if '=' == program[0]
        '==='
      else if 'or' == program[0]
        '||'
      else if 'and' == program[0]
        '&&'
      else
        program[0]
      "(#{arguments.callee(program[1])}) #{op} (#{arguments.callee(program[2])})"
    else if program[0] == 'not'
      "!(#{arguments.callee(program[1])})"
    else
      arglist = _.chain(program).tail().map(arguments.callee).value()
      "#{directJavaScript(program[0])}(#{arglist})"

directJavaScript = (program) ->
  hareToJs =
    'round': 'Math.round'
    'floor': 'Math.floor'
    'ceiling': 'Math.ceiling'
    '^': 'Math.pow'
    'ˆ': 'Math.pow'
    'sqrt': 'Math.sqrt'
    'max': 'Math.max'
    'min': 'Math.min'
    'cos': 'Math.cos'
    'sin': 'Math.sin'
    'tan': 'Math.tan'
    'acos': 'Math.acos'
    'asin': 'Math.asin'
    'atan': 'Math.atan'
    'log': 'Math.log'
    'log10': 'Math.log10'
    'E': 'Math.E'
    'PI': 'Math.PI'
    'random': 'Math.random'
  for key, value of _
    if _.hasOwnProperty(key)
      hareToJs[key] = "_.#{key}"
  js = hareToJs[program]
  if _.isUndefined(js) then program else js

module.exports =
  Compiler: Compiler
  compile: (program) ->
    compiler = new Compiler()
    compiler.compile(program)
