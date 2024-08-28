document.addEventListener('DOMContentLoaded', loadDonors);

document.getElementById('donate-form').addEventListener('submit', function(e) {
    e.preventDefault();

    if (!validateConditions()) {
        alert("You can't donate blood as you do not meet all the conditions.");
        return;
    }

    const name = document.getElementById('name').value;
    const bloodGroup = document.getElementById('blood-group').value;
    const contact = document.getElementById('contact').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;

    const donor = {
        name,
        bloodGroup,
        contact,
        address,
        city
    };

    addDonorToList(donor);
    saveDonor(donor);
    this.reset();
});

function validateConditions() {
    const age = document.getElementById('age').checked;
    const weight = document.getElementById('weight').checked;
    const health = document.getElementById('health').checked;
    const donationInterval = document.getElementById('donation-interval').checked;
    const disease = document.getElementById('disease').checked;

    return age && weight && health && donationInterval && disease;
}

function loadDonors() {
    const donors = getDonors();
    donors.forEach(donor => addDonorToList(donor));
}

function addDonorToList(donor) {
    const donorList = document.getElementById('donor-list');
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        ${donor.name} - ${donor.bloodGroup} - ${donor.contact} - ${donor.address} - ${donor.city}
        <button class="delete-btn" onclick="deleteDonor(this)">Delete</button>
    `;
    donorList.appendChild(listItem);
}

function saveDonor(donor) {
    const donors = getDonors();
    donors.push(donor);
    localStorage.setItem('donors', JSON.stringify(donors));
}

function getDonors() {
    const donors = localStorage.getItem('donors');
    return donors ? JSON.parse(donors) : [];
}

function deleteDonor(button) {
    const listItem = button.parentElement;
    const donorInfo = listItem.textContent.replace('Delete', '').trim().split(' - ');
    const donor = {
        name: donorInfo[0],
        bloodGroup: donorInfo[1],
        contact: donorInfo[2],
        address: donorInfo[3],
        city: donorInfo[4]
    };

    const donors = getDonors();
    const index = donors.findIndex(d => 
        d.name === donor.name && 
        d.bloodGroup === donor.bloodGroup && 
        d.contact === donor.contact && 
        d.address === donor.address && 
        d.city === donor.city
    );
    if (index !== -1) {
        donors.splice(index, 1);
        localStorage.setItem('donors', JSON.stringify(donors));
    }

    listItem.remove();
}

document.getElementById('search').addEventListener('input', function() {
    const query = this.value.toUpperCase();
    const donors = document.getElementById('donor-list').getElementsByTagName('li');
    
    Array.from(donors).forEach(function(donor) {
        const bloodGroup = donor.textContent.split(' - ')[1];
        if (bloodGroup.toUpperCase().indexOf(query) > -1) {
            donor.style.display = '';
        } else {
            donor.style.display = 'none';
        }
    });
});
