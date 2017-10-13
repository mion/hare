// Generated by CoffeeScript 1.12.7
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiLi4iLCJzb3VyY2VzIjpbInNyY19jb2ZmZWUvdXRpbHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQVEsU0FBQyxLQUFEO2FBQ04sS0FBSyxDQUFDLENBQU4sR0FBVSxLQUFLLENBQUM7SUFEVixDQUFSO0lBRUEsU0FBQSxFQUFXLFNBQUMsU0FBRCxFQUFZLFVBQVo7QUFDVCxVQUFBO01BQUEsUUFBQSxHQUFXLENBQUMsVUFBVSxDQUFDLEtBQVgsR0FBbUIsU0FBUyxDQUFDLEtBQTlCLENBQUEsR0FBdUM7TUFDbEQsUUFBQSxHQUFXLENBQUMsVUFBVSxDQUFDLE1BQVgsR0FBb0IsU0FBUyxDQUFDLE1BQS9CLENBQUEsR0FBeUM7TUFDcEQsU0FBUyxDQUFDLENBQVYsR0FBYyxVQUFVLENBQUMsQ0FBWCxHQUFlO2FBQzdCLFNBQVMsQ0FBQyxDQUFWLEdBQWMsVUFBVSxDQUFDLENBQVgsR0FBZTtJQUpwQixDQUZYO0lBUUEsZUFBQSxFQUFpQixTQUFDLFNBQUQsRUFBWSxVQUFaO0FBQ2YsVUFBQTtNQUFBLFFBQUEsR0FBVyxDQUFDLFVBQVUsQ0FBQyxLQUFYLEdBQW1CLFNBQVMsQ0FBQyxLQUE5QixDQUFBLEdBQXVDO01BQ2xELFFBQUEsR0FBVyxDQUFDLFVBQVUsQ0FBQyxNQUFYLEdBQW9CLFNBQVMsQ0FBQyxNQUEvQixDQUFBLEdBQXlDO2FBQ3BEO1FBQUMsQ0FBQSxFQUFHLFVBQVUsQ0FBQyxDQUFYLEdBQWUsUUFBbkI7UUFBNkIsQ0FBQSxFQUFHLFVBQVUsQ0FBQyxDQUFYLEdBQWUsUUFBL0M7O0lBSGUsQ0FSakI7SUFhQSxPQUFBLEVBQVMsU0FBQyxLQUFEO2FBQVcsS0FBSyxDQUFDLENBQU4sR0FBVSxLQUFLLENBQUMsTUFBTixHQUFlO0lBQXBDLENBYlQ7SUFjQSxPQUFBLEVBQVMsU0FBQyxLQUFEO2FBQVcsS0FBSyxDQUFDLENBQU4sR0FBVSxLQUFLLENBQUMsS0FBTixHQUFjO0lBQW5DLENBZFQ7SUFnQkEsTUFBQSxFQUFRLFNBQUMsS0FBRCxFQUFRLFVBQVI7YUFDTixLQUFLLENBQUMsQ0FBTixHQUFVLFFBQUEsQ0FBUyxVQUFVLENBQUMsQ0FBcEIsQ0FBQSxHQUF5QixLQUFLLENBQUMsS0FBTixHQUFjO0lBRDNDLENBaEJSO0lBbUJBLEtBQUEsRUFBTyxTQUFDLEtBQUQsRUFBUSxVQUFSLEVBQW9CLE1BQXBCO2FBQ0wsS0FBSyxDQUFDLENBQU4sR0FBVSxVQUFVLENBQUMsQ0FBWCxHQUFlLENBQUcsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxNQUFSLENBQUgsR0FBd0IsS0FBSyxDQUFDLE1BQTlCLEdBQTBDLE1BQTFDO0lBRHBCLENBbkJQOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICB4UmlnaHQ6IChsYXllcikgLT5cbiAgICBsYXllci54ICsgbGF5ZXIud2lkdGhcbiAgY2VudGVyaXplOiAob3ZlckxheWVyLCB1bmRlckxheWVyKSAtPlxuICAgIHBhZGRpbmdYID0gKHVuZGVyTGF5ZXIud2lkdGggLSBvdmVyTGF5ZXIud2lkdGgpIC8gMlxuICAgIHBhZGRpbmdZID0gKHVuZGVyTGF5ZXIuaGVpZ2h0IC0gb3ZlckxheWVyLmhlaWdodCkgLyAyXG4gICAgb3ZlckxheWVyLnggPSB1bmRlckxheWVyLnggKyBwYWRkaW5nWFxuICAgIG92ZXJMYXllci55ID0gdW5kZXJMYXllci55ICsgcGFkZGluZ1lcblxuICBjZW50ZXJpemVkUG9pbnQ6IChvdmVyTGF5ZXIsIHVuZGVyTGF5ZXIpIC0+XG4gICAgcGFkZGluZ1ggPSAodW5kZXJMYXllci53aWR0aCAtIG92ZXJMYXllci53aWR0aCkgLyAyXG4gICAgcGFkZGluZ1kgPSAodW5kZXJMYXllci5oZWlnaHQgLSBvdmVyTGF5ZXIuaGVpZ2h0KSAvIDJcbiAgICB7eDogdW5kZXJMYXllci54ICsgcGFkZGluZ1gsIHk6IHVuZGVyTGF5ZXIueSArIHBhZGRpbmdZfVxuXG4gIG1pZGRsZVk6IChsYXllcikgLT4gbGF5ZXIueSArIGxheWVyLmhlaWdodCAvIDJcbiAgbWlkZGxlWDogKGxheWVyKSAtPiBsYXllci54ICsgbGF5ZXIud2lkdGggLyAyXG5cbiAgYWxpZ25YOiAobGF5ZXIsIGZpeGVkTGF5ZXIpIC0+XG4gICAgbGF5ZXIueCA9IF9taWRkbGVYKGZpeGVkTGF5ZXIueCkgLSBsYXllci53aWR0aCAvIDJcblxuICBhYm92ZTogKGxheWVyLCBmaXhlZExheWVyLCBtYXJnaW4pIC0+XG4gICAgbGF5ZXIueSA9IGZpeGVkTGF5ZXIueSAtIGlmIF8uaXNOaWwobWFyZ2luKSB0aGVuIGxheWVyLmhlaWdodCBlbHNlIG1hcmdpblxuIl19
//# sourceURL=/Users/gvieira/code/hare/hare_framer/src_coffee/utils.coffee