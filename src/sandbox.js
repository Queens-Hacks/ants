var aether = new Aether({
  yieldConditionally: true
});

var userCode = [
  "var x = 5;",
  "var y = 10;",
  "var z = 20;",
  "this.foo();",
  "this.foo();",
  "this.foo();",
  "this.foo();"
].join('\n');

aether.lint(userCode);
console.log(aether.problems);

aether.transpile(userCode);
var func = aether.createFunction();
console.log(func);

console.log(func.toString());

console.log(aether.pure);

var prgm = func.call({
  foo: function() {
    console.log("Calling foo");
    aether._shouldYield = true;
  }
});

while (! prgm.next().done)
  console.log("We have Yielded");
