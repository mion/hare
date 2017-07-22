// Generated by CoffeeScript 1.12.7
(function() {
  var Button, Card, CardList, ClusterView, ExplorationSlider, Workplace, addButton, cardList, clusterButton, clusterMaker, leftmost, tasksQueue,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  clusterMaker = require("clusters");

  tasksQueue = [];

  CardList = (function() {
    function CardList() {
      this.cards = [];
    }

    CardList.prototype.add = function(task) {
      var card;
      card = new Card(task, this);
      this.cards.push(card);
      card.onDoubleTap((function(_this) {
        return function() {
          return _this.remove(card);
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

  Workplace = (function(superClass) {
    extend(Workplace, superClass);

    function Workplace() {
      Workplace.__super__.constructor.call(this, {
        width: Screen.width / 2,
        height: Screen.height / 2,
        x: Align.center,
        y: Align.center,
        backgroundColor: "#F9F9F9"
      });
      this.active = false;
      this.onLongPress(function() {
        if (this.active) {
          return this.deactivate();
        } else {
          return this.activate();
        }
      });
    }

    Workplace.prototype.activate = function() {
      this.animate({
        backgroundColor: "#AAA"
      });
      return this.active = true;
    };

    Workplace.prototype.deactivate = function() {
      this.active = false;
      return this.animate({
        backgroundColor: "#F9F9F9"
      });
    };

    return Workplace;

  })(Layer);

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

  addButton = new Button("plus");

  clusterButton = new Button("box", addButton);

  cardList = new CardList();

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

  ExplorationSlider = (function(superClass) {
    extend(ExplorationSlider, superClass);

    function ExplorationSlider() {
      ExplorationSlider.__super__.constructor.call(this, {
        x: Align.center,
        y: 50,
        min: 0.0,
        max: 1.0
      });
      this.knob.draggable.momentum = false;
      this.knob.onDragEnd((function(_this) {
        return function() {
          return print(_this.value);
        };
      })(this));
    }

    return ExplorationSlider;

  })(SliderComponent);

  leftmost = function(layers) {
    return _.head(_.sortBy(layers, function(l) {
      return l.x;
    }));
  };

  ClusterView = (function(superClass) {
    extend(ClusterView, superClass);

    function ClusterView(cluster1) {
      var height, max_x, max_y, min_x, min_y, width, x, y;
      this.cluster = cluster1;
      min_x = _.head(_.sortBy(this.cluster.points, function(point) {
        return point[0];
      }))[0];
      max_x = _.head(_.reverse(_.sortBy(this.cluster.points, function(point) {
        return point[0];
      })))[0];
      min_y = _.head(_.sortBy(this.cluster.points, function(point) {
        return point[1];
      }))[1];
      max_y = _.head(_.reverse(_.sortBy(this.cluster.points, function(point) {
        return point[1];
      })))[1];
      height = max_y - min_y;
      width = max_x - min_x;
      x = this.cluster.centroid[0] - (width / 2);
      y = this.cluster.centroy[0] - (height / 2);
      ClusterView.__super__.constructor.call(this, {
        x: x,
        y: y,
        width: width,
        height: height,
        backgroundColor: "#EEDDDD"
      });
      this.sendToBack();
    }

    return ClusterView;

  })(Layer);

  Card = (function(superClass) {
    extend(Card, superClass);

    Card.prototype.instersectionArea = function(layer) {};

    Card.prototype.isInside = function(layer) {
      return (this.x > layer.x) && (this.x < layer.x + layer.width) && (this.y > layer.y) && (this.y < layer.y + layer.height);
    };

    function Card(task1, list) {
      var PADDING, _damping, grow, key, newHeight, newWidth, pos_str, stay, text;
      this.task = task1;
      this.list = list;
      key = this.task.toLowerCase().split(" ").join("_");
      pos_str = localStorage.getItem("cardpos:" + key);
      if (pos_str !== null) {
        this.xInit = parseInt(pos_str.split(",")[0]);
        this.yInit = parseInt(pos_str.split(",")[1]);
      } else {
        this.xInit = Canvas.width / 2;
        this.yInit = Canvas.height / 2;
      }
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
      this.onDragEnd(function() {
        key = this.task.toLowerCase().split(" ").join("_");
        return localStorage.setItem("cardpos:" + key, this.x + "," + this.y);
      });
      this.onLongPressEnd((function(_this) {
        return function() {
          newWidth = _this.width * 1.25;
          newHeight = _this.height * 1.25;
          _this.animate({
            width: newWidth,
            height: newHeight
          });
          return text.animate({
            x: (newWidth / 2) - (text.width / 2),
            y: (newHeight / 2) - (text.height / 2)
          });
        };
      })(this));
      this.onTap(function() {
        return this.bringToFront();
      });
      this.onPinch(function() {
        return;
        newWidth = this.width * (1 / 1.25);
        newHeight = this.height * (1 / 1.25);
        this.animate({
          width: newWidth,
          height: newHeight
        });
        return text.animate({
          x: (newWidth / 2) - (text.width / 2),
          y: (newHeight / 2) - (text.height / 2)
        });
      });
    }

    return Card;

  })(Layer);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2xkLmpzIiwic291cmNlUm9vdCI6Ii4uIiwic291cmNlcyI6WyJzcmNfY29mZmVlL29sZC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUEsTUFBQSx5SUFBQTtJQUFBOzs7RUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLFVBQVI7O0VBRWYsVUFBQSxHQUFhOztFQUtQO0lBQ1Esa0JBQUE7TUFDWixJQUFDLENBQUEsS0FBRCxHQUFTO0lBREc7O3VCQUViLEdBQUEsR0FBSyxTQUFDLElBQUQ7QUFDSixVQUFBO01BQUEsSUFBQSxHQUFPLElBQUksSUFBSixDQUFTLElBQVQsRUFBZSxJQUFmO01BQ1AsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQVksSUFBWjtNQUNBLElBQUksQ0FBQyxXQUFMLENBQWlCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDaEIsS0FBQyxDQUFBLE1BQUQsQ0FBUSxJQUFSO1FBRGdCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQjtBQUVBLGFBQU87SUFMSDs7dUJBTUwsTUFBQSxHQUFRLFNBQUMsSUFBRDtBQUNQLFVBQUE7TUFBQSxHQUFBLEdBQU0sSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFQLENBQWUsSUFBZjtNQUNOLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFjLEdBQWQsRUFBbUIsQ0FBbkI7YUFDQSxJQUFJLENBQUMsT0FBTCxDQUFBO0lBSE87O3VCQUlSLE1BQUEsR0FBUSxTQUFDLENBQUQsRUFBSSxDQUFKO0FBQ1AsVUFBQTtBQUFBO0FBQUEsV0FBQSxxQ0FBQTs7UUFDQyxJQUFHLElBQUksQ0FBQyxDQUFMLEtBQVUsQ0FBVixJQUFlLElBQUksQ0FBQyxDQUFMLEtBQVUsQ0FBNUI7QUFDQyxpQkFBTyxLQURSOztBQUREO2FBR0E7SUFKTzs7dUJBS1IsT0FBQSxHQUFTLFNBQUE7QUFDUixVQUFBO01BQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxLQUFLLENBQUMsR0FBUCxDQUFXLFNB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R0FBYyxDQUFmLENBRHRCO1NBREQ7TUFQUSxDQUFUO0lBbkZZOzs7O0tBSks7QUFwSW5CIiwic291cmNlc0NvbnRlbnQiOlsiY2x1c3Rlck1ha2VyID0gcmVxdWlyZSBcImNsdXN0ZXJzXCJcblxudGFza3NRdWV1ZSA9IFtcblx0I1wicHV0IGNhcmRzIGluIGEgbGlzdCB1cG9uIGFkZGluZ1wiLFxuXHQjXCJhdXRvIHJlLW9yZGVyIGNhcmRzIHVwb24gZHJhZyBlbmRcIixcbl1cblxuY2xhc3MgQ2FyZExpc3Rcblx0Y29uc3RydWN0b3I6ICgpIC0+XG5cdFx0QGNhcmRzID0gW11cblx0YWRkOiAodGFzaykgLT5cblx0XHRjYXJkID0gbmV3IENhcmQodGFzaywgdGhpcylcblx0XHRAY2FyZHMucHVzaChjYXJkKVxuXHRcdGNhcmQub25Eb3VibGVUYXAgPT5cblx0XHRcdEByZW1vdmUoY2FyZClcblx0XHRyZXR1cm4gY2FyZFxuXHRyZW1vdmU6IChjYXJkKSAtPlxuXHRcdHBvcyA9IEBjYXJkcy5pbmRleE9mKGNhcmQpXG5cdFx0QGNhcmRzLnNwbGljZShwb3MsIDEpXG5cdFx0Y2FyZC5kZXN0cm95KClcblx0Y2FyZEF0OiAoeCwgeSkgLT5cblx0XHRmb3IgY2FyZCBpbiBAY2FyZHNcblx0XHRcdGlmIGNhcmQueCA9PSB4ICYmIGNhcmQueSA9PSB5XG5cdFx0XHRcdHJldHVybiBjYXJkXG5cdFx0bnVsbFxuXHRjbHVzdGVyOiAoKSAtPlxuXHRcdHBvaW50cyA9IEBjYXJkcy5tYXAgKGNhcmQpIC0+IFtjYXJkLngsIGNhcmQueV1cblx0XHRjbHVzdGVyTWFrZXIuZGF0YShwb2ludHMpXG5cdFx0Y2x1c3RlcnMgPSBjbHVzdGVyTWFrZXIuY2x1c3RlcnMoKVxuXHRcdGNvbnNvbGUubG9nKFwiY2x1c3RlcnNcIiwgY2x1c3RlcnMpXG5cdFx0Zm9yIGNsdXN0ZXIgaW4gY2x1c3RlcnNcblx0XHRcdGNhcmRzSW5zaWRlID0gW11cblx0XHRcdGZvciBwYWlyIGluIGNsdXN0ZXIucG9pbnRzXG5cdFx0XHRcdGMgPSBAY2FyZEF0KHBhaXJbMF0sIHBhaXJbMV0pXG5cdFx0XHRcdGNhcmRzSW5zaWRlLnB1c2goYykgdW5sZXNzIF8uaXNOaWwoYylcblx0XHRcdHRhc2tzID0gY2FyZHNJbnNpZGUubWFwIChjYXJkKSAtPiBjYXJkLnRhc2tcblx0XHRcdGJpZ0NhcmQgPSBAYWRkKHRhc2tzLmpvaW4oXCI7IFwiKSlcblx0XHRcdGJpZ0NhcmQueCA9IGNsdXN0ZXIuY2VudHJvaWRbMF1cblx0XHRcdGJpZ0NhcmQueSA9IGNsdXN0ZXIuY2VudHJvaWRbMV1cblx0XHRcdGNhcmRzSW5zaWRlLmZvckVhY2ggKGNhcmQpID0+IEByZW1vdmUoY2FyZClcblxuY2xhc3MgV29ya3BsYWNlIGV4dGVuZHMgTGF5ZXJcblx0Y29uc3RydWN0b3I6ICgpIC0+XG5cdFx0c3VwZXJcblx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGggLyAyXG5cdFx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHQgLyAyXG5cdFx0XHR4OiBBbGlnbi5jZW50ZXJcblx0XHRcdHk6IEFsaWduLmNlbnRlclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIiNGOUY5RjlcIlxuXHRcdEBhY3RpdmUgPSBmYWxzZVxuXHRcdEBvbkxvbmdQcmVzcyAtPlxuXHRcdFx0aWYgQGFjdGl2ZSB0aGVuIEBkZWFjdGl2YXRlKCkgZWxzZSBAYWN0aXZhdGUoKVxuXHRhY3RpdmF0ZTogKCkgLT5cblx0XHRAYW5pbWF0ZVxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIiNBQUFcIlxuXHRcdEBhY3RpdmUgPSB0cnVlXG5cdGRlYWN0aXZhdGU6ICgpIC0+XG5cdFx0QGFjdGl2ZSA9IGZhbHNlXG5cdFx0QGFuaW1hdGVcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCIjRjlGOUY5XCJcblxuIyB3b3JrcGxhY2UgPSBuZXcgV29ya3BsYWNlXG5cbmNsYXNzIEJ1dHRvbiBleHRlbmRzIExheWVyXG5cdGNvbnN0cnVjdG9yOiAoaWNvbiwgYnV0dG9uKSAtPlxuXHRcdEJVVFRPTl9TSVpFID0gNzVcblx0XHRJQ09OX1NJWkUgPSAzMFxuXHRcdFBBRERJTkcgPSAxNVxuXHRcdHN1cGVyXG5cdFx0XHR3aWR0aDogQlVUVE9OX1NJWkVcblx0XHRcdGhlaWdodDogQlVUVE9OX1NJWkVcblx0XHRcdHg6IGlmIF8uaXNOaWwoYnV0dG9uKSB0aGVuIFNjcmVlbi53aWR0aCAtIEJVVFRPTl9TSVpFIC0gUEFERElORyBlbHNlIGJ1dHRvbi54IC0gQlVUVE9OX1NJWkUgLSBQQURESU5HXG5cdFx0XHR5OiBQQURESU5HXG5cdFx0XHRib3JkZXJSYWRpdXM6IDE1XG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiI0VFRVwiXG5cdFx0QGljb25MYXllciA9IG5ldyBMYXllclxuXHRcdFx0cGFyZW50OiB0aGlzXG5cdFx0XHR3aWR0aDogSUNPTl9TSVpFXG5cdFx0XHRoZWlnaHQ6IElDT05fU0laRVxuXHRcdFx0eDogQWxpZ24uY2VudGVyXG5cdFx0XHR5OiBBbGlnbi5jZW50ZXJcblx0XHRcdGltYWdlOiBcImltYWdlcy9pY29ucy8je2ljb259LnN2Z1wiXG5cbmFkZEJ1dHRvbiA9IG5ldyBCdXR0b24oXCJwbHVzXCIpXG5jbHVzdGVyQnV0dG9uID0gbmV3IEJ1dHRvbihcImJveFwiLCBhZGRCdXR0b24pXG5jYXJkTGlzdCA9IG5ldyBDYXJkTGlzdCgpXG5cbmFkZEJ1dHRvbi5vblRhcCAtPlxuXHR0YXNrID0gaWYgXy5pc0VtcHR5KHRhc2tzUXVldWUpXG5cdFx0cHJvbXB0KFwiV2hhdCdzIHRoZSB0YXNrP1wiKVxuXHRlbHNlXG5cdFx0dGFza3NRdWV1ZS5wb3AoKVxuXHRpZiB0YXNrICE9IG51bGxcblx0XHRjYXJkTGlzdC5hZGQodGFzaylcblxuY2x1c3RlckJ1dHRvbi5vblRhcCAtPlxuXHRjYXJkTGlzdC5jbHVzdGVyKClcblxuY2xhc3MgRXhwbG9yYXRpb25TbGlkZXIgZXh0ZW5kcyBTbGlkZXJDb21wb25lbnRcblx0Y29uc3RydWN0b3I6ICgpIC0+XG5cdFx0c3VwZXJcblx0XHRcdHg6IEFsaWduLmNlbnRlclxuXHRcdFx0eTogNTBcblx0XHRcdG1pbjogMC4wXG5cdFx0XHRtYXg6IDEuMFxuXHRcdEBrbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlXG5cdFx0QGtub2Iub25EcmFnRW5kID0+XG5cdFx0XHRwcmludChAdmFsdWUpXG5cbiNzbGlkZXIgPSBuZXcgRXhwbG9yYXRpb25TbGlkZXJcblxubGVmdG1vc3QgPSAobGF5ZXJzKSAtPlxuXHRfLmhlYWQoXy5zb3J0QnkobGF5ZXJzLCAobCkgLT4gbC54KSlcblxuY2xhc3MgQ2x1c3RlclZpZXcgZXh0ZW5kcyBMYXllclxuXHRjb25zdHJ1Y3RvcjogKEBjbHVzdGVyKSAtPlxuXHRcdG1pbl94ID0gXy5oZWFkKF8uc29ydEJ5KEBjbHVzdGVyLnBvaW50cywgKHBvaW50KSAtPiBwb2ludFswXSkpWzBdXG5cdFx0bWF4X3ggPSBfLmhlYWQoXy5yZXZlcnNlKF8uc29ydEJ5KEBjbHVzdGVyLnBvaW50cywgKHBvaW50KSAtPiBwb2ludFswXSkpKVswXVxuXHRcdG1pbl95ID0gXy5oZWFkKF8uc29ydEJ5KEBjbHVzdGVyLnBvaW50cywgKHBvaW50KSAtPiBwb2ludFsxXSkpWzFdXG5cdFx0bWF4X3kgPSBfLmhlYWQoXy5yZXZlcnNlKF8uc29ydEJ5KEBjbHVzdGVyLnBvaW50cywgKHBvaW50KSAtPiBwb2ludFsxXSkpKVsxXVxuXHRcdGhlaWdodCA9IG1heF95IC0gbWluX3lcblx0XHR3aWR0aCA9IG1heF94IC0gbWluX3hcblx0XHR4ID0gQGNsdXN0ZXIuY2VudHJvaWRbMF0gLSAod2lkdGggLyAyKVxuXHRcdHkgPSBAY2x1c3Rlci5jZW50cm95WzBdIC0gKGhlaWdodCAvIDIpXG5cdFx0c3VwZXJcblx0XHRcdHg6IHhcblx0XHRcdHk6IHlcblx0XHRcdHdpZHRoOiB3aWR0aFxuXHRcdFx0aGVpZ2h0OiBoZWlnaHRcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCIjRUVEREREXCJcblx0XHRAc2VuZFRvQmFjaygpXG5cbmNsYXNzIENhcmQgZXh0ZW5kcyBMYXllclxuXHRpbnN0ZXJzZWN0aW9uQXJlYTogKGxheWVyKSAtPlxuXHRpc0luc2lkZTogKGxheWVyKSAtPlxuXHRcdChAeCA+IGxheWVyLngpICYmIChAeCA8IGxheWVyLnggKyBsYXllci53aWR0aCkgJiYgKEB5ID4gbGF5ZXIueSkgJiYgKEB5IDwgbGF5ZXIueSArIGxheWVyLmhlaWdodClcblx0Y29uc3RydWN0b3I6IChAdGFzaywgQGxpc3QpIC0+XG5cdFx0a2V5ID0gQHRhc2sudG9Mb3dlckNhc2UoKS5zcGxpdChcIiBcIikuam9pbihcIl9cIilcblx0XHRwb3Nfc3RyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJjYXJkcG9zOiN7a2V5fVwiKVxuXHRcdGlmIHBvc19zdHIgIT0gbnVsbFxuXHRcdFx0QHhJbml0ID0gcGFyc2VJbnQocG9zX3N0ci5zcGxpdChcIixcIilbMF0pXG5cdFx0XHRAeUluaXQgPSBwYXJzZUludChwb3Nfc3RyLnNwbGl0KFwiLFwiKVsxXSlcblx0XHRlbHNlXG5cdFx0XHRAeEluaXQgPSAoQ2FudmFzLndpZHRoIC8gMilcblx0XHRcdEB5SW5pdCA9IChDYW52YXMuaGVpZ2h0IC8gMilcblx0XHRzdXBlclxuXHRcdFx0eDogQHhJbml0XG5cdFx0XHR5OiBAeUluaXRcblx0XHRcdHdpZHRoOiAxMDBcblx0XHRcdGhlaWdodDogMTAwXG5cdFx0XHRib3JkZXJSYWRpdXM6IDhcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCIjRkZGRkNDXCJcblx0XHRcdHNoYWRvd1g6IDBcblx0XHRcdHNoYWRvd1k6IDNcblx0XHRcdHNoYWRvd0JsdXI6IDZcblx0XHRcdHNoYWRvd1NwcmVhZDogMFxuXHRcdFx0c2hhZG93Q29sb3I6IFwicmdiYSgwLDAsMCwwLjI1KVwiXG5cblx0XHR0ZXh0ID0gbmV3IFRleHRMYXllclxuXHRcdFx0cGFyZW50OiB0aGlzXG5cdFx0XHR0ZXh0OiBAdGFza1xuXHRcdFx0Zm9udFNpemU6IDEyXG5cdFx0XHRmb250RmFtaWx5OiBcIkluY29uc29sYXRhLWdcIlxuXHRcdFx0Y29sb3I6IFwiYmxhY2tcIlxuXG5cdFx0UEFERElORyA9IDE1XG5cdFx0QHdpZHRoID0gdGV4dC53aWR0aCArICgyICogUEFERElORylcblx0XHRAaGVpZ2h0ID0gdGV4dC5oZWlnaHQgKyAoMiAqIFBBRERJTkcpXG5cdFx0dGV4dC54ID0gQWxpZ24uY2VudGVyXG5cdFx0dGV4dC55ID0gQWxpZ24uY2VudGVyXG5cblx0XHRuZXdXaWR0aCA9IEB3aWR0aCAqICgxLjI1KVxuXHRcdG5ld0hlaWdodCA9IEBoZWlnaHQgKiAoMS4yNSlcblx0XHRfZGFtcGluZyA9IDAuMTkgI3NsaWRlci52YWx1ZVxuXHRcdGdyb3cgPSBuZXcgQW5pbWF0aW9uIHRoaXMsXG5cdFx0XHR3aWR0aDogbmV3V2lkdGhcblx0XHRcdGhlaWdodDogbmV3SGVpZ2h0XG5cdFx0XHR4OiBAeEluaXRcblx0XHRcdHk6IEB5SW5pdFxuXHRcdFx0b3B0aW9uczpcblx0XHRcdFx0Y3VydmU6IFNwcmluZyhkYW1waW5nOiBfZGFtcGluZylcblx0XHRcdFx0dGltZTogMC41XG5cdFx0Z3Jvdy5zdGFydCgpXG5cblx0XHRzdGF5ID0gbmV3IEFuaW1hdGlvbiB0ZXh0LFxuXHRcdFx0eDogKChuZXdXaWR0aCAvIDIpIC0gKHRleHQud2lkdGggLyAyKSlcblx0XHRcdHk6ICgobmV3SGVpZ2h0IC8gMikgLSAodGV4dC5oZWlnaHQgLyAyKSlcblx0XHRcdG9wdGlvbnM6XG5cdFx0XHRcdGN1cnZlOiBTcHJpbmcoZGFtcGluZzogX2RhbXBpbmcpXG5cdFx0XHRcdHRpbWU6IDAuNVxuXG5cdFx0c3RheS5zdGFydCgpXG5cblx0XHRAZHJhZ2dhYmxlLmVuYWJsZWQgPSB0cnVlXG5cdFx0QGRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlXG5cdFx0QG9uRHJhZ0VuZCAtPlxuXHRcdFx0IyBpZiBAaXNJbnNpZGUod29ya3BsYWNlKSAmJiB3b3JrcGxhY2UuYWN0aXZlXG5cdFx0XHQjIFx0QGFuaW1hdGVcblx0XHRcdCMgXHRcdHg6IEFsaWduLmNlbnRlclxuXHRcdFx0IyBcdFx0eTogQWxpZ24uY2VudGVyXG5cdFx0XHRrZXkgPSBAdGFzay50b0xvd2VyQ2FzZSgpLnNwbGl0KFwiIFwiKS5qb2luKFwiX1wiKVxuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJjYXJkcG9zOiN7a2V5fVwiLCBcIiN7QHh9LCN7QHl9XCIpXG5cbiMgXHRcdEBvbkRvdWJsZVRhcCA9PlxuIyBcdFx0XHRAZGVzdHJveSgpXG5cblx0XHRAb25Mb25nUHJlc3NFbmQgPT5cblx0XHRcdCMgcmV0dXJuXG5cdFx0XHRuZXdXaWR0aCA9IEB3aWR0aCAqICgxLjI1KVxuXHRcdFx0bmV3SGVpZ2h0ID0gQGhlaWdodCAqICgxLjI1KVxuXHRcdFx0QGFuaW1hdGVcblx0XHRcdFx0d2lkdGg6IG5ld1dpZHRoXG5cdFx0XHRcdGhlaWdodDogbmV3SGVpZ2h0XG5cdFx0XHR0ZXh0LmFuaW1hdGVcblx0XHRcdFx0eDogKChuZXdXaWR0aCAvIDIpIC0gKHRleHQud2lkdGggLyAyKSlcblx0XHRcdFx0eTogKChuZXdIZWlnaHQgLyAyKSAtICh0ZXh0LmhlaWdodCAvIDIpKVxuXHRcdEBvblRhcCAtPlxuXHRcdFx0QGJyaW5nVG9Gcm9udCgpXG5cblx0XHRAb25QaW5jaCAtPlxuXHRcdFx0cmV0dXJuXG5cdFx0XHRuZXdXaWR0aCA9IEB3aWR0aCAqICgxIC8gMS4yNSlcblx0XHRcdG5ld0hlaWdodCA9IEBoZWlnaHQgKiAoMSAvIDEuMjUpXG5cdFx0XHRAYW5pbWF0ZVxuXHRcdFx0XHR3aWR0aDogbmV3V2lkdGhcblx0XHRcdFx0aGVpZ2h0OiBuZXdIZWlnaHRcblx0XHRcdHRleHQuYW5pbWF0ZVxuXHRcdFx0XHR4OiAoKG5ld1dpZHRoIC8gMikgLSAodGV4dC53aWR0aCAvIDIpKVxuXHRcdFx0XHR5OiAoKG5ld0hlaWdodCAvIDIpIC0gKHRleHQuaGVpZ2h0IC8gMikpXG4iXX0=
//# sourceURL=/Users/gvieira/Dropbox/design/Projects/Hare/hare.io/Framer/Project/src_coffee/old.coffee