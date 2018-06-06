var mysql = require("mysql");
var inquirer = require("inquirer");
var prices = [];
var clientQuantities = [];
var stockQuantities = [];
var idArray = [];
var productSalesArray = [];

var connection = mysql.createConnection({
  host: "localhost",


  port: 3306,


  user: "root",


  password: "",
  database: "bamazon_db"
});

connection.connect(function (err) {
  if (err) throw err;
  showProducts();
});

function showProducts() {
  connection.query("SELECT item_id, product_name, price, stock_quantity FROM products;", function (err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log("Product ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Price: $" + res[i].price + " || Quantity Available: " + res[i].stock_quantity);
    }

    Order();
  });
}

function Order() {
  inquirer.prompt([

    {
      name: "id",
      type: "input",
      message: "What is the ID of the product you would you like to purchase? "
    },
    {
      name: "quantity",
      type: "input",
      message: "How many would you like ?"
    }
  ]).then(function (answer) {

    var query = "SELECT * FROM products WHERE ?";
    connection.query(query, { item_id: answer.id }, function (err, res) {

      if (res[0] !== undefined) {
        if (idArray.indexOf(answer.id) === -1) {
          if ((res[0].stock_quantity >= answer.quantity)) {

            console.log("Successfully purchased " + answer.quantity + " of " + res[0].product_name + "'s !");
            prices.push(res[0].price);
            clientQuantities.push(answer.quantity);
            idArray.push(answer.id);
            stockQuantities.push(res[0].stock_quantity);
            productSalesArray.push(res[0].product_sales);
            askAgain();

          } else {
            console.log("Insufficient quantity!");
          }

        } else {
          var i = idArray.indexOf(answer.id);
          clientQ = parseInt(answer.quantity) + parseInt(clientQuantities[i]);

          if (res[0].stock_quantity >= clientQ) {
            clientQuantities[i] = clientQ;
            console.log("Successfully purchased " + answer.quantity + " of " + res[0].product_name + "'s !");
            askAgain();
          } else {
            console.log("Insufficient quantity!");
          }
        }
      } else {
        console.log("please choose a valid existing ID");
        Order();
      }

    });
  });
}

function askAgain() {
  inquirer.prompt([

    {
      name: "con",
      type: "confirm",
      message: "Do you want to buy another product?"
    },

  ]).then(function (answer) {

    if (answer.con) {
      Order();
    } else {
      var total = 0;
      for (var i = 0; i < idArray.length; i++) {

        total += parseFloat(prices[i]) * parseFloat(clientQuantities[i]);
      }


      console.log("Your total is : $" + total);
      updateDatabase();

    }
  });

}
function updateDatabase() {
  inquirer.prompt([

    {
      name: "con",
      type: "confirm",
      message: "Confirm your purchase ?"
    },

  ]).then(function (answer) {

    if (answer.con) {
      for (var i = 0; i < idArray.length; i++) {

        quantity = parseInt(stockQuantities[i]) - parseInt(clientQuantities[i]);
        var query = "UPDATE products SET stock_quantity=" + quantity + " WHERE item_id=" + parseInt(idArray[i]);
        connection.query(query, function (error) {
          if (error) throw error;


        });



        var productSales = productSalesArray[i] + parseFloat(prices[i]) * parseFloat(clientQuantities[i]);
        var query = "UPDATE products SET ? WHERE ?";
        connection.query(query, [{ product_sales: productSales }, { item_id: idArray[i] }], function (error) {
          if (error) throw error;

        });

      }

      console.log("Thank you for your purchase !");
      connection.end();
    } else {
      console.log("Ok no problem, Good bye !");
      connection.end();
    }
  });
}


