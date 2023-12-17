const mongoose = require('mongoose');

// Define the schema for a quiz question
const quizSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true, // Makes the 'question' field mandatory
        trim: true      // Trims whitespace from the question text
    },
    options: {
        type: [String],
        required: true, // Makes the 'options' field mandatory
        validate: [arrayLimit, '{PATH} must have exactly 4 options'] // Custom validator for the options array
    },
    correctAnswer: {
        type: Number,
        required: true, // Makes the 'correctAnswer' field mandatory
        min: 0,         // Minimum value for the correct answer index
        max: 3          // Maximum value for the correct answer index
    }
});

// Custom validation function to ensure there are exactly 4 options
function arrayLimit(val) {
    return val.length === 4;
}

// Create the model from the schema and export it
module.exports = mongoose.model('Quiz', quizSchema);
