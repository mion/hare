__ = require './utils'
chai = require('chai')
Edit = require './edit'

replace = (_program, _position, newProgram) ->
  program = _.clone _program
  position = _.clone _position
  p = program
  while position.length > 1
    p = program[position.pop()]
  idx = position.pop()
  program[idx] = newProgram
  return program

testReplace = () ->
  console.log("[*] Testing 'replace'...")
  testCases = [
    [
      replace(['foo', 'bar'], [0], 'quux'),
      ['quux', 'bar']
    ],
    [
      replace(['foo', ['bar'], 'quux'], [0, 1], 'lol'),
      ['foo', ['lol'], 'quux']
    ]
  ]
  failures = 0
  tests = 0
  _.each testCases, (tc) ->
    try
      chai.expect(tc[0]).to.deep.equal(tc[1])
      tests += 1
    catch error
      console.error(error)
      failures += 1
  if failures == 0
    console.log '[*] #{tests} tests pass!'
  else
    console.log("[!] #{failures} failures.")

module.exports =
  run: () ->
    testReplace()
