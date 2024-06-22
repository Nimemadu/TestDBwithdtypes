 document.addEventListener('DOMContentLoaded', function() {
    const tables = {};
    let currentTableName = '';
    let currentRowIndex = -1;

    const createTableForm = document.getElementById('create-table-form');
    const tablesContainer = document.getElementById('tables-container');
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const closeModalBtn = document.getElementsByClassName('close')[0];

    createTableForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const tableName = document.getElementById('table-name').value.trim();
        const fields = document.querySelectorAll('.field-container');

        const fieldArray = [];
        fields.forEach(field => {
            const fieldName = field.querySelector('.field-name').value.trim();
            const fieldType = field.querySelector('.field-type').value;
            if (fieldName) {
                fieldArray.push({ name: fieldName, type: fieldType });
            }
        });

        if (tableName && fieldArray.length > 0) {
            tables[tableName] = {
                fields: fieldArray,
                data: []
            };

            renderTables();
        }
    });

    document.getElementById('add-field').addEventListener('click', function() {
        addFieldInput();
    });

    function addFieldInput() {
        const fieldContainer = document.createElement('div');
        fieldContainer.classList.add('field-container');

        const fieldNameInput = document.createElement('input');
        fieldNameInput.type = 'text';
        fieldNameInput.placeholder = 'Field Name';
        fieldNameInput.classList.add('field-name');
        fieldNameInput.required = true;

        const fieldTypeSelect = document.createElement('select');
        fieldTypeSelect.classList.add('field-type');
        const optionString = document.createElement('option');
        optionString.value = 'string';
        optionString.text = 'String';
        const optionDate = document.createElement('option');
        optionDate.value = 'date';
        optionDate.text = 'Date';
        const optionNumber = document.createElement('option');
        optionNumber.value = 'number';
        optionNumber.text = 'Number';
        fieldTypeSelect.appendChild(optionString);
        fieldTypeSelect.appendChild(optionDate);
        fieldTypeSelect.appendChild(optionNumber);

        fieldContainer.appendChild(fieldNameInput);
        fieldContainer.appendChild(fieldTypeSelect);

        document.getElementById('fields-container').appendChild(fieldContainer);
    }

    function renderTables() {
        tablesContainer.innerHTML = '';

        for (const tableName in tables) {
            const table = tables[tableName];
            const accordion = document.createElement('button');
            accordion.classList.add('accordion');
            accordion.textContent = tableName;

            const panel = document.createElement('div');
            panel.classList.add('panel');

            const addDataForm = document.createElement('form');
            addDataForm.classList.add('add-data-form');

            table.fields.forEach(field => {
                const label = document.createElement('label');
                label.textContent = field.name;

                const input = document.createElement('input');
                input.type = field.type;
                input.name = field.name;
                input.required = true;

                addDataForm.appendChild(label);
                addDataForm.appendChild(input);
            });

            const addButton = document.createElement('button');
            addButton.type = 'submit';
            addButton.textContent = 'Add Row';

            addDataForm.appendChild(addButton);

            panel.appendChild(addDataForm);

            const tableElement = document.createElement('table');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            const headerRow = document.createElement('tr');
            table.fields.forEach(field => {
                const th = document.createElement('th');
                th.textContent = field.name;
                headerRow.appendChild(th);
            });
            const actionTh = document.createElement('th');
            actionTh.textContent = 'Actions';
            headerRow.appendChild(actionTh);
            thead.appendChild(headerRow);
            tableElement.appendChild(thead);
            tableElement.appendChild(tbody);

            panel.appendChild(tableElement);

            tablesContainer.appendChild(accordion);
            tablesContainer.appendChild(panel);

            accordion.addEventListener('click', function() {
                this.classList.toggle('active');
                const panel = this.nextElementSibling;
                if (panel.style.display === 'block') {
                    panel.style.display = 'none';
                } else {
                    panel.style.display = 'block';
                }
            });

            addDataForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const newData = {};
                table.fields.forEach(field => {
                    newData[field.name] = this[field.name].value;
                });
                table.data.push(newData);
                renderTableData(tableName, table, tbody);
                this.reset();
            });

            renderTableData(tableName, table, tbody);
        }
    }

    function renderTableData(tableName, table, tbody) {
        tbody.innerHTML = '';

        table.data.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');
            table.fields.forEach(field => {
                const td = document.createElement('td');
                td.textContent = row[field.name];
                tr.appendChild(td);
            });
            const actionTd = document.createElement('td');

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', function() {
                currentTableName = tableName;
                currentRowIndex = rowIndex;
                openEditModal(row, table.fields);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                table.data.splice(rowIndex, 1);
                renderTableData(tableName, table, tbody);
            });

            actionTd.appendChild(editButton);
            actionTd.appendChild(deleteButton);
            tr.appendChild(actionTd);

            tbody.appendChild(tr);
        });
    }

    function openEditModal(rowData, fields) {
        editForm.innerHTML = '';

        fields.forEach(field => {
            const label = document.createElement('label');
            label.textContent = field.name;

            const input = document.createElement('input');
            input.type = field.type;
            input.name = field.name;
            input.value = rowData[field.name];
            input.required = true;

            editForm.appendChild(label);
            editForm.appendChild(input);
        });

        const saveButton = document.createElement('button');
        saveButton.type = 'submit';
        saveButton.textContent = 'Save';

        editForm.appendChild(saveButton);

        editModal.style.display = 'block';

        editForm.onsubmit = function(e) {
            e.preventDefault();
            const updatedData = {};
            fields.forEach(field => {
                updatedData[field.name] = this[field.name].value;
            });

            tables[currentTableName].data[currentRowIndex] = updatedData;
            renderTables();
            editModal.style.display = 'none';
        };
    }

    closeModalBtn.onclick = function() {
        editModal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    };

    addFieldInput(); // Initial field input to start with
});
