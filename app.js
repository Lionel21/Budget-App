/**
 * Module declaration with an IIFE
 * Remark : the two modules are completely independent => they will not be interactions between them
 * The controllers don't know the other one exists
 * Budget controller
 */

var budgetController = (function() {
    
    // Some code

})();

/**
 * UI Controller
 */
var UIController = (function() {

    // We'Il write some code later

})();

/**
 * Global App Controller
 * @type {{anotherPublic: dataController.anotherPublic}}
 */
var dataController = (function(budgetCtrl, UICtrl) {

    var ctrtAddItem = function() {

        /**
         * TO DO list
         * 1. Get the field input data (récupérer les données d'entrées)
         * 2. Add the item to the budget controller
         * 3. Add the new item to the user interface
         * 4. Calculate the budget
         * 5. Display the budget on the User Interface
         */

        console.log('It works');

    }

    document.querySelector('.add__btn').addEventListener('click', ctrtAddItem);

    document.addEventListener('keypress', function(event) {

        if (event.keyCode === 13 || event.which === 13 ) {
            ctrtAddItem();

        }
    });


})(budgetController, UIController);

