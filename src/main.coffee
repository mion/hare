#############################################
# Imports
#############################################
__ = require './utils'
clusterMaker = require "clusters"
Position = require './position'
Movement = require './movement'
Creature = require './creature'

#############################################
# Grid
#############################################
class Cell extends Layer # FIXME
  constructor: (parent, sqm, i, j, backgroundColor) ->
    super
      parent: parent
      x: i * sqm
      y: i * sqm
      width: sqm
      height: sqm
      backgroundColor: backgroundColor

class Grid extends Layer
  constructor: (@sqm) ->
    super
      x: 0
      y: 0
      width: Canvas.width
      height: Canvas.height
      backgroundColor: '#333333'
    @rows = Math.ceil(@height / @sqm)
    @columns = Math.ceil(@width / @sqm)
    @cells = {}
    counter = 0
    @creatures = []
    for i in [0..@rows - 1] by 1
      @cells[i] = {}
      for j in [0..@columns - 1] by 1
        @cells[i][j] = null
        bgColor = if counter % 2 == 0
          '#f0f0f0'
        else
          '#f6f6f6'
        counter += 1
        # FIXME cell = new Cell(this, @sqm, i, j, bgColor)
        cell = new Layer
          parent: this
          x: i * @sqm
          y: j * @sqm
          width: @sqm
          height: @sqm
          backgroundColor: bgColor
        @cells[i][j] = cell
  cellAt: (pos) ->
    @cells[pos.i][pos.j]
  isWithinBounds: (pos) ->
    (0 <= pos.i) && (pos.i <= (@rows - 1)) && (0 <= pos.j) && (pos.j <= (@columns - 1))
  addCreature: (creature) ->
    @creatures.push(creature)
    @addChild(creature)
    __.centerize(creature, @cellAt(creature.pos))
  isWalkable: (pos) ->
    ! _.some(@creatures, (creature) -> creature.pos.isEqual(pos))

#############################################
# Simulation
#############################################
class Simulation
  constructor: () ->
    @grid = new Grid(70)
  start: () ->
    @foo = new Creature("Foo", new Position(1, 2))
    @grid.addCreature(@foo)
    @bar = new Creature("Bar", new Position(2, 2))
    @grid.addCreature(@bar)
    @quux = new Creature("Quux", new Position(0, 2))
    @grid.addCreature(@quux)
  update: () ->
    console.log('[*] Updating')
    dir = Utils.randomChoice(["up", "down", "left", "right"])
    action = new Movement(@grid, @foo, @foo.pos.next(dir))
    action.perform()

simulation = new Simulation
simulation.start()
Utils.interval 1, ->
  simulation.update()
