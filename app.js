/*
1. first name: aviv , last name: levi, id: 319123287 .
2. first name: mor , last name: moshe, id: 208658880 .
*/

document.addEventListener("DOMContentLoaded", async () => {
    // event listener added when the DOM is fully loaded.
    const db = await idb.openCaloriesDB("caloriesdb", 1); // open or create the IndexedDB "caloriesdb".

    const form = document.getElementById("calorie-form"); // get the form for adding calorie items.
    const reportForm = document.getElementById("report-form"); // get the form for generating reports.

    if (form && !form.dataset.eventAdded) { 
        // if the form exists and the event listener is not already added, add one.
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            // collect form input values for calorie, category, description, and date.
            const calorie = parseInt(document.getElementById("calorie").value);
            const category = document.getElementById("category").value;
            const description = document.getElementById("description").value;
            const date = document.getElementById("date").value;

            // create an object for the new calorie item with date converted to ISO format.
            const calorieItem = { calorie, category, description, date: new Date(date).toISOString() };

            try {
                const result = await db.addCalories(calorieItem); // add the calorie item to the database.
                if (result) {
                    alert("Calorie item added successfully."); // alert success if the item was added.
                    form.reset(); // reset the form for future submissions.
                }
            } catch (error) {
                alert(error); // alert any errors that occur during the process.
            }
        });
        form.dataset.eventAdded = true;  // add a flag to prevent multiple event listener bindings.
    }

    if (reportForm && !reportForm.dataset.eventAdded) { 
        // if the report form exists and the event listener is not already added, add one.
        reportForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Prevent the default form submission behavior.

            // Collect form input values for month and year to generate the report.
            const month = parseInt(document.getElementById("month").value);
            const year = parseInt(document.getElementById("year").value);

            try {
                const result = await db.getCaloriesByMonthAndYear(month, year); // fetch calorie items for the given month and year.
                const reportDiv = document.getElementById("report-results"); // get the div to display the report results.
                reportDiv.innerHTML = ""; // clear any previous report results.

                if (result.length === 0) {
                    reportDiv.innerHTML = "<p>No calorie items found for this period.</p>"; // show a message if no results are found.
                } else {
                    result.forEach(item => {
                        // display each calorie item in the report with description, calories, category, and date.
                        reportDiv.innerHTML += `
                            <p>
                                ${item.description}: ${item.calorie} calories (${item.category}) on ${new Date(item.date).toLocaleDateString()}
                            </p>
                        `;
                    });
                }
            } catch (error) {
                alert("Error generating report: " + error); // alert any errors that occur during report generation.
            }
        });
        reportForm.dataset.eventAdded = true;  // add a flag to prevent multiple event listener bindings.
    }
});
