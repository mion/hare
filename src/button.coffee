class module.exports extends Layer
  constructor: (text, x, y) ->
    textLayer = new TextLayer
      x: 0
      y: 0
      text: text
      fontFamily: 'Arial'
      fontSize: 12
      color: '#000000'
      padding: 8
    super
      x: x
      y: y
      width: textLayer.width
      height: textLayer.height
      backgroundColor: '#eeeeee'
      borderRadius: 8
      borderColor: '#000000'
      borderWidth: 1
    @addChild(textLayer)
    @states.normal =
      backgroundColor: '#eeeeee'
    @states.pressed =
      backgroundColor: '#cccccc'
    @on Events.Click, (event, layer) =>
      downAnim = new Animation this,
        backgroundColor: '#cccccc'
        options:
          time: 0.25
      upAnim = downAnim.reverse()
      downAnim.on Events.AnimationEnd, upAnim.start
      downAnim.start()
