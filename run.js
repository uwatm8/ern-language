const fs = require("fs");
const { exit } = require("process");
const code = fs.readFileSync("code.ern", "utf8");

const lines = code.split("\n");

const variables = {};

let currentLinehandled = 0;

const isDeclaration = (line) => {
  let copy = line;

  return copy.replace(/^(\s|" ")*/g, "").startsWith("yo ");
};

const error = (message) => {
  console.error(message);
  exit();
};

const ensureValidValue = (candidateValue) => {
  if (!isNaN(candidateValue) || isNumber(candidateValue)) {
    return true;
  }
  const validStringCharacters = ["'", '"', "`"];
  let foundValidString = false;
  validStringCharacters.forEach((validStringCharacter) => {
    if (
      candidateValue.startsWith(validStringCharacter) &&
      candidateValue.endsWith(validStringCharacter) &&
      candidateValue.split(validStringCharacter) === 3
    ) {
      foundValidString = true;
    }
  });
};

// todo handle float
const isNumber = (candidateString) => {
  const reg = new RegExp("^[0-9]*$");

  return reg.test(candidateString);
};

const declareVariable = (name, value) => {
  if (!isNaN(value) || isNumber(value)) {
    value = parseFloat(value);
    variables[name] = { value, type: "number" };
    return;
  }
  variables[name] = { value, type: "string" };
};

const handleDeclaration = (line) => {
  line = line.replace("yo ", "");
  line = line.replace(/\s/g, "");

  const i = line.indexOf("=");
  const variableName = line.slice(0, i);
  let value = line.slice(i + 1);

  if (variables[value]) {
    // variable already exists
    variables[variableName] = variables[value];
    return;
  }
  if (!variableName) {
    error(
      `Error on line ${currentLinehandled + 1}, definition without variable.`
    );
  }

  ensureValidValue(value);
  declareVariable(variableName, value);
};

lines.forEach((line, lineCount) => {
  currentLinehandled = lineCount;

  if (isDeclaration(line)) {
    handleDeclaration(line);
  }
});
