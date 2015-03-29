// var esprima = require('esprima');
var regenerator = require('regenerator');
require('regenerator/runtime');
var recast = require('recast');

function compile(code, funcNames, prelude) {
  // console.log(prelude);
  // Parse the AST
  var ast = recast.parse(prelude + ";\n" + code);
  var b = recast.types.builders;

  // Transform the AST nodes, making functions into generators, and
  // function calls into yield expressions.
  var visited = [];
  recast.types.visit(ast, {
    visitFunction: function(path) {
      var node = path.node;
      node.generator = true;

      this.traverse(path);
    },

    visitCallExpression: function(path) {
      // Prevent visiting the path twice
      if (visited.indexOf(path.node) == -1) {
        visited.push(path.node);
      } else {
        this.traverse(path);
        return;
      }

      // Create the yield expression
      var n = b.yieldExpression(path.node);
      n = b.callExpression(b.identifier("____id_hack_this_sucks"), [n]);

      console.log(n);

      path.replace(n);

      // Continue processing
      this.traverse(path);
    }
  });

  // Wrap in a generator
  var wrapped = "function* ____main____(" + funcNames.join(', ') + ") {\n" + recast.print(ast).code + "\n}";

  console.log(wrapped);

  // And compile to es5 with regenerator
  var es5Src = regenerator.compile(wrapped, { includeRuntime: false }).code;

  console.log(es5Src);

  // Regenerator has a bug where property accesses on yield statements
  // are horribly broken. This is an awful hack to get around that bug
  var idHack = "\nfunction ____id_hack_this_sucks(x) { return x; };\n";

  // Create the function object
  var func = new Function(idHack + es5Src + "; return ____main____;");
  var yieldActions = funcNames.map(function(name) {
    return function() {
      var args = new Array(arguments.length);
      for (var i=0; i<arguments.length; i++) {
        args[i] = arguments[i];
      }

      return { ___yield_action___: true, type: name, args: args };
    };
  });

  // Produce a wrapped function
  return function() { return func().apply(null, yieldActions); };
}

// Create a GenState object at the starting state
function GenState(func, handler) {
  this.gens = [func()];
  console.log(this.gens);
  this.handler = handler;
  this.nextValue = undefined;
}

// run next on the top item in the stack
GenState.prototype._next = function(value) {
  return this.gens[this.gens.length - 1].next(value);
};

GenState.prototype.step = function() {
  // Run the generator once
  var yvw = this._next(this.nextValue);

  while (true) {
    // console.log("yvw =", yvw);

    var yv = yvw.value;
    if (yvw.done) {
      // console.log("done");
      // We're done a layer, go back up
      this.gens.pop();
      if (this.gens.length <= 0) {
        // We were at the top, we're done!
        return { done: true, value: yv };
      }
      // Run the next action
      yvw = this._next(yv);
      // yvw = genstate.gens[genstate.gens.length - 1].next(yv);
    } else if (yv &&
               Object.hasOwnProperty.call(yv, '___yield_action___') &&
               yv.___yield_action___) {
      // Run the handler
      // console.log("yieldaction");
      var hresult = this.handler(yv, function(v) {
        return { yld: true, val: v };
      }, function(v) {
        return { yld: false, val: v };
      });

      if (hresult.yld) {
        // It was a yield action! Stop running
        this.nextValue = hresult.val;
        return { done: false };
      } else {
        yvw = this._next(hresult.val);
      }
    } else if (yv &&
               typeof(yv.next) === 'function') {
      // We're looking at a generator
      // console.log("generator");

      this.gens.push(yv);
      yvw = this._next(undefined);
    } else {
      // It's a raw value, don't do much other than just send it back in
      // console.log("value");
      yvw = this._next(yv);
    }
  }
};

module.exports = {
  compile: compile,
  GenState: GenState
};


/*
var compiled = compile(source, [
  'walk',
  'run',
  'eat',
  'swim'
]);
var genState = new GenState(compiled, function(yv) {
  switch (yv.type) {
  case 'walk':
    console.log("Walking...");
    return true;
    break;
  case 'run':
    console.log("Running...");
    return false;
    break;
  case 'eat':
    console.log("Eating...");
    return true;
    break;
  case 'swim':
    console.log("Swimming...");
    return false;
    break;
  default:
    throw new Error("Unrecognized yield type");
  }
});

while (true) {
  var rslt = genState.step();
  console.log("~~~ Stepped ~~~");
  if (rslt.done) break;
}

console.log("Done");
  */
