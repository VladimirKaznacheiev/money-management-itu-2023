const express = require('express');
const cors = require("cors");
const app = express();
app.use(cors());
const port = 3000;
// const db = new sqlite3.Database('money_management_database.db');
const { PrismaClient } = require("@prisma/client");
// const { is } = require('core-js/core/object');

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
        const categoryIcons = [];

        const categories = await prisma.Category.findMany();

        // Transform the array of instances into a dictionary
        const categoriesDict = categories.reduce((acc, instance) => {
          acc[parseInt(instance.id, 10)] = {name: instance.name, icon: instance.iconName};
          return acc;
        }, {});

        console.log(categoriesDict);

        let income_amount = 0;
        let expense_amount = 0;

        transactions.forEach(transaction => {
            const { categoryId, amount, isIncome } = transaction;

            if (isIncome == (req.query.is_income === 'true')) {
            
              const category = categoriesDict[String(categoryId)];

              console.log(category);

              
              if (category.name in categorySums) {
                categorySums[category.name] += amount;
              } else {
                categorySums[category.name] = amount;
                categoryIcons.push(category.icon);
              }
            }

            
            if (isIncome) {
                income_amount += amount;
            }else{
                expense_amount += amount;
            }

          });
        const labels = Object.keys(categorySums);
        const data = Object.values(categorySums);
        const randomColors = Array.from({ length: labels.length }, () => getRandomColor());

        const result = {labels: labels, datasets:[{data: data, backgroundColor: randomColors}], income_amount: income_amount, expense_amount: expense_amount, categoryIcons: categoryIcons};
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
                isIncome: req.query.is_income === 'true',
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

app.delete('/delete_transaction', async (req, res) => {
    const prisma = new PrismaClient();
    try {
        const deletedTransaction = await prisma.Transaction.delete({
            where: {
                id: parseInt(req.query.id, 10),
            },
        });
        console.log('Deleted transaction:', deletedTransaction);
        // Respond with the created user
        res.status(200).json(deletedTransaction);
    } catch (error) {
        console.error('Error deleting a transaction:', error);
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
                iconName: req.query.icon_name,
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