import express from 'express';
import router from './api/index';  // Make sure this path is correctly resolved
import cors from 'cors';
import dotenv from 'dotenv';




dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

app.use('/api' , router)
const port = process.env.PORT || 4001;



app.listen(port, () => {
 console.log(`Server running on http://localhost:${port}`);
});
