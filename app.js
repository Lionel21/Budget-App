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
        this.percentage = - 1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {

        /**
         * Condition pour ne pas diviser par zéro
         */
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    /**
     * @returns {number}
     * Méthode qui permet de renvoyer le pourcentage de l'objet
     */
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    // Function constructor for the income
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
        budget: 0,
        /**
         * The mines 1 means that is an income or an expense don't exist, there is no percentage automatically
         */
        percentage : -1

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


        /**
         * Création d'une méthode pour supprimer un budget
         * type => représente le tableau de nos objets
         */
        deleteItem: function(type, id) {
            var ids, index;

            // ids = [1 2 4 6 8]
            // id = 6 (comment faire pour supprimer 6 sachant que l'index = 3 ?)
            // data.allItems[type][id]; <= pas la bonne méthode

            // On avait utilié la méthode .forEach. La méthode .map est très similaire
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function() {

            // Calculate total income and expenses

            /**
             * I use the calculateTotal method into my expenses et my incomes
             */
            calculateTotal('expenses');
            calculateTotal('incomes');

            // Calculate the budget: income - expenses

            /**
             * @type {number}
             * Get the data into our data structure
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
         * Méthode pour calculer les pourcentages
         */
        calculatePercentages: function() {

            // fonction() => callback fonction
            // cur => variable actuelle
            data.allItems.expenses.forEach(function(cur) {
                cur.calcPercentage(data.totals.incomes);
            });
        },

        // On récupère les pourcentages
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

    // Private object
    // Good practice : insert differents value and call them back into our querySelector...
    // ... if we want to change our values, it can be done with this practice, avoid bugs and can change them easily
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
        expPercentages: '.item__percentage'
    };

    /**
     *
     * @param number
     * @param type = nature de l'opérateur
     * Méthode pour formater les chiffres
     */
    var formatNumber = function(number, type) {
        var numberSplit, integerPart, decimalPart, type;

        /**
         * + ou -avant le nombre
         * Obtenir deux décimaux
         * Obtenir unr virgule pour séparer les milliers
         *
         * Exemple : 2310.4567 => + 2,310.46
         */

        // Valeur absolue
        number = Math.abs(number);

        // Valeur décimale
        number = number.toFixed(2);

        numberSplit = number.split('.');

        integerPart = numberSplit[0];

        // Rappel : integerPart est une chaîne de caractères qui se situe dans un tableau => donc on peut accéder la propriété length
        if (integerPart.length > 3) {
            // Pas la bonne méthode : car si le input = 23410 => output = 2,3410
            // integerPart = integerPart.substr(0, 1) + ',' + integerPart.substr(1, 3); // Input 2310, output 2,310


            integerPart = integerPart.substr(0, integerPart.length - 3) + ',' + integerPart.substr(integerPart.length - 3, integerPart.length); // input 23410 => output : 23,410
        }

        decimalPart = numberSplit[1];

        // Si le type est égal à 'expenses', alors le site est '-', sinon le signe est '+'
        // type === 'exp' ? sign = '-' : sign = '+';
        //
        // return type + ' ' + integerPart + '.' + decimalPart;
        return (type === 'expenses' ? '-' : '+') + ' ' + integerPart + '.' + decimalPart;
    };

    // Public method
    return {
        getinput: function() {
            // Return an object instead three variables
            return {
                //.value => read the value of the selector
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMstrings.descriptionType).value,
                /**
                 * The value bellow read the input into a string, but we want an integer for the calculates
                 * parseFloat() convert a string to a floating number
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
            // Remember : the id property is the one contained by our function constructors

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));




            // Insert the HTML into the DOM

            // Remember : element refers to the DOMstrings elements
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        /**
         * Méthode pour supprimer un budget
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

        // Méthode pour mettre à jour l'interface utilisateur
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
         * Méthode pour afficher les pourcentages sur l'interface utilisateur
         */
        displayPercentages: function(percentages) {

            var fields = document.querySelector(DOMstrings.expPercentages);

            var nodeListForEach = function(list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

            nodeListForEach(fields, function(current, index) {

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });

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

    };


    var updateBudget = function() {

        // 1. Calculate the budget

        budgetCtrl.calculateBudget();

        // 2. Return the budget (with a method), and nothing else (just a return)

        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the User Interface

        /**
         * On retourne l'objet budget en paramètre
         */
        UICtrl.displayBudget(budget);
    };

    /**
     * Méthode pour mettre à jour les pourcentages de chaque revenu dépensé
     */
    var updatePercentages = function() {

        // 1. Calculer les pourcentages
        budgetCtrl.calculatePercentages();

        // 2. Lire les pourcentages à partir du controller du budget
        var percentages = budgetCtrl.getPercentages();

        // 3. Mettre à jour l'interface utilisateur avec les pourcentages
        UIController.displayPercentages(percentages);

    };

    var ctrtAddItem = function() {

        var input, newItem

          // TO DO list
          // 1. Get the field input data (récupérer les données d'entrées)

            input = UICtrl.getinput();
            console.log(input);

            if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
                // 2. Add the item to the budget controller

                newItem = budgetController.addItem(input.type, input.description, input.value);
                console.log(newItem);

                // 3. Add the new item to the user interface

                // We pass the newItem that it was created
                UIController.addListItem(newItem, input.type);

                // 4. Clear the fields
                UIController.clearFields();

                // 5. Calculate and update budget
                updateBudget();

                // 6. Calculer et mettre à jour les pourcentages
                updatePercentages();
            }

        };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        // On précise l'id pour sélectionner un élément unique
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            // Format d'affichage de l'id : inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Supprimer un budget à partir de notre structure de données

            budgetCtrl.deleteItem(type, ID);

            // 2. Supprimer un budget à partir de l'interface utilisateur

            UICtrl.deleteListItem(itemID);

            // 3. Mettre à jour le nouveau budget total
            updateBudget();

            // 4. Mettre à jour les pourcentages
            updatePercentages();

        }
    };

    return {
        init: function() {
            console.log('Application has started');
            // Copie de cette méthode pour tout réinitialiser à zéro à chaque rechargement de page
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