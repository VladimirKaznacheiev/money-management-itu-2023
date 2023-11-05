const express = require('express');
const cors = require("cors");
const app = express();
app.use(cors());
const port = 3000;
// const db = new sqlite3.Database('money_management_database.db');
const { PrismaClient } = require("@prisma/client");

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

app.get('/get_users', async (req, res) => {
    const prisma = new PrismaClient();
    try {
        const users = await prisma.User.findMany();
        console.log(users);
        res.json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
      prisma.$disconnect();
});

app.get('/get_transactions', async (req, res) => {
    const prisma = new PrismaClient();
    try {
        const transactions = await prisma.Transaction.findMany();
        console.log(transactions);
        res.json(transactions);
    } catch (error) {
        console.error('Error getting transactions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
      prisma.$disconnect();
});
app.get('/get_transactions_piechart_data', async (req, res) => {
    const prisma = new PrismaClient();
    try {
        const transactions = await prisma.Transaction.findMany();
        const categorySums = {};

        transactions.forEach(transaction => {
            const { category, amount } = transaction;
            if (category in categorySums) {
              categorySums[category] += amount;
            } else {
              categorySums[category] = amount;
            }
          });
        const labels = Object.keys(categorySums);
        const data = Object.values(categorySums);
        const randomColors = Array.from({ length: labels.length }, () => getRandomColor());

        const result = {labels: labels, datasets:[{data: data, backgroundColor: randomColors}]};
        console.log(result);
        res.json(result);
    } catch (error) {
        console.error('Error getting transactions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
      prisma.$disconnect();
});

app.post('/add_user', async (req, res) => {
    const prisma = new PrismaClient();
    try {
        const newUser = await prisma.User.create({
            data: {
                username: req.query.username,
                email: req.query.email,
                password: req.query.password,
            },
        });
        console.log('Created new user:', newUser);
        // Respond with the created user
        res.status(200).json(newUser);
    } catch (error) {
        console.error('Error creating a new user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
      prisma.$disconnect();
      
});


app.post('/add_transaction', async (req, res) => {
    const prisma = new PrismaClient();
    try {
        const date = new Date(req.query.date);
        const newTransaction = await prisma.Transaction.create({
            data: {
                category: req.query.category,
                description: req.query.description,
                date: date.toISOString(),
                amount: parseInt(req.query.amount),
            },
        });
        console.log('Created new transaction:', newTransaction);
        // Respond with the created user
        res.status(200).json(newTransaction);
    } catch (error) {
        console.error('Error creating a new user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
      prisma.$disconnect();
      
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});