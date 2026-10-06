$(document).ready(function () {
    const table = $('#myTable').DataTable();
    let selectedId = null;

   $('#myTable tbody').on('click', 'tr', function () {
                table.$('tr.selected-row').removeClass('selected-row');
                $(this).addClass('selected-row');
                selectedId = $(this).find('td:first-child').text().trim();
            });

    function getTableName() {
        const path = window.location.pathname;
        if (path.includes("users")) return "users";
        if (path.includes("services")) return "services";
        if (path.includes("employees")) return "employees";
        if (path.includes("admin-dashboard")) return "appointments";
        return "";
    }

    $('.button button:contains("Update"), button#updateBtn').on('click', function () {
        if (!selectedId) return alert("You have to click on an ID!");

        const $row = $('.selected-row');
        const updatedData = { id: selectedId };

        $row.find('.editable').each(function () {
            const field = $(this).data('field');
            const value = $(this).text().trim();
            updatedData[field] = value;
        });

        $row.find('select').each(function () {
            const field = $(this).data('field');
            updatedData[field] = $(this).val();
        });

        fetch('/auth/update-record', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ table: getTableName(), data: updatedData })
        })
        .then(res => res.json())
        .then(res => {
            alert(res.message);
            location.reload();
        });
    });

    $('.button button:contains("Delete"), button#deleteBtn').on('click', function () {
        if (!selectedId) return alert("You have to click on an ID!");

        if (confirm(`Are you sure you want to delete this ${selectedId} user?`)) {
            fetch('/auth/delete-record', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ table: getTableName(), id: selectedId })
            })
            .then(res => res.json())
            .then(res => {
                alert(res.message);
                location.reload();
            });
        }
    });
});