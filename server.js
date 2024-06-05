const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { runAgent } = require('./src/utils/jira/agent'); 

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/ask', async (req, res) => {
  try {
    const { input } = req.body;
    const result = await runAgent(input);
    res.json({ output: result.output });
  } catch (error) {
    console.error("Error encountered:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
