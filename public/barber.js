    $(document).ready(function () {
    $('#barberTable').DataTable({
        "columnDefs": [
            {
                "targets": 4,
                "render": function (data, type, row) {
                    if (data) {
                        return data.substring(0, 10);
                    }
                    return data;
                }
            }
        ],
        "order": [[4, "asc"], [5, "asc"]],
    });
});