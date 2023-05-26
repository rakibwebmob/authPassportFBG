import express from 'express';
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

import index from "./src/routes/index"

app.use("/", index)
  
app.get("/", (req, res) => {
    res.json({ message: "Welcome to application." });
});

app.use(function (req, res, next) {
    res.status(404).json({
        message: "No such route exists"
    });
});

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})