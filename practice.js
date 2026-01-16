const greet = ()=>{
    console.log("Hello there!");
}
function fun(cb){
    console.log("This is fun function");
    cb()
}
fun(greet)
fun(() => {
    console.log("Morning!")
})