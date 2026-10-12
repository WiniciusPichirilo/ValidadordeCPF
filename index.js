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

if (typeof document !== 'undefined') {
    const form = document.getElementById('cpfForm');
    const cpfInput = document.getElementById('cpfInput');
    const resultMessage = document.getElementById('resultMessage');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (validarCPF(cpfInput.value)) {
            resultMessage.textContent = 'CPF válido!';
            resultMessage.className = 'message success';
        } else {
            resultMessage.textContent = 'CPF inválido.';
            resultMessage.className = 'message error';
        }
    });

    cpfInput.addEventListener('input', function (event) {
        let value = event.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        event.target.value = value;
    });
}

if (typeof process !== 'undefined' && process.argv) {
    const cpf = process.argv[2];

    if (!cpf) {
        console.log('Informe um CPF. Exemplo: node index.js 52998224725');
    } else if (validarCPF(cpf)) {
        console.log('CPF válido!');
    } else {
        console.log('CPF inválido.');
    }
}
