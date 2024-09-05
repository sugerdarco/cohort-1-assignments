// Task 1
import fs from "fs";

let counter = 0;

function incrementCounter() {
    console.clear();
    console.log(counter);
    counter++;
}

//setInterval(incrementCounter, 1000);

//Task 2
function incrementCounter2() {
    console.clear();
    console.log(counter);
    counter++;
    setTimeout(incrementCounter2, 1000);
}
//incrementCounter2();

// Task 3
const read = fs.readFileSync('3-read-from-file.md', 'utf8');
console.log(read);

// Task 4
fs.writeFileSync('3-read-from-file.md', 'hey how are you?');
