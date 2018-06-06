var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
const cTable = require('console.table');

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
        "View Product Sales by Department",
        "Create New Department",
        "Exit the app ?"

      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View Product Sales by Department":
          viewProductSalesD();
          break;

        case "Create New Department":
          createNewDept();
          break;

        case "Exit the app ?":
          console.log("\nThank you !");
          connection.end();
          break;


      }
    });
}

function viewProductSalesD() {

  var table = new Table({
    head: ['Department ID', 'Department Name', 'Over Head Costs', 'Product Sales', 'Total Profit']
    , colWidths: [20, 20, 20, 20, 20]
  });


  var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, "
  query += "SUM(products.product_sales) AS product_sales, SUM(products.product_sales)-departments.over_head_costs AS total_profit "
  query += "FROM products INNER JOIN departments ON departments.department_name=products.department_name group by department_name;"


  connection.query(query, function (err, res) {
    for (var i = 0; i < res.length; i++) {
      table.push(
        [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit]


      );

    }
    // console.log(console.table(res)); This is line is there if we want to console log the table directly 
    console.log(table.toString());
    options();
  });

}


function createNewDept() {

  inquirer.prompt([

    {
      name: "name",
      type: "input",
      message: "What the name of the department you want to add ? "
    },
    {
      name: "ovhd",
      type: "input",
      message: "How much is the over head cost ?",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }
  ]).then(function (answer) {


    connection.query("INSERT INTO departments SET ?",
      {
        department_name: answer.name.toLowerCase(),
        over_head_costs: answer.ovhd

      }, function (err, res) {
        if (err) throw err;
        console.log("\nThe department " + answer.name + " has been successfully added !\n");
        options()

      });
  });


}

