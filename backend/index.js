const express = require("express");
const app = express();
const middleware = require("./utils/middleware");

const stockRouter = require("./routes/stock");
const currencyRouter = require("./routes/currency");
const newRouter = require("./routes/news");

app.use(middleware.requestLogger);

app.use("/api/stock", stockRouter);

app.use("/api/currency", currencyRouter);

app.use("/api/news", newRouter);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);
});
