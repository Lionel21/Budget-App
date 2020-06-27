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

    // Private object
    // Good practice : insert differents value and call them back into our querySelector...
    // ... if we want to change our values, it can be done with this practice, avoid bugs and can change them easily
    var DOMstrings = {
        inputType: '.add__type',
        descriptionType: '.add__description',
        valueType: '.add__value',
        inputBtn : '.add__btn'
    };

    // Public object
    return {
        getinput: function() {
            // Return an object instead three variables
            return {
                //.value => read the value of the selector
                type: document.querySelector(DOMstrings.inputType).value, // Will be either income or expensive
                description: document.querySelector(DOMstrings.descriptionType).value,
                value: document.querySelector(DOMstrings.valueType).value
            };
        },

        // Expose the DOMstrings object into the public
        getDOMstrings: function() {
            return DOMstrings;
        }
    };


})();

/**
 * Global App Controller
 * @type {{anotherPublic: dataController.anotherPublic}}
 */
var dataController = (function(budgetCtrl, UICtrl) {

    // GetDOMstrings function into the UIController
    var DOM = UIController.getDOMstrings();

    var ctrtAddItem = function() {


          // TO DO list
          // 1. Get the field input data (récupérer les données d'entrées)

            var input = UICtrl.getinput();
            console.log(input);

          // 2. Add the item to the budget controller
          // 3. Add the new item to the user interface
          // 4. Calculate the budget
          // 5. Display the budget on the User Interface

    }

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrtAddItem);

    document.addEventListener('keypress', function(event) {

        if (event.keyCode === 13 || event.which === 13 ) {
            ctrtAddItem();

        }
    });


})(budgetController, UIController);

