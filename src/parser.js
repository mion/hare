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
    test: function() {
      var parse, test;
      parse = function(str) {
        var parser;
        parser = new Parser(str);
        return parser.parse();
      };
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
      test(parse, "hi", "hi");
      test(parse, "()", []);
      test(parse, "(hi)", ["hi"]);
      test(parse, "(hello there)", ["hello", "there"]);
      return test(parse, "(hello (my good) old friend ())", ["hello", ["my", "good"], "old", "friend", []]);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6Ii4uIiwic291cmNlcyI6WyJzcmNfY29mZmVlL3BhcnNlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUEsTUFBQSxNQUFBO0lBQUE7O0VBQU07SUFDUyxnQkFBQyxPQUFEO01BQUMsSUFBQyxDQUFBLFNBQUQ7SUFBRDs7cUJBRWIsUUFBQSxHQUFVLFNBQUMsTUFBRDthQUNSLE1BQU0sQ0FBQyxPQUFQLENBQWUsS0FBZixFQUFzQixJQUF0QixDQUEyQixDQUFDLE9BQTVCLENBQW9DLEtBQXBDLEVBQTJDLElBQTNDLENBQWdELENBQUMsS0FBakQsQ0FBdUQsR0FBdkQsQ0FBMkQsQ0FBQyxNQUE1RCxDQUFtRSxTQUFDLEdBQUQ7ZUFBUyxHQUFBLEtBQVM7TUFBbEIsQ0FBbkU7SUFEUTs7cUJBR1YsT0FBQSxHQUFTLFNBQUMsS0FBRDtNQUNQLElBQWUsS0FBQSxLQUFTLE1BQXhCO0FBQUEsZUFBTyxLQUFQOztNQUNBLElBQWdCLEtBQUEsS0FBUyxPQUF6QjtBQUFBLGVBQU8sTUFBUDs7TUFDQSxJQUEwQixDQUFJLENBQUMsQ0FBQyxLQUFGLENBQVEsUUFBQSxDQUFTLEtBQVQsQ0FBUixDQUE5QjtBQUFBLGVBQU8sUUFBQSxDQUFTLEtBQVQsRUFBUDs7QUFFQSxhQUFPO0lBTEE7O3FCQU9ULFFBQUEsR0FBVSxTQUFDLE1BQUQ7QUFDUixVQUFBO01BQUEsSUFBeUQsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxNQUFWLENBQXpEO0FBQUEsY0FBTSxJQUFJLFdBQUosQ0FBZ0IsOEJBQWhCLEVBQU47O01BQ0EsS0FBQSxHQUFRLE1BQU0sQ0FBQyxLQUFQLENBQUE7TUFDUixJQUFHLEtBQUEsS0FBUyxHQUFaO1FBQ0UsQ0FBQSxHQUFJO0FBQ0osZUFBTSxNQUFPLENBQUEsQ0FBQSxDQUFQLEtBQWUsR0FBckI7VUFDRSxDQUFDLENBQUMsSUFBRixDQUFPLElBQUMsQ0FBQSxRQUFELENBQVUsTUFBVixDQUFQO1FBREY7UUFFQSxNQUFNLENBQUMsS0FBUCxDQUFBO0FBQ0EsZUFBTyxFQUxUO09BQUEsTUFNSyxJQUFHLEtBQUEsS0FBUyxHQUFaO0FBQ0gsY0FBTSxJQUFJLFdBQUosQ0FBZ0IsY0FBaEIsRUFESDtPQUFBLE1BQUE7QUFHSCxlQUFPLElBQUMsQ0FBQSxPQUFELENBQVMsS0FBVCxFQUhKOztJQVRHOztxQkFjVixLQUFBLEdBQU8sU0FBQTthQUNMLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBQyxDQUFBLFFBQUQsQ0FBVSxJQUFDLENBQUEsTUFBWCxDQUFWO0lBREs7Ozs7OztFQUdULE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQVEsTUFBUjtJQUNBLElBQUEsRUFBTSxTQUFBO0FBQ0osVUFBQTtNQUFBLEtBQUEsR0FBUSxTQUFDLEdBQUQ7QUFDTixZQUFBO1FBQUEsTUFBQSxHQUFTLElBQUksTUFBSixDQUFXLEdBQVg7ZUFDVCxNQUFNLENBQUMsS0FBUCxDQUFBO01BRk07TUFHUixJQUFBLEdBQU8sU0FBQTtBQUNMLFlBQUE7UUFETSxtQkFBSSxpR0FBUztRQUNuQixNQUFBLEdBQVMsRUFBQSxhQUFHLElBQUg7UUFDVCxJQUFHLENBQUMsQ0FBQyxPQUFGLENBQVUsTUFBVixFQUFrQixRQUFsQixDQUFIO2lCQUNFLE9BQU8sQ0FBQyxHQUFSLENBQVksYUFBWixFQURGO1NBQUEsTUFBQTtpQkFHRSxPQUFPLENBQUMsR0FBUixDQUFZLG1DQUFBLEdBQW9DLFFBQXBDLEdBQTZDLEtBQTdDLEdBQWlELENBQUMsT0FBTyxRQUFSLENBQWpELEdBQWtFLGtCQUFsRSxHQUFvRixNQUFwRixHQUEyRixLQUEzRixHQUErRixDQUFDLE9BQU8sTUFBUixDQUEvRixHQUE4RyxHQUExSCxFQUhGOztNQUZLO01BTVAsSUFBQSxDQUFLLEtBQUwsRUFBWSxJQUFaLEVBQWtCLElBQWxCO01BQ0EsSUFBQSxDQUFLLEtBQUwsRUFBWSxJQUFaLEVBQWtCLEVBQWxCO01BQ0EsSUFBQSxDQUFLLEtBQUwsRUFBWSxNQUFaLEVBQW9CLENBQUMsSUFBRCxDQUFwQjtNQUNBLElBQUEsQ0FBSyxLQUFMLEVBQVksZUFBWixFQUE2QixDQUFDLE9BQUQsRUFBVSxPQUFWLENBQTdCO2FBQ0EsSUFBQSxDQUFLLEtBQUwsRUFBWSxpQ0FBWixFQUErQyxDQUFDLE9BQUQsRUFBVSxDQUFDLElBQUQsRUFBTyxNQUFQLENBQVYsRUFBMEIsS0FBMUIsRUFBaUMsUUFBakMsRUFBMkMsRUFBM0MsQ0FBL0M7SUFkSSxDQUROOztBQS9CRiIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFBhcnNlclxuICBjb25zdHJ1Y3RvcjogKEBzdHJpbmcpIC0+XG5cbiAgdG9rZW5pemU6IChzdHJpbmcpIC0+XG4gICAgc3RyaW5nLnJlcGxhY2UoL1xcKC9nLCBcIiggXCIpLnJlcGxhY2UoL1xcKS9nLCBcIiApXCIpLnNwbGl0KFwiIFwiKS5maWx0ZXIgKHN0cikgLT4gc3RyIGlzbnQgXCJcIlxuXG4gIGF0b21pemU6ICh0b2tlbikgLT5cbiAgICByZXR1cm4gdHJ1ZSBpZiB0b2tlbiBpcyBcInRydWVcIlxuICAgIHJldHVybiBmYWxzZSBpZiB0b2tlbiBpcyBcImZhbHNlXCJcbiAgICByZXR1cm4gcGFyc2VJbnQodG9rZW4pIGlmIG5vdCBfLmlzTmFOKHBhcnNlSW50KHRva2VuKSlcbiAgICAjIFRPRE86IGxpdGVyYWwgc3RyaW5nc1xuICAgIHJldHVybiB0b2tlblxuXG4gIHJlYWRGcm9tOiAodG9rZW5zKSAtPlxuICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcInVuZXhwZWN0ZWQgRU9GIHdoaWxlIHJlYWRpbmdcIikgaWYgXy5pc0VtcHR5KHRva2VucylcbiAgICB0b2tlbiA9IHRva2Vucy5zaGlmdCgpXG4gICAgaWYgdG9rZW4gaXMgXCIoXCJcbiAgICAgIEwgPSBbXVxuICAgICAgd2hpbGUgdG9rZW5zWzBdIGlzbnQgXCIpXCJcbiAgICAgICAgTC5wdXNoKEByZWFkRnJvbSh0b2tlbnMpKVxuICAgICAgdG9rZW5zLnNoaWZ0KClcbiAgICAgIHJldHVybiBMXG4gICAgZWxzZSBpZiB0b2tlbiBpcyBcIilcIlxuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwidW5leHBlY3RlZCApXCIpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIEBhdG9taXplKHRva2VuKVxuXG4gIHBhcnNlOiAtPlxuICAgIEByZWFkRnJvbShAdG9rZW5pemUoQHN0cmluZykpXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgUGFyc2VyOiBQYXJzZXJcbiAgdGVzdDogLT5cbiAgICBwYXJzZSA9IChzdHIpIC0+XG4gICAgICBwYXJzZXIgPSBuZXcgUGFyc2VyKHN0cilcbiAgICAgIHBhcnNlci5wYXJzZSgpXG4gICAgdGVzdCA9IChmbiwgYXJncy4uLiwgZXhwZWN0ZWQpIC0+XG4gICAgICBhY3R1YWwgPSBmbihhcmdzLi4uKVxuICAgICAgaWYgXy5pc0VxdWFsKGFjdHVhbCwgZXhwZWN0ZWQpXG4gICAgICAgIGNvbnNvbGUubG9nIFwiWypdIFRlc3QgT0tcIlxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLmxvZyBcIlshXSBUZXN0IGZhaWxlZCFcXG4gICAgRXhwZWN0ZWQ6IGAje2V4cGVjdGVkfWAgKCN7dHlwZW9mIGV4cGVjdGVkfSlcXG4gICAgQWN0dWFsOiBgI3thY3R1YWx9YCAoI3t0eXBlb2YgYWN0dWFsfSlcIlxuICAgIHRlc3QgcGFyc2UsIFwiaGlcIiwgXCJoaVwiXG4gICAgdGVzdCBwYXJzZSwgXCIoKVwiLCBbXVxuICAgIHRlc3QgcGFyc2UsIFwiKGhpKVwiLCBbXCJoaVwiXVxuICAgIHRlc3QgcGFyc2UsIFwiKGhlbGxvIHRoZXJlKVwiLCBbXCJoZWxsb1wiLCBcInRoZXJlXCJdXG4gICAgdGVzdCBwYXJzZSwgXCIoaGVsbG8gKG15IGdvb2QpIG9sZCBmcmllbmQgKCkpXCIsIFtcImhlbGxvXCIsIFtcIm15XCIsIFwiZ29vZFwiXSwgXCJvbGRcIiwgXCJmcmllbmRcIiwgW11dXG4iXX0=
//# sourceURL=/Users/gvieira/Dropbox/design/Projects/Hare/hare.io/Framer/Project/src_coffee/parser.coffee