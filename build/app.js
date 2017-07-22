(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var Editor, Key, KeyHandler, SAtom, SExpression, SList, Token, __, editor, inconsolata, keyHandler, render,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  __ = require('./utils');

  inconsolata = Utils.loadWebFont("Inconsolata");

  SExpression = (function() {
    function SExpression(tokens1, parent1) {
      var sibling;
      this.tokens = tokens1;
      this.parent = parent1;
      this.children = [];
      this.previous = null;
      this.next = null;
      if (!_.isNil(this.parent)) {
        if (!_.isEmpty(this.parent.children)) {
          sibling = _.last(this.parent.children);
          this.previous = sibling;
          sibling.next = this;
        }
        this.parent.children.push(this);
      }
    }

    SExpression.prototype.select = function() {
      return _.each(this.tokens, function(token) {
        return token.select();
      });
    };

    SExpression.prototype.deselect = function() {
      return _.each(this.tokens, function(token) {
        return token.deselect();
      });
    };

    return SExpression;

  })();

  SAtom = (function(superClass) {
    extend(SAtom, superClass);

    function SAtom(token, parent) {
      SAtom.__super__.constructor.call(this, [token], parent);
    }

    return SAtom;

  })(SExpression);

  SList = (function(superClass) {
    extend(SList, superClass);

    function SList(tokens, parent) {
      SList.__super__.constructor.call(this, tokens, parent);
    }

    return SList;

  })(SExpression);

  Token = (function(superClass) {
    extend(Token, superClass);

    Token.prototype.DESELECTED_COLOR = '#F5F5F5';

    Token.prototype.SELECTED_COLOR = '#F5F500';

    function Token(txt, x, y) {
      Token.__super__.constructor.call(this, {
        text: txt,
        fontSize: 20,
        fontFamily: inconsolata,
        textAlign: 'center',
        x: x,
        y: y,
        color: '#000000',
        backgroundColor: this.DESELECTED_COLOR,
        borderWidth: 1,
        borderColor: '#F2F2F2',
        padding: 10
      });
    }

    Token.prototype.select = function() {
      return this.backgroundColor = this.SELECTED_COLOR;
    };

    Token.prototype.deselect = function() {
      return this.backgroundColor = this.DESELECTED_COLOR;
    };

    return Token;

  })(TextLayer);

  render = function(exp, x, y, tokens, parentSExp) {
    var lastToken, leftParens, leftParensIndex, rightParens, slist, str;
    if (_.isString(exp)) {
      str = new Token(exp, x, y);
      tokens.push(str);
      return new SAtom(str, parentSExp);
    } else {
      leftParens = new Token("(", x, y);
      tokens.push(leftParens);
      leftParensIndex = tokens.length - 1;
      slist = new SList([], parentSExp);
      _.each(exp, function(e) {
        var lastToken;
        lastToken = _.last(tokens);
        return render(e, __.xRight(lastToken), y, tokens, slist);
      });
      lastToken = _.last(tokens);
      rightParens = new Token(")", __.xRight(lastToken), y);
      tokens.push(rightParens);
      slist.tokens = tokens.slice(leftParensIndex);
      return slist;
    }
  };

  Editor = (function() {
    function Editor() {
      this.program = [['lambda', ['x'], ['cons', 'x', ['quote', ['b']]]]];
      this.rootSExp = render(this.program, 50, 100, []);
      this.currentSExp = null;
      console.log(this.rootSExp);
    }

    Editor.prototype.goNext = function() {
      if (_.isNil(this.currentSExp)) {
        return;
      }
      if (_.isNil(this.currentSExp.next)) {
        return;
      }
      this.currentSExp.deselect();
      this.currentSExp = this.currentSExp.next;
      return this.currentSExp.select();
    };

    Editor.prototype.goPrevious = function() {
      if (_.isNil(this.currentSExp)) {
        return;
      }
      if (_.isNil(this.currentSExp.previous)) {
        return;
      }
      this.currentSExp.deselect();
      this.currentSExp = this.currentSExp.previous;
      return this.currentSExp.select();
    };

    Editor.prototype.goIn = function() {
      if (_.isNil(this.currentSExp)) {
        this.currentSExp = this.rootSExp;
        return this.currentSExp.select();
      } else {
        if (!_.isEmpty(this.currentSExp.children)) {
          this.currentSExp.deselect();
          this.currentSExp = _.first(this.currentSExp.children);
          return this.currentSExp.select();
        }
      }
    };

    Editor.prototype.goOut = function() {
      if (_.isNil(this.currentSExp)) {
        return;
      }
      this.currentSExp.deselect();
      this.currentSExp = this.currentSExp.parent;
      if (!_.isNil(this.currentSExp)) {
        return this.currentSExp.select();
      }
    };

    return Editor;

  })();

  editor = new Editor;

  Key = {
    LEFT: 72,
    RIGHT: 76,
    UP: 75,
    DOWN: 74,
    SPACE: 32,
    ENTER: 13
  };

  KeyHandler = (function() {
    function KeyHandler(editor1) {
      this.editor = editor1;
      Events.wrap(window).addEventListener('keydown', (function(_this) {
        return function(event) {
          console.log('key code', event.keyCode);
          if (event.keyCode === Key.DOWN) {
            _this.editor.goIn();
          }
          if (event.keyCode === Key.UP) {
            _this.editor.goOut();
          }
          if (event.keyCode === Key.RIGHT) {
            _this.editor.goNext();
          }
          if (event.keyCode === Key.LEFT) {
            return _this.editor.goPrevious();
          }
        };
      })(this));
    }

    return KeyHandler;

  })();

  keyHandler = new KeyHandler(editor);

  console.log('ok');

}).call(this);



},{"./utils":2}],2:[function(require,module,exports){
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



},{}]},{},[1,2]);
