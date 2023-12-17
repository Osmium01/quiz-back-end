const express = require('express');
const multer = require('multer');
const fs = require('fs');
const PDFParse = require('pdf-parse');
const Quiz = require('../models/Quiz');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Configures multer to save uploaded files in the 'uploads' directory

// POST route to handle PDF uploads
// POST route to handle PDF uploads
router.post('/', upload.single('file'), async (req, res) => {
    try {
        // Read the PDF file
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await PDFParse(dataBuffer);

        // Extract quiz questions from the PDF text
        const questions = extractQuizQuestions(data.text);

        // Store extracted questions in MongoDB
        await Quiz.insertMany(questions);

        res.json({ message: 'File processed and data stored' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        // Clean up: Delete the uploaded file from the server
        fs.unlinkSync(req.file.path);
    }
});


// Function to extract quiz questions from PDF text
// function extractQuizQuestions(text) {
//     const questions = [];
//     const questionBlocks = text.split(/Q\d+\./).slice(1); // Split the text into blocks, each starting with "Q<number>."

//     questionBlocks.forEach(block => {
//         const lines = block.split('\n').filter(line => line.trim()); // Split each block into lines and remove empty lines
//         const questionText = lines[0].trim(); // Assume first line is the question
//         const options = lines.slice(1, -1); // All lines except the first and last are options
//         const answerLine = lines[lines.length - 1]; // Last line contains the answer
//         const answerMatch = answerLine.match(/Ans:\s*(\d)/);

//         if (answerMatch) {
//             const correctAnswer = parseInt(answerMatch[1], 10) - 1; // Convert answer to zero-based index
//             questions.push({ question: questionText, options, correctAnswer });
//         }
//     });

//     return questions;
// }

function extractQuizQuestions(text) {
    const pattern = /Q(\d+)\.([\s\S]*?)\n1\. (.*?)\n2\. (.*?)\n3\. (.*?)\n4\. (.*?)\n\d+Mark\s*\nAns:(\d)\./g;
    const quizData = [];
    
    let match;
    while ((match = pattern.exec(text)) !== null) {
        const question = match[2].trim().replace(/\n/g, ' ');
        const options = [match[3].trim(), match[4].trim(), match[5].trim(), match[6].trim()];
        const correctAnswerIndex = parseInt(match[7], 10) - 1;

        quizData.push({
            question: question,
            options: options,
            correctAnswer: correctAnswerIndex
        });
    }
    
    console.log('quizData', quizData[0])
    return quizData;
}

module.exports = router;
