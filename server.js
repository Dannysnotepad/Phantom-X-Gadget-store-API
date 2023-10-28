const http = require("http");
const {
  homePage,
  getProducts,
  getProduct,
  createProduct,
  getProductByCategory,
  addProduct,
  updateProduct,
  removeProduct,
} = require("./controllers/productController");

const server = http.createServer((req, res) => {
  //const req.url = req.url.replace(/\/?(?:\?.*)?$/,'').toLowerCase()
  console.log(`The client made a ${req.method} request to ${req.url}`);

  if (req.url === "/") {
    homePage(req, res);
  } else if (req.url === "/api/products" && req.method === "GET") {
    getProducts(req, res);
  } else if (
    req.url.match(/\/api\/products\/([0-9]+)/) &&
    req.method === "GET"
  ) {
    const id = req.url.split("/")[3];
    getProduct(req, res, id);
  } else if (
    req.url.match(/\/api\/products\/category\/([a-z]+)/) &&
    req.method === "GET"
  ) {
    const category = req.url.split("/")[4];
    getProductByCategory(req, res, category);
  } else if (req.url === "/api/products" && req.method === "POST") {
    addProduct(req, res);
  } else if (
    req.url.match(/\/api\/products\/([0-9]+)/) &&
    req.method === "PUT"
  ) {
    const id = req.url.split("/")[3];
    updateProduct(req, res, id);
  } else if (
    req.url.match(/\/api\/products\/([0-9]+)/) &&
    req.method === "DELETE"
  ) {
    const id = req.url.split("/")[3];
    removeProduct(req, res, id);
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT);
