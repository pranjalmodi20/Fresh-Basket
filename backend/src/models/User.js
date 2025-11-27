// User Model - This defines what data we store for each user
const mongoose = require('mongoose');

// Create a schema (structure) for our user
const userSchema = new mongoose.Schema({
    // User's full name
    name: {
        type: String,
        required: true,  // This field is mandatory
        trim: true       // Remove extra spaces
    },
    // User's email (must be unique)
    email: {
        type: String,
        required: true,
        unique: true,    // No two users can have same email
        lowercase: true  // Convert to lowercase
    },
    // User's password (will be encrypted)
    password: {
        type: String,
        required: true,
        minlength: 6     // Password must be at least 6 characters
    },
    // When the user was created
    createdAt: {
        type: Date,
        default: Date.now  // Automatically set current date
    }
});

// Export the model so we can use it in other files
module.exports = mongoose.model('User', userSchema);
