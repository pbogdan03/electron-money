import React from 'react';

const Html = ({title, body, manifest}) => (
  <html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <title>{title}</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <link href={manifest["app.css"]} rel="stylesheet" />
    </head>
    <body>
      <div id="root" class="root-container"></div>
      <noscript>
        <div class="container" dangerouslySetInnerHTML={{ __html: body }} ></div>
      </noscript>
      <script type="text/javascript" src={manifest["manifest.js"]}></script>
      <script type="text/javascript" src={manifest["vendor.js"]}></script>
      <script type="text/javascript" src={manifest["app.js"]}></script>
    </body>
  </html>
);

export default Html;
