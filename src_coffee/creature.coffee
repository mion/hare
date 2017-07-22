__ = require './utils'

class module.exports extends Layer
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
    __.above healthBarLayer, this, 10
    __.above nameTextLayer, healthBarLayer, 20
