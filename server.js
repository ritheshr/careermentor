const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const docxParser = require('docx-parser');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect('mongodb+srv://ritheshraj321:<Rithu@@88>@cluster0.8qeg1ya.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Multer Setup for File Upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for file upload
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (file.mimetype === 'application/pdf') {
    pdfParse(file.buffer).then(result => {
      // Process PDF
      res.json({ text: result.text });
    });
  } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    docxParser.parseDocx(file.buffer, function(err, result) {
      if (err) {
        res.status(500).send('Error parsing document');
      } else {
        res.json({ text: result });
      }
    });
  } else {
    res.status(400).send('Unsupported file type');
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));


app.post('/interview', async (req, res) => {
    const { role } = req.body;
    const questions = {
      "Data Scientist": ["What is overfitting?", "Explain bias-variance tradeoff."],
      "Product Manager": ["How do you prioritize features?", "Tell me about a time you handled a difficult stakeholder."],
    };
  
    const selectedQuestions = questions[role] || ["Tell me about yourself."];
  
    const interview = selectedQuestions.map(q => {
      return openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Simulate a job interview for a ${role}. Ask: ${q}`,
        max_tokens: 150,
      });
    });
  
    const responses = await Promise.all(interview);
    res.json(responses.map(r => r.data.choices[0].text));
  });

  async function suggestCareerPaths(experience) {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Suggest career paths for someone with this experience: ${experience}`,
      max_tokens: 200,
    });
    return response.data.choices[0].text;
  }

  const puppeteer = require('puppeteer');

async function scrapeIndeedJobs(query, location) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const searchUrl = `https://www.indeed.com/jobs?q=${query}&l=${location}`;
  await page.goto(searchUrl);
  
  // Scrape job titles and URLs
  const jobs = await page.evaluate(() => {
    const jobElements = document.querySelectorAll('.jobtitle');
    const jobListings = [];
    jobElements.forEach(job => {
      const title = job.textContent;
      const url = job.parentNode.href;
      jobListings.push({ title, url });
    });
    return jobListings;
  });

  await browser.close();
  return jobs;
}
