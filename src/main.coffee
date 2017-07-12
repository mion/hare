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

_middleY = (layer) -> layer.y + layer.height / 2
_middleX = (layer) -> layer.x + layer.width / 2

_alignX = (layer, fixedLayer) ->
  layer.x = _middleX(fixedLayer.x) - layer.width / 2

_above = (layer, fixedLayer, margin) ->
  layer.y = fixedLayer.y - if _.isNil(margin) then layer.height else margin

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
  place: (thing) ->
    @addChild(thing)
    _centerize(thing, @cellAt(thing.pos))

#############################################
# Creature
#############################################
class Position
  constructor: (@i, @j) ->

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

class Movement
  constructor: (@grid, @creature, @targetPos) ->
  isValid: () ->
    @grid.isWithinBounds(@targetPos)
  perform: () ->
    return false if @creature.isAnimating
    return false unless @isValid()
    anim = new Animation @creature,
      point: _centerizedPoint(@creature, @grid.cellAt(@targetPos))
    anim.start()
    anim.on Events.AnimationEnd, =>
      @creature.pos = new Position(@targetPos.i, @targetPos.j)
    return true

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
    nameTextLayer = new TextLayer
      text: @displayName
      fontSize: 15
      fontWeight: 'bold'
      fontFamily: 'Arial'
      textAlign: 'center'
      x: this.x
      y: this.y
      width: this.width
      color: '#000000'
    # nameTextLayer.y -= nameTextLayer.height
    @addChild(nameTextLayer)
    healthBarLayer = new Layer
      x: this.x
      y: this.y
      width: this.width
      height: 5
      backgroundColor: '#00ff00'
      borderWidth: 1
      borderColor: '#000000'
    @addChild(healthBarLayer)
    _above healthBarLayer, this, 10
    _above nameTextLayer, healthBarLayer, 20

#############################################
# Simulation
#############################################
class Simulation
  constructor: () ->
    @grid = new Grid(70)
  start: () ->
    @foo = new Creature("Foo", new Position(1, 2))
    @grid.place(@foo)
  update: () ->
    console.log('[*] Updating')
    dir = Utils.randomChoice(["up", "down", "left", "right"])
    action = new Movement(@grid, @foo, @foo.pos.next(dir))
    action.perform()

simulation = new Simulation
simulation.start()
Utils.interval 1, ->
  simulation.update()
