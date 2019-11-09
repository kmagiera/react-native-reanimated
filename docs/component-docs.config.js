/* @flow */

import path from 'path';
import fs from 'fs';

Object.defineProperty(Array.prototype, 'flat', {
  value: function(depth = 1) {
    return this.reduce(function(flat, toFlatten) {
      return flat.concat(
        Array.isArray(toFlatten) && depth > 1
          ? toFlatten.flat(depth - 1)
          : toFlatten
      );
    }, []);
  },
});

const root = path.join(__dirname, '..');
const dist = path.join(__dirname, 'dist');
const assets = [
  path.join(__dirname, 'assets', 'screenshots'),
  path.join(__dirname, 'assets', 'images'),
];
const styles = [path.join(__dirname, 'assets', 'styles.css')];
const github =
  'https://github.com/kmagiera/react-native-reanimated/edit/master/';

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist);
}

function getType(file: string) {
  if (file.endsWith('.js')) {
    return 'custom';
  } else if (file.endsWith('.mdx')) {
    return 'mdx';
  }
  return 'md';
}

const nameToGroupTitle = (name: string) => {
  return name
    .split('.')[1]
    .split(/(?=[A-Z])/)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
};

const mapToObject = (filePath, group) =>
  fs
    .readdirSync(filePath, { withFileTypes: true })
    .map(file => {
      if (file.isDirectory()) {
        return mapToObject(
          path.join(filePath, file.name),
          nameToGroupTitle(file.name)
        );
      } else {
        let result = {
          file: path.join(filePath, file.name),
          type: getType(file.name),
        };
        if (!!group) {
          result['group'] = group;
        }
        return result;
      }
    })
    .flat();

const docs = mapToObject(path.join(__dirname, 'pages'));

module.exports = {
  root,
  assets,
  styles,
  pages: docs,
  output: dist,
  github,
};
