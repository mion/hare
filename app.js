(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Generated by CoffeeScript 1.12.6
(function() {
  var Button,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  exports.Button = Button;

  Button = (function(superClass) {
    extend(Button, superClass);

    function Button(icon, button) {
      var BUTTON_SIZE, ICON_SIZE, PADDING;
      BUTTON_SIZE = 75;
      ICON_SIZE = 30;
      PADDING = 15;
      Button.__super__.constructor.call(this, {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        x: _.isNil(button) ? Screen.width - BUTTON_SIZE - PADDING : button.x - BUTTON_SIZE - PADDING,
        y: PADDING,
        borderRadius: 15,
        backgroundColor: "#EEE"
      });
      this.iconLayer = new Layer({
        parent: this,
        width: ICON_SIZE,
        height: ICON_SIZE,
        x: Align.center,
        y: Align.center,
        image: "images/icons/" + icon + ".svg"
      });
    }

    return Button;

  })(Layer);

}).call(this);

},{}],2:[function(require,module,exports){
// Generated by CoffeeScript 1.12.6
(function() {
  var Card,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  exports.Card = Card;

  Card = (function(superClass) {
    extend(Card, superClass);

    Card.prototype.GROW_FACTOR = 1.25;

    Card.prototype.MAX_SIZE = 13;

    Card.prototype.MIN_SIZE = 1;

    Card.prototype.isInside = function(layer) {
      return (this.x > layer.x) && (this.x < layer.x + layer.width) && (this.y > layer.y) && (this.y < layer.y + layer.height);
    };

    function Card(task, delegate) {
      var PADDING, _damping, grow, newHeight, newWidth, stay, text;
      this.task = task;
      this.delegate = delegate;
      if (typeof this.task === 'object') {
        this.xInit = this.task.x;
        this.yInit = this.task.y;
        this.task = this.task.text;
      } else {
        this.xInit = Canvas.width / 2;
        this.yInit = Canvas.height / 2;
      }
      this.pointsEstimate = Card.prototype.MIN_SIZE;
      Card.__super__.constructor.call(this, {
        x: this.xInit,
        y: this.yInit,
        width: 100,
        height: 100,
        borderRadius: 8,
        backgroundColor: "#FFFFCC",
        shadowX: 0,
        shadowY: 3,
        shadowBlur: 6,
        shadowSpread: 0,
        shadowColor: "rgba(0,0,0,0.25)"
      });
      text = new TextLayer({
        parent: this,
        text: this.task,
        fontSize: 12,
        fontFamily: "Inconsolata-g",
        color: "black"
      });
      this.text = text;
      PADDING = 15;
      this.width = text.width + (2 * PADDING);
      this.height = text.height + (2 * PADDING);
      text.x = Align.center;
      text.y = Align.center;
      newWidth = this.width * 1.25;
      newHeight = this.height * 1.25;
      _damping = 0.19;
      grow = new Animation(this, {
        width: newWidth,
        height: newHeight,
        x: this.xInit,
        y: this.yInit,
        options: {
          curve: Spring({
            damping: _damping
          }),
          time: 0.5
        }
      });
      grow.start();
      stay = new Animation(text, {
        x: (newWidth / 2) - (text.width / 2),
        y: (newHeight / 2) - (text.height / 2),
        options: {
          curve: Spring({
            damping: _damping
          }),
          time: 0.5
        }
      });
      stay.start();
      this.draggable.enabled = true;
      this.draggable.momentum = false;
    }

    Card.prototype.toObject = function() {
      return {
        text: this.task,
        x: this.x,
        y: this.y
      };
    };

    Card.prototype.grow = function() {
      var newHeight, newWidth;
      if (this.pointsEstimate === Card.prototype.MAX_SIZE) {
        return this.pointsEstimate;
      }
      newWidth = this.width * Card.prototype.GROW_FACTOR;
      newHeight = this.height * Card.prototype.GROW_FACTOR;
      this.animate({
        width: newWidth,
        height: newHeight
      });
      this.text.animate({
        x: (newWidth / 2) - (this.text.width / 2),
        y: (newHeight / 2) - (this.text.height / 2)
      });
      if (this.pointsEstimate === 1) {
        this.pointsEstimate = 2;
      } else if (this.pointsEstimate === 2) {
        this.pointsEstimate = 3;
      } else if (this.pointsEstimate === 3) {
        this.pointsEstimate = 5;
      } else if (this.pointsEstimate === 5) {
        this.pointsEstimate = 8;
      } else if (this.pointsEstimate === 8) {
        this.pointsEstimate = this.MAX_SIZE;
      }
      return this.pointsEstimate;
    };

    Card.prototype.shrink = function() {
      var newHeight, newWidth;
      if (this.pointsEstimate === Card.prototype.MIN_SIZE) {
        return this.pointsEstimate;
      }
      newWidth = this.width * (1 / Card.prototype.GROW_FACTOR);
      newHeight = this.height * (1 / Card.prototype.GROW_FACTOR);
      this.animate({
        width: newWidth,
        height: newHeight
      });
      this.text.animate({
        x: (newWidth / 2) - (this.text.width / 2),
        y: (newHeight / 2) - (this.text.height / 2)
      });
      if (this.pointsEstimate === 2) {
        this.pointsEstimate = this.MIN_SIZE;
      } else if (this.pointsEstimate === 3) {
        this.pointsEstimate = 2;
      } else if (this.pointsEstimate === 5) {
        this.pointsEstimate = 3;
      } else if (this.pointsEstimate === 8) {
        this.pointsEstimate = 5;
      } else if (this.pointsEstimate === 13) {
        this.pointsEstimate = 8;
      }
      return this.pointsEstimate;
    };

    return Card;

  })(Layer);

}).call(this);

},{}],3:[function(require,module,exports){
// Generated by CoffeeScript 1.12.6
(function() {
  var Card, CardList;

  Card = require('./card');

  exports.CardList = CardList;

  CardList = (function() {
    function CardList() {
      this.cards = [];
    }

    CardList.prototype.save = function() {
      var card_objects, json_string;
      console.log("saving " + this.cards.length + " cards...");
      card_objects = _.map(this.cards, function(card) {
        return card.toObject();
      });
      json_string = JSON.stringify(card_objects);
      return localStorage.setItem('card_objects', json_string);
    };

    CardList.prototype.restore = function() {
      var card_objects, restored_cards;
      if (_.isNil(localStorage.getItem('card_objects'))) {
        return false;
      }
      card_objects = JSON.parse(localStorage.getItem('card_objects'));
      console.log("restoring " + card_objects.length + " cards...");
      restored_cards = _.map(card_objects, (function(_this) {
        return function(obj) {
          return new Card(obj, _this);
        };
      })(this));
      return _.forEach(restored_cards, (function(_this) {
        return function(card) {
          return _this.addCard(card);
        };
      })(this));
    };

    CardList.prototype.add = function(task) {
      var card;
      card = new Card(task, this);
      return this.addCard(card);
    };

    CardList.prototype.addCard = function(card) {
      this.cards.push(card);
      card.onDoubleTap((function(_this) {
        return function() {
          return card.grow();
        };
      })(this));
      card.onLongPress((function(_this) {
        return function() {
          if (!card.draggable.isDragging) {
            return card.shrink();
          }
        };
      })(this));
      card.onDragEnd((function(_this) {
        return function() {
          return _this.save();
        };
      })(this));
      return card;
    };

    CardList.prototype.remove = function(card) {
      var pos;
      pos = this.cards.indexOf(card);
      this.cards.splice(pos, 1);
      return card.destroy();
    };

    CardList.prototype.cardAt = function(x, y) {
      var card, i, len, ref;
      ref = this.cards;
      for (i = 0, len = ref.length; i < len; i++) {
        card = ref[i];
        if (card.x === x && card.y === y) {
          return card;
        }
      }
      return null;
    };

    CardList.prototype.cluster = function() {
      var bigCard, c, cardsInside, cluster, clusters, i, j, len, len1, pair, points, ref, results, tasks;
      points = this.cards.map(function(card) {
        return [card.x, card.y];
      });
      clusterMaker.data(points);
      clusters = clusterMaker.clusters();
      console.log("clusters", clusters);
      results = [];
      for (i = 0, len = clusters.length; i < len; i++) {
        cluster = clusters[i];
        cardsInside = [];
        ref = cluster.points;
        for (j = 0, len1 = ref.length; j < len1; j++) {
          pair = ref[j];
          c = this.cardAt(pair[0], pair[1]);
          if (!_.isNil(c)) {
            cardsInside.push(c);
          }
        }
        tasks = cardsInside.map(function(card) {
          return card.task;
        });
        bigCard = this.add(tasks.join("; "));
        bigCard.x = cluster.centroid[0];
        bigCard.y = cluster.centroid[1];
        results.push(cardsInside.forEach((function(_this) {
          return function(card) {
            return _this.remove(card);
          };
        })(this)));
      }
      return results;
    };

    return CardList;

  })();

}).call(this);

},{"./card":2}],4:[function(require,module,exports){
// Generated by CoffeeScript 1.12.6
(function() {
  var Button, CardList, addButton, bug, cardList, clusterButton, clusterMaker, leftmost, tasksQueue;

  clusterMaker = require("clusters");

  Button = require('./button');

  CardList = require('./card_list');

  tasksQueue = [];

  console.log(JSON);

  bug = function(things) {
    return _.forEach(things, function(thing) {
      return console.log(thing);
    });
  };

  addButton = new Button("plus");

  clusterButton = new Button("box", addButton);

  cardList = new CardList();

  cardList.restore();

  addButton.onTap(function() {
    var task;
    task = _.isEmpty(tasksQueue) ? prompt("What's the task?") : tasksQueue.pop();
    if (task !== null) {
      return cardList.add(task);
    }
  });

  clusterButton.onTap(function() {
    return cardList.cluster();
  });

  leftmost = function(layers) {
    return _.head(_.sortBy(layers, function(l) {
      return l.x;
    }));
  };

}).call(this);

},{"./button":1,"./card_list":3,"clusters":5}],5:[function(require,module,exports){
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

},{}]},{},[4]);
