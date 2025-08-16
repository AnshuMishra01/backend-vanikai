const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const { getGeminiAnalysis } = require('./gemini');

app.post('/api/analyze', async (req, res) => {
  const { type, form } = req.body;
  try {
    const analysis = await getGeminiAnalysis(form, type);
    res.json({ message: analysis });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate analysis.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
