var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",


  port: 3306,


  user: "root",


  password: "",
  database: "bamazon_db"
});

connection.connect(function (err) {
  if (err) throw err;
  options();
});

function options() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "Exit the app ?"
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View Products for Sale":
          viewProducts();
          break;

        case "View Low Inventory":
          viewLowInv();
          break;

        case "Add to Inventory":
          addToInv();
          break;

        case "Add New Product":
          addNewProduct();
          break;

        case "Exit the app ?":
          console.log("\nThank you !");
          connection.end();
          break;
      }
    });
}


function viewProducts() {
  connection.query("SELECT item_id, product_name, price, stock_quantity FROM products;", function (err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log("Product ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Price: $" + res[i].price + " || Quantity Available: " + res[i].stock_quantity);

    }
    options();
  });

}

function viewLowInv() {

  connection.query("SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity <= 5;", function (err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log("Product ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Quantity Available: " + res[i].stock_quantity);

    }
    options();
  });


}

function addToInv() {
  inquirer.prompt([

    {
      name: "id",
      type: "input",
      message: "What is the ID of the product you would you like to restock? "
    },
    {
      name: "quantity",
      type: "input",
      message: "How many would you like to add?"
    }
  ]).then(function (answer) {

    var query = "SELECT * FROM products WHERE ?";
    connection.query(query, { item_id: answer.id }, function (err, res) {
      if (err) throw err;
      var quantity = parseInt(res[0].stock_quantity) + parseInt(answer.quantity);
      var name = res[0].product_name;

      var query = "UPDATE products SET ? WHERE ?";
      connection.query(query, [{ stock_quantity: quantity }, { item_id: answer.id }], function (err, res) {
        if (err) throw err;
        console.log(answer.quantity + " of " + name + " were successfully added to the stock !");

        addMore("Do you want to add more in another product?", addToInv);
      });

    });
  });

}

function addMore(string, addto) {

  inquirer.prompt([

    {
      name: "con",
      type: "confirm",
      message: string
    },

  ]).then(function (answer) {

    if (answer.con) {
      addto();
    } else {
      options();
    }
  });
}

function addNewProduct() {

  inquirer.prompt([

    {
      name: "name",
      type: "input",
      message: "What the name of the new product you want to add to the stock? "
    },
    {
      name: "dept",
      type: "input",
      message: "What departement name?"
    },
    {
      name: "price",
      type: "input",
      message: "What is the price of this product?"
    },
    {
      name: "quantity",
      type: "input",
      message: "How many in stock?"
    }
  ]).then(function (answer) {


    connection.query("INSERT INTO products SET ?",
      {
        product_name: answer.name,
        department_name: answer.dept.toLowerCase(),
        price: answer.price,
        stock_quantity: answer.quantity
      }, function (err, res) {
        if (err) throw err;
        console.log("The product " + answer.name + " has been successfully added to the stock !");
        addMore("Do you want to add another new product?", addNewProduct);

      });
  });


}