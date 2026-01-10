const fs = require('fs');

fs.writeFileSync('./example.txt', 'This is an example file.');
// const result = fs.readFileSync('./unknown.txt', 'utf-8');
// console.log(result);

// fs.readFile('./unknown.txt', 'utf-8', (err, result) => {
//     if (err) {
//         console.log('Error reading files:', err);
//         return;
//     }
//     else{
//         console.log('File contents:', result);
//     }        
// });

// fs.appendFile("./example.txt", `${Date.now()} Hey there\n`, (err) => {
//     if (err) {
//         console.log('Error appending to file:', err);
//         return;
//     }
//     console.log('File appended successfully.');
// });


// fs.cpSync('./example.txt', './example_copy.txt');    
// This will copy the file.

// fs.unlinkSync('./example_copy.txt');       
// This will delete the copied file

// console.log(fs.statSync('./unknown.txt').isFile());
// This will check if the path is a file or directory

// fs.mkdirSync('./my-docs/a/b', {recursive: true}); 
// This will create nested directories a and b inside my-docs.

// fs.rmdirSync('./my-docs', {recursive: true}); 
// This will delete my-docs directory along with a and b inside it.  

// Blocking / Synchronous Code
console.log("1");
const result = fs.readFileSync('./unknown.txt', 'utf-8');
console.log(result);
console.log("2");

// Non-Blocking / Asynchronous Code
console.log("1");
fs.readFile('./unknown.txt', 'utf-8', (err, result) => {
    console.log(result);
});
console.log("2");