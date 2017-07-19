module.exports =
  xRight: (layer) ->
    layer.x + layer.width
  centerize: (overLayer, underLayer) ->
    paddingX = (underLayer.width - overLayer.width) / 2
    paddingY = (underLayer.height - overLayer.height) / 2
    overLayer.x = underLayer.x + paddingX
    overLayer.y = underLayer.y + paddingY

  centerizedPoint: (overLayer, underLayer) ->
    paddingX = (underLayer.width - overLayer.width) / 2
    paddingY = (underLayer.height - overLayer.height) / 2
    {x: underLayer.x + paddingX, y: underLayer.y + paddingY}

  middleY: (layer) -> layer.y + layer.height / 2
  middleX: (layer) -> layer.x + layer.width / 2

  alignX: (layer, fixedLayer) ->
    layer.x = _middleX(fixedLayer.x) - layer.width / 2

  above: (layer, fixedLayer, margin) ->
    layer.y = fixedLayer.y - if _.isNil(margin) then layer.height else margin
