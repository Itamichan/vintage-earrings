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

Some of the identified bugs:
* If user logs out while being at the checkout step they still can see the private address information - fixed.
* No timeouts are set during axios requests which makes impossible for the user to reach the point where they are informed that something went wrong - to be fixed in the next sprint.
* The initial position of the Footer was wrong in relation to other components - fixed.

## User Stories

As a test case we choose the user story in which the user tries ti buy a product.

* As a user, I want to buy  the product that I added to the basket.
* Taken steps:
    * On the home page I click the "shop" button.
    * I see different products and add several of the to my basket.
    * I click on my basket to see the added products.
    * I am happy with what I have in the basket and i click "Proceed to checkout".
    * I am asked if I want to login or continue to the payment, I choose the latest.
    * I am asked to provide the delivery address. After completion I click "Proceed to Payment".
    * I am redirected to the payment page where I introduce my card information. I click "Pay".
    * I am redirected to the success page.
    * Yay!

## PageSpeed Insights

**Identified Loading speed of the web page:**
* On mobile - 31
* On desktop - 85

**Opportunities for improvement:**
* Reduce initial server response time - would save 0.84s. - to be fixed in the next sprint.
* Serve static assets with an efficient cache policy  -  to be fixed in the next sprint.
* In case of the low speed on mobile, in the future we will implement react code splitting in order to load only the necessary data at a time. - to be fixed in the next sprint.
    
## Django Testing

In our back-end we use django test to test our views. Every application has at least a test in the corresponding test folder.
