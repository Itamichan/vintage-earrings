
# VintageEarrings

A live demo can be found [here](https://vintage-earrings.herokuapp.com/)

## Introduction

VintageEarrings is a web shop which offers to their clients the possibility to purchase vintage earrings. 

The main purpose of the web page is to offer the user an easy access to the liked products and pass through and easy and convenient payment processes. We keep the user updated at every step of their product's journey until it reaches them.

VintageEarrings's back-end is consumed as an API by the front-end. The API is documented with apidoc. Link to the documentation:
[VintageEarrings API](https://vintage-earrings-api-doc.s3.eu-north-1.amazonaws.com/apidoc/index.html)

### Actions that can be taken on the web page
* **Non registered user**:
    * Can see all the existing products.
    * Can search through existing products by name.
    * Can add product to the basket.
    * Can purchase products.
* **Registered user**:
    * Can see all their shipping information.
    * Can add or remove a shipping address.

## Table of Content

1. [UX](#ux)
    * [Goals](#goals)
        * [VintageEarrings goal](#vintageearrings-goal)
        * [Business goals](#business-goals)
        * [Customer goals](#customer-goals)
    * [User Stories](#user-stories)     
    * [Minimum Viable Product](#minimum-viable-product)
    * [Design](#design)
        * [Colors](#colors)
        * [Font](#font)
    * [Wireframes](#wireframes)
2. [Features](#features)
    * [Existing Features](#existing-features)
    * [Features left to implement](#features-left-to-implement)
    * [Features left to implement after testing](#features-left-to-implement-after-testing)
3. [Technologies Used](#technologies-used)
    * [Languages](#languages)
    * [Libraries](#libraries)
    * [Tools](#tools)
    * [React in detail](#react-in-detail)
4. [Testing](#testing)
5. [Deployment](#deployment)
6. [Credits](#credits)
    * [Content](#content)
    * [Acknowledgements](#acknowledgements)
        * [Deployment scripts](#deployment-scripts)
        * [Pages used for Inspiration](#pages-used-for-inspiration)
7. [Disclaimer](#disclaimer)

## UX

### Goals
#### VintageEarrings goal

The main goal of the JapanWanderlust is to sell wonderful, vintage earrings to people who have an interest in them.

**Target audience is:**
* People 18 years old and above.
* People interested in earrings, in special in vintage style earrings.

#### Business goals

* Create a platform that allows the potential customer to find and buy the product they like.
* Get users to register in order to increase the retention rate.
* Have well structured database.
* Have an attractive design of the web page.
* Have user friendly experience on the page.


#### Customer goals

* **Users**:
    * Find earrings that fit their style.
    * Buy earrings through an easy payment flow.
    * Save earrings in their favourite list.
    * See previous purchases.
    * Comment and rate bought products.

Both business and customer goals are addressed through user stories.

### User Stories
#### User category: _The User_

* As a user, I want to see all the available vintage earrings so that I can choose the ones I like.
* As a user, I want to buy  the product that I added to the basket.
* As a user, I want to see reviews of the products so that I know the opinion of people who already bought them.
* As a user, I want to add items to the basket so that I can buy them.
* As a user, I want to be able to contact customer support so that they can help me when something is not clear or went wrong.
* As a user, I want to be able to filter the products so that I can reduce the number of suggested products to those in which I am most interested in.

#### User category: _The Registered User_
* As a user, I want to save the earrings in a Wish List so I can revisit them later.
* As a user, I want to be able to change my Profile details so that my personal information is up to date.
* As a user, I want to see my previous order so that I can buy them again if I liked them.
* As a user, I want to rate the purchased items so that others are informed about the product based on my experience.

#### User category: _The UX Designer_
* As a UX designer, I want to track user behaviour so that I can improve the user experience.
    * As a UX designer, I want to track the user behaviour so that I can identify the possible user confusion.
    * As a UX designer, I want to find which parts are not accessed by the user so that I can suggest a better architecture of the page.    
        
#### User category: _The Business Owner_
* As a business owner, I want that our web page looks attractive so that people are motivated to spend time on it.
* As a business owner, I want that our customers have the means to contact us so that they can let us know if they need any help.
* As a business owner, I want to provide sufficient information about a product so that the user has a sufficient understanding of the product.
* As a business owner, I want to offer information about our business idea and values so that the users can identify their ideologies with ours.

### Minimum Viable Product
Taking in consideration all the user stories, their importance and viability of their implementation at the moment certain value and complexity levels have been attributed to the user stories.
    
[User Stories evaluation](readme-related-documents/user-stories.md)

### Design
#### Colors

Following colors have been used:
* ![#e0c53f](https://via.placeholder.com/15/e0c53f/000000?text=+) `#e0c53f`
* ![#682D8A](https://via.placeholder.com/15/682D8A/000000?text=+) `#682D8A`
* ![#FAF6F5](https://via.placeholder.com/15/FAF6F5/000000?text=+) `#FAF6F5`

The main colors are used in order to put the accent that the web site sells high quality, old styled earrings.

The black color and it's lighter variations was used for background coloring.

#### Font

The used Fonts for this project are: 
* [Lobster Two](https://fonts.google.com/specimen/Lobster+Two) with the font weight:
    * 400 - for main heading text.
   TODO check if 700 was used
    * 700 - for very strong emphasis if such is needed.
* [Source Sans Pro](https://fonts.google.com/specimen/Source+Sans+Pro) with the font weight: 
    * 400 - for most of the text.
    * 600 - for better text emphasis.
TODO check if 700 was used
    * 700 - for headers.

* The **Lobster Two** is a second version of the original [Lobster](https://fonts.google.com/specimen/Lobster) font provided by Google Fonts. It keeps the same character of writing but in a less bold version.

    This font was chosen for its display/poster look but in the same time having a note of elegance. These traits are important when we think that our web-shop sells vintage earrings, where vintage is associated with something old, unique and when we speak about jewellery we imagine something elegant, fancy, stylish.

* The **Source Sans Pro** was chosen for its good readability and slight soft curves that combine well with Lobster Two font.

### Wireframes

VintageEarrings wireframes are made both for mobile and desktop view. The wireframes were done in [figma](https://www.figma.com/). 

Link to wireframes for mobile can be found [here](https://www.figma.com/file/fc70yvJpqyFX6Ij4lbLagV/vintage_earrings_mobile?node-id=29%3A256).

Link to wireframes for desktop can be found [here](https://www.figma.com/file/57SegHqdQEUU5IlXkwf8Tf/vintage_earrings_desktop?node-id=0%3A1).

## Features

### Existing Features

#### Elements present on every page

* **Navigation bar** - Has a `fixed` position in order to ensure that the user can access it at any time.
    * **VintageEarrings** logo in the left corner which serves as a link to go back to the landing page.
    * Links that can be accessed are placed on the right side.

* **Footer**
    * Provides the links which offer extra access to VintageEarrings's content as well as links to Social Media.

#### Home page

* **Hero Banner** - sets the mood towards an exquisite web page and attracts user's attention to go directly to the shop.

* **Latest Additions** - presents the latest products added to the shop. Serves as a first glimpse into what the shop can offer.
    
* **About VintageEarrings** - informs the user what is the web page about. The aim is to create a connection between VintageEarrings as a company and the potential customer..

### Features left to implement

* **Product Review** - The possibility for the register user to review and rate the products that they had purchased.
* **User Reviews History** - The possibility for the user to see in one place all the reviews and ratings they had ever made.
* **Orders History** - The possibility to see the previous bought products in order to have an easy way to find them again if the user wants to buy them again.
* **User Account Personal Information** - The possibility for the logged user to see their personal information and update it if needed.
* **Product Filters** - The possibility to filter the products based on different characteristics, such as color, shape, year etc.

### Features left to implement after testing

* **Timeouts** - for a robust user experience we should ad timeouts to all axios requests to avoid long page loads.
* **Confirmation window** - when the user decides to delete an address.
* **Improve page's loading speed - biggest problem being the images size for the mobile use.**
* **Bind the basket to the user** - due to lack of time, at the moment the basket does not make difference between the logged and non logged user.
  
## Technologies Used

### Languages

* HTML - more precisely this project uses JSX which is a JavaScript extension and allows us to write "HTML" alike code in React.
* Java Script
* [Python](https://www.python.org/)
* CSS
* [Sass](https://sass-lang.com/) - Sass was used in order to write an easier css. It allowed to create variables and mixins.
* SQL


### Libraries

* **Front-End**
    * [React](https://reactjs.org/) - the entire project was built in React.
    * [react-redux](https://github.com/reduxjs/react-redux) - used for creation of global states.
    * [react-routing](https://reacttraining.com/react-router/web/guides/quick-start) - used for creation of page routes.
    * [axios](https://github.com/axios/axios) - used for HTTP requests to our back-end API.
    * [react-device-detect](https://www.npmjs.com/package/react-device-detect) - used for conditional rendering of content depending on which type of device the user has.
    * [reactstrap](https://reactstrap.github.io/) - used for layout and styling of different elements.
    * [react-fontawesome](https://github.com/FortAwesome/react-fontawesome) - used for icons.
    * [Google Fonts](https://fonts.google.com/) - used for the Lobster Two and Source Sans Pro fonts.
    * [react-notify-toast](https://www.npmjs.com/package/react-notify-toast) - used to inform the user on success or failure of certain actions.
    * [jwt-decode](https://www.npmjs.com/package/jwt-decode) - used to decode the jwt token on the client's side.
    * [Availity reactstrap Validation](https://availity.github.io/availity-reactstrap-validation/) - used for form validation.

* **Back-End**
     * [django](https://www.djangoproject.com/) - used for creation of the web framework.
     * [gunicorn](https://gunicorn.org/) - used for our workers for Heroku.
     * [pyJWT](https://pyjwt.readthedocs.io/en/latest/) - used for creation of Authentication Token on Login.
     * [APIDOC](https://apidocjs.com/) - used to create API documentation for our back-end
     * [dj-database-url](https://pypi.org/project/dj-database-url/) - used for the database url parsing.
     * [stripe](https://stripe.com/) - used for the payment flow.
     * [django-storages](https://django-storages.readthedocs.io/en/latest/#) and [boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) - for storing django static files.
     * [pika](https://pika.readthedocs.io/en/stable/) - python package that allowed to use [RabbitMQ](https://www.rabbitmq.com/)
     * [sendgrid](https://sendgrid.com/) - used for sending emails to the user.
     
* **Database**
    * [psycopg2](https://pypi.org/project/psycopg2/) - python library for PostgreSQL.

### Tools

* [WebStorm](https://www.jetbrains.com/webstorm/) - used as local IDE for the front-end of this project.
* [PyCharm](https://www.jetbrains.com/pycharm/) - used as local IDE for the back-end of this project.
* [Heroku Postgres](https://elements.heroku.com/addons/heroku-postgresql) - used as our main database based on PostgreSQL.
* [Heroku Papertrail](https://elements.heroku.com/addons/papertrail) - used for debugging and logging.
* [Clous AMQP](https://elements.heroku.com/addons/cloudamqp) - used for handling of events.
* [Git](https://git-scm.com/) - used for version control.
* [Figma](https://www.figma.com/) - used for creation of wireframes.
* [favicon.io](https://favicon.io/) - used for creation of the fav icon for the web page.
* [GIMP](https://www.gimp.org/) - used as image editor.
* [Tinyjpg](https://tinyjpg.com/) - used for image compression.
* [Google Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools) - used for testing and debugging.
* [PageSpeed insights](https://developers.google.com/speed/pagespeed/insights/) - used for testing the loading speed of the site.
* [AWS](https://aws.amazon.com/s3/?nc=sn&loc=0) - used to store and retrieve project's data.
* [Heroku](https://id.heroku.com/) - for hosting of our project.
* [Paletton](https://paletton.com/) - used for application's color combinations.

### React in detail

This project's front-end was entirely built in React, which as a result has a directory structure different then the classic projects built only with HTML and JavaScript.

**The distinctive points are:**
* The project is divided in components.
    * As a rule each component directory will contain a JS file and a scss file which is related to it.
    * The most important components present in the project are:
        * Checkout - which is responsible for calling the stripe and rendering  the success or cancellation page.
        * Basket - which represents the added products and where the user can update the number of the products or delete it entirely.
        * ProductContainer - which represents all existing products and gives the possibility to search through them.
* The final index.html is placed in the public folder and has only one root div. This div renders the App.js which represents our main JavaScript file.
* The project uses "real" HTML in an limited amount. The most HTML alike code is written with JSX. 

## Testing

Testing information can be fond [here](readme-related-documents/testing.md).

## Deployment

Deployment information can be fond [here](readme-related-documents/deployment.md).

## Credits

### Content

The products' information and images were taken from [etsy](https://www.etsy.com/).

### Acknowledgements

#### Pages used for Inspiration

* [etsy](https://www.etsy.com/)
* [amazon](https://www.amazon.com/)

* Inspiration resources for writing this README file:
    * [AJGreaves](https://github.com/AJGreaves/familyhub)

## Disclaimer

**This web page was created for educational purpose only.** 
