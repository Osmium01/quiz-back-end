const express = require('express');
const Quiz = require('../models/Quiz');

const router = express.Router();

// Get all quizzes
router.get('/', async (req, res) => {
    try {
        console.log('quiz', Quiz)
        const quizzes = await Quiz.find();
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/submit', async (req, res) => {
    try {
        const userAnswers = req.body.user_answers;

        // Fetch the quiz questions and correct answers from your database
        // Assuming each question in the quiz has a correct answer field
        const questions = await Quiz.find({}); // Adjust based on your Quiz model

        // Evaluate the answers
        let score = 0;
        questions.forEach((question, index) => {
            if(question.correctAnswer === userAnswers[index]) {
                score++;
            }
        });

        // Return the result
        res.status(200).json({ score: score, total: questions.length });

    } catch (error) {
        console.error('Error in quiz submission:', error);
        res.status(500).send('Error processing quiz submission');
    }
});


// Get a single quiz by ID
router.get('/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.json(quiz);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new quiz
router.post('/', async (req, res) => {
    const quiz = new Quiz({
        question: req.body.question,
        options: req.body.options,
        correctAnswer: req.body.correctAnswer
    });

    try {
        const newQuiz = await quiz.save();
        res.status(201).json(newQuiz);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
