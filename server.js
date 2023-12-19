// Název souboru: server.js
// Autor: Volodymyr Kaznacheiev (xkazna01) 
// Datum vytvoření: 05/12/2023


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

app.put('/edit_transaction', async (req, res) => {
    const prisma = new PrismaClient();
    try {
        const transactionId = parseInt(req.query.id, 10);

        if (!req.query.category_id || req.query.category_id.trim() === '' || req.query.category_id == 0) {
            res.status(400).json({ error: 'Category cannot be empty' });
            return;
        }

        if (!req.query.amount || req.query.amount.trim() === '' || req.query.amount == 0) {
            res.status(400).json({ error: 'Amount cannot be empty' });
            return;
        }

        const existingTransaction = await prisma.Transaction.findUnique({
            where: {
                id: transactionId,
            },
        });

        if (!existingTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Update transaction fields based on the provided data
        const updatedTransaction = await prisma.Transaction.update({
            where: {
                id: transactionId,
            },
            data: {
                isIncome: req.query.is_income === 'true',
                categoryId: parseInt(req.query.category_id, 10),
                description: req.query.description,
                date: new Date(req.query.date).toISOString(),
                amount: parseInt(req.query.amount),
            },
        });

        console.log('Updated transaction:', updatedTransaction);
        res.status(200).json(updatedTransaction);
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        prisma.$disconnect();
    }
});

app.put('/edit_goal', async (req, res) => {
    const prisma = new PrismaClient();
    try {

        if (!req.query.category_id || req.query.category_id.trim() === '' || req.query.category_id == 0) {
          res.status(400).json({ error: 'Category cannot be empty' });
          return;
        }

        if (!req.query.amount || req.query.amount.trim() === '' || req.query.amount == 0) {
            res.status(400).json({ error: 'Amount cannot be empty' });
            return;
        }

        if (!req.query.name || req.query.name.trim() === '') {
            res.status(400).json({ error: 'Name cannot be empty' });
            return;
        }
        const transactionId = parseInt(req.query.id, 10);

        const existingTransaction = await prisma.Goal.findUnique({
            where: {
                id: transactionId,
            },
        });

        if (!existingTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Update transaction fields based on the provided data
        const updatedTransaction = await prisma.Goal.update({
            where: {
                id: transactionId,
            },
            data: {
                isSpend: req.query.is_spend === 'true',
                name: req.query.name,
                categoryId: parseInt(req.query.category_id, 10),
                date: new Date(req.query.date).toISOString(),
                amount: parseInt(req.query.amount),
            },
        });

        console.log('Updated transaction:', updatedTransaction);
        res.status(200).json(updatedTransaction);
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        prisma.$disconnect();
    }
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

app.put('/edit_category', async (req, res) => {
    const prisma = new PrismaClient();
    try {

          // Check if the name is an empty string
        if (!req.query.name || req.query.name.trim() === '') {
          res.status(400).json({ error: 'Category name cannot be empty' });
          return;
        }

        const categoryId = parseInt(req.query.id, 10);

        const existingCategory = await prisma.Category.findUnique({
            where: {
                id: categoryId,
            },
        });

        if (!existingCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Update category fields based on the provided data
        const updatedCategory = await prisma.Category.update({
            where: {
                id: categoryId,
            },
            data: {
                name: req.query.name,
                iconName: req.query.icon_name,
                isIncome: req.query.is_income === 'true',
            },
        });

        console.log('Updated category:', updatedCategory);
        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        prisma.$disconnect();
    }
});

app.put('/edit_category', async (req, res) => {
    const prisma = new PrismaClient();
    try {
        const categoryId = parseInt(req.params.id, 10);

        const existingCategory = await prisma.Category.findUnique({
            where: {
                id: categoryId,
            },
        });

        if (!existingCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Update category fields based on the provided data
        const updatedCategory = await prisma.Category.update({
            where: {
                id: categoryId,
            },
            data: {
                name: req.body.name,
                iconName: req.body.iconName,
                isIncome: req.body.isIncome === 'true',
            },
        });

        console.log('Updated category:', updatedCategory);
        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        prisma.$disconnect();
    }
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

app.delete('/delete_category', async (req, res) => {
    const prisma = new PrismaClient();
    try {
        // Find and delete transactions associated with the category
        await prisma.Transaction.deleteMany({
            where: {
                categoryId: parseInt(req.query.id, 10),
            },
        });

        // Delete the category
        await prisma.Category.delete({
            where: {
                id: parseInt(req.query.id, 10),
            },
        });

        res.status(200).json({ message: 'Category and associated transactions deleted successfully' });
    } catch (error) {
        console.error('Error deleting a category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        prisma.$disconnect();
    }
});

app.post('/add_transaction', async (req, res) => {
    const prisma = new PrismaClient();
    try {
        const date = new Date(req.query.date);

        if (!req.query.category_id || req.query.category_id.trim() === '' || req.query.category_id == 0) {
            res.status(400).json({ error: 'Category cannot be empty' });
            return;
        }

        if (!req.query.amount || req.query.amount.trim() === '' || req.query.amount == 0) {
            res.status(400).json({ error: 'Amount cannot be empty' });
            return;
        }




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
  let isIncome = req.query.is_income === 'true';

  // Check if the name is an empty string
  if (!req.query.name || req.query.name.trim() === '') {
      res.status(400).json({ error: 'Category name cannot be empty' });
      return;
  }

  try {
      // Check if a category with the same name already exists
      const existingCategory = await prisma.Category.findFirst({
          where: {
              name: req.query.name,
          },
      });

      if (existingCategory) {
          res.status(400).json({ error: 'Category with the same name already exists' });
          return;
      }

      const newCategory = await prisma.Category.create({
          data: {
              name: req.query.name,
              iconName: req.query.icon_name,
              isIncome: isIncome,
          },
      });

      console.log('Created new category:', newCategory);
      // Respond with the created user
      res.status(200).json(newCategory);
  } catch (error) {
      console.error('Error creating a new category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  } finally {
      prisma.$disconnect();
  }
});

app.post('/add_goal', async (req, res) => {
    const prisma = new PrismaClient();
    try {

        if (!req.query.category_id || req.query.category_id.trim() === '' || req.query.category_id == 0) {
            res.status(400).json({ error: 'Category cannot be empty' });
            return;
        }

        if (!req.query.amount || req.query.amount.trim() === '' || req.query.amount == 0) {
            res.status(400).json({ error: 'Amount cannot be empty' });
            return;
        }

        if (!req.query.name || req.query.name.trim() === '') {
            res.status(400).json({ error: 'Name cannot be empty' });
            return;
        }

        const date = new Date(req.query.date);

        const newGoal = await prisma.Goal.create({
            data: {
                categoryId: parseInt(req.query.category_id, 10),
                name: req.query.name,
                date: date.toISOString(),
                amount: parseInt(req.query.amount),
                isSpend: req.query.is_spend === 'true',
            },
        });
        console.log('Created new goal:', newGoal);
        // Respond with the created user
        res.status(200).json(newGoal);
    } catch (error) {
        console.error('Error creating a new goal:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
        prisma.$disconnect();
});

app.get('/get_goals', async (req, res) => {
    const prisma = new PrismaClient();
    try {
        const goals = await prisma.Goal.findMany();

        for (let index = 0; index < goals.length; index++) {
            const element = goals[index];

            const transactions = await prisma.Transaction.findMany({

                where: {
                    categoryId: element.categoryId,
                    isIncome: false,
                },
            });

            let sum = 0;
            transactions.forEach(transaction => {
                sum += transaction.amount;
            });

            element['spent'] = sum;

            
        }


        console.log(goals);
        res.json(goals);
    } catch (error) {
        console.error('Error getting goals:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
      prisma.$disconnect();
});

app.delete('/delete_goal', async (req, res) => {
    const prisma = new PrismaClient();
    try {
        const deletedGoal = await prisma.Goal.delete({
            where: {
                id: parseInt(req.query.id, 10),
            },
        });
        console.log('Deleted goal:', deletedGoal);
        // Respond with the created user
        res.status(200).json(deletedGoal);
    } catch (error) {
        console.error('Error deleting a goal:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
      prisma.$disconnect();

});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});