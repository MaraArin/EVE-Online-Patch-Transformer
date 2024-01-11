"use client"

import React, { useState, ChangeEvent } from 'react';

interface CleanHTMLComponentProps {}

/* ToDo:
nested lists,
a's hrefs aka links,
use a library?, // will it work client side?
instructions/docs,
styling
*/
const CleanHTMLComponent: React.FC<CleanHTMLComponentProps> = () => {
  const [inputHTML, setInputHTML] = useState<string>('');
  const [titles, setTitles] = useState<string[]>([]);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputHTML(event.target.value);
  };

  const cleanHTML = () => {
    // Use a regex to remove HTML attributes
    let modifiedHTML = inputHTML.replace(/(\S+)="[^"]*"/g, '');

    // Remove extra whitespaces
    modifiedHTML = modifiedHTML.replace(/\s+/g, ' ');

    // Remove extra whitespaces within HTML tags
    modifiedHTML = modifiedHTML.replace(/>\s+</g, '><');
    modifiedHTML = modifiedHTML.replace(/\s>/g, '>');
    modifiedHTML = modifiedHTML.replace(/>\s/g, '>');
    modifiedHTML = modifiedHTML.replace(/\s</g, '<');
    modifiedHTML = modifiedHTML.replace(/<\s/g, '<');
    modifiedHTML = modifiedHTML.replace(/\s\//g, '/');

    // Split the modified HTML by <hr> tags
    let sections = modifiedHTML.split('<hr/>');
    if (sections.length == 1) {
      sections = modifiedHTML.split('<hr>');
    }

    // Process each section separately
    const sectionTitleBulletMaps = sections.map(section => {
      
      section = removeDefectFixes(section)

      // Replace HTML with MediaWiki syntax
      section = section.replace(/<p><b>Features &amp; Changes:<\/b><\/p>/g, '\n=== Features & Changes ===\n\n');

      section = section.replace(/<h2>/g, '== ');
      section = section.replace(/<\/h2>/g, ' ==\n\n');

      section = section.replace(/<h3><b>/g, '=== ');
      section = section.replace(/<\/b><\/h3>/g, ' ===\n\n');

      section = section.replace(/<p><b>/g, '==== ');
      section = section.replace(/<\/b><\/p>/g, ' ====\n\n');

      section = section.replace(/<li><p>/g, '* ');
      section = section.replace(/<\/p><\/li>/g, '\n');

      section = section.replace(/<\/p>/g, '\n');

      // Remove ":"
      //section = section.replace(/:/g, '');
      section = section.replace(/: =/g, ' =');
      // Remove "amp;"
      section = section.replace(/amp;/g, '');
      
      // Remove the remaining HTML tags
      section = section.replace(/<\/?[^>]+(>|$)/g, "")

      console.log(section)
      // Add extra newline between bulletpoint and header
      section = section.replace(/\.\n==/g, '.\n\n==');
      section = section.replace(/\.\n====/g, '.\n\n====');

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
    if (startIndexH3 !== -1 && (startIndexP === -1 || startIndexH3 < startIndexP)) {
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

return (
  <div>
    <label>
      Input HTML:
      <textarea value={inputHTML} onChange={handleInputChange} />
    </label>
    <br />
    <button onClick={cleanHTML}>Clean HTML</button>
    <br />
    <label>
      Extracted Titles:
    </label>
    <div>
      {titles.map((title, index) => (
        <pre key={index}>{title}</pre>
      ))}
    </div>
  </div>
);
};

export default CleanHTMLComponent;

/*
import React, { useState, ChangeEvent } from 'react';

interface CleanHTMLComponentProps {}

const CleanHTMLComponent: React.FC<CleanHTMLComponentProps> = () => {
  const [inputHTML, setInputHTML] = useState<string>('');
  const [titleBulletMaps, setTitleBulletMaps] = useState<{ [title: string]: string[] }[]>([]);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputHTML(event.target.value);
  };

  const cleanHTML = () => {
    // Use a regex to remove HTML attributes
    let modifiedHTML = inputHTML.replace(/(\S+)="[^"]*"/g, '');

    // Remove extra whitespaces
    modifiedHTML = modifiedHTML.replace(/\s+/g, ' ');

    // Remove extra whitespaces within HTML tags
    modifiedHTML = modifiedHTML.replace(/>\s+</g, '><');

    // Remove extra whitespaces around brackets
    modifiedHTML = modifiedHTML.replace(/\s>/g, '>');
    modifiedHTML = modifiedHTML.replace(/>\s/g, '>');
    modifiedHTML = modifiedHTML.replace(/\s</g, '<');
    modifiedHTML = modifiedHTML.replace(/<\s/g, '<');
    modifiedHTML = modifiedHTML.replace(/\s\//g, '/');

    // Split the modified HTML by <hr/> tags
    const sections = modifiedHTML.split('<hr/>');

    // Process each section separately
    const sectionTitleBulletMaps = sections.map(section => {
      
      section = removeDefectFixes(section)

      // Extract titles between the first <h2> tags
      const titleMatches = section.match(/<h2>(.*?)<\/h2>/);
      const title = titleMatches ? titleMatches[1] : '';

      // Extract bullet points between <li><p> tags
      const bulletPointMatches = section.match(/<li><p>(.*?)<\/p><\/li>/g);
      const bulletPoints = bulletPointMatches ? bulletPointMatches.map(match => match.replace(/<li><p>(.*?)<\/p><\/li>/, '$1')) : [];

      // Return the title and bullet points for the section
      return { [title]: bulletPoints };
    });

    console.log(sectionTitleBulletMaps[0])

    // Update the titleBulletMaps state
    setTitleBulletMaps(sectionTitleBulletMaps);
  };

  function removeDefectFixes(input: string): string {
    const startIndex = input.indexOf("<h3><b>Defect Fixes:</b></h3>");

    if (startIndex !== -1) {
        // Found the starting point, remove everything from that point onwards
        return input.substring(0, startIndex);
    } else {
        // Starting point not found, return the original string
        return input;
    }
}

  return (
    <div>
      <label>
        Input HTML:
        <textarea value={inputHTML} onChange={handleInputChange} />
      </label>
      <br />
      <button onClick={cleanHTML}>Clean HTML</button>
      <br />
      <label>
        Extracted Titles and Bullet Points:
      </label>
      <div>
        {titleBulletMaps.map((titleBulletMap, index) => (
          <div key={index}>
            {Object.entries(titleBulletMap).map(([title, bulletPoints], titleIndex) => (
              <div key={titleIndex}>
                <h2>{title}</h2>
                <ul>
                  {bulletPoints.map((bullet, bulletIndex) => (
                    <li key={bulletIndex}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CleanHTMLComponent;
*/
/*
import React, { useState, ChangeEvent } from 'react';

interface CleanHTMLComponentProps {}

const CleanHTMLComponent: React.FC<CleanHTMLComponentProps> = () => {
  const [inputHTML, setInputHTML] = useState<string>('');
  const [titles, setTitles] = useState<string[]>([]);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputHTML(event.target.value);
  };

  const cleanHTML = () => {
    // Use a regex to remove HTML attributes
    let modifiedHTML = inputHTML.replace(/(\S+)="[^"]*"/g, '');

    // Remove extra whitespaces
    modifiedHTML = modifiedHTML.replace(/\s+/g, ' ');

    // Remove extra whitespaces within HTML tags
    modifiedHTML = modifiedHTML.replace(/>\s+</g, '><');

    // Remove extra whitespaces around brackets
    modifiedHTML = modifiedHTML.replace(/\s>/g, '>');
    modifiedHTML = modifiedHTML.replace(/>\s/g, '>');
    modifiedHTML = modifiedHTML.replace(/\s</g, '<');
    modifiedHTML = modifiedHTML.replace(/<\s/g, '<');
    modifiedHTML = modifiedHTML.replace(/\s\//g, '/');

    // Split the modified HTML into an array of strings
    const lines = modifiedHTML.split('<hr/>');
    console.log(lines[1])

    // Extract titles between the first <h2> tags
    const titles: string[] = []
    for (let element of lines) {
      const titleMatches = element.match(/<h2>(.*?)<\/h2>/);
      const title = titleMatches ? titleMatches[1] : '';
      titles.push(title);
    }
    // Set the title to the state
    setTitles(titles);

  };

  return (
    <div>
      <label>
        Input HTML:
        <textarea value={inputHTML} onChange={handleInputChange} />
      </label>
      <br />
      <button onClick={cleanHTML}>Clean HTML</button>
      <br />
      <label>
        Extracted Titles:
      </label>
      <div>
        {titles.map((title, index) => (
          <div key={index}>{title}</div>
        ))}
      </div>
    </div>
  );
};

export default CleanHTMLComponent;
*/
