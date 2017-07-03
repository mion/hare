(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Generated by CoffeeScript 1.12.6
(function() {
  var Creature, Grid, Movement, Position, _centerize, clusterMaker, foo, grid,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  clusterMaker = require("clusters");

  _centerize = function(overLayer, underLayer) {
    var paddingX, paddingY;
    paddingX = (underLayer.width - overLayer.width) / 2;
    paddingY = (underLayer.height - overLayer.height) / 2;
    overLayer.x = underLayer.x + paddingX;
    return overLayer.y = underLayer.y + paddingY;
  };

  Grid = (function(superClass) {
    extend(Grid, superClass);

    function Grid(sqm) {
      var bgColor, cell, i, j, k, l, m, n, ref, ref1, ref2, ref3;
      this.sqm = sqm;
      Grid.__super__.constructor.call(this, {
        x: 0,
        y: 0,
        width: Canvas.width,
        height: Canvas.height,
        backgroundColor: '#333333'
      });
      this.rows = Math.ceil(this.height / this.sqm);
      this.columns = Math.ceil(this.width / this.sqm);
      this.cells = {};
      for (i = k = 0, ref = this.rows - 1; k <= ref; i = k += 1) {
        this.cells[i] = {};
        for (j = l = 0, ref1 = this.columns - 1; l <= ref1; j = l += 1) {
          this.cells[i][j] = null;
        }
      }
      for (j = m = 0, ref2 = this.columns - 1; m <= ref2; j = m += 1) {
        for (i = n = 0, ref3 = this.rows - 1; n <= ref3; i = n += 1) {
          bgColor = (i + j * (this.columns + 1)) % 2 === 0 ? '#f0f0f0' : '#f6f6f6';
          cell = new Layer({
            x: i * this.sqm,
            y: j * this.sqm,
            width: this.sqm,
            height: this.sqm,
            backgroundColor: bgColor
          });
          this.cells[i][j] = cell;
        }
      }
    }

    Grid.prototype.cellAt = function(pos) {
      return this.cells[pos.i][pos.j];
    };

    Grid.prototype.place = function(thing) {
      this.addChild(thing);
      return _centerize(thing, this.cellAt(thing.pos));
    };

    return Grid;

  })(Layer);

  grid = new Grid(70);

  Position = (function() {
    function Position(i1, j1) {
      this.i = i1;
      this.j = j1;
    }

    return Position;

  })();

  Movement = (function() {
    function Movement(creature, destination) {
      this.creature = creature;
      this.destination = destination;
    }

    Movement.prototype.perform = function() {
      return this.creature.move(this.destination);
    };

    return Movement;

  })();

  Creature = (function(superClass) {
    extend(Creature, superClass);

    function Creature(displayName, pos1) {
      this.displayName = displayName;
      this.pos = pos1;
      this.health = 100;
      this.energy = 100;
      this.hunger = 100;
      this.thirst = 100;
      this.sex = 100;
      this.pleasure = 100;
      Creature.__super__.constructor.call(this, {
        width: 50,
        height: 50,
        backgroundColor: '#0099ff',
        borderRadius: 12
      });
    }

    return Creature;

  })(Layer);

  foo = new Creature("Foo", new Position(1, 2));

}).call(this);

},{"clusters":2}],2:[function(require,module,exports){
'use strict'

module.exports = {

  data: getterSetter([], function(arrayOfArrays) {
    var n = arrayOfArrays[0].length;
    return (arrayOfArrays.map(function(array) {
      return array.length == n;
    }).reduce(function(boolA, boolB) { return (boolA & boolB) }, true));
  }),

  clusters: function() {
    var pointsAndCentroids = kmeans(this.data(), {k: this.k(), iterations: this.iterations() });
    var points = pointsAndCentroids.points;
    var centroids = pointsAndCentroids.centroids;

    return centroids.map(function(centroid) {
      return {
        centroid: centroid.location(),
        points: points.filter(function(point) { return point.label() == centroid.label() }).map(function(point) { return point.location() }),
      };
    });
  },

  k: getterSetter(undefined, function(value) { return ((value % 1 == 0) & (value > 0)) }),

  iterations: getterSetter(Math.pow(10, 3), function(value) { return ((value % 1 == 0) & (value > 0)) }),

};

function kmeans(data, config) {
  // default k
  var k = config.k || Math.round(Math.sqrt(data.length / 2));
  var iterations = config.iterations;

  // initialize point objects with data
  var points = data.map(function(vector) { return new Point(vector) });

  // intialize centroids randomly
  var centroids = [];
  for (var i = 0; i < k; i++) {
    centroids.push(new Centroid(points[i % points.length].location(), i));
  };

  // update labels and centroid locations until convergence
  for (var iter = 0; iter < iterations; iter++) {
    points.forEach(function(point) { point.updateLabel(centroids) });
    centroids.forEach(function(centroid) { centroid.updateLocation(points) });
  };

  // return points and centroids
  return {
    points: points,
    centroids: centroids
  };

};

// objects
function Point(location) {
  var self = this;
  this.location = getterSetter(location);
  this.label = getterSetter();
  this.updateLabel = function(centroids) {
    var distancesSquared = centroids.map(function(centroid) {
      return sumOfSquareDiffs(self.location(), centroid.location());
    });
    self.label(mindex(distancesSquared));
  };
};

function Centroid(initialLocation, label) {
  var self = this;
  this.location = getterSetter(initialLocation);
  this.label = getterSetter(label);
  this.updateLocation = function(points) {
    var pointsWithThisCentroid = points.filter(function(point) { return point.label() == self.label() });
    if (pointsWithThisCentroid.length > 0) self.location(averageLocation(pointsWithThisCentroid));
  };
};

// convenience functions
function getterSetter(initialValue, validator) {
  var thingToGetSet = initialValue;
  var isValid = validator || function(val) { return true };
  return function(newValue) {
    if (typeof newValue === 'undefined') return thingToGetSet;
    if (isValid(newValue)) thingToGetSet = newValue;
  };
};

function sumOfSquareDiffs(oneVector, anotherVector) {
  var squareDiffs = oneVector.map(function(component, i) {
    return Math.pow(component - anotherVector[i], 2);
  });
  return squareDiffs.reduce(function(a, b) { return a + b }, 0);
};

function mindex(array) {
  var min = array.reduce(function(a, b) {
    return Math.min(a, b);
  });
  return array.indexOf(min);
};

function sumVectors(a, b) {
  return a.map(function(val, i) { return val + b[i] });
};

function averageLocation(points) {
  var zeroVector = points[0].location().map(function() { return 0 });
  var locations = points.map(function(point) { return point.location() });
  var vectorSum = locations.reduce(function(a, b) { return sumVectors(a, b) }, zeroVector);
  return vectorSum.map(function(val) { return val / points.length });
};

},{}]},{},[1]);
