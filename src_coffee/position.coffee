module.exports =
  class Position
    constructor: (@i, @j) ->

    isEqual: (pos) ->
      @i is pos.i and @j is pos.j

    next: (direction) ->
      if direction == "up"
        return new Position(@i, @j - 1)
      else if direction == "down"
        return new Position(@i, @j + 1)
      else if direction == "left"
        return new Position(@i - 1, @j)
      else if direction == "right"
        return new Position(@i + 1, @j)
      else
        return null
