__ = require './utils'
Position = require './position'

class module.exports
  constructor: (@grid, @creature, @targetPos) ->
  isValid: () ->
    @grid.isWithinBounds(@targetPos) and @grid.isWalkable(@targetPos)
  perform: () ->
    return false if @creature.isAnimating
    return false unless @isValid()
    anim = new Animation @creature,
      point: __.centerizedPoint(@creature, @grid.cellAt(@targetPos))
    anim.start()
    anim.on Events.AnimationEnd, =>
      @creature.pos = new Position(@targetPos.i, @targetPos.j)
    return true
