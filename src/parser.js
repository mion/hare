// Generated by CoffeeScript 1.12.7
(function() {
  var Parser,
    slice = [].slice;

  Parser = (function() {
    function Parser(string1) {
      this.string = string1;
    }

    Parser.prototype.tokenize = function(string) {
      return string.replace(/\(/g, "( ").replace(/\)/g, " )").split(" ").filter(function(str) {
        return str !== "";
      });
    };

    Parser.prototype.atomize = function(token) {
      if (token === "true") {
        return true;
      }
      if (token === "false") {
        return false;
      }
      if (!_.isNaN(parseInt(token))) {
        return parseInt(token);
      }
      return token;
    };

    Parser.prototype.readFrom = function(tokens) {
      var L, token;
      if (_.isEmpty(tokens)) {
        throw new SyntaxError("unexpected EOF while reading");
      }
      token = tokens.shift();
      if (token === "(") {
        L = [];
        while (tokens[0] !== ")") {
          L.push(this.readFrom(tokens));
        }
        tokens.shift();
        return L;
      } else if (token === ")") {
        throw new SyntaxError("unexpected )");
      } else {
        return this.atomize(token);
      }
    };

    Parser.prototype.parse = function() {
      return this.readFrom(this.tokenize(this.string));
    };

    return Parser;

  })();

  module.exports = {
    Parser: Parser,
    parse: function(str) {
      var parser;
      parser = new Parser(str);
      return parser.parse();
    },
    test: function() {
      var test;
      test = function() {
        var actual, args, expected, fn, i;
        fn = arguments[0], args = 3 <= arguments.length ? slice.call(arguments, 1, i = arguments.length - 1) : (i = 1, []), expected = arguments[i++];
        actual = fn.apply(null, args);
        if (_.isEqual(actual, expected)) {
          return console.log("[*] Test OK");
        } else {
          return console.log("[!] Test failed!\n    Expected: `" + expected + "` (" + (typeof expected) + ")\n    Actual: `" + actual + "` (" + (typeof actual) + ")");
        }
      };
      test(this.parse, "hi", "hi");
      test(this.parse, "12", 12);
      test(this.parse, "()", []);
      test(this.parse, "(hi)", ["hi"]);
      test(this.parse, "(hello there)", ["hello", "there"]);
      test(this.parse, "(hello 'there)", ["hello", "'there"]);
      test(this.parse, "(hello (1 2 3))", ["hello", [1, 2, 3]]);
      return test(this.parse, "(hello (my good) old friend ())", ["hello", ["my", "good"], "old", "friend", []]);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6Ii4uIiwic291cmNlcyI6WyJzcmNfY29mZmVlL3BhcnNlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUEsTUFBQSxNQUFBO0lBQUE7O0VBQU07SUFDUyxnQkFBQyxPQUFEO01BQUMsSUFBQyxDQUFBLFNBQUQ7SUFBRDs7cUJBRWIsUUFBQSxHQUFVLFNBQUMsTUFBRDthQUNSLE1BQU0sQ0FBQyxPQUFQLENBQWUsS0FBZixFQUFzQixJQUF0QixDQUEyQixDQUFDLE9BQTVCLENBQW9DLEtBQXBDLEVBQTJDLElBQTNDLENBQWdELENBQUMsS0FBakQsQ0FBdUQsR0FBdkQsQ0FBMkQsQ0FBQyxNQUE1RCxDQUFtRSxTQUFDLEdBQUQ7ZUFBUyxHQUFBLEtBQVM7TUFBbEIsQ0FBbkU7SUFEUTs7cUJBR1YsT0FBQSxHQUFTLFNBQUMsS0FBRDtNQUNQLElBQWUsS0FBQSxLQUFTLE1BQXhCO0FBQUEsZUFBTyxLQUFQOztNQUNBLElBQWdCLEtBQUEsS0FBUyxPQUF6QjtBQUFBLGVBQU8sTUFBUDs7TUFDQSxJQUEwQixDQUFJLENBQUMsQ0FBQyxLQUFGLENBQVEsUUFBQSxDQUFTLEtBQVQsQ0FBUixDQUE5QjtBQUFBLGVBQU8sUUFBQSxDQUFTLEtBQVQsRUFBUDs7QUFFQSxhQUFPO0lBTEE7O3FCQU9ULFFBQUEsR0FBVSxTQUFDLE1BQUQ7QUFDUixVQUFBO01BQUEsSUFBeUQsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxNQUFWLENBQXpEO0FBQUEsY0FBTSxJQUFJLFdBQUosQ0FBZ0IsOEJBQWhCLEVBQU47O01BQ0EsS0FBQSxHQUFRLE1BQU0sQ0FBQyxLQUFQLENBQUE7TUFDUixJQUFHLEtBQUEsS0FBUyxHQUFaO1FBQ0UsQ0FBQSxHQUFJO0FBQ0osZUFBTSxNQUFPLENBQUEsQ0FBQSxDQUFQLEtBQWUsR0FBckI7VUFDRSxDQUFDLENBQUMsSUFBRixDQUFPLElBQUMsQ0FBQSxRQUFELENBQVUsTUFBVixDQUFQO1FBREY7UUFFQSxNQUFNLENBQUMsS0FBUCxDQUFBO0FBQ0EsZUFBTyxFQUxUO09BQUEsTUFNSyxJQUFHLEtBQUEsS0FBUyxHQUFaO0FBQ0gsY0FBTSxJQUFJLFdBQUosQ0FBZ0IsY0FBaEIsRUFESDtPQUFBLE1BQUE7QUFHSCxlQUFPLElBQUMsQ0FBQSxPQUFELENBQVMsS0FBVCxFQUhKOztJQVRHOztxQkFjVixLQUFBLEdBQU8sU0FBQTthQUNMLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFDLENBQUEsTUFBWCxDQUFWO0lBREs7Ozs7OztFQUdULE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQVEsTUFBUjtJQUNBLEtBQUEsRUFBTyxTQUFDLEdBQUQ7QUFDTCxVQUFBO01BQUEsTUFBQSxHQUFTLElBQUksTUFBSixDQUFXLEdBQVg7YUFDVCxNQUFNLENBQUMsS0FBUCxDQUFBO0lBRkssQ0FEUDtJQUlBLElBQUEsRUFBTSxTQUFBO0FBQ0osVUFBQTtNQUFBLElBQUEsR0FBTyxTQUFBO0FBQ0wsWUFBQTtRQURNLG1CQUFJLGlHQUFTO1FBQ25CLE1BQUEsR0FBUyxFQUFBLGFBQUcsSUFBSDtRQUNULElBQUcsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxNQUFWLEVBQWtCLFFBQWxCLENBQUg7aUJBQ0UsT0FBTyxDQUFDLEdBQVIsQ0FBWSxhQUFaLEVBREY7U0FBQSxNQUFBO2lCQUdFLE9BQU8sQ0FBQyxHQUFSLENBQVksbUNBQUEsR0FBb0MsUUFBcEMsR0FBNkMsS0FBN0MsR0FBaUQsQ0FBQyxPQUFPLFFBQVIsQ0FBakQsR0FBa0Usa0JBQWxFLEdBQW9GLE1BQXBGLEdBQTJGLEtBQTNGLEdBQStGLENBQUMsT0FBTyxNQUFSLENBQS9GLEdBQThHLEdBQTFILEVBSEY7O01BRks7TUFNUCxJQUFBLENBQUssSUFBSSxDQUFDLEtBQVYsRUFBaUIsSUFBakIsRUFBdUIsSUFBdkI7TUFDQSxJQUFBLENBQUssSUFBSSxDQUFDLEtBQVYsRUFBaUIsSUFBakIsRUFBdUIsRUFBdkI7TUFDQSxJQUFBLENBQUssSUFBSSxDQUFDLEtBQVYsRUFBaUIsSUFBakIsRUFBdUIsRUFBdkI7TUFDQSxJQUFBLENBQUssSUFBSSxDQUFDLEtBQVYsRUFBaUIsTUFBakIsRUFBeUIsQ0FBQyxJQUFELENBQXpCO01BQ0EsSUFBQSxDQUFLLElBQUksQ0FBQyxLQUFWLEVBQWlCLGVBQWpCLEVBQWtDLENBQUMsT0FBRCxFQUFVLE9BQVYsQ0FBbEM7TUFDQSxJQUFBLENBQUssSUFBSSxDQUFDLEtBQVYsRUFBaUIsZ0JBQWpCLEVBQW1DLENBQUMsT0FBRCxFQUFVLFFBQVYsQ0FBbkM7TUFDQSxJQUFBLENBQUssSUFBSSxDQUFDLEtBQVYsRUFBaUIsaUJBQWpCLEVBQW9DLENBQUMsT0FBRCxFQUFVLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBQVYsQ0FBcEM7YUFDQSxJQUFBLENBQUssSUFBSSxDQUFDLEtBQVYsRUFBaUIsaUNBQWpCLEVBQW9ELENBQUMsT0FBRCxFQUFVLENBQUMsSUFBRCxFQUFPLE1BQVAsQ0FBVixFQUEwQixLQUExQixFQUFpQyxRQUFqQyxFQUEyQyxFQUEzQyxDQUFwRDtJQWRJLENBSk47O0FBL0JGIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgUGFyc2VyXG4gIGNvbnN0cnVjdG9yOiAoQHN0cmluZykgLT5cblxuICB0b2tlbml6ZTogKHN0cmluZykgLT5cbiAgICBzdHJpbmcucmVwbGFjZSgvXFwoL2csIFwiKCBcIikucmVwbGFjZSgvXFwpL2csIFwiIClcIikuc3BsaXQoXCIgXCIpLmZpbHRlciAoc3RyKSAtPiBzdHIgaXNudCBcIlwiXG5cbiAgYXRvbWl6ZTogKHRva2VuKSAtPlxuICAgIHJldHVybiB0cnVlIGlmIHRva2VuIGlzIFwidHJ1ZVwiXG4gICAgcmV0dXJuIGZhbHNlIGlmIHRva2VuIGlzIFwiZmFsc2VcIlxuICAgIHJldHVybiBwYXJzZUludCh0b2tlbikgaWYgbm90IF8uaXNOYU4ocGFyc2VJbnQodG9rZW4pKVxuICAgICMgVE9ETzogbGl0ZXJhbCBzdHJpbmdzXG4gICAgcmV0dXJuIHRva2VuXG5cbiAgcmVhZEZyb206ICh0b2tlbnMpIC0+XG4gICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwidW5leHBlY3RlZCBFT0Ygd2hpbGUgcmVhZGluZ1wiKSBpZiBfLmlzRW1wdHkodG9rZW5zKVxuICAgIHRva2VuID0gdG9rZW5zLnNoaWZ0KClcbiAgICBpZiB0b2tlbiBpcyBcIihcIlxuICAgICAgTCA9IFtdXG4gICAgICB3aGlsZSB0b2tlbnNbMF0gaXNudCBcIilcIlxuICAgICAgICBMLnB1c2goQHJlYWRGcm9tKHRva2VucykpXG4gICAgICB0b2tlbnMuc2hpZnQoKVxuICAgICAgcmV0dXJuIExcbiAgICBlbHNlIGlmIHRva2VuIGlzIFwiKVwiXG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJ1bmV4cGVjdGVkIClcIilcbiAgICBlbHNlXG4gICAgICByZXR1cm4gQGF0b21pemUodG9rZW4pXG5cbiAgcGFyc2U6IC0+XG4gICAgQHJlYWRGcm9tKEB0b2tlbml6ZShAc3RyaW5nKSlcblxubW9kdWxlLmV4cG9ydHMgPVxuICBQYXJzZXI6IFBhcnNlclxuICBwYXJzZTogKHN0cikgLT5cbiAgICBwYXJzZXIgPSBuZXcgUGFyc2VyKHN0cilcbiAgICBwYXJzZXIucGFyc2UoKVxuICB0ZXN0OiAtPlxuICAgIHRlc3QgPSAoZm4sIGFyZ3MuLi4sIGV4cGVjdGVkKSAtPlxuICAgICAgYWN0dWFsID0gZm4oYXJncy4uLilcbiAgICAgIGlmIF8uaXNFcXVhbChhY3R1YWwsIGV4cGVjdGVkKVxuICAgICAgICBjb25zb2xlLmxvZyBcIlsqXSBUZXN0IE9LXCJcbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS5sb2cgXCJbIV0gVGVzdCBmYWlsZWQhXFxuICAgIEV4cGVjdGVkOiBgI3tleHBlY3RlZH1gICgje3R5cGVvZiBleHBlY3RlZH0pXFxuICAgIEFjdHVhbDogYCN7YWN0dWFsfWAgKCN7dHlwZW9mIGFjdHVhbH0pXCJcbiAgICB0ZXN0IHRoaXMucGFyc2UsIFwiaGlcIiwgXCJoaVwiXG4gICAgdGVzdCB0aGlzLnBhcnNlLCBcIjEyXCIsIDEyXG4gICAgdGVzdCB0aGlzLnBhcnNlLCBcIigpXCIsIFtdXG4gICAgdGVzdCB0aGlzLnBhcnNlLCBcIihoaSlcIiwgW1wiaGlcIl1cbiAgICB0ZXN0IHRoaXMucGFyc2UsIFwiKGhlbGxvIHRoZXJlKVwiLCBbXCJoZWxsb1wiLCBcInRoZXJlXCJdXG4gICAgdGVzdCB0aGlzLnBhcnNlLCBcIihoZWxsbyAndGhlcmUpXCIsIFtcImhlbGxvXCIsIFwiJ3RoZXJlXCJdXG4gICAgdGVzdCB0aGlzLnBhcnNlLCBcIihoZWxsbyAoMSAyIDMpKVwiLCBbXCJoZWxsb1wiLCBbMSwgMiwgM11dXG4gICAgdGVzdCB0aGlzLnBhcnNlLCBcIihoZWxsbyAobXkgZ29vZCkgb2xkIGZyaWVuZCAoKSlcIiwgW1wiaGVsbG9cIiwgW1wibXlcIiwgXCJnb29kXCJdLCBcIm9sZFwiLCBcImZyaWVuZFwiLCBbXV1cbiJdfQ==
//# sourceURL=/Users/gvieira/code/hare/hare_framer/src_coffee/parser.coffee