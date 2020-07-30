/**
 * Module declaration with an IIFE
 * Remark : the two modules are completely independent => they will not be interactions between them
 * The controllers don't know the other one exists
 */

var budgetController = (function() {

    /**
     * Constructor for the expense
     * @param id
     * @param description
     * @param value
     * @constructor
     */
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = - 1;
    };

    /**
     *
     * @param totalIncome
     */
    Expense.prototype.calcPercentage = function(totalIncome) {

        // Condition not to divide on zero
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    /**
     * Method who allow to send back the percentage object
     * @returns {number}
     */
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    /**
     * Constructor for the incomes
     * @param id
     * @param description
     * @param value
     * @constructor
     */
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });

        data.totals[type] = sum;
    };

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
        budget: 0,
        // The mines 1 means that is an income or an expense don't exist, there is no percentage automatically
        percentage : -1

    };

    // Adding a new Item
    // Public method
    return {
        addItem: function(type, des, val) {
            var newItem, ID;

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


        /**
         * Creation of a method to delete a budget
         */
        deleteItem: function(type, id) {
            var ids, index;

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {

            /**
             * Using the calculateTotal method into the expenses et the incomes
             */
            calculateTotal('expenses');
            calculateTotal('incomes');

            // Calculate the budget: income - expenses

            /**
             * Get the data into our data structure
             * @type {number}
             */
            data.budget = data.totals.incomes - data.totals.expenses;

            // Calculate the percentage of income that we spent

            /**
             * Avoid the division by 0
             */
            if (data.totals.incomes > 0) {
                data.percentage = Math.round((data.totals.expenses / data.totals.incomes)) * 100;
            } else {
                data.percentage = -1;
            }

        },

        /**
         * Method to calculate the percentages
         */
        calculatePercentages: function() {

            data.allItems.expenses.forEach(function(cur) {
                cur.calcPercentage(data.totals.incomes);
            });
        },

        // Get the percentages
        getPercentages: function() {
            var allPerc = data.allItems.expenses.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        /**
         * Method who will only return something from our data structure
         */
        getBudget: function() {
            return {
                budget: data.budget,
                totalIncome: data.totals.incomes,
                totalExpense: data.totals.expenses,
                percentage: data.percentage
            }
        },

        // Creation of a function for testing the data object
        testing: function() {
            console.log(data);
        }
    };
})();

/**
 * UI Controller method
 */
var UIController = (function() {

    var DOMstrings = {
        inputType: '.add__type',
        descriptionType: '.add__description',
        valueType: '.add__value',
        inputBtn : '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expPercentages: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    /**
     *
     * @param number
     * @param type = nature de l'opérateur
     * Method to formate the type
     */
    var formatNumber = function(number, type) {
        var numberSplit, integerPart, decimalPart, type;

        // Absolute value
        number = Math.abs(number);

        // Decimal value
        number = number.toFixed(2);
        numberSplit = number.split('.');
        integerPart = numberSplit[0];

        // Reminder : integerPart is a string  which is located in an array => so we can use the length property
        if (integerPart.length > 3) {
            integerPart = integerPart.substr(0, integerPart.length - 3) + ',' + integerPart.substr(integerPart.length - 3, integerPart.length); // input 23410 => output : 23,410
        }

        decimalPart = numberSplit[1];

        return (type === 'expenses' ? '-' : '+') + ' ' + integerPart + '.' + decimalPart;
    };

    /**
     * @param list
     * @param callback
     */
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    // Public method
    return {
        getinput: function() {
            // Return an object instead three variables
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMstrings.descriptionType).value,

                /**
                 * The value bellow read the input into a string, but we want an integer for the calculates
                 */
                value: parseFloat(document.querySelector(DOMstrings.valueType).value)
            };
        },

        // Adding new items into our user interface
        // What do we need? The object itself and the type of the bill
        addListItem: function(obj, type) {

            var html, newHtml, element;
            // Create an HTML string with placeholder text

            if (type === 'incomes') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="incomes-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'expenses') {
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="expenses-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with some actual data
            // Reminder : the id property is the one contained by our constructors

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert the HTML into the DOM
            // Remember : element refers to the DOMstrings elements
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        /**
         * Method for delete a budget
         */
        deleteListItem: function(selectorID) {
            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },

        // Public method
        // Clean the data inputs after a submit
        clearFields: function() {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.descriptionType + ', ' +  DOMstrings.valueType);

            // The Array prototype will return an array for the fields variable
            // We can now loop on this array and clear all the fields that were selected
            fieldsArray = Array.prototype.slice.call(fields);

            // This method moves over all of the elements of the fields array
            fieldsArray.forEach(function(currentValue, currentIndex, originalArray) {
                // The fields will be simply be cleared
                // forEach sets the values all of them back to an empty string
                currentValue.value = "";
            });

            // After a submit => go back to the first input to enter a new data
            fieldsArray[0].focus();
        },

        /**
         * Method for update the user interface
         * @param object
         */
        displayBudget: function(object) {
            var type;
            object.budget > 0 ? type = 'incomes' : type = 'expenses';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(object.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(object.totalIncome, 'incomes');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(object.totalExpense, 'expenses');

            if (object.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = object.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        /**
         * Method to display the percentages on the user interface
         */
        displayPercentages: function(percentages) {

            var fields = document.querySelectorAll(DOMstrings.expPercentages);

            nodeListForEach(fields, function(current, index) {

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });

        },

        /**
         * Method to display the current month and year
         */
        displayMonth: function() {
            var currentDate, month, months, year;

            currentDate = new Date();

            // Trick to get the month names instead to get the numbers
            months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
            month = currentDate.getMonth();
            year = currentDate.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' +  year;

        },

        /**
         * Méthode pour effectuer quelques modifications de styles au niveau de l'interface utilisateur
         */
        changedType: function() {

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.descriptionType + ',' +
                DOMstrings.valueType);

            nodeListForEach(fields, function(current) {
                current.classList.add('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },

        // Expose the DOMstrings object into the public
        getDOMstrings: function(object) {
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };


    var updateBudget = function() {

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget (with a method), and nothing else (just a return)
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the User Interface
        UICtrl.displayBudget(budget);
    };

    /**
     * Method to update the percentages on every income spent
     */
    var updatePercentages = function() {

        // 1. Percentage calculations
        budgetCtrl.calculatePercentages();

        // 2. Read the percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. Update the user interface with the percentages
        UIController.displayPercentages(percentages);

    };

    var ctrtAddItem = function() {

        var input, newItem

          // TO DO list
          // 1. Get the field input data (récupérer les données d'entrées)
            input = UICtrl.getinput();

            if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
                // 2. Add the item to the budget controller

                newItem = budgetController.addItem(input.type, input.description, input.value);

                // 3. Add the new item to the user interface
                // Passing the newItem that it was created
                UIController.addListItem(newItem, input.type);

                // 4. Clear the fields
                UIController.clearFields();

                // 5. Calculate and update budget
                updateBudget();

                // 6. Update the percentages
                updatePercentages();
            }
        };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        // Specify the id to select a unique element
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            // Format to display the id: inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Delete a budget from our data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete a budget from the user interface
            UICtrl.deleteListItem(itemID);

            // 3. Update the new total budget
            updateBudget();

            // 4. Update the percentages
            updatePercentages();

        }
    };

    return {
        init: function() {
            UICtrl.displayMonth();
            // Reset the elements on each page load
            UICtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpense: 0,
                percentage: -1
            });
            setupEventListeners();
        },
    }


})(budgetController, UIController);

dataController.init();