const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/ussd', (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    let response = '';

    const textArray = text.split('*');
    const userInput = textArray[textArray.length - 1];

    if (text === '') {
        response = `CON Welcome to MyBank
        1. Check Balance
        2. Transfer Money
        3. View Transactions`;
    } else if (text === '1') {
        response = `END Your balance is KES 1,000`;
    } else if (text.startsWith('2')) {
        if (textArray.length === 1) {
            response = `CON Enter recipient's phone number:`;
        } else if (textArray.length === 2) {
            response = `CON Enter amount to transfer:`;
        } else if (textArray.length === 3) {
            const recipientNumber = textArray[1];
            const amount = textArray[2];
            response = `END Transferred KES ${amount} to ${recipientNumber}`;
        }
    } else if (text === '3') {
        response = `END Recent transactions:
        1. -KES 200 to 0712345678
        2. +KES 500 from 0709876543`;
    } else {
        response = `END Invalid option`;
    }

    res.set('Content-Type', 'text/plain');
    res.send(response);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
