"use client";

import React from "react";
import Markdown from "markdown-to-jsx";
import { markdownComponents } from "./PrismMarkdownComponents";
import PrismCodeBlock from "./PrismCodeBlock";
import "highlight.js/styles/atom-one-dark.css";

export default function SyntaxHighlightingTest() {
  // Sample code snippets for testing
  const javascriptCode = `function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return true;
}
// Call the function
greet("World");`;

  const pythonCode = `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n-1)

# Calculate factorial of 5
result = factorial(5)
print(f"The factorial of 5 is {result}")`;

  const javaCode = `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`;

  // Markdown sample for testing our component integration
  const markdownSample = `# Markdown Test
  
This is a test of our Markdown rendering with \`inline code\` elements.

## Code blocks

\`\`\`javascript
function testFunction() {
  console.log("Hello from markdown!");
  return {
    success: true,
    data: [1, 2, 3]
  };
}
\`\`\`

\`\`\`python
def hello_world():
    greeting = "Hello world from Python!"
    print(greeting)
    return {
        "message": greeting,
        "status": 200
    }
\`\`\`

## Inline code test

Here's an example of \`const x = 42;\` inline code.`;

  return (
    <div className="p-6 bg-gray-900">
      <h1 className="text-xl text-white font-bold mb-4">
        Syntax Highlighting Test with Prism
      </h1>

      <h2 className="text-lg text-white mb-2">Direct Component Usage</h2>
      <h3 className="text-md text-white mb-2">JavaScript</h3>
      <PrismCodeBlock className="language-javascript">
        {javascriptCode}
      </PrismCodeBlock>

      <h3 className="text-md text-white mt-6 mb-2">Python</h3>
      <PrismCodeBlock className="language-python">{pythonCode}</PrismCodeBlock>

      <h3 className="text-md text-white mt-6 mb-2">Java</h3>
      <PrismCodeBlock className="language-java">{javaCode}</PrismCodeBlock>

      <h2 className="text-lg text-white mt-8 mb-4">Markdown Component Test</h2>
      <div className="prose prose-invert max-w-none mb-10 border border-gray-700 p-4 rounded-md">
        <Markdown options={{ overrides: markdownComponents }}>
          {markdownSample}
        </Markdown>
      </div>
    </div>
  );
}
