const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/donationApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// User schema and model
const userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    username: { type: String, unique: true },
    password: String,
    city: String,
    state: String,
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
    res.redirect('/signin');
});

app.get('/register', (req, res) => {
    res.render('register.html');
});

app.post('/register', async (req, res) => {
    const { name, phone, username, password, confirmPassword, city, state } = req.body;
    if (password !== confirmPassword) {
        return res.send('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, phone, username, password: hashedPassword, city, state });
    try {
        await newUser.save();
        res.redirect('/signin');
    } catch (err) {
        console.log(err);
        res.send('Error registering user');
    }
});

app.get('/signin', (req, res) => {
    res.render('signin.html');
});

app.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
        res.redirect('/heartfulhub');
    } else {
        res.send('Invalid username or password');
    }
});

app.get('/heartfulhub', (req, res) => {
    res.render('heartfulhub.html');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
