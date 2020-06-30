
[back to README.md file](../README.md)

1. [Version control on GitHub](#version-control-on-github)
2. [Deployment to AWS](#deployment-to-aws)
3. [Deployment to Heroku](#deployment-to-heroku)
4. [How to run this project locally](#how-to-run-this-project-locally)

# Deployment

This web page was locally developed in WebStorm and PyCharm. It was pushed to the remote repository - GitHub. The live page is hosted on AWS and Heroku. 

### Version control on GitHub

In order to connect the local IDE to GitHub I used the command `git remote add origin` and added the link to the remote repository: `https://github.com/Itamichan/Japan-Wanderlust.git`

My main local branch is `master` which I deployed as `origin/master` to GitHub.

**Used commands during version control:**
* `git add .` - to add the files to the staging area.
* `git commit -m "text message here"` - to commit the files.
* `git push origin master` - to push to origin master branch on GitHub.
* `git status` - was extensively used in order to see the current status of the files.

### Deployment to AWS

This project is stored on AWS. If you would like to also deploy your project to AWS then execute the following steps:

1. Go to [AWS](https://aws.amazon.com/) and create there an account. Choose Amazon Free Teer option in order to benefit the free version.
2. Go to "Services" and search for "S3".
3. Access "S3" and create a bucket there with "Create bucket" button. You can call it `japan-wanderlust`.
4. Under "Permissions" ensure that you set the access to public in order to be able to access the bucket's content.
5. Now you can add all your files related to the project into the bucket. You can do this by clicking "Upload" button. **Or** you can upload all the files in an automatic way by using python scripts.
    * I chose to upload them automatically with the help of the scripts written by [sheepsy90](https://github.com/sheepsy90). Since the scripts are not written by me I will not go into describing them. For your general knowledge the used python files are:
        * build.py
        * deploy.py
        * Additionally, you can use a shell script where you would store the values of your AWS credentials - **This file should be added to .gitignore file and never deployed to GitHub to not expose the access credentials**.
    * If you want to deploy the code in an automated way [here](https://www.freecodecamp.org/news/automated-deployment-in-aws-5aadc2e708a9/) is a good online resource.
6. Now your project is deployed to AWS.
    * Since the files on AWS are stored in a specific format in order to be able to access your web page you will need to additionally deploy your project to Heroku. Please look below how to do this.

### Deployment to Heroku

In order to serve our project which is saved on AWS we need a web server. In our case we chose to host on Heroku.
We also use the Heroku Postgres Database for storing of our tables.
To deploy JapanWanderlust to Heroku, take the following steps:

1. Create a `requirements.txt` file and add inside `requests flask gunicorn` for the python dependencies.
2. Create `run.py` file that will contain all our end points. It will handle our request deliver of index page.
3. Create a `Procfile` file and add inside `web: gunicorn -w 2 --pythonpath src src.run`. This file tells Heroku which processes need to be available. In our example we need a web server process.
4. Create a new app on the [Heroku website](https://dashboard.heroku.com/apps) by clicking the "New" button in your dashboard. Give it a name and set the region to Europe.
5. Select "Deploy" > "Deployment method" and select GitHub.
6. Confirm the linking of the Heroku app to the correct GitHub repository.
7. Select "Settings" > "Reveal Config Vars".
8. Set the following config vars:

|  **Key** | **Value**  |
|---|---|
| AWS_INDEX_URL | here you put the link to your index.html file from AWS  | 
| DATABASE_URL  | provided by Heroku Postgres | 
| DB_HOST | provided by Heroku Postgres |
| DB_NAME | provided by Heroku Postgres |
| DB_PASSWORD | provided by Heroku Postgres |
| DB_USER | provided by Heroku Postgres |
| PAPERTRAIL_API_TOKEN | provided by Heroku Papertrail on creation |
| SECRET_KEY | is your random secret key which you are using when you encrypt the passwords provided by the users on registration |
| SENDGRID_API_KEY | provided by SendGrid once on creation of your API Key |
        
* The link to your index-html page you can find on opening the index.html file in your bucket (japan-wanderlust).
* All the values for the dabase are found under Heroku Account > Resources > Heroku Postgres > Settings > Database Credentials.

9. Enable the web worker on Heroku.
    * Go to "Resources" > under Free Dynos choose to edit your dyno - turn it on and confirm it.
10. In the heroku dashboard, click "Deploy" > "Manual Deployment" and make sure the master branch is selected, then click "Deploy Branch".
11. The site is now successfully deployed.
12. To find the link to your web page go to "Settings" > "Domains".

### How to run this project locally

In order to be able to run the project locally you need to have an IDE with the following installed dependencies:

*This project's back-end is built as an API so in practice you can keep only the "frontend" directory and don't need to handle the back end at all.

**Front-End**  
* [npm v.6.13.7](https://www.npmjs.com/)
* [nodejs v12.14.1](https://nodejs.org/en/)
* [React v16.12.0](https://reactjs.org/)
* [Ruby Sass 3.7.4](https://sass-lang.com/)

Optionally:
* [reactstrap v8.4.1](https://reactstrap.github.io/)
* [react-fontawesome v0.1.8](https://github.com/FortAwesome/react-fontawesome)

*If you want to have access and work on the back-end code you need to have a corresponding ADI and install all the needed libraries.

**Back-End**
* Run the command `pip3 install -r requirements.txt`. This way you are intaling all the needed libraries for the project.

**Clone this project from GitHub:**

* Go to [Japan-Wanderlust](https://github.com/Itamichan/Japan-Wanderlust) GitHub repository.
* Click on "Clone or download" green button.
* Copy the URL to the repository.
* Open the terminal in your local IDE.
* Choose the working directory where you would like to have the cloned repository.
* Type git clone, and add the URL you copied from Github: `git clone https://github.com/Itamichan/Japan-Wanderlust.git`
* Press Enter and your local clone will be created.
    * If you do not want to deploy the project to AWS and Heroku remove all the related files to this process.
* Run `npm install` and `npm run` in order to run the project.
* Now you are good to go.