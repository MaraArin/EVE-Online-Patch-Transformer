"use client";

import React, { useState, ChangeEvent } from "react";
import Docs from './docs';

interface TransformPatchNotesProps {}

/* ToDo:
parse nested lists,
parse a's hrefs aka links,
use a library? // will it work client side?
*/

const TransformPatchNotes: React.FC<TransformPatchNotesProps> = () => {
  const [inputPatchNoteHTML, setInputPatchNoteHTML] = useState<string>("");
  const [patchNoteSections, setPatchNoteSections] = useState<string[]>([]);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputPatchNoteHTML(event.target.value);
  };

  const transformHTMLToMediaWiki = () => {
    let htmlPatchNotes = removeHTMLAttributes(inputPatchNoteHTML);

    let patchNoteSections = htmlPatchNotes.split("<hr/>");
    if (patchNoteSections.length == 1) {
      patchNoteSections = htmlPatchNotes.split("<hr>");
    }

    const cleanSections = patchNoteSections.map((section) => {
      section = removeDefectFixes(section);

      section = removeStyleTags(section);

      return section;
    }
    );

    const mediaWikiSections = convertToMediaWiki(cleanSections);

    setPatchNoteSections(mediaWikiSections);
  };

  const copyToClipboard = () => {
    const outputText = patchNoteSections.join("\n\n");

    // Create a temporary textarea to copy the text to clipboard
    const tempTextarea = document.createElement("textarea");
    tempTextarea.value = outputText;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextarea);

    alert("Content copied to clipboard!");
  };

  return (
    <main>
      <Docs/>
      <div className="container">
        <button onClick={transformHTMLToMediaWiki}>Convert to MediaWiki</button>
        <button onClick={copyToClipboard}>Copy to Clipboard</button>
      </div>
      <div className="container">
        <div className="input-container">
          <label>Input HTML:</label>
          <textarea value={inputPatchNoteHTML} onChange={handleInputChange} />
        </div>
        <div className="output-container">
          <label>Output MediaWiki:</label>
          <pre>{patchNoteSections.join("")}</pre>
        </div>
      </div>
    </main>
  );
};

export default TransformPatchNotes;

function convertToMediaWiki(sectionsWithoutDefectFixes: string[]) {
  return sectionsWithoutDefectFixes.map((section) => {
    // Replace HTML with MediaWiki syntax
    // Headers
    section = section.replace(
      /<p><b>Features &amp; Changes:<\/b><\/p>/g,
      "=== Features & Changes ===\n\n"
    );

    section = section.replace(/<h2>(.*?)<\/h2>/g,"== $1 ==\n\n");

    section = section.replace(/<h3><b>(.*?)<\/b><\/h3>/g,"=== $1 ===\n\n");

    section = section.replace(/<p><b>(.*?)<\/b><\/p>/g, '==== $1 ====\n\n');
    
    // Bold text
    //section = section.replace(/<b>/g, "'''");
    //section = section.replace(/<\/b>/g, "'''");

    // Break lines
    section = section.replace(/<br>/g, "\n");

    //Bullet points
    section = section.replace(/<li><p>(.*?)<\/p><\/li>/g, "* $1\n");

    // Quotes
    section = section.replace(/‘/g, "'");
    section = section.replace(/’/g, "'");
    section = section.replace(/“/g, '"');
    section = section.replace(/”/g, '"');

    // Remove ":" inside headers
    section = section.replace(/: =/g, " =");
    // Remove "amp;" from "&"
    section = section.replace(/amp;/g, "");
    // Remove "&nbsp;", the non-breaking newline
    section = section.replace(/&nbsp;/g, "");

    console.log(section)

    // Edge case formatting
    section = section.replace(/:<\/p><ul><li><p>/g, ":\n* ");

    // Remove the remaining HTML tags
    section = section.replace(/<\/?[^>]+(>|$)/g, "");

    // Newlines, extra
    section = section.replace(/([\w\.\,\!\?])=/g, "$1\n\n=");
    section = section.replace(/([\w\.\,\!\?])\n=/g, "$1\n\n=");
    section = section.replace(/([\w\.\,\!\?])\*/g, "$1\n\n*");

    return section;
  });
}

function removeHTMLAttributes(inputPatchNoteHTML: string) {
  // Remove HTML tag attributes
  let blogPostPatchNotes = inputPatchNoteHTML.replace(/(\S+)="[^"]*"/g, "");

  // Remove extra whitespaces
  blogPostPatchNotes = blogPostPatchNotes.replace(/\s+/g, " ");
  blogPostPatchNotes = blogPostPatchNotes.replace(/>\s+</g, "><");
  blogPostPatchNotes = blogPostPatchNotes.replace(/\s>/g, ">");
  blogPostPatchNotes = blogPostPatchNotes.replace(/>\s/g, ">");
  blogPostPatchNotes = blogPostPatchNotes.replace(/\s</g, "<");
  blogPostPatchNotes = blogPostPatchNotes.replace(/<\s/g, "<");
  blogPostPatchNotes = blogPostPatchNotes.replace(/\s\//g, "/");
  return blogPostPatchNotes;
}

function removeDefectFixes(input: string): string {
  // "Defect Fixes" are a type of content within the Patch Notes
  const startIndexH3 = input.indexOf("<h3><b>Defect Fixes:</b></h3>");
  const startIndexP = input.indexOf("<p><b>Defect Fixes:</b></p>");

  let startIndex: number;

  // Determine the starting index based on which pattern is found first
  if (
    startIndexH3 !== -1 &&
    (startIndexP === -1 || startIndexH3 < startIndexP)
  ) {
    startIndex = startIndexH3;
  } else if (startIndexP !== -1) {
    startIndex = startIndexP;
  } else {
    // Starting point not found, return the original string
    return input;
  }

  // Found the starting point, remove everything from that point onwards
  return input.substring(0, startIndex);
}

function removeStyleTags(input: string): string {
  input = input.replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, '')

  return input;
}

