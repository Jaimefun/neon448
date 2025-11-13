const cheerio = require("cheerio");

module.exports = function (html) {
  const $ = cheerio.load(html);

  // Example rewrite: Change all titles
  $("title").text("Unblocked by Proxy");

  // Example rewrite: Add custom banner
  $("body").prepend(
    '<div style="background:#ffc;">Proxy: Page Unblocked</div>'
  );

  return $.html();
};
