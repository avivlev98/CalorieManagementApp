/*
1. first name: aviv , last name: levi, id: 319123287 .
2. first name: mor , last name: moshe, id: 208658880 .
*/

const idb = (function () {
    let db;

    // open the database and return an object with all methods
    function openCaloriesDB(dbName, version) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version);

            request.onupgradeneeded = function (event) {
                db = event.target.result;
                if (!db.objectStoreNames.contains("calories")) {
                    db.createObjectStore("calories", { keyPath: "id", autoIncrement: true });
                }
            };

            request.onsuccess = function (event) {
                db = event.target.result;
                console.log("Database opened successfully");

                // return an object with all functions once DB is ready
                resolve({
                    addCalories: addCalories,
                    getCaloriesByMonthAndYear: getCaloriesByMonthAndYear
                });
            };

            request.onerror = function (event) {
                reject("Error opening database: " + event.target.errorCode);
            };
        });
    }

    // add a new calorie item
    function addCalories(calorieItem) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["calories"], "readwrite");
            const store = transaction.objectStore("calories");
            const request = store.add(calorieItem);

            request.onsuccess = function () {
                resolve(true);
            };

            request.onerror = function () {
                reject("Error adding calorie item.");
            };
        });
    }

    // get calories by month and year
    function getCaloriesByMonthAndYear(month, year) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["calories"], "readonly");
            const store = transaction.objectStore("calories");
            const request = store.getAll();

            request.onsuccess = function (event) {
                const data = event.target.result;
                const filtered = data.filter(item => {
                    const itemDate = new Date(item.date);
                    return itemDate.getMonth() + 1 === month && itemDate.getFullYear() === year;
                });
                resolve(filtered);
            };

            request.onerror = function () {
                reject("Error fetching calorie data.");
            };
        });
    }

    return {
        openCaloriesDB
    };
})();

