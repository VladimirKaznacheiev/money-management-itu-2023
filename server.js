const express = require('express');
const cors = require("cors");
const app = express();
app.use(cors());
const port = 3000;
// const db = new sqlite3.Database('money_management_database.db');
const { PrismaClient } = require("@prisma/client");

app.get('/get_users', async (req, res) => {
    const prisma = new PrismaClient();
    try {
        const users = await prisma.User.findMany()
        console.log(users)
        res.json(users);
    } catch (error) {
        console.error('Error getting users:', error);
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});