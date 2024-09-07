import express from 'express';
import cors from 'cors';
import uploadRoute from './routes/uploadRoute.js';
import translateRoute from './routes/translateRoute.js'

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/api', uploadRoute);
app.use('/api', translateRoute);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
