import express from 'express';
import cors from 'cors';
import uploadRoute from './routes/uploadRoute.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use('/api', uploadRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
