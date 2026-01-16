console.log("First line of callback.js");
function login(cb){
    setTimeout(() => {
        console.log("User logged in")
        cb()
    }, 2000)
}
function UserDetails(cb){
    setTimeout(() => {
        console.log("User details")
        cb()
    }, 1000)
}
function Password(){
    setTimeout(() => {
        console.log("User password")
    },3000)
}
// callback hell 
login(()=>{
    UserDetails(()=>{
        Password()
    })
})
console.log("Last line of callback.js");