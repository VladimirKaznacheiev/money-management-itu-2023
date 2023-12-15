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

        const categories = await prisma.Category.findMany();

        // Transform the array of instances into a dictionary
        const categoriesDict = categories.reduce((acc, instance) => {
          acc[parseInt(instance.id, 10)] = instance.name;
          return acc;
        }, {});

        console.log(categoriesDict);

        transactions.forEach(transaction => {
            const { categoryId, amount } = transaction;

            
            const category = categoriesDict[String(categoryId)];

            console.log(category);

            
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


app.get('/get_categories', async (req, res) => {
    const prisma = new PrismaClient();
    try {
        const categories = await prisma.Category.findMany();
        console.log(categories);
        res.json(categories);
    } catch (error) {
        console.error('Error getting categories:', error);
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
                categoryId: parseInt(req.query.category_id, 10),
                description: req.query.description,
                date: date.toISOString(),
                amount: parseInt(req.query.amount),
            },
        });
        console.log('Created new transaction:', newTransaction);
        // Respond with the created user
        res.status(200).json(newTransaction);
    } catch (error) {
        console.error('Error creating a new transaction:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
      prisma.$disconnect();
      
});

app.post('/add_category', async (req, res) => {
    const prisma = new PrismaClient();
    try {
        const newCategory = await prisma.Category.create({
            data: {
                name: req.query.name,
            },
        });
        console.log('Created new category:', newCategory);
        // Respond with the created user
        res.status(200).json(newCategory);
    } catch (error) {
        console.error('Error creating a new category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
      prisma.$disconnect();
      
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});