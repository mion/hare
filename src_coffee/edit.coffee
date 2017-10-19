__ = require './utils'

class Edit
  constructor: (@program, @position, @operation) ->
  perform: () ->
    {success: true, program: @program, position: @position}

module.exports =
  Edit: Edit
  test: ->
    prog = [
      'begin',
      [
        'def',
        ['square', 'x'],
        ['*', 'x', 'x']
      ],
      [
        'square',
        25
      ]
    ]
    test = (pos, op) ->
      codeEdit = new Edit(prog, pos, op)
      codeEdit.perform()
    test [0], 'replace', {success: true, program: prog, position: [0]}
    test [0], 'replace', {success: false, program: prog, position: [0]}
