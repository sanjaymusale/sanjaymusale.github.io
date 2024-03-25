import { readdirSync, writeFileSync, statSync, readFileSync } from 'fs';

// Directory containing JavaScript files
const directoryPath = 'src/urls';

// Regular expression to match assignments like "export const VARIABLE_NAME = VALUE;"
const assignmentRegex = /export\s+const\s+(\w+)\s*=\s*`(.+?)`/g;

// Function to find JavaScript files in a directory
function findJSFiles(directoryPath) {
  let jsFiles = [];
  const files = readdirSync(directoryPath);

  files.forEach((file) => {
    const filePath = `${directoryPath}/${file}`;
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      jsFiles = jsFiles.concat(findJSFiles(filePath));
    } else if (file.endsWith('.js')) {
      jsFiles.push(filePath);
    }
  });

  return jsFiles;
}

// Function to extract values assigned to variables from a JavaScript file
function extractValuesFromFile(filePath) {
  const code = readFileSync(filePath, 'utf-8');
  const values = [];

  let match;
  while ((match = assignmentRegex.exec(code)) !== null) {
    values.push(match[2]); // Capture group 2 contains the value assigned to the variable
  }

  return values;
}

// Find all JavaScript files in the directory
const jsFiles = findJSFiles(directoryPath);

// Extract values assigned to variables from each file and aggregate the results
const allValues = [];
jsFiles.forEach((file) => {
  const values = extractValuesFromFile(file);
  allValues.push(...values);
});

writeFileSync('apis.txt', allValues.join('\n'));
console.log(allValues);
