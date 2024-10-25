// Função para salvar dados no Local Storage e carregar os dados salvos
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// Função para adicionar uma nova linha à tabela e salvar no Local Storage
function addRow(listId, form, storageKey) {
    const table = document.getElementById(listId).querySelector('tbody');
    const formData = {};
    for (let i = 0; i < form.elements.length; i++) {
        if (form.elements[i].name) {
            formData[form.elements[i].name] = form.elements[i].value;
        }
    }

    const dataList = loadFromLocalStorage(storageKey);
    dataList.push(formData);
    saveToLocalStorage(storageKey, dataList);
    
    updateTable(listId, storageKey);
    form.reset();
}

// Função para carregar os dados salvos no Local Storage e preencher a tabela
function updateTable(listId, storageKey) {
    const table = document.getElementById(listId).querySelector('tbody');
    const dataList = loadFromLocalStorage(storageKey);
    
    table.innerHTML = ''; // Limpa a tabela

    dataList.forEach((data, index) => {
        const newRow = table.insertRow();
        Object.values(data).forEach(value => {
            const newCell = newRow.insertCell();
            newCell.textContent = value;
        });
        const actionCell = newRow.insertCell();
        actionCell.classList.add('actions');
        actionCell.innerHTML = `<button class="button-edit" onclick="editRow('${listId}', '${storageKey}', ${index})">Alterar</button>
                                <button class="button-delete" onclick="deleteRow('${listId}', '${storageKey}', ${index})">Excluir</button>`;
    });
}

// Função para editar uma linha
function editRow(listId, storageKey, index) {
    const dataList = loadFromLocalStorage(storageKey);
    const form = document.querySelector(`#${listId.replace('List', 'Form')}`);
    const data = dataList[index];

    // Preenche o formulário com os dados da linha
    Object.keys(data).forEach(key => {
        form.querySelector(`[name="${key}"]`).value = data[key];
    });

    // Atualiza o botão "Confirmar" para salvar as edições
    form.onsubmit = function(event) {
        event.preventDefault();
        saveEditedRow(listId, form, storageKey, index);
    };
}

// Função para salvar a edição de uma linha
function saveEditedRow(listId, form, storageKey, index) {
    const dataList = loadFromLocalStorage(storageKey);
    const updatedData = {};
    for (let i = 0; i < form.elements.length; i++) {
        if (form.elements[i].name) {
            updatedData[form.elements[i].name] = form.elements[i].value;
        }
    }
    dataList[index] = updatedData;
    saveToLocalStorage(storageKey, dataList);
    updateTable(listId, storageKey);
    form.reset();

    // Reseta o comportamento do botão "Confirmar"
    form.onsubmit = function(event) {
        event.preventDefault();
        addRow(listId, form, storageKey);
    };
}

// Função para excluir uma linha
function deleteRow(listId, storageKey, index) {
    const dataList = loadFromLocalStorage(storageKey);
    dataList.splice(index, 1);
    saveToLocalStorage(storageKey, dataList);
    updateTable(listId, storageKey);
}

// Função para mostrar uma seção específica
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Função para carregar as tabelas com os dados salvos ao carregar a página
window.onload = function() {
    updateTable('maquinaList', 'maquinas');
    updateTable('recebimentoList', 'recebimentos');
    updateTable('contratoList', 'contratos');
    updateTable('contaList', 'contas');
    updateTable('empresaList', 'empresas');
};

// Configuração dos eventos de envio de formulário para cada seção
document.getElementById('maquinaForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addRow('maquinaList', this, 'maquinas');
});

document.getElementById('recebimentoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addRow('recebimentoList', this, 'recebimentos');
});

document.getElementById('contratoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addRow('contratoList', this, 'contratos');
});

document.getElementById('contaForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addRow('contaList', this, 'contas');
});

document.getElementById('empresaForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addRow('empresaList', this, 'empresas');
});

// Função para buscar na tabela
function searchInTable(listId, searchInputId) {
    const input = document.getElementById(searchInputId);
    const filter = input.value.toLowerCase();
    const table = document.getElementById(listId);
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');

    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        let rowContainsSearch = false;

        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            if (cell.textContent.toLowerCase().includes(filter)) {
                rowContainsSearch = true;
                break;
            }
        }
        row.style.display = rowContainsSearch ? '' : 'none';
    });
}

// Função para confirmar busca ao clicar no botão "Confirmar"
function confirmSearch(listId, searchInputId) {
    searchInTable(listId, searchInputId);
}
