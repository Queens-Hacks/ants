/* var options = {
  thisValue: null,  // TODO: don't use this. Aether doesn't use it at compile time and CodeCombat uses it just at runtime, and it makes cloning original options weird/unintuitive/slow.
  globals: [],
  language: "javascript",
  languageVersion: "ES5",
  functionName: null,  // In case we need it for error messages
  functionParameters: [],  // Or something like ["target"]
  yieldAutomatically: false,  // Horrible name... we could have it auto-insert yields after every statement
  yieldConditionally: false,  // Also bad name, but what it would do is make it yield whenever this._aetherShouldYield is true (and clear it)
  noSerializationInFlow: false,
  noVariablesInFlow: false,
  skipDuplicateUserInfoInFlow: false,
  includeFlow: true,
  includeMetrics: true,
  includeStyle: true,
  protectAPI: false,
  protectBuiltins: true
}; */

var test = new Aether({
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

test.lint(userCode);
console.log(test.problems);

test.transpile(userCode);
var func = test.createFunction();
console.log(func);

console.log(func.toString());

console.log(test.pure);

var prgm = func.call({
  foo: function() {
    console.log("Calling foo");
    test._shouldYield = true;
  }
});

while (! prgm.next().done)
  console.log("We have Yielded");
