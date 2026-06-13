require("dotenv").config();

const express = require("express");
const app = express();
const middleware = require("./utils/middleware");

const stockRouter = require("./routes/stock");
const currencyRouter = require("./routes/currency");
const newRouter = require("./routes/news");
const userStockRouter = require("./routes/userStocks");
const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");

app.use(middleware.requestLogger);
app.use(express.json());

app.use(express.static("dist"));

app.use("/api/login", loginRouter);
app.use("/api/signup", signupRouter);
app.use("/api/userstock", userStockRouter);

app.use("/api/stock", stockRouter);

app.use("/api/currency", currencyRouter);

app.use("/api/news", newRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);
});
