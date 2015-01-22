#E-wallet

##notes:

* JS logic in AngularJS
* persistence implemented using localStorage (assuming a modern browser)
* visuals and responsive navbar implemented using Twitter Bootstrap

##implementation considerations:

* layers of logic (storage, business logic, presentation) separated into services
* potentially reusable components implemented as directives
* wallet service uses asynchronous logic ($q promises) for easier replacement of local storage with a more realistic network persistence setup

##todos (if more time allowed & assuming production environment/app growth):

* setup test environment and add unit test coverage
* manage vendor scripts using something like Bower
* minify JS resources
* add AngularUI router
* make it look less like a dog's dinner

##time taken

~5 hours