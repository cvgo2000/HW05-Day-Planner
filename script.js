$(document).ready(function() {
    // Sets text content of HTML element with id of currentDay to today's date using moment.js per my tutor's suggestion
    $("#currentDay").text(moment().format("dddd, MMMM Do"));

    // Array for time - used to dynamically create time blocks on the page
    const timeArr = ["9", "10", "11", "12", "13", "14", "15", "16", "17"];

    // Assigning container div to variable, to grab and append to at the end of loop below
    var mainDisplay = $("#displayContent");

    // Creating an empty array to store user input for todos
    var todoList = [];

    // Loops through timeArr to dynamically create display
    timeArr.forEach((element, index) => {
        // ROW: create div row containing each time block
        var newRow = $("<div>").addClass("row");

        // Create column div for first column with time (2 blocks)
        var col1 = $("<div>").addClass("col-sm-2 time-block hour");
            // sets text to AM or PM based on array element/time
            if(element <= 11) {
                col1.text(`${element}AM`);
            }
            else if (element == 12){
                col1.text(`${element}PM`);
            }
            else {
                col1.text(`${element-12}PM`);
            }

        // Create column div for second column with text area (9 blocks)
        var col2 = $("<textarea>").addClass("col-sm-9 row text-column");
        col2.attr("id", "col-text-"+element);
            // checks current hour and sets column class to past, present, or future based on the time
            if(element === moment().hour()) {
                col2.addClass("present");
            }
            else if(element < moment().hour()) {
                col2.addClass("past");
            }
            else {
                col2.addClass("future");
            }

        // Create column div for third column with save button (1 block)
        var col3 = $("<button type='submit'>").addClass("col-sm-1 saveBtn");
        col3.attr("value", element);
        col3.append($("<i class='fas fa-save'>"));

        // Appends newly created columns to newly created row, and then appending row to container div
        newRow.append(col1);
        newRow.append(col2);
        newRow.append(col3);
        mainDisplay.append(newRow);
    });

    // Adding event listener to save buttons
    $("button").on("click", saveToLocalStorage);

    // Saves value of user input to local storage whenever save is clicked
    function saveToLocalStorage() {
        var todoObject = {
            hour: $(this).val(),
            todo: $("#col-text-"+$(this).val()).val()
        }
        // Pushes newly created todoObject to todoList array, then sets the todoList array to localStorage
            todoList.push(todoObject);
            localStorage.setItem("todoList", JSON.stringify(todoList));
    }

    // If local storage contains data, this retrieves the data and displays it
    function renderToDoList() {
        var storedTodos = JSON.parse(localStorage.getItem("todoList"));
        if(storedTodos !== null) {
            todoList = storedTodos;

            todoList.forEach((element, index) => {
                $("#col-text-"+(todoList[index].hour)).text(todoList[index].todo);
            });
        }
    }

    renderToDoList();

    // Event listener for triple click, will ask user if they want to delete todo
    $(".text-column").on('click', function(event) {
        if (event.detail === 3) {
            if(confirm("Are you sure you want to delete this item?")) {
                var columnToDelete = $(this).attr("id");
                todoList = $.grep(todoList, function(e) {
                    return e.hour != columnToDelete.slice(9);
                })
                localStorage.setItem("todoList", JSON.stringify(todoList));
                $(this).val("");
            }
        }
    });
});
