# Testing

[back to README.md file](../README.md)

## Table of Content

1. [DevTools](#devtools)
2. [Manual Testing](#manual-testing)
3. [User Stories](#user-stories)
4. [PageSpeed Insights](#pagespeed-insights)
5. [Travis testing](#travis-testing)


## DevTools

Was used for:
* Testing the responsiveness of the web page.
    * As an outcome I adjusted the media queries on different occasions in order to ensure the proper placement on different screen sizes.
* Debugging - which allowed to identify wrongly applied scss as well as to see if the react components are working as expected. 

As a result the web page is responsive on different screen sizes and existing bugs are identified and addressed accordingly.

## Manual Testing

Was used:
* To test links' functionality.
* To assess the flow and intuitiveness of the content placement.
* To see web page's performance in different browsers, such as Chrome, Firefox and Safari.

Identified bugs:
* The pagination component was returning the nr of pages rounded down which as a result made several attraction cards to not be shown - fixed.
* The "Filter Menu" was moving to the right is the Attractions were "loading" - fixed.
* No timeouts are set during axios requests which makes impossible for the user to reach the point where they are informed that something went wrong - to be fixed in the next sprint.

## User Stories

As a test case we choose the user story which requires one of the most steps in order to be fulfilled.

* As a user, I want to see the available attractions in Japan so that I can choose which one I would like to save in my Trip.
* Taken steps:
    * On the home page we can see all the available attractions.
    * I try to save an attraction.
    * Modal window says that I need to login or register.
    * I create an account.
    * I receive an welcome email.
    * I am introducing my login credentials in the login form.
    * I try to save an attraction.
    * I am suggested to create a Trip since I do not have any.
    * I create a Trip.
    * I choose the Trip name from the suggested options.
    * I see on the bottom of the page my current chose Trip.
    * I try to save an attraction.
    * I succeed!

## PageSpeed Insights

**Identified Loading speed of the web page:**
* On mobile - 72
* On desktop - 92

**Opportunities for improvement:**
* Properly size images - considering that we will never need the images in big resolution we could reduce their size significantly - would save 11.19s.
    * To be fixed in the next sprint.
    
## Travis Testing

In our back-end we use travis to test our functions that run database queries. 
These tests ensure that the code which doesn't pass the tests will not be pushed to GitHUb and as a result it will not deployed to Heroku.
This kind of testing protects the live web page from potential bugs.
