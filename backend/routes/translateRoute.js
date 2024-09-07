import express from 'express';
import translate from 'node-google-translate-skidz';
const router = express.Router();

router.post('/translate', (req, res) => {
  const { text, source, target } = req.body;

  translate({ text, source, target }, (result) => {
    if (result && result.translation) {
      res.json({ translation: result.translation });
    } else {
      res.status(500).json({ error: 'Translation failed' });
    }
  });
});

export default router;
