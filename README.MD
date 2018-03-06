## CREATE VIRTUAL MACHINE IN GOOGLE CLOUD PLATFORM
1 Click *Compute Engine* then click *VM Instances*
2 Click *Create Instances*
3 Then you should give __name__ of __instance__, choose __zone__  (_choose zone asia-shouteast1-a_), choose __machine type__, (_choose micro_), change __Boot disk__, choose all __Firewall__ then click __Create__
4 After click __Create__, wait until the instances running, and then klik on _Connect_ column and choose _Open in browser window_
5 After choose that, you will have command prompt

Until this step you have create your Virtual Machine

## SETTING VIRTUAL MACHINE

* Open Virtual Machine from Instances Machine (_choose SSH and open in browser_)
* Go into root, type `sudo su` on `terminal`
* Install Nodejs from [this link](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions) and choose for version 8
* After install **Nodejs**, check the version by type `node -v` and check npm by type `npm -v`. It should return **node version 8.9.3** or next and **npm version 5.6** or next
* Install **pm2** from [this link](http://pm2.keymetrics.io/docs/usage/quick-start/)
* Install **Nginx** type on terminal `apt-get install nginx`
* On terminal change directory type `cd /etc/nginx/sites-available`
* Open file **default** and find `location/` type inside curly brace `proxy_pass http://localhost:3030;`

Your Setting has done

## CREATE DATABASE

* Go to **Google Cloud Platform** and click _Menu_ then choose menu _Storage_ and click _SQL_
* Click _Create Instance_ and choose database engine **POSTGRESQL** then click *Next*
* The you should give **Instance ID**, create **Password**, set **Region** and **Zone**. It should same as the Virtual Machine then click _Create_
* After the Instance created, click it and choose _Database_ Column and click _Create databse_ to create new database
* Choose _Authorization_ Column and click _Add Network_
* Input your IP Address of your Virtual Machine and Save the network. Your Virtual Machine has been connected to the database that you have been created

Your Database has been created 

## DEPLOY YOUR API

1 Choose directory into `/home/ubuntu` and clone your project into this folder
2 Go into your directory project and create `.env` file. Input your config from your local into your vm
3 Change your setting on `.env` 
4 For your Development Setting, Change your `HOST`, `PORT`, `USER`, `PASS`, `DATABASE` into remote setting you have been created,
5 After change all setting, then type on your terminal `npm install`. It will install what is in `package.json` file
6 After finishing install, run migration type `sequelize db:migrate`and your seeders if you need
7 Run your config script
8 Run your api type `pm2 start app,js`
9 Check your running api, type `pm2 list` and see your running api. It should **online**
10 To check the log, type `pm2 logs <id>`

Then you check your api in postman or browser