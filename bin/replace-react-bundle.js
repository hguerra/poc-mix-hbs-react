const fs = require('fs');
const path = require('path');

function extract([beg, end]) {
  const matcher = new RegExp(`${beg}(.*?)${end}`, 'gm');
  const normalise = (str) => str.slice(beg.length, end.length * -1).trim();
  return function (str) {
    return str.match(matcher).map(normalise);
  };
}

(async () => {
  const reactHtml = await fs.promises.readFile(
    path.join(__dirname, '..', 'web', 'dist', 'index.html'),
    'utf-8',
  );
  const homeTemplate = await fs.promises.readFile(
    path.join(__dirname, '..', 'views', 'template', 'home.template.hbs'),
    'utf-8',
  );

  const replaceSrc = (str) => str.replace(/assets/g, 'dist/assets');
  const srcs = extract(['<script', '>'])(reactHtml).map(replaceSrc);
  const hrefs = extract(['<link', '>'])(reactHtml).map(replaceSrc);

  const bundleList = [];
  srcs.forEach((content) => bundleList.push(`<script ${content}></script>`));
  hrefs.forEach((content) => bundleList.push(`<link ${content}>`));

  const bundleContent = bundleList.join('\n');

  const homeHtml = homeTemplate.replace(
    /<!-- ADD_REACT_DIST -->/,
    bundleContent,
  );
  await fs.promises.writeFile(
    path.join(__dirname, '..', 'views', 'home.hbs'),
    homeHtml,
    'utf-8',
  );
})();
