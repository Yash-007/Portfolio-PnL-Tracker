const express = require('express');
const { createTrade, getPortfolio, getPnL } = require('./controller');

const app = express();
app.use(express.json());

// Routes
app.post("/trade", createTrade);
app.get("/portfolio", getPortfolio);
app.get("/pnl", getPnL);

app.get("/", (req, res) => {
    res.send("Portfolio Tracker is running fine");
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Portfolio Tracker is running on port ${PORT}`);
});