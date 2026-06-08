const express = require("express");
const app = express();
const middleware = require("./utils/middleware");

const stockRouter = require("./routes/stock");
const currencyRouter = require("./routes/currency");
const newRouter = require("./routes/news");

// Enable CORS
const allowedOrigins = [
    "http://localhost:5173", // Your local frontend during development
    "https://www.yourproductionfrontend.com", // Your live website
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200,
};

const cors = require("cors");
app.use(cors(corsOptions));

app.use(middleware.requestLogger);

app.use("/api/stock", stockRouter);

app.use("/api/currency", currencyRouter);

app.use("/api/news", newRouter);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`);
});
