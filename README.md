# Magazzino
Hi, this is Magazzino, my first React application.

## What is it?
It is a store management system to track how many items are in two different stores. Moreover, there is a sort of cash register that helps to remove the items if they are sold.

![Screenshot](https://raw.githubusercontent.com/alessandro308/magazzino/master/screenshot.png?token=AFzmbMnPnmtFGBtq1YaPiGO_tYDNj6nUks5a5Ob-wA%3D%3D)

This project uses `react-table` to organize the data to show in the main page (a huge number of products) and `react-bootstrap` to try to render a beautiful components. 

### Settings
The project is divided into two parts:
  - Frontend (Go React!)
  - Backend (PHP, using FlightPHP :/)

In order to set properly all the parts, you have to deploy your API somewhere, then set into `frontend/src/constant.js` the `BASE_URL` and all the strings to locate the project in your language. 

Then try it!

#### Consideration
The backend is developed in PHP since it runs on an italian [web hosting](https://www.tophost.it/sfida) that accepts only PHP and costs 10€/year (nice!).
Maybe, in the past commits you can find some password, don't worry, the hosting accepts incoming connection only from their own server, don't waste your time to hack the DB.

