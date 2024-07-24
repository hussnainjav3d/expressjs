const dotenv = require("dotenv")
dotenv.config({path: './config.env'})
console.log(process.env.PORT)
const app = require("./app");

// CREATE & LISTEN SERVER 
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on ${port}`));