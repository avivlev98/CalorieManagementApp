document.addEventListener("DOMContentLoaded", async () => {
    const db = await idb.openCaloriesDB("caloriesdb", 1);

    const form = document.getElementById("calorie-form");
    const reportForm = document.getElementById("report-form");

    if (form && !form.dataset.eventAdded) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const calorie = parseInt(document.getElementById("calorie").value);
            const category = document.getElementById("category").value;
            const description = document.getElementById("description").value;
            const date = document.getElementById("date").value;

            const calorieItem = { calorie, category, description, date: new Date(date).toISOString() };

            try {
                const result = await idb.addCalories(calorieItem);
                if (result) {
                    alert("Calorie item added successfully.");
                    form.reset();
                }
            } catch (error) {
                alert(error);
            }
        });
        form.dataset.eventAdded = true;  // Flag to ensure event listener isn't added multiple times
    }

    if (reportForm && !reportForm.dataset.eventAdded) {
        reportForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const month = parseInt(document.getElementById("month").value);
            const year = parseInt(document.getElementById("year").value);

            try {
                const result = await idb.getCaloriesByMonthAndYear(month, year);
                const reportDiv = document.getElementById("report-results");
                reportDiv.innerHTML = "";

                if (result.length === 0) {
                    reportDiv.innerHTML = "<p>No calorie items found for this period.</p>";
                } else {
                    result.forEach(item => {
                        reportDiv.innerHTML += `
              <p>
                ${item.description}: ${item.calorie} calories (${item.category}) on ${new Date(item.date).toLocaleDateString()}
              </p>
            `;
                    });
                }
            } catch (error) {
                alert("Error generating report: " + error);
            }
        });
        reportForm.dataset.eventAdded = true;  // Flag to ensure event listener isn't added multiple times
    }
});
