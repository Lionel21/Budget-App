/**
 * Module declaration with an IIFE
 * Remark : the two modules are completely independent => they will not be interactions between them
 * The controllers don't know the other one exists
 * Budget controller
 */

var budgetController = (function() {

    // Function constructor (use a capital at the begenning) for the expense
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Function constructor for the income
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Array creations to set up datas in there => not a good practice (need to have a big structure for everything)
    // var allExpenses = [];
    // var allIncomes = [];
    // var totalExpenses = [];

    // Object creation => better solution
    // Private variable
    var data = {
        // Create an object into an object
        allItems: {
            expenses: [],
            incomes: []
        },
        // Create a total object
        totals: {
            expenses: 0,
            incomes: 0
        },
    };

    // Adding a new Item
    // Public method
    return {
        // To avoid some confusions : change a little the parameter names
        addItem: function(type, des, val) {
            var newItem, ID;

            // How to create a unique ID?
            // First possibility:
            // [1, 2, 3, 4, 5], next ID = 6;

            // But it's a big problem, because if we delete an item, we'Il have an array like this
            // [0, 1, 2, 4, 6, 91], next ID should be 92 (and not 3) : that's the number that comes after the last one

            // What we really want:
            // ID = last ID + 1

            // Create new ID
            // First: we want to select our last item element
            // Second: calculate the allItems array and adding + 1 into the id

            // If data is empty, nothing can be add according this: ID  = data.allItems[type][data.allItems[type].length - 1].id + 1; because there is nothing...
            // ... so it's an error
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }




            // Create new item based on "expenses" and on "incomes" type
            // Conditions to verify if the new item is an expense or an income, and create a new object according the item
            if (type === 'expenses') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'incomes') {
                newItem = new Income(ID, des, val);
            }

            // Push the new item into our data structure
            // Type = expenses or incomes which come from the addItem function (parameter)
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },

        // Creation of a function for testing the data object
        testing: function() {
            console.log(data);
        }

    };

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

    // Public method
    return {
        getinput: function() {
            // Return an object instead three variables
            return {
                //.value => read the value of the selector
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
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

    var setupEventListeners = function() {

        // GetDOMstrings function into the UIController
        var DOM = UIController.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrtAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13 ) {
                ctrtAddItem();
            }
        });
    };



    var ctrtAddItem = function() {

        var input, newItem

          // TO DO list
          // 1. Get the field input data (récupérer les données d'entrées)

            input = UICtrl.getinput();
            console.log(input);

          // 2. Add the item to the budget controller

            newItem = budgetController.addItem(input.type, input.description, input.value);
            console.log(newItem);

          // 3. Add the new item to the user interface

          // 4. Calculate the budget

          // 5. Display the budget on the User Interface

    };

    return {
        init: function() {
            console.log('Application has started');
            setupEventListeners();
        },
    }


})(budgetController, UIController);

dataController.init();