class Expression
  constructor: (@id, @context) ->
    @context.add(this)
    @is_list = false
    @is_atom = false

class Atom extends Expression
  constructor: (@string, @context) ->
    @id = _.uniqueId('Atom_')
    super @id, @context
    @is_atom = true
  to_s: () ->
    @string

class List extends Expression
  constructor: (@context) ->
    @id = _.uniqueId('List_')
    super @id, @context
    @is_list = true

class Context
  constructor: () ->
    @expression_by_id = []
    @root_id = null
    @cursor_id = null
    @parent_of = {}
    @children_of = {}
    @previous_of = {}
    @next_of = {}
  get: (id) ->
    @expression_by_id[id]
  add: (exp) ->
    @expression_by_id[exp.id] = exp
  children: (exp) ->
    if _.isUndefined(@children_of[exp.id])
      @children_of[exp.id] = []
    @children_of[exp.id]
  push: (list, exp) ->
    @parent_of[exp.id] = list.id
    @children_of[list.id] = [] if _.isUndefined(@children_of[list.id])
    @children_of[list.id].push(exp.id)
    if @children_of[list.id].length > 1
      before_exp = _.last(_.dropRight(@children_of[list.id]))
      @previous_of[exp.id] = before_exp.id
      @next_of[before_exp.id] = exp.id

class StringParser
  constructor: (@context, @string) ->
  tokenize: (string) ->
    # input -> '(fn (s) (+ "hello " s))'
    # output -> ['(', 'fn', '(', 's', ')', '(', '"hello', '"', 's', ')']
    string.replace(/\(/g, "( ").replace(/\)/g, " )").split(" ").filter (str) -> str isnt ""
  readFrom: (tokens, context) ->
    throw new SyntaxError("unexpected EOF while reading") if _.isEmpty(tokens)
    token = tokens.shift()
    if token is "("
      list = new List(context)
      while tokens[0] isnt ")"
        @context.push(list, @readFrom(tokens, context))
      tokens.shift()
      return list
    else if token is ")"
      throw new SyntaxError("unexpected )")
    else
      return new Atom(token, context)
  parse: ->
    exp = @readFrom(@tokenize(@string), @context)
    @context.root_id = exp.id

class StringRenderer
  constructor: (@context, @root_id) ->
  render: () ->
    exp = @context.get(@root_id)
    @_render(exp)
  _render: (exp) ->
    if exp.is_atom
      exp.to_s()
    else
      children = @context.children(exp)

module.exports =
  Expression: Expression
  List: List
  Atom: Atom
  Context: Context
  StringParser: StringParser
  StringRenderer: StringRenderer
