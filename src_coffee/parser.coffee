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
  test: ->
    parse = (str) ->
      parser = new Parser(str)
      parser.parse()
    test = (fn, args..., expected) ->
      actual = fn(args...)
      if _.isEqual(actual, expected)
        console.log "[*] Test OK"
      else
        console.log "[!] Test failed!\n    Expected: `#{expected}` (#{typeof expected})\n    Actual: `#{actual}` (#{typeof actual})"
    test parse, "hi", "hi"
    test parse, "()", []
    test parse, "(hi)", ["hi"]
    test parse, "(hello there)", ["hello", "there"]
    test parse, "(hello 'there)", ["hello", "'there"]
    test parse, "(hello (1 2 3))", ["hello", [1, 2, 3]]
    test parse, "(hello (my good) old friend ())", ["hello", ["my", "good"], "old", "friend", []]
