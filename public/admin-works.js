$(document).ready(function () {
            const table = $('#myTable').DataTable();
            let selectedId = null;

            function loadImages(callback) {
                fetch('/auth/get-images').then(res => res.json()).then(data => {
                    if (!data.success) return;

                    $('.image-selector').each(function () {
                        const $sel = $(this);
                        const currentVal = $sel.data('current') || ''; 

                        data.images.forEach(imgFilename => {
                            const imgPath = `/images/${imgFilename}`;
                            const $opt = new Option(imgFilename, imgPath);
                            if (currentVal === imgPath || currentVal === imgFilename) {
                                $opt.selected = true;
                            }
                            $sel.append($opt);
                        });

                        const $row = $sel.closest('tr');
                        const rowId = $row.find('td:first-child').text().trim();
                        const $thumb = rowId ? $(`#thumb-${rowId}`) : $('#thumb-new');

                        if ($sel.val()) {
                            $thumb.attr('src', $sel.val());
                        }
                    });

                    if (callback) callback();
                });
            }

            loadImages();

            $(document).on('change', '.image-selector', function () {
                const $sel = $(this);
                const selectedSrc = $sel.val();

                const $thumb = $sel.closest('td').find('img');

                if (selectedSrc) {
                    $thumb.attr('src', selectedSrc);
                } else {
                    $thumb.attr('src', '/images/favicon.png');
                }
            });

            $('#myTable tbody').on('click', 'tr', function () {
                table.$('tr.selected-row').removeClass('selected-row');
                $(this).addClass('selected-row');
                selectedId = $(this).find('td:first-child').text().trim();
            });
           $('#updateBtn').on('click', function () {
                if (!selectedId) return alert("Select a row first!");

                const $row = $('.selected-row');
                const updateData = { id: selectedId };

                $row.find('.editable').each(function () {
                    const field = $(this).data('field');
                    if (field) {
                        updateData[field] = $(this).text().trim();
                    }
                });

                $row.find('.image-selector').each(function () {
                    const field = $(this).data('field');
                    const val = $(this).val();
                    if (field) {
                        updateData[field] = val;
                    }
                });

                fetch('/auth/update-record', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ table: 'employees', data: updateData })
                }).then(res => res.json()).then(data => {
                    if (data.success) {
                        alert("Update successful!");
                        location.reload();
                    } else {
                        alert("Update failed.");
                    }
                });
            });


            $('#deleteBtn').on('click', function () {
                if (!selectedId || !confirm("Delete this employee?")) return;
                fetch('/auth/delete-record', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ table: 'employees', id: selectedId })
                }).then(() => location.reload());
            });
        });
