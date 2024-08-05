document.getElementById('config').addEventListener('change', function() {
    const fileName = this.files.length > 0 ? this.files[0].name : 'No file chosen';
    document.getElementById('configFileName').textContent = fileName;
});

document.getElementById('input').addEventListener('change', function() {
    const fileName = this.files.length > 0 ? this.files[0].name : 'No file chosen';
    document.getElementById('inputFileName').textContent = fileName;
});

document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(this);
    
    fetch(this.action, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('responseData').textContent = JSON.stringify(data, null, 2); // Pretty-print JSON
        showModal('successModal');
    })
    .catch(error => {
        document.getElementById('errorMessage').textContent = error.message;
        showModal('errorModal');
    });
});

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function copyToClipboard() {
    const responseData = document.getElementById('responseData').textContent;
    navigator.clipboard.writeText(responseData).then(() => {
        alert('Response copied to clipboard!');
    }, err => {
        console.error('Failed to copy: ', err);
    });
}