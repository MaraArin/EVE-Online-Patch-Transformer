"use client";

import React, { useState, ChangeEvent } from "react";

interface CleanHTMLComponentProps {}

/* ToDo:
parse nested lists,
parse a's hrefs aka links,
use a library? // will it work client side?
*/
const CleanHTMLComponent: React.FC<CleanHTMLComponentProps> = () => {
  const [inputHTML, setInputHTML] = useState<string>("");
  const [titles, setTitles] = useState<string[]>([]);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputHTML(event.target.value);
  };

  const cleanHTML = () => {
    // Use a regex to remove HTML attributes
    let modifiedHTML = inputHTML.replace(/(\S+)="[^"]*"/g, "");

    // Remove extra whitespaces
    modifiedHTML = modifiedHTML.replace(/\s+/g, " ");

    // Remove extra whitespaces within HTML tags
    modifiedHTML = modifiedHTML.replace(/>\s+</g, "><");
    modifiedHTML = modifiedHTML.replace(/\s>/g, ">");
    modifiedHTML = modifiedHTML.replace(/>\s/g, ">");
    modifiedHTML = modifiedHTML.replace(/\s</g, "<");
    modifiedHTML = modifiedHTML.replace(/<\s/g, "<");
    modifiedHTML = modifiedHTML.replace(/\s\//g, "/");

    // Split the modified HTML by <hr> tags
    let sections = modifiedHTML.split("<hr/>");
    if (sections.length == 1) {
      sections = modifiedHTML.split("<hr>");
    }

    // Process each section separately
    const sectionTitleBulletMaps = sections.map((section) => {
      section = removeDefectFixes(section);

      // Replace HTML with MediaWiki syntax
      section = section.replace(
        /<p><b>Features &amp; Changes:<\/b><\/p>/g,
        "\n=== Features & Changes ===\n\n"
      );

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
      //section = section.replace(/:/g, '');
      section = section.replace(/: =/g, " =");
      // Remove "amp;"
      section = section.replace(/amp;/g, "");

      // Remove the remaining HTML tags
      section = section.replace(/<\/?[^>]+(>|$)/g, "");

      console.log(section);
      // Add extra newline between bulletpoint and header
      section = section.replace(/\.\n==/g, ".\n\n==");
      section = section.replace(/\.\n====/g, ".\n\n====");

      // Return the title and bullet points for the section
      return section;
    });

    //console.log(sectionTitleBulletMaps[1])

    // Update the titleBulletMaps state
    setTitles(sectionTitleBulletMaps);
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
    const outputText = titles.join("\n\n");

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
        <button onClick={cleanHTML}>Convert to MediaWiki</button>
        <button onClick={copyToClipboard}>Copy to Clipboard</button>
      </div>
      <div className="container">
        <div className="input-container">
          <label>Input HTML:</label>
          <textarea value={inputHTML} onChange={handleInputChange} />
        </div>
        <div className="output-container">
          <label>Output MediaWiki:</label>
          <pre>{titles.join("")}</pre>
        </div>
      </div>
    </div>
  );
};

export default CleanHTMLComponent;
