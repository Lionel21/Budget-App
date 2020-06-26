/**
 * Module declaration with an IIFE
 * Remark : the two modules are completely independent => they will not be interactions between them
 * The controllers don't know the other one exists
 */

var budgetController = (function() {
    
    // Private variable
    var x = 23;

    // Private function (closure)
    var add = function(a) {
        return a + x;
    }

    // Return of an object (only the publicTest method can access to the x variable and add() function)
    return {
        publicTest: function(b) {
            return add(b);
        }
    }

})();


var UIController = (function() {

    // We'Il write some code later

})();

var dataController = (function(budgetCtrl, UICtrl) {

    // Some code later
    // We could pass the budgetController module like this in our dataController => but it's not a good practice...
    //... this would make the controller a little bit less independent...
    //... because if we want to change the name of budgetController(), we will just change it down in the invoke 
    // budgetController.publicTest();

    var z = budgetCtrl.publicTest(5);

    // Return a public object
    return {
        anotherPublic: function() {
            console.log(z);
        }
    }

    // Passing budgetController and UIController as arguments to invoke them immediately
})(budgetController, UIController);

