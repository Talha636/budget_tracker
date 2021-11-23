let db;
let budgetVersion;

const request = indexedDB.open('budget', 1);

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('budget', { autoIncrement: true });
};

request.onerror = (error) => {
    console.log(error.target.errorCode);
};

request.onsuccess = (success) => {
    db = success.target.result;
    if (navigator.onLine) {
        checkDatabase();
    }
};

checkDatabase = () => {
    const transaction = db.transaction(['budget'], 'readwrite');
    const store = transaction.objectStore('budget');
    const getAll = store.getAll();
    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch('api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/jaon, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            }).then((res) => res.json())
            .then(() => {
                const transaction = db.transaction(['budget'], 'readwrite');
                const store = transaction.objectStore('budget');
                store.clear();
            })
        }
    }
}

window.addEventListener('online', checkDatabase);