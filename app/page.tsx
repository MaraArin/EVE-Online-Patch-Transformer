"use client";

import React, { useState, ChangeEvent } from "react";

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
    // Remove HTML attributes
    let blogPostPatchNotes = inputPatchNoteHTML.replace(/(\S+)="[^"]*"/g, "");

    // Remove extra whitespaces
    blogPostPatchNotes = blogPostPatchNotes.replace(/\s+/g, " ");
    blogPostPatchNotes = blogPostPatchNotes.replace(/>\s+</g, "><");
    blogPostPatchNotes = blogPostPatchNotes.replace(/\s>/g, ">");
    blogPostPatchNotes = blogPostPatchNotes.replace(/>\s/g, ">");
    blogPostPatchNotes = blogPostPatchNotes.replace(/\s</g, "<");
    blogPostPatchNotes = blogPostPatchNotes.replace(/<\s/g, "<");
    blogPostPatchNotes = blogPostPatchNotes.replace(/\s\//g, "/");

    // Split the HTML by <hr> or <hr/> tag
    let patchNoteSections = blogPostPatchNotes.split("<hr/>");
    if (patchNoteSections.length == 1) {
      patchNoteSections = blogPostPatchNotes.split("<hr>");
    }

    const sectionsWithoutDefectFixes = patchNoteSections.map((section) => {
      return removeDefectFixes(section);
    }
    );

    // Process each section separately
    const mediaWikiSections = sectionsWithoutDefectFixes.map((section) => {

      // Replace HTML with MediaWiki syntax
      section = section.replace(
        /<p><b>Features &amp; Changes:<\/b><\/p>/g,
        "\n=== Features & Changes ===\n\n"
      );

      section = section.replace(/<br>/g,"\n");

      section = section.replace(/<h2>/g, "== ");
      section = section.replace(/<\/h2>/g, " ==\n\n");

      section = section.replace(/<h3><b>/g, "=== ");
      section = section.replace(/<\/b><\/h3>/g, " ===\n\n");

      section = section.replace(/<p><b>/g, "==== ");
      section = section.replace(/<\/b><\/p>/g, " ====\n\n");

      section = section.replace(/<li><p>/g, "* ");
      section = section.replace(/<\/p><\/li>/g, "\n");

      section = section.replace(/<\/p>/g, "\n");

      // Remove ":"
      section = section.replace(/: =/g, " =");
      // Remove "amp;"
      section = section.replace(/amp;/g, "");

      // Remove the remaining HTML tags
      section = section.replace(/<\/?[^>]+(>|$)/g, "");

      // Add extra newline between bulletpoints and headers
      section = section.replace(/\.\n==/g, ".\n\n==");
      section = section.replace(/\.\n====/g, ".\n\n====");

      section = section.replace(/\?\n==/g, "?\n\n==");
      section = section.replace(/\?\n====/g, "?\n\n====");

      section = section.replace(/\!\n==/g, "!\n\n==");
      section = section.replace(/\!\n====/g, "!\n\n====");
      
      // Add extra newline between bulletpoints and headers
      section = section.replace(/:\n\w/g, ":\n\n\w");

      return section;
    });

    setPatchNoteSections(mediaWikiSections);
  };

  function removeDefectFixes(input: string): string {
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
    <div>
      <p>
        The EVE Online Patch Notes Transformer converts EVE Online Patch Notes
        from rich HTML and CSS into MediaWiki Syntax.
      </p>
      <ol className="list-decimal">
        <li>
          Go to{" "}
          <a
            className="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline"
            target="_blank"
            href="https://www.eveonline.com/news/t/patch-notes"
          >
            EVE Online Patch Notes
          </a>
          .
        </li>
        <li>
          Open a Patch Notes blog post such as{" "}
          <a
            className="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline"
            target="_blank"
            href="https://www.eveonline.com/news/view/havoc-expansion-notes"
          >
            Havoc: Expansion Notes
          </a>
          .
        </li>
        <li>
          Right-click anywhere on the webpage to open up a dropdown menu and
          click on <strong>Inspect</strong>. A developer console should open up. The{" "}
          <strong>Inspector</strong> tab should be selected, showing HTML elements.
        </li>
        <li>
          Find the HTML element with the <strong>class=RichText_richtext</strong>.
          You can use the <strong>Search HTML</strong> tool to find it more easily.
          This HTML element contains the contents of the Patch Notes blog post.
        </li>
        <li>
          Right-click the HTML element to open up a dropdown menu, hover over{" "}
          <strong>Copy</strong> than click on <strong>Inner HTML</strong>. This will
          copy the HTML contents of the Patch Notes blog post into your
          clipboard.
        </li>
        <li>
          Paste the contents of the Patch Notes blog post into the text field
          below.
        </li>
        <li>
          Press the <strong>Convert</strong> button.
        </li>
      </ol>
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
    </div>
  );
};

export default TransformPatchNotes;
