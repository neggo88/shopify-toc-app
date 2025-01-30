const cheerio = require('cheerio');

const generateTOC = (htmlContent) => {
  const $ = cheerio.load(htmlContent);
  let toc = '<nav class="toc-container"><ul>';
  
  $('h2, h3').each((i, element) => {
    const tag = element.name;
    const text = $(element).text();
    const id = `section-${i}-${text.toLowerCase().replace(/ /g, '-')}`;
    
    $(element).attr('id', id);
    
    toc += `
      <li class="toc-${tag}">
        <a href="#${id}">${text}</a>
      </li>
    `;
  });

  toc += '</ul></nav>';
  return {
    modifiedContent: $.html(),
    tocHtml: toc
  };
};

module.exports = { generateTOC };