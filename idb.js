// idb.js

const idb = (function () {
    let db;

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
                resolve(db);
            };

            request.onerror = function (event) {
                reject("Error opening database: " + event.target.errorCode);
            };
        });
    }

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
        openCaloriesDB,
        addCalories,
        getCaloriesByMonthAndYear
    };
})();
