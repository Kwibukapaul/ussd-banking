const express = require('express');
const bodyParser = require('body-parser');
const { User, Transaction } = require('../models');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/ussd', async (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    console.log(`Received request: ${JSON.stringify(req.body)}`);

    let response = '';

    const textArray = text.split('*');
    const userInput = textArray[textArray.length - 1];

    // Find or create user
    let user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
        user = await User.create({ phoneNumber });
    }

    if (text === '') {
        response = `CON Welcome to MyBank
        1. Check Balance
        2. Transfer Money
        3. View Transactions`;
    } else if (text === '1') {
        response = `END Your balance is KES ${user.balance}`;
    } else if (text.startsWith('2')) {
        if (textArray.length === 1) {
            response = `CON Enter recipient's phone number:`;
        } else if (textArray.length === 2) {
            response = `CON Enter amount to transfer:`;
        } else if (textArray.length === 3) {
            const recipientNumber = textArray[1];
            const amount = parseFloat(textArray[2]);

            let recipient = await User.findOne({ where: { phoneNumber: recipientNumber } });
            if (!recipient) {
                response = `END Recipient not found`;
            } else {
                if (user.balance < amount) {
                    response = `END Insufficient balance`;
                } else {
                    user.balance -= amount;
                    recipient.balance += amount;
                    await user.save();
                    await recipient.save();

                    await Transaction.create({
                        phoneNumber: phoneNumber,
                        amount: amount,
                        type: 'debit'
                    });
                    await Transaction.create({
                        phoneNumber: recipientNumber,
                        amount: amount,
                        type: 'credit'
                    });

                    response = `END Transferred KES ${amount} to ${recipientNumber}`;
                }
            }
        }
    } else if (text === '3') {
        const transactions = await Transaction.findAll({
            where: { phoneNumber },
            order: [['date', 'DESC']],
            limit: 5
        });
        let transactionText = 'END Recent transactions:\n';
        transactions.forEach((transaction, index) => {
            transactionText += `${index + 1}. ${transaction.type === 'debit' ? '-' : '+'}KES ${transaction.amount} on ${transaction.date}\n`;
        });
        response = transactionText;
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
