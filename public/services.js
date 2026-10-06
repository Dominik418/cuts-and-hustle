$(document).ready(function () {
            const table = $('#myTable').DataTable();
            let selectedId = null;

            const intFields = ['price', 'duration_minutes'];

            function sanitizeData(data) {
                intFields.forEach(field => {
                    if (data[field] !== undefined) {
                        const num = parseInt(data[field]);
                        data[field] = isNaN(num) ? 0 : num;
                    }
                });
                return data;
            }


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
                const $row = $sel.closest('tr');
                const rowId = $row.find('td:first-child').text().trim();
                const $thumb = rowId && rowId !== 'New' ? $(`#thumb-${rowId}`) : $('#thumb-new');
                const val = $sel.val();
                $thumb.attr('src', val || '/images/favicon.png');
            });

            $('#myTable tbody').on('click', 'tr', function () {
                table.$('tr.selected-row').removeClass('selected-row');
                $(this).addClass('selected-row');
                selectedId = $(this).find('td:first-child').text().trim();
            });

            $('#updateBtn').on('click', function () {
                if (!selectedId) return alert("Select a row first!");
                const $row = $('.selected-row');
                let updateData = { id: selectedId };

                $row.find('.editable').each(function () {
                    updateData[$(this).data('field')] = $(this).text().trim();
                });

                updateData['pictures'] = $row.find('.image-selector').val();
                updateData = sanitizeData(updateData);

                fetch('/auth/update-record', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ table: 'services', data: updateData })
                }).then(res => res.json()).then(data => {
                    if (data.success) {
                        alert("Update successful!");
                        location.reload();
                    } else {
                        alert("Update failed.");
                    }
                });
            });

            $('#addBtn').on('click', () => {
                $('#newRecordRow').show();
                $('#saveNewBtn, #cancelBtn').show();
                $('#addBtn, #updateBtn, #deleteBtn').hide();
            });

            $('#cancelBtn').on('click', () => location.reload());

            $('#saveNewBtn').on('click', function () {
                let newData = {};
                $('#newRecordRow .new-editable').each(function () {
                    const $inputArea = $(this).find('.input-area');
                    const val = $inputArea.length ? $inputArea.text().trim() : $(this).text().trim();
                    newData[$(this).data('field')] = val;
                });
                newData['pictures'] = $('#newRecordRow .image-selector').val();
                newData = sanitizeData(newData);

                fetch('/auth/add-record', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ table: 'services', data: newData })
                }).then(res => res.json()).then(data => {
                    if (data.success) {
                        location.reload();
                    } else {
                        alert("Save failed.");
                    }
                });
            });

            $('#deleteBtn').on('click', function () {
                if (!selectedId || !confirm("Delete this service?")) return;
                fetch('/auth/delete-record', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ table: 'services', id: selectedId })
                }).then(() => location.reload());
            });
        });
