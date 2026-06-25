require("dotenv").config();

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const middleware = require("./middleware/middleware");
const path = require("path");

const stockRouter = require("./routes/stock");
const currencyRouter = require("./routes/currency");
const newRouter = require("./routes/news");
const userStockRouter = require("./routes/userStocks");
const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");
const authMeRouter = require("./routes/auth/me");
const authLogoutRouter = require("./routes/auth/logout");

app.use(middleware.requestLogger);
app.use(express.json());
app.use(cookieParser());

app.use("/api/login", loginRouter);
app.use("/api/signup", signupRouter);
app.use("/api/userstock", userStockRouter);

app.use("/api/stock", stockRouter);

app.use("/api/currency", currencyRouter);

app.use("/api/news", newRouter);

app.use("/api/auth/me", authMeRouter);
app.use("/api/auth/logout", authLogoutRouter);

app.use(express.static("dist"));
app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);
});
