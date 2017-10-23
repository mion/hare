# class Expression
#   constructor: (@id, @context) ->
#     @context.expression_by_id[@id] = this
#
# class Atom extends Expression
#   constructor: (@string, @context) ->
#     @id = _.uniqueId('Atom_')
#     super @id, @context
#
# class List extends Expression
#   constructor: (@context) ->
#     @id = _.uniqueId('List_')
#     super @id, @context
#
# class Context
#   constructor: () ->
#     @expression_by_id = []
#     @root_id = null
#     @cursor_id = null
#     @parent_of = {}
#     @children_of = {}
#     @previous_of = {}
#     @next_of = {}
#     @layer_of = {}
#   push: (list, exp) ->
#     @parent_of[exp.id] = list.id
#     @children_of[list.id] = [] if _.isUndefined(@children_of[list.id])
#     @children_of[list.id].push(exp.id)
#     if @children_of[list.id].length > 1
#       before_exp = _.last(_.dropRight(@children_of[list.id]))
#       @previous_of[exp.id] = before_exp.id
#       @next_of[before_exp.id] = exp.id
#
# class StringParser
#   constructor: (@string) ->
#     @context = new Context()
#
#   tokenize: (string) ->
#     # input -> '(fn (s) (+ "hello " s))'
#     # output -> ['(', 'fn', '(', 's', ')', '(', '"hello', '"', 's', ')']
#     string.replace(/\(/g, "( ").replace(/\)/g, " )").split(" ").filter (str) -> str isnt ""
#
#   readFrom: (tokens, context) ->
#     throw new SyntaxError("unexpected EOF while reading") if _.isEmpty(tokens)
#     token = tokens.shift()
#     if token is "("
#       list = new List(context)
#       while tokens[0] isnt ")"
#         @context.push(list, @readFrom(tokens, context))
#       tokens.shift()
#       return list
#     else if token is ")"
#       throw new SyntaxError("unexpected )")
#     else
#       return new Atom(token, context)
#
#   parse: ->
#     exp = @readFrom(@tokenize(@string), @context)
#     @context.root_id = exp.id


class Parser
  constructor: (@string) ->

  tokenize: (string) ->
    string.replace(/\(/g, "( ").replace(/\)/g, " )").split(" ").filter (str) -> str isnt ""

  atomize: (token) ->
    return true if token is "true"
    return false if token is "false"
    return parseInt(token) if not _.isNaN(parseInt(token))
    # TODO: literal strings
    return token

  readFrom: (tokens) ->
    throw new SyntaxError("unexpected EOF while reading") if _.isEmpty(tokens)
    token = tokens.shift()
    if token is "("
      L = []
      while tokens[0] isnt ")"
        L.push(@readFrom(tokens))
      tokens.shift()
      return L
    else if token is ")"
      throw new SyntaxError("unexpected )")
    else
      return @atomize(token)

  parse: ->
    @readFrom(@tokenize(@string))

module.exports =
  Parser: Parser
  parse: (str) ->
    parser = new Parser(str)
    parser.parse()
  test: ->
    test = (fn, args..., expected) ->
      actual = fn(args...)
      if _.isEqual(actual, expected)
        console.log "[*] Test OK"
      else
        console.log "[!] Test failed!\n    Expected: `#{expected}` (#{typeof expected})\n    Actual: `#{actual}` (#{typeof actual})"
    test this.parse, "hi", "hi"
    test this.parse, "12", 12
    test this.parse, "()", []
    test this.parse, "(hi)", ["hi"]
    test this.parse, "(hello there)", ["hello", "there"]
    test this.parse, "(hello 'there)", ["hello", "'there"]
    test this.parse, "(hello (1 2 3))", ["hello", [1, 2, 3]]
    test this.parse, "(hello (my good) old friend ())", ["hello", ["my", "good"], "old", "friend", []]
