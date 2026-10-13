function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let soma = 0;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
    }

    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
        resto = 0;
    }

    if (resto !== parseInt(cpf.substring(9, 10), 10)) {
        return false;
    }

    soma = 0;

    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
        resto = 0;
    }

    return resto === parseInt(cpf.substring(10, 11), 10);
}

function calcularDigitoCNPJ(cnpj, pesos) {
    const soma = cnpj
        .split('')
        .reduce((total, caractere, index) => total + parseInt(caractere, 10) * pesos[index], 0);
    const resto = soma % 11;

    return resto < 2 ? 0 : 11 - resto;
}

function normalizarDocumento(documento) {
    return documento.replace(/\D/g, '');
}

function validarCNPJ(cnpj) {
    const documento = normalizarDocumento(cnpj);

    if (documento.length !== 14 || /^(\d)\1{13}$/.test(documento)) {
        return false;
    }

    const base = documento.substring(0, 12);
    const primeiroDigito = calcularDigitoCNPJ(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    const segundoDigito = calcularDigitoCNPJ(`${base}${primeiroDigito}`, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

    return documento === `${base}${primeiroDigito}${segundoDigito}`;
}

function validarDocumento(documento) {
    const valor = normalizarDocumento(documento);

    if (/^\d{11}$/.test(valor)) {
        return validarCPF(valor);
    }

    if (/^\d{14}$/.test(valor)) {
        return validarCNPJ(valor);
    }

    return false;
}

if (typeof document !== 'undefined') {
    const form = document.getElementById('cpfForm');
    const cpfInput = document.getElementById('cpfInput');
    const resultMessage = document.getElementById('resultMessage');
    const cpfButton = document.getElementById('cpfButton');
    const cnpjButton = document.getElementById('cnpjButton');
    let tipoDocumentoSelecionado = 'CPF';

    function selecionarTipoDocumento(tipo) {
        tipoDocumentoSelecionado = tipo;
        const ehCPF = tipo === 'CPF';

        cpfButton.classList.toggle('active', ehCPF);
        cnpjButton.classList.toggle('active', !ehCPF);
        cpfInput.value = '';
        cpfInput.maxLength = ehCPF ? 14 : 18;
        cpfInput.placeholder = ehCPF ? '000.000.000-00' : '00.000.000/0000-00';
        resultMessage.className = 'message';
        resultMessage.textContent = '';
        cpfInput.focus();
    }

    cpfButton.addEventListener('click', function () {
        selecionarTipoDocumento('CPF');
    });

    cnpjButton.addEventListener('click', function () {
        selecionarTipoDocumento('CNPJ');
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const documento = normalizarDocumento(cpfInput.value);
        const valido = tipoDocumentoSelecionado === 'CPF'
            ? validarCPF(documento)
            : validarCNPJ(documento);

        if (valido) {
            resultMessage.textContent = `${tipoDocumentoSelecionado} válido!`;
            resultMessage.className = 'message success';
        } else {
            resultMessage.textContent = `${tipoDocumentoSelecionado} inválido.`;
            resultMessage.className = 'message error';
        }
    });

    cpfInput.addEventListener('input', function (event) {
        let value = normalizarDocumento(event.target.value);

        if (tipoDocumentoSelecionado === 'CPF') {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        } else {
            value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})$/, '$1.$2.$3/$4-$5');
        }

        event.target.value = value;
    });
}

if (typeof module !== 'undefined' && require.main === module) {
    const documento = process.argv[2];

    if (!documento) {
        console.log('Informe um CPF ou CNPJ. Exemplo: node index.js 52998224725');
    } else if (validarDocumento(documento)) {
        console.log('Documento válido!');
    } else {
        console.log('Documento inválido.');
    }
}

if (typeof module !== 'undefined') {
    module.exports = { validarCPF, validarCNPJ, validarDocumento };
}
