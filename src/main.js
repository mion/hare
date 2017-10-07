// Generated by CoffeeScript 1.12.7
(function() {
  var Editor, KeyForCommand, KeyHandler, Parser, SAtom, SExpression, SList, Token, __, editor, evaluate, inconsolata, key, keyHandler, render,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  __ = require('./utils');

  Parser = require('./parser');

  inconsolata = Utils.loadWebFont("Inconsolata");

  Parser.test();

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

    Token.prototype.BACKGROUND_COLOR_DESELECTED = '#FFFFFF';

    Token.prototype.TEXT_COLOR_DESELECTED = '#AAA';

    Token.prototype.BACKGROUND_COLOR_SELECTED = '#F8F8F8';

    Token.prototype.TEXT_COLOR_SELECTED = '#000000';

    function Token(txt, x, y) {
      Token.__super__.constructor.call(this, {
        text: txt,
        fontSize: 15,
        fontFamily: inconsolata,
        textAlign: 'center',
        x: x,
        y: y,
        color: this.TEXT_COLOR_DESELECTED,
        backgroundColor: this.BACKGROUND_COLOR_DESELECTED,
        borderWidth: 1,
        borderColor: '#FEFEFE',
        padding: 10
      });
    }

    Token.prototype.select = function() {
      this.backgroundColor = this.BACKGROUND_COLOR_SELECTED;
      return this.color = this.TEXT_COLOR_SELECTED;
    };

    Token.prototype.deselect = function() {
      this.backgroundColor = this.BACKGROUND_COLOR_DESELECTED;
      return this.color = this.TEXT_COLOR_DESELECTED;
    };

    return Token;

  })(TextLayer);

  evaluate = function(sexp) {
    var args, operator, thing;
    if (!(_.isArray(sexp) && sexp.length > 0)) {
      return sexp;
    }
    operator = _.head(sexp);
    args = _.tail(sexp);
    if (operator === 'quote') {
      if (args.length === 1) {
        return args[0];
      } else {
        return "ERROR: wrong numbers of arguments";
      }
    }
    if (operator === 'atom') {
      if (args.length === 1) {
        thing = evaluate(args[0]);
        if ((_.isArray(thing) && _.isEmpty(thing)) || _.isString(thing)) {
          return 't';
        } else {
          return [];
        }
      } else {
        return "ERROR: wrong numbers of arguments";
      }
    }
  };

  window.evaluate = evaluate;

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

  key = {
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    space: 32,
    enter: 13,
    shift: 16
  };

  KeyForCommand = {
    GO_IN: key.j,
    GO_OUT: key.k,
    GO_PREVIOUS: key.h,
    GO_NEXT: key.l
  };

  KeyHandler = (function() {
    function KeyHandler(editor1) {
      this.editor = editor1;
      this.isDown = {};
      Events.wrap(window).addEventListener('keyup', (function(_this) {
        return function(event) {
          console.log('key up', event.keyCode);
          return delete _this.isDown[event.keyCode];
        };
      })(this));
      Events.wrap(window).addEventListener('keydown', (function(_this) {
        return function(event) {
          console.log('key down', event.keyCode);
          _this.isDown[event.keyCode] = true;
          if (event.keyCode === KeyForCommand.GO_IN) {
            _this.editor.goIn();
          }
          if (event.keyCode === KeyForCommand.GO_OUT) {
            _this.editor.goOut();
          }
          if (event.keyCode === KeyForCommand.GO_NEXT) {
            _this.editor.goNext();
          }
          if (event.keyCode === KeyForCommand.GO_PREVIOUS) {
            return _this.editor.goPrevious();
          }
        };
      })(this));
    }

    return KeyHandler;

  })();

  keyHandler = new KeyHandler(editor);

  console.log('running...');

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIuLiIsInNvdXJjZXMiOlsic3JjX2NvZmZlZS9tYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBR0E7QUFBQSxNQUFBLHVJQUFBO0lBQUE7OztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0VBRVQsV0FBQSxHQUFjLEtBQUssQ0FBQyxXQUFOLENBQWtCLGFBQWxCOztFQUVkLE1BQU0sQ0FBQyxJQUFQLENBQUE7O0VBRU07SUFDUyxxQkFBQyxPQUFELEVBQVUsT0FBVjtBQUNYLFVBQUE7TUFEWSxJQUFDLENBQUEsU0FBRDtNQUFTLElBQUMsQ0FBQSxTQUFEO01BQ3JCLElBQUMsQ0FBQSxRQUFELEdBQVk7TUFDWixJQUFDLENBQUEsUUFBRCxHQUFZO01BQ1osSUFBQyxDQUFBLElBQUQsR0FBUTtNQUNSLElBQUcsQ0FBSSxDQUFDLENBQUMsS0FBRixDQUFRLElBQUMsQ0FBQSxNQUFULENBQVA7UUFDRSxJQUFHLENBQUksQ0FBQyxDQUFDLE9BQUYsQ0FBVSxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQWxCLENBQVA7VUFDRSxPQUFBLEdBQVUsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQWY7VUFDVixJQUFDLENBQUEsUUFBRCxHQUFZO1VBQ1osT0FBTyxDQUFDLElBQVIsR0FBZSxLQUhqQjs7UUFJQSxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFqQixDQUFzQixJQUF0QixFQUxGOztJQUpXOzswQkFVYixNQUFBLEdBQVEsU0FBQTthQUNOLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLE1BQVIsRUFBZ0IsU0FBQyxLQUFEO2VBQVcsS0FBSyxDQUFDLE1BQU4sQ0FBQTtNQUFYLENBQWhCO0lBRE07OzBCQUVSLFFBQUEsR0FBVSxTQUFBO2FBQ1IsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENB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TUFHQSxNQUFNLENBQUMsSUFBUCxDQUFZLE1BQVosQ0FBbUIsQ0FBQyxnQkFBcEIsQ0FBcUMsU0FBckMsRUFBZ0QsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQ7VUFDOUMsT0FBTyxDQUFDLEdBQVIsQ0FBWSxVQUFaLEVBQXdCLEtBQUssQ0FBQyxPQUE5QjtVQUNBLEtBQUMsQ0FBQSxNQUFPLENBQUEsS0FBSyxDQUFDLE9BQU4sQ0FBUixHQUF5QjtVQUd6QixJQUFHLEtBQUssQ0FBQyxPQUFOLEtBQWlCLGFBQWEsQ0FBQyxLQUFsQztZQUNFLEtBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFBLEVBREY7O1VBRUEsSUFBRyxLQUFLLENBQUMsT0FBTixLQUFpQixhQUFhLENBQUMsTUFBbEM7WUFDRSxLQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsQ0FBQSxFQURGOztVQUVBLElBQUcsS0FBSyxDQUFDLE9BQU4sS0FBaUIsYUFBYSxDQUFDLE9BQWxDO1lBQ0UsS0FBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLENBQUEsRUFERjs7VUFFQSxJQUFHLEtBQUssQ0FBQyxPQUFOLEtBQWlCLGFBQWEsQ0FBQyxXQUFsQzttQkFDRSxLQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBQSxFQURGOztRQVg4QztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEQ7SUFMVzs7Ozs7O0VBbUJmLFVBQUEsR0FBYSxJQUFJLFVBQUosQ0FBZSxNQUFmOztFQUViLE9BQU8sQ0FBQyxHQUFSLENBQVksWUFBWjtBQXpLQSIsInNvdXJjZXNDb250ZW50IjpbIiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuIyBJbXBvcnRzXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbl9fID0gcmVxdWlyZSAnLi91dGlscydcblBhcnNlciA9IHJlcXVpcmUgJy4vcGFyc2VyJ1xuXG5pbmNvbnNvbGF0YSA9IFV0aWxzLmxvYWRXZWJGb250KFwiSW5jb25zb2xhdGFcIilcblxuUGFyc2VyLnRlc3QoKVxuXG5jbGFzcyBTRXhwcmVzc2lvblxuICBjb25zdHJ1Y3RvcjogKEB0b2tlbnMsIEBwYXJlbnQpIC0+XG4gICAgQGNoaWxkcmVuID0gW11cbiAgICBAcHJldmlvdXMgPSBudWxsXG4gICAgQG5leHQgPSBudWxsXG4gICAgaWYgbm90IF8uaXNOaWwoQHBhcmVudClcbiAgICAgIGlmIG5vdCBfLmlzRW1wdHkoQHBhcmVudC5jaGlsZHJlbilcbiAgICAgICAgc2libGluZyA9IF8ubGFzdChAcGFyZW50LmNoaWxkcmVuKVxuICAgICAgICBAcHJldmlvdXMgPSBzaWJsaW5nXG4gICAgICAgIHNpYmxpbmcubmV4dCA9IHRoaXNcbiAgICAgIEBwYXJlbnQuY2hpbGRyZW4ucHVzaCh0aGlzKVxuICBzZWxlY3Q6ICgpIC0+XG4gICAgXy5lYWNoIEB0b2tlbnMsICh0b2tlbikgLT4gdG9rZW4uc2VsZWN0KClcbiAgZGVzZWxlY3Q6ICgpIC0+XG4gICAgXy5lYWNoIEB0b2tlbnMsICh0b2tlbikgLT4gdG9rZW4uZGVzZWxlY3QoKVxuXG5jbGFzcyBTQXRvbSBleHRlbmRzIFNFeHByZXNzaW9uXG4gIGNvbnN0cnVjdG9yOiAodG9rZW4sIHBhcmVudCkgLT5cbiAgICBzdXBlciBbdG9rZW5dLCBwYXJlbnRcblxuY2xhc3MgU0xpc3QgZXh0ZW5kcyBTRXhwcmVzc2lvblxuICBjb25zdHJ1Y3RvcjogKHRva2VucywgcGFyZW50KSAtPlxuICAgIHN1cGVyIHRva2VucywgcGFyZW50XG5cbmNsYXNzIFRva2VuIGV4dGVuZHMgVGV4dExheWVyXG4gIEJBQ0tHUk9VTkRfQ09MT1JfREVTRUxFQ1RFRDogJyNGRkZGRkYnXG4gIFRFWFRfQ09MT1JfREVTRUxFQ1RFRDogJyNBQUEnXG4gIEJBQ0tHUk9VTkRfQ09MT1JfU0VMRUNURUQ6ICcjRjhGOEY4J1xuICBURVhUX0NPTE9SX1NFTEVDVEVEOiAnIzAwMDAwMCdcbiAgY29uc3RydWN0b3I6ICh0eHQsIHgsIHkpIC0+XG4gICAgc3VwZXJcbiAgICAgIHRleHQ6IHR4dFxuICAgICAgZm9udFNpemU6IDE1XG4gICAgICBmb250RmFtaWx5OiBpbmNvbnNvbGF0YVxuICAgICAgdGV4dEFsaWduOiAnY2VudGVyJ1xuICAgICAgeDogeFxuICAgICAgeTogeVxuICAgICAgY29sb3I6IEBURVhUX0NPTE9SX0RFU0VMRUNURURcbiAgICAgIGJhY2tncm91bmRDb2xvcjogQEJBQ0tHUk9VTkRfQ09MT1JfREVTRUxFQ1RFRFxuICAgICAgYm9yZGVyV2lkdGg6IDFcbiAgICAgIGJvcmRlckNvbG9yOiAnI0ZFRkVGRSdcbiAgICAgIHBhZGRpbmc6IDEwXG4gIHNlbGVjdDogKCkgLT5cbiAgICBAYmFja2dyb3VuZENvbG9yID0gQEJBQ0tHUk9VTkRfQ09MT1JfU0VMRUNURURcbiAgICBAY29sb3IgPSBAVEVYVF9DT0xPUl9TRUxFQ1RFRFxuICBkZXNlbGVjdDogKCkgLT5cbiAgICBAYmFja2dyb3VuZENvbG9yID0gQEJBQ0tHUk9VTkRfQ09MT1JfREVTRUxFQ1RFRFxuICAgIEBjb2xvciA9IEBURVhUX0NPTE9SX0RFU0VMRUNURURcblxuIyB3b3JrIGluIHByb2dyZXNzXG5ldmFsdWF0ZSA9IChzZXhwKSAtPlxuICByZXR1cm4gc2V4cCB1bmxlc3MgXy5pc0FycmF5KHNleHApICYmIHNleHAubGVuZ3RoID4gMFxuICBvcGVyYXRvciA9IF8uaGVhZChzZXhwKVxuICBhcmdzID0gXy50YWlsKHNleHApXG4gIGlmIG9wZXJhdG9yIGlzICdxdW90ZSdcbiAgICBpZiBhcmdzLmxlbmd0aCA9PSAxXG4gICAgICByZXR1cm4gYXJnc1swXVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBcIkVSUk9SOiB3cm9uZyBudW1iZXJzIG9mIGFyZ3VtZW50c1wiXG4gIGlmIG9wZXJhdG9yIGlzICdhdG9tJ1xuICAgIGlmIGFyZ3MubGVuZ3RoID09IDFcbiAgICAgIHRoaW5nID0gZXZhbHVhdGUoYXJnc1swXSlcbiAgICAgIHJldHVybiBpZiAoXy5pc0FycmF5KHRoaW5nKSBhbmQgXy5pc0VtcHR5KHRoaW5nKSkgb3IgXy5pc1N0cmluZyh0aGluZykgdGhlbiAndCcgZWxzZSBbXVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBcIkVSUk9SOiB3cm9uZyBudW1iZXJzIG9mIGFyZ3VtZW50c1wiXG5cbndpbmRvdy5ldmFsdWF0ZSA9IGV2YWx1YXRlXG5cbnJlbmRlciA9IChleHAsIHgsIHksIHRva2VucywgcGFyZW50U0V4cCkgLT5cbiAgaWYgXy5pc1N0cmluZyhleHApXG4gICAgc3RyID0gbmV3IFRva2VuKGV4cCwgeCwgeSlcbiAgICB0b2tlbnMucHVzaChzdHIpXG4gICAgcmV0dXJuIG5ldyBTQXRvbShzdHIsIHBhcmVudFNFeHApXG4gIGVsc2VcbiAgICBsZWZ0UGFyZW5zID0gbmV3IFRva2VuKFwiKFwiLCB4LCB5KVxuICAgIHRva2Vucy5wdXNoKGxlZnRQYXJlbnMpXG4gICAgbGVmdFBhcmVuc0luZGV4ID0gdG9rZW5zLmxlbmd0aCAtIDFcbiAgICBzbGlzdCA9IG5ldyBTTGlzdChbXSwgcGFyZW50U0V4cClcbiAgICBfLmVhY2ggZXhwLCAoZSkgLT5cbiAgICAgIGxhc3RUb2tlbiA9IF8ubGFzdCh0b2tlbnMpXG4gICAgICByZW5kZXIoZSwgX18ueFJpZ2h0KGxhc3RUb2tlbiksIHksIHRva2Vucywgc2xpc3QpXG4gICAgbGFzdFRva2VuID0gXy5sYXN0KHRva2VucylcbiAgICByaWdodFBhcmVucyA9IG5ldyBUb2tlbihcIilcIiwgX18ueFJpZ2h0KGxhc3RUb2tlbiksIHkpXG4gICAgdG9rZW5zLnB1c2gocmlnaHRQYXJlbnMpXG4gICAgc2xpc3QudG9rZW5zID0gdG9rZW5zLnNsaWNlKGxlZnRQYXJlbnNJbmRleClcbiAgICByZXR1cm4gc2xpc3RcblxuY2xhc3MgRWRpdG9yXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgIEBwcm9ncmFtID0gW1snbGFtYmRhJywgWyd4J10sIFsnY29ucycsICd4JywgWydxdW90ZScsIFsnYiddXV1dXVxuICAgIEByb290U0V4cCA9IHJlbmRlciBAcHJvZ3JhbSwgNTAsIDEwMCwgW11cbiAgICBAY3VycmVudFNFeHAgPSBudWxsXG4gICAgY29uc29sZS5sb2coQHJvb3RTRXhwKVxuICBnb05leHQ6ICgpIC0+XG4gICAgcmV0dXJuIGlmIF8uaXNOaWwoQGN1cnJlbnRTRXhwKVxuICAgIHJldHVybiBpZiBfLmlzTmlsKEBjdXJyZW50U0V4cC5uZXh0KVxuICAgIEBjdXJyZW50U0V4cC5kZXNlbGVjdCgpXG4gICAgQGN1cnJlbnRTRXhwID0gQGN1cnJlbnRTRXhwLm5leHRcbiAgICBAY3VycmVudFNFeHAuc2VsZWN0KClcbiAgZ29QcmV2aW91czogKCkgLT5cbiAgICByZXR1cm4gaWYgXy5pc05pbChAY3VycmVudFNFeHApXG4gICAgcmV0dXJuIGlmIF8uaXNOaWwoQGN1cnJlbnRTRXhwLnByZXZpb3VzKVxuICAgIEBjdXJyZW50U0V4cC5kZXNlbGVjdCgpXG4gICAgQGN1cnJlbnRTRXhwID0gQGN1cnJlbnRTRXhwLnByZXZpb3VzXG4gICAgQGN1cnJlbnRTRXhwLnNlbGVjdCgpXG4gIGdvSW46ICgpIC0+XG4gICAgaWYgXy5pc05pbChAY3VycmVudFNFeHApXG4gICAgICBAY3VycmVudFNFeHAgPSBAcm9vdFNFeHBcbiAgICAgIEBjdXJyZW50U0V4cC5zZWxlY3QoKVxuICAgIGVsc2VcbiAgICAgIGlmIG5vdCBfLmlzRW1wdHkoQGN1cnJlbnRTRXhwLmNoaWxkcmVuKVxuICAgICAgICBAY3VycmVudFNFeHAuZGVzZWxlY3QoKVxuICAgICAgICBAY3VycmVudFNFeHAgPSBfLmZpcnN0KEBjdXJyZW50U0V4cC5jaGlsZHJlbilcbiAgICAgICAgQGN1cnJlbnRTRXhwLnNlbGVjdCgpXG4gIGdvT3V0OiAoKSAtPlxuICAgIHJldHVybiBpZiBfLmlzTmlsKEBjdXJyZW50U0V4cClcbiAgICBAY3VycmVudFNFeHAuZGVzZWxlY3QoKVxuICAgIEBjdXJyZW50U0V4cCA9IEBjdXJyZW50U0V4cC5wYXJlbnRcbiAgICBAY3VycmVudFNFeHAuc2VsZWN0KCkgdW5sZXNzIF8uaXNOaWwoQGN1cnJlbnRTRXhwKVxuXG5lZGl0b3IgPSBuZXcgRWRpdG9yXG5cbiMgZWRpdG9yLmdvSW4oKVxuXG5rZXkgPVxuICBoOiA3MlxuICBpOiA3M1xuICBqOiA3NFxuICBrOiA3NVxuICBsOiA3NlxuICBzcGFjZTogMzJcbiAgZW50ZXI6IDEzXG4gIHNoaWZ0OiAxNlxuXG5LZXlGb3JDb21tYW5kID1cbiAgR09fSU46IGtleS5qXG4gIEdPX09VVDoga2V5LmtcbiAgR09fUFJFVklPVVM6IGtleS5oXG4gIEdPX05FWFQ6IGtleS5sXG5cbmNsYXNzIEtleUhhbmRsZXJcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yKSAtPlxuICAgIEBpc0Rvd24gPSB7fVxuICAgIEV2ZW50cy53cmFwKHdpbmRvdykuYWRkRXZlbnRMaXN0ZW5lciAna2V5dXAnLCAoZXZlbnQpID0+XG4gICAgICBjb25zb2xlLmxvZyAna2V5IHVwJywgZXZlbnQua2V5Q29kZVxuICAgICAgZGVsZXRlIEBpc0Rvd25bZXZlbnQua2V5Q29kZV1cbiAgICBFdmVudHMud3JhcCh3aW5kb3cpLmFkZEV2ZW50TGlzdGVuZXIgJ2tleWRvd24nLCAoZXZlbnQpID0+XG4gICAgICBjb25zb2xlLmxvZyAna2V5IGRvd24nLCBldmVudC5rZXlDb2RlXG4gICAgICBAaXNEb3duW2V2ZW50LmtleUNvZGVdID0gdHJ1ZVxuICAgICMgRXZlbnRzLndyYXAod2luZG93KS5hZGRFdmVudExpc3RlbmVyICdrZXlwcmVzcycsIChldmVudCkgPT5cbiAgICAjICAgY29uc29sZS5sb2cgJ2tleSBwcmVzcycsIGV2ZW50LmtleUNvZGVcbiAgICAgIGlmIGV2ZW50LmtleUNvZGUgaXMgS2V5Rm9yQ29tbWFuZC5HT19JTlxuICAgICAgICBAZWRpdG9yLmdvSW4oKVxuICAgICAgaWYgZXZlbnQua2V5Q29kZSBpcyBLZXlGb3JDb21tYW5kLkdPX09VVFxuICAgICAgICBAZWRpdG9yLmdvT3V0KClcbiAgICAgIGlmIGV2ZW50LmtleUNvZGUgaXMgS2V5Rm9yQ29tbWFuZC5HT19ORVhUXG4gICAgICAgIEBlZGl0b3IuZ29OZXh0KClcbiAgICAgIGlmIGV2ZW50LmtleUNvZGUgaXMgS2V5Rm9yQ29tbWFuZC5HT19QUkVWSU9VU1xuICAgICAgICBAZWRpdG9yLmdvUHJldmlvdXMoKVxuXG5rZXlIYW5kbGVyID0gbmV3IEtleUhhbmRsZXIoZWRpdG9yKVxuXG5jb25zb2xlLmxvZyAncnVubmluZy4uLidcbiJdfQ==
//# sourceURL=/Users/gvieira/Dropbox/design/Projects/Hare/hare.io/Framer/Project/src_coffee/main.coffee