const Product = require("../models/productModel");
const { getPostData } = require("../utils");
const fs = require("fs");

//@des documentation page
//@route domain/
async function homePage(req, res) {
  try {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(fs.readFileSync("./data/index.html", "utf-8"));
    res.end();
  } catch (e) {
    console.log(e);
  }
}

function serveStaticFile(res, path, contentType, responseCode = 200) {
  fs.readFile(__dirname + path, (err, data) => {
    /*if(err){
      res.writeHead(500, {'Content-Type': 'text/plain'})
      return res.end('500 - Internal Server Error')
    }*/
    res.writeHead(responseCode, { "Content-Type": contentType });
    res.end(data);
  });
}

//@des Get all products in the database
//@route /api/products
//@method GET
async function getProducts(req, res) {
  try {
    const product = await Product.findAll();

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(product));
  } catch (e) {
    console.log(e);
  }
}

// @des   Get single Product
// @route /api/products/:id
//@method GET
async function getProduct(req, res, id) {
  try {
    const product = await Product.findById(id);
    if (!product) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Product not found" }));
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(product));
    }
  } catch (e) {
    console.log(e);
  }
}

// @des   Get Product by category
// @route /api/products/category/{category}
//@method GET
async function getProductByCategory(req, res, categorySearched) {
  try {
    const product = await Product.findByCategory(categorySearched);
    if (!product) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({ message: "Could'nt find any product with that id" }),
      );
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(product));
    }
  } catch (e) {
    console.log(e);
  }
}

//@des create a product
//@route /api/products
//@method POST
async function addProduct(req, res) {
  try {
    const body = await getPostData(req);

    const { id, img_url, item, category, description, price } =
      JSON.parse(body);

    const product = {
      id,
      img_url,
      item,
      category,
      description,
      price,
    };

    const newProduct = await Product.add(product);

    res.writeHead(201, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(newProduct));
  } catch (e) {
    console.log(e);
  }
}

//@des update product
//@route /api/products/:id
//@method PUT
async function updateProduct(req, res, id) {
  try {
    const product = await Product.findById(id);

    if (!product) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({ message: "Could'nt find any product with that id" }),
      );
    } else {
      const body = await getPostData(req);

      const { img_url, item, category, description, price } = JSON.parse(body);

      const productData = {
        img_url: img_url || product.img_url,
        item: item || product.item,
        category: category || product.category,
        description: description || product.description,
        price: price || product.price,
      };

      const updProduct = await Product.update(id, productData);

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(updProduct));
    }
  } catch (e) {
    console.log(e);
  }
}

// @des   DELETE a Product
// @route /api/products/:id
//@method DELETE
async function removeProduct(req, res, id) {
  try {
    const product = await Product.findById(id);
    if (!product) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Product not found" }));
    } else {
      await Product.remove(id);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: `Product ${id} removed` }));
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  homePage,
  getProducts,
  getProduct,
  getProductByCategory,
  addProduct,
  updateProduct,
  removeProduct,
};
