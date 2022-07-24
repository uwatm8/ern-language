const fs = require("fs");
const { exit } = require("process");
const code = fs.readFileSync("code.ern", "utf8");

const lines = code.split("\n");

const variables = {};

const isDeclaration = (line) => {
  let copy = line;

  return copy.replace(/^(\s|" ")*/g, "").startsWith("yo ");
};

const error = (message) => {
  console.error(message);
  exit();
};

const ensureValidValue = (candidateValue) => {
  if (!isNaN(value) || isNumber(value)) {
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

const handleDeclaration = (line, lineNumber) => {
  line = line.replace("yo ", "");
  line = line.replace(/\s/g, "");

  const i = line.indexOf("=");
  const [variableName, value] = [line.slice(0, i), line.slice(i + 1)];

  if (!variableName) {
    error(`Error on line ${lineNumber + 1}, definition without varaible`);
  }

  declareVariable(variableName, value);
};

lines.forEach((line) => {
  console.log(line);

  if (isDeclaration(line)) {
    handleDeclaration(line);
  }
});

console.log(variables);
