document.addEventListener('DOMContentLoaded', () => {
    const volunteerForm = document.getElementById('volunteer-form');
    const donorForm = document.getElementById('donor-form');
    const itemsList = document.getElementById('items-list');

    const loadItems = () => {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        itemsList.innerHTML = '';
        items.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.item} - ${item.count} (Address: ${item.address})</span>
                <button onclick="verifyDonation(${index})">Verify</button>
            `;
            itemsList.appendChild(li);
        });
    };

    const saveItems = (items) => {
        localStorage.setItem('items', JSON.stringify(items));
        loadItems();
    };

    volunteerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const item = document.getElementById('item').value;
        const count = parseInt(document.getElementById('count').value);
        const address = document.getElementById('address').value;

        const items = JSON.parse(localStorage.getItem('items')) || [];
        items.push({ item, count, address });
        saveItems(items);

        volunteerForm.reset();
    });

    donorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const donorName = document.getElementById('donor-name').value;
        const donateItem = document.getElementById('donate-item').value;
        const donateCount = parseInt(document.getElementById('donate-count').value);
        const phone = document.getElementById('phone').value;

        const items = JSON.parse(localStorage.getItem('items')) || [];
        const itemIndex = items.findIndex(item => item.item === donateItem);

        if (itemIndex > -1 && items[itemIndex].count >= donateCount) {
            items[itemIndex].count -= donateCount;

            if (items[itemIndex].count === 0) {
                items.splice(itemIndex, 1);
            }

            saveItems(items);

            alert(`Thank you, ${donorName}! Your donation of ${donateCount} ${donateItem}(s) has been received.`);
        } else {
            alert('Item not available or insufficient quantity.');
        }

        donorForm.reset();
    });

    window.verifyDonation = (index) => {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        items.splice(index, 1);
        saveItems(items);
    };

    loadItems();
});
