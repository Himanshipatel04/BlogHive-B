import {app} from './App.js';
import "dotenv/config";
import  dbConnection  from "./db/dbConnection.js";


//Database Connection
dbConnection()


app.listen(process.env.PORT || 3000 , () => {
    console.log(`Server is running at ${process.env.PORT}`);
})
 