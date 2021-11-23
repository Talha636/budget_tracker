let db;
let budgetVersion;

const request = indexedDB.open('budget', 1);

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('budget', { autoIncrement: true });
    console.log('brr');
};

request.onerror = (error) => {
    console.log(error.target.errorCode);
    console.log('brr');
};

request.onsuccess = (success) => {
    db = success.target.result;
    if (navigator.onLine) {
        console.log('brr');
        checkDatabase();
    }
};

checkDatabase = () => {
    const transaction = db.transaction(['budget'], 'readwrite');
    const store = transaction.objectStore('budget');
    const getAll = store.getAll();
    console.log('brr');
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

let saveRecord = (transaction) => {
    const transaction = db.transaction(['budget'], 'readwrite');
    const store = transaction.objectStore('budget');
    store.clear(transaction);
}

window.addEventListener('online', chechDatabase);