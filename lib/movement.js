// Generated by CoffeeScript 1.12.6
(function() {
  var Position, __;

  __ = require('./utils');

  Position = require('./position');

  module.exports = (function() {
    function exports(grid, creature, targetPos) {
      this.grid = grid;
      this.creature = creature;
      this.targetPos = targetPos;
    }

    exports.prototype.isValid = function() {
      return this.grid.isWithinBounds(this.targetPos) && this.grid.isWalkable(this.targetPos);
    };

    exports.prototype.perform = function() {
      var anim;
      if (this.creature.isAnimating) {
        return false;
      }
      if (!this.isValid()) {
        return false;
      }
      anim = new Animation(this.creature, {
        point: __.centerizedPoint(this.creature, this.grid.cellAt(this.targetPos))
      });
      anim.start();
      anim.on(Events.AnimationEnd, (function(_this) {
        return function() {
          return _this.creature.pos = new Position(_this.targetPos.i, _this.targetPos.j);
        };
      })(this));
      return true;
    };

    return exports;

  })();

}).call(this);