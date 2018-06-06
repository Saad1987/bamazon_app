DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;
SET SQL_SAFE_UPDATES = 0;

CREATE TABLE products (

item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price INT default 200,
stock_quantity INT default 10,
product_sales INT default 0,
PRIMARY KEY (item_id)
  
);





CREATE TABLE departments (

department_id INT NOT NULL AUTO_INCREMENT,
department_name VARCHAR(100) NOT NULL,
over_head_costs INT NOT NULL,
PRIMARY KEY (department_id)
  
);

insert into products (product_name, department_name, price, stock_quantity,product_sales) values ('Skyrim', 'video games', 70, 18,3650);
insert into products (product_name, department_name, price, stock_quantity,product_sales) values ('Tomb raider', 'video games', 64, 20,1980);
insert into products (product_name, department_name, price, stock_quantity,product_sales) values ('The Avengers', 'movies', 50, 11,2500);
insert into products (product_name, department_name, price, stock_quantity,product_sales) values ('The Matrix', 'movies', 19, 13,3500);
insert into products (product_name, department_name, price, stock_quantity,product_sales) values ('Galaxy Note 10', 'smartphones', 1049, 3,65000);
insert into products (product_name, department_name, price, stock_quantity,product_sales) values ('Iphone XI', 'smartphones', 1199, 4,65000);
insert into products (product_name, department_name, price, stock_quantity,product_sales) values ('Google Pixel 3 XL', 'smartphones', 989, 2,43000);
insert into products (product_name, department_name, price, stock_quantity,product_sales) values ('Xbox one', 'video games', 300, 3,84680);
insert into products (product_name, department_name, price, stock_quantity,product_sales) values ('PS4', 'video games', 320, 4,95482);
insert into products (product_name, department_name, price, stock_quantity,product_sales) values ('The Matrix 2', 'movies', 20, 15,2681);


insert into departments (department_name, over_head_costs) values ('video games', 42015); 
insert into departments (department_name, over_head_costs) values ('movies', 2815); 
insert into departments (department_name, over_head_costs) values ('smartphones', 85015); 


SELECT * FROM departments;

SELECT * FROM products;


SELECT department_name, 
FROM products
GROUP BY department_name;


SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales, SUM(products.product_sales)-departments.over_head_costs AS total_profit
FROM products
INNER JOIN departments ON departments.department_name=products.department_name group by department_name;