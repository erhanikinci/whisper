import { connectDB } from "./src/config/databse";
import app from "./src/app";

const PORT = process.env.PORT || 3000

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('====================================');
        console.log("Server is up and running PORT: ", PORT);
        console.log('====================================');
    });
}).catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
});