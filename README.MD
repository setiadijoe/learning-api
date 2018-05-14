![TaraliteLogo](https://e27.co/img/startups/8222/logo-1447040977.png)

#STEP DEPLOY IN GOOGLE CLOUD PLATFORM

## CREATE VIRTUAL MACHINE IN GOOGLE CLOUD PLATFORM

- Click *Compute Engine* then click *VM Instances*
- Click *Create Instances*
- Then you should :
	- give __name__ of __instance__, 
	- choose __zone__  (_choose zone asia-shouteast1-a_), 
	- choose __machine type__, (_choose micro_), 
	- change __Boot disk__, 
	- choose all __Firewall__ 
	- then click __Create__
- After click __Create__, wait until the instances running, and then click on _Connect_ column and choose _Open in browser window_
- After choose that, you will have command prompt

Until this step you have create your Virtual Machine

## SETTING VIRTUAL MACHINE

* Open **Virtual Machine** from Instances Machine (_choose SSH and open in browser_)
* Go into root, type 
```js
sudo su
``` 

* Install Nodejs from [this link](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions) and choose for version 8
* After install **Nodejs**, check the version by type :
```js
node -v
>>v8.9.4

npm -v
>>5.6.0
```
* Install **pm2** from [this link](http://pm2.keymetrics.io/docs/usage/quick-start/)
* Install **Nginx** type on terminal 
```js
apt-get install nginx
```
* On terminal change directory type `cd /etc/nginx/sites-available`
* Open file **default** and find `location/` type inside curly brace `proxy_pass http://localhost:3030;`

```js
location / {
	proxy_pass http://localhost:3030
}
```

Your Setting has done

## CREATE DATABASE

* Go to **Google Cloud Platform** and click _Menu_ then choose menu _Storage_ and click _SQL_
* Click _Create Instance_ and choose database engine **POSTGRESQL** then click *Next*
* The you should do this following: 
	* give **Instance ID**, 
	* create **Password**, 
	* set **Region** and **Zone**,
	* click _Create_
* After the Instance created, click it and choose _Database_ Column and click _Create databse_ to create new database
* Choose _Authorization_ Column and click _Add Network_
* Input your IP Address of your Virtual Machine and Save the network. Your Virtual Machine has been connected to the database that you have been created

Your Database has been created 

## DEPLOY YOUR API

- Choose directory into `/home/ubuntu` and clone your project into this folder
- Go into your directory project and create `.env` file. Input your config from your local into your vm
- Change your setting on `.env` 
- For your Development Setting, Change your `HOST`, `PORT`, `USER`, `PASS`, `DATABASE`, `DIALECT` with the settings that you have been created,

```js
#DEVELOPMENT
DB_DEV_HOST=<YOUR HOST NAME>
DB_DEV_PORT=<YOUR OPEN PORT>
DB_DEV_USER=<YOUR USER NAME>
DB_DEV_PASS=<YOUR PASSWORD>
DB_DEV=<YOUR DATABASE NAME>
DB_DEV_DIALECT=<YOUR DIALECT>
```

- After change all setting, then type on your terminal `npm install`. It will install what is in `package.json` file
- After finishing install, run migration type `sequelize db:migrate`and your seeders if you need
- Run your config script
- Run your api type 

```js
pm2 start app,js
```

- Check your running api, type `pm2 list` and see your running api. It should **online**
- To check the log, type `pm2 logs <id>`

Then you check your api in postman

##DEPLOY ON YOUR LOCAL SERVER

- first you must have admin service project on your local and running well
- git clone this repository into your local workdir
- go into the directory and run `npm i` or `yarn`
- copy `env_template` and rename into `.env` then edit as you need
- run `npm run start`
- for query type `inquiry` and `payment`, use signature from `virtual-account-id`
- for post notify, use signature from `bill_no` and `payment_status_code`


##DOCUMENTATION FASPAY
![Faspay Documentation](https://faspay.co.id/docs/#request-parameter-inquiry-payment-notification)