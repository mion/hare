__ = require './utils'

module.exports = class Edit
  constructor: (@program, @position, @operation) ->
  perform: () ->
    {program: @program, position: @position}
