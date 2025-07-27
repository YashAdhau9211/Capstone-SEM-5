const { parse } = require('@babel/parser');

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => data += chunk);
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

(async () => {
  // Log start of validation
  console.error("[ast_validation] Starting AST validation...");
  const code = await readStdin();
  let result = {
    validation_status: "SUCCESS",
    errors: [],
    ast: null
  };

  if (!code || !code.trim()) {
    result.validation_status = "FAILURE";
    result.errors.push("No code provided for validation.");
    console.error("[ast_validation] No code provided for validation.");
    process.stdout.write(JSON.stringify(result, null, 2));
    process.exit(0);
  }

  try {
    const ast = parse(code, {
      sourceType: "unambiguous",
      plugins: [
        "jsx",
        "typescript",
        "classProperties",
        "decorators-legacy",
        "objectRestSpread",
        "dynamicImport",
        "optionalChaining",
        "nullishCoalescingOperator",
        "asyncGenerators",
        "bigInt",
        "optionalCatchBinding",
        "throwExpressions",
        "exportDefaultFrom",
        "exportNamespaceFrom",
        "logicalAssignment",
        // add more as needed
      ]
    });
    result.ast = ast; // Optionally include the AST for debugging
    console.error("[ast_validation] AST parsing succeeded.");
  } catch (err) {
    result.validation_status = "FAILURE";
    result.errors.push(err.message);
    if (err.loc) {
      result.errors.push(`Line: ${err.loc.line}, Column: ${err.loc.column}`);
      console.error(`[ast_validation] Parse error at line ${err.loc.line}, column ${err.loc.column}: ${err.message}`);
    } else {
      console.error(`[ast_validation] Parse error: ${err.message}`);
    }
  }

  // Only include the AST if validation succeeded
  if (result.validation_status === "FAILURE") {
    delete result.ast;
  }

  process.stdout.write(JSON.stringify(result, null, 2));
})();
