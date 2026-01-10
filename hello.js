// console.log("Hello, World!");
const readline=require('readline');
const {add, sub, mul, div}=require('./hello1');
// console.log(add(5,10));
// console.log(sub(11,9));
// console.log(mul(4,6));
// console.log(div(8,4));
const rl=readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question('Enter first number: ', (num1)=>{
    rl.question('Enter second number: ', (num2)=>{
        num1 = Number(num1);
        num2 = Number(num2);

        console.log(`Addition: `, add(num1, num2));
        console.log(`Subtraction:`, sub(num1, num2));
        console.log(`Multiplication: `, mul(num1, num2));
        console.log(`Division: `, div(num1, num2));
        rl.close();
    });
});