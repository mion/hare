################################################################################
# imports
assert = require 'assert'
chai = require('chai')
hare = require('./hare')
################################################################################
# alias
lg = console.log
################################################################################
# tests
describe 'hare', ->
  describe '#tokenize()', ->
    output = hare.tokenize '(1 2 3)'
    assert.equal output, ['[', '1', '2', '3', ']']
