import React from 'react';

interface DocsProps {
}

const Docs: React.FC<DocsProps> = () => {
  return (
    <>
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
    </>
  );
};

export default Docs;
