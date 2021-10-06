import express from 'express';
const app = express()
import cors from 'cors'
const PORT = 9500

// Data User
let users = [
    {
        id: 1,
        username: "tes",
        password: "abce",
    },
    {
        id: 2,
        username: "tes",
        password: "abce",
    },
];

// Data
let products = [
    {
        id: 1,
        name: "papan kayu",
        price: 20000,
    },
    {
        id: 2,
        name: "kursi kayu",
        price: 200000,
    },
    {
        id: 3,
        name: "lemari kece",
        price: 50000,
    }
];

let id = 3

const loggingFunc = (req, res, next) => {
    console.log(req.method, req.url, new Date().toString());
    next()
}

app.use(express.json())
app.use(loggingFunc)
app.use(cors())

app.get("/products/:id", (req, res) => {
    const { id } = req.params
    let indexProduk = products.findIndex(val => val.id == id)
    return res.status(200).send(products[indexProduk])
})

app.get("/products", (req, res) => {
    console.log("42 req.query products", req.query);
    const { namaProduk, hargaMin, hargaMax } = req.query
    let newFilterProduk = products

    if (namaProduk) {
        newFilterProduk = newFilterProduk.filter(val => {
            val.name.toLowerCase().includes(namaProduk.toLowerCase())
        })
    }

    if (hargaMin) {
        newFilterProduk = newFilterProduk.filter(val => {
            val.price >= hargaMin
        })
    }

    if (hargaMax) {
        newFilterProduk = newFilterProduk.filter(val => {
            val.price <= hargaMax
        })
    }

    return res.status(200).send(newFilterProduk)
})

app.get("/users", (req, res) => {
    console.log("query user", req.query);
    return res.status(200).send(users);
});

app.post("/products", (req, res) => {
    console.log(req.body);
    let data = req.body
    data.id = ++id

    products.push(data)
    return res.status(200).send(products)
})

app.patch("/products/:id", (req, res) => {
    const { id } = req.params;
    // cari index
    let indexEdit = products.findIndex((val) => val.id == id);

    if (indexEdit >= 0) {
        // edit data
        const { name, price } = req.body;
        if (name) {
            // jika name ada
            products[indexEdit].name = name;
        }
        if (price) {
            // jika price ada
            products[indexEdit].price = price;
        }
        return res.status(200).send(products);
    } else {
        let obj = {
            message: "tidak ada id",
        };
        return res.status(400).send(obj);
    }
});

app.delete("/products/:id", (req, res) => {
    let id = req.params.id;
    // cari index
    let indexDelete = products.findIndex((val) => val.id == id);

    if (indexDelete >= 0) {
        // delete data in array
        products.splice(indexDelete, 1);
        return res.status(200).send(products);
    } else {
        let obj = {
            message: "tidak ada id",
        };
        return res.status(400).send(obj);
    }
});

app.listen(PORT, () => {
    console.log(`Server di ${PORT}`);
})