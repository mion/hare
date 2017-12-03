__ = require './utils'
chai = require('chai')
hare = require('./hare')

lg = console.log

test_results = []
tests =
  hare:
    tokenize:
      '(1 2 3)': ['[', '1', '2', '3', ']']

_.each tests, (test) ->
  try
    chai.expect(test.in).to.deep.equal(test.out)
    console.log("☑ #{test.name}")
  catch error
    console.error("☒ #{test.name}")

module.exports =
  run: () ->
    lg('Running tests...')
    lg(tests)
