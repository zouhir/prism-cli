#!/usr/bin/env node

const readline = require("readline");
const prism = require("prismjs"); // syntax coloring and tokenizing
const supportedFormats = require("prismjs/components");
const mri = require("mri"); // fast cross-os cli argument parser
const clipboardy = require("clipboardy"); // cross-os clipboard library

// prism.js library loads some languages by default
// default loaded: markup, css, clike and javascript
// https://prismjs.com/#basic-usage
const defaultLangSet = new Set(["markup", "css", "clike", "javascript"]);

const argv = mri(process.argv.slice(2));

let language = argv["lang"];

if (!language) {
  console.warn("⚠️ You have not specified a language, javascript is default");
  language = "javascript";
} else {
  language = language.toLowerCase();
  if (!supportedFormats.languages[language]) {
    throw Error(
      "Language passed is not supported \nPlease checkout supported languages here: // https://prismjs.com/#supported-languages \n"
    );
  }
  if (!defaultLangSet.has(language)) {
    let loader = require("prismjs/components/");
    // if language does not exists, loader does not throws :(
    // this is why I needed: const supportedFormats = require("prismjs/components"); above
    loader([language]);
  }
}

var stdin = process.stdin,
  inputChunks = [];

stdin.resume();
stdin.setEncoding("utf8");

stdin.on("data", function(chunk) {
    console.log('DATA reeee')
  inputChunks.push(chunk);
});

process.on('SIGINT', function(){
    process.stdout.write('\nformatting... \n');
    var snippet = inputChunks.join("");
    var html = prism.highlight(snippet, Prism.languages[language], language);
    let template = `
        <pre><code class="language-${language}">${html}</code></pre>
    `
    console.log("Copying to your clipnoard...");
    clipboardy.write(template).then(() => {
        process.exit();    
    });
});