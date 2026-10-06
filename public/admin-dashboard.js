$(document).ready(function () {
    const table = $('#myTable').DataTable();
    let selectedId = null;

    $('#myTable tbody').on('click', 'tr', function () {
                table.$('tr.selected-row').removeClass('selected-row');
                $(this).addClass('selected-row');
                selectedId = $(this).find('td:first-child').text().trim();
            });

    
    $('#deleteBtn').on('click', function () {
    if (!selectedId) return alert("You have to click on an ID!");

    if (confirm(`Are you sure you want to delete this ${selectedId} appointment?`)) {
        fetch('/auth/delete-record', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                table: 'appointments',
                id: selectedId 
            })
        })
        .then(res => res.json())
        .then(res => {
            alert(res.message);
            location.reload();
        })
        .catch(err => console.error("Error:", err));
    }
});
});