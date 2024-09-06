const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

app.use(cors());
app.use(express.json());

app.post('/api/apple-pay-transaction', async (req, res) => {
  try {
    const { amount, account, promoCode, currency } = req.body;

    if (!amount || !account || !currency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transaction = {
      id: Date.now(),
      amount: parseFloat(amount),
      account,
      promoCode: promoCode || '',
      currency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await admin.database().ref('transactions').push(transaction);

    res.status(200).json({ message: 'Transaction added successfully', transaction });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});