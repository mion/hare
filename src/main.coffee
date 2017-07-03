#############################################
# Imports
#############################################
clusterMaker = require "clusters"

#############################################
# Helpers
#############################################
_centerize = (overLayer, underLayer) ->
  paddingX = (underLayer.width - overLayer.width) / 2
  paddingY = (underLayer.height - overLayer.height) / 2
  overLayer.x = underLayer.x + paddingX
  overLayer.y = underLayer.y + paddingY

_centerizedPoint = (overLayer, underLayer) ->
  paddingX = (underLayer.width - overLayer.width) / 2
  paddingY = (underLayer.height - overLayer.height) / 2
  {x: underLayer.x + paddingX, y: underLayer.y + paddingY}

#############################################
# Singleton Classes
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
    for i in [0..@rows - 1] by 1
      @cells[i] = {}
      for j in [0..@columns - 1] by 1
        @cells[i][j] = null
    for j in [0..@columns - 1] by 1
      for i in [0..@rows - 1] by 1
        bgColor = if (i + j * @columns) % 2 == 0
          '#f0f0f0'
        else
          '#f6f6f6'
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
  place: (thing) ->
    @addChild(thing)
    _centerize(thing, @cellAt(thing.pos))

#############################################
# Classes
#############################################
class Position
  constructor: (@i, @j) ->

class Movement
  constructor: (@grid, @creature, @pos) ->
  perform: () ->
    @creature.animate
      point: _centerizedPoint(@creature, @grid.cellAt(@pos))

class Creature extends Layer
  constructor: (@displayName, @pos) ->
    @health = 100
    @energy = 100
    @hunger = 100
    @thirst = 100
    @sex = 100
    @pleasure = 100
    super
      name: 'creature_' + @displayName.toLowerCase().split(' ').join('_')
      width: 50
      height: 50
      backgroundColor: '#0099ff'
      borderRadius: 12

#############################################
# main
#############################################
$grid = new Grid(70)

foo = new Creature("Foo", new Position(1, 2))
$grid.place(foo)

action = new Movement($grid, foo, new Position(1, 3))
action.perform()
