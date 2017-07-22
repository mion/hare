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

//# sourceMappingURL=main.js.map