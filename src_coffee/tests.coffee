################################################################################
# imports
__ = require './utils'
chai = require('chai')
hare = require('./hare')

################################################################################
# alias
lg = console.log

################################################################################
# tests
lg('Running tests...')

tests =
  tokenize:
    '(1 2 3)': ['[', '1', '2', '3', ']']

_.each tests, (out_by_in, func_name) ->
  _.each out_by_in, (output, input) ->
    try
      func = hare[func_name]
      chai.expect(func(input)).to.deep.equal(output)
      console.log("☑ #{test.name}")
    catch error
      console.error("☒ #{test.name}")

lg(tests)
