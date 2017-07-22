(function() {
  module.exports = {
    xRight: function(layer) {
      return layer.x + layer.width;
    },
    centerize: function(overLayer, underLayer) {
      var paddingX, paddingY;
      paddingX = (underLayer.width - overLayer.width) / 2;
      paddingY = (underLayer.height - overLayer.height) / 2;
      overLayer.x = underLayer.x + paddingX;
      return overLayer.y = underLayer.y + paddingY;
    },
    centerizedPoint: function(overLayer, underLayer) {
      var paddingX, paddingY;
      paddingX = (underLayer.width - overLayer.width) / 2;
      paddingY = (underLayer.height - overLayer.height) / 2;
      return {
        x: underLayer.x + paddingX,
        y: underLayer.y + paddingY
      };
    },
    middleY: function(layer) {
      return layer.y + layer.height / 2;
    },
    middleX: function(layer) {
      return layer.x + layer.width / 2;
    },
    alignX: function(layer, fixedLayer) {
      return layer.x = _middleX(fixedLayer.x) - layer.width / 2;
    },
    above: function(layer, fixedLayer, margin) {
      return layer.y = fixedLayer.y - (_.isNil(margin) ? layer.height : margin);
    }
  };

}).call(this);

//# sourceMappingURL=utils.js.map
