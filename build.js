const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceDir = path.join(__dirname, 'public');
const buildDir = path.join(__dirname, 'dist');

// Helper function to copy files
function copyFiles(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const files = fs.readdirSync(srcDir);
  files.forEach((file) => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);

    if (fs.statSync(srcFile).isDirectory()) {
      copyFiles(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

// Step 1: Clean the dist directory
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true, force: true });
}
fs.mkdirSync(buildDir);

// Step 2: Copy files from "public" to "dist"
copyFiles(sourceDir, buildDir);

// Step 3: Minify CSS
console.log('Minifying CSS...');
const cssDir = path.join(buildDir, 'css');
if (fs.existsSync(cssDir)) {
  const cssFiles = fs.readdirSync(cssDir);
  cssFiles.forEach((file) => {
    const filePath = path.join(cssDir, file);
    execSync(`npx cleancss -o ${filePath} ${filePath}`);
  });
}

// Step 4: Minify JavaScript
console.log('Minifying JavaScript...');
const jsDir = path.join(buildDir, 'js');
if (fs.existsSync(jsDir)) {
  const jsFiles = fs.readdirSync(jsDir);
  jsFiles.forEach((file) => {
    const filePath = path.join(jsDir, file);
    execSync(`npx terser -o ${filePath} ${filePath}`);
  });
}

console.log('Build completed. Files are in the "dist" directory.');
