//VALIDAÇÃO DA DATA DE NASCIMENTO PARA CADA INPUT
export function valida(input){
    const tipoDeInput = input.dataset.tipo
    

    if(validadores[tipoDeInput]){
        validadores[tipoDeInput](input)
    }

    if(input.validity.valid){
        input.parentElement.classList.remove("input-container--invalido")
        input.parentElement.querySelector(".input-mensagem-erro").innerHTML = ""
    }else{
        input.parentElement.classList.add("input-container--invalido")
        input.parentElement.querySelector(".input-mensagem-erro").innerHTML = mostraMensagemDeErro(tipoDeInput, input)
    }
}

const tiposDeErro = [

    "valueMissing",
    "typeMismatch",
    "patternMismatch", 
    "customError",
]

const mensagemErro = {

    nome: {
        valueMissing: "O campo não pode estar vazio."
    },
    email: {
        valueMissing: "O campo não pode estar vazio.",
        typeMismatch: "O email digitado não é valido."
    },
    senha: {
        valueMissing: "O campo não pode estar vazio.",
        patternMismatch: "A senha deve conter no mínimo 5 dígitos, deve ter pelo menos 1 letra e 1 número."
    },
    dataNascimento: {
        valueMissing: "O campo não pode estar vazio.",
        customError: "É necessário ser maior de 18 anos para se cadastrar!"
    },
    cpf: {
        valueMissing: "O campo não pode estar vazio.",
        customError: "O CPF digitado não é válido."
    },
    cep: {
        valueMissing: "O campo não pode estar vazio.",
        patternMismatch: "O CEP digitado não é válido.",
        customError: "Não foi possível localizar esse CEP."
    },
    logradouro: {
        valueMissing: "O campo não pode estar vazio.",
    },
    cidade: {
        valueMissing: "O campo não pode estar vazio.",
    },
    estado: {
        valueMissing: "O campo não pode estar vazio.",
    }, 
    preco: {
        valueMissing: "O campo não pode estar vazio.",
    }

}

const validadores = {
    dataNascimento:input => validaDataNascimento(input),
    cpf:input => validaCpf(input),
    cep:input => recuperaCEP(input)
}

function mostraMensagemDeErro(tipoDeInput, input){
    let mensagem = ""

    tiposDeErro.forEach(erro => {
        if(input.validity[erro]){
            mensagem = mensagemErro[tipoDeInput][erro]
        }
    })    
    
    return mensagem
}

function validaDataNascimento(input) {
    const dataRecebida = new Date(input.value)
    let mensagem = ""

    if(!maiorDe18(dataRecebida)){
        mensagem = "É necessário ser maior de 18 anos para se cadastrar!"
    }

    input.setCustomValidity(mensagem)
    
}

function maiorDe18(data){
    const dataAtual = new Date()
    const dataMais18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate())

    return dataMais18 <= dataAtual
}

function validaCpf(input){
    const cpfFormatado = input.value.replace(/\D/g, "")
    let mensagem = ""

    if(!checaCpfRepetido(cpfFormatado) || !checaEstruturaCPF(cpfFormatado)){
        mensagem = mostraMensagemDeErro("cpf", input)
    }

    input.setCustomValidity(mensagem)
}

function checaCpfRepetido(cpf){
    const valoresRepetido = [
        "00000000000",
        "11111111111",
        "22222222222",
        "33333333333",
        "44444444444",
        "55555555555",
        "66666666666",
        "77777777777",
        "88888888888",
        "99999999999"
    ]

    let cpfValido = true

    valoresRepetido.forEach(valor => {
        if(valor == cpf){
            cpfValido = false
        }
    })

    return cpfValido

}

function checaEstruturaCPF(cpf){
    const multiplicador = 10

    return checaDigitoVerificador(cpf, multiplicador)
}

function checaDigitoVerificador(cpf, multiplicador){
    //se multiplicador for maior ou igual a 12, digitos verificadores corretos, 
    //pois multiplicador pega a posição 10 e 11 do CPF apenas
    if(multiplicador >= 12){
        return true
    }

    let multiplicadorInicial = multiplicador
    let soma = 0
    const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split('')
    const digitoVerificador = cpf.charAt(multiplicador - 1)
    for(let contador = 0; multiplicadorInicial > 1; multiplicadorInicial--){
        soma = soma + cpfSemDigitos[contador] * multiplicadorInicial
        contador++
    }

    if(digitoVerificador == confirmaDigito(soma)){
        return checaDigitoVerificador(cpf, multiplicador + 1)
    }

    return false
}

function confirmaDigito(soma){
    return 11 - (soma % 11)
}

function recuperaCEP(input){
    const cep = input.value.replace(/\D/g, "")
    const url = `https://viacep.com.br/ws/${cep}/json`
    const options = {
        method: "GET",
        mode: "cors",
        headers: {
            "content-type" : "application/json;charset=utf-8"
        }
    }

    if(!input.validity.patternMismatch && !input.validity.valueMissing){
        fetch(url, options).then(
            response => response.json()
        ).then(
            data => {
                if(data.erro){
                    input.setCustomValidity("Não foi possível localizar esse CEP.")
                    return
                }
                input.setCustomValidity("")
                preencheCamposComCEP(data)
                return
            }
        )
    }
}

function preencheCamposComCEP(data){
    const logradouro = document.querySelector('[data-tipo="logradouro"]')
    const cidade = document.querySelector('[data-tipo="cidade"]')
    const estado = document.querySelector('[data-tipo="estado"]')

    logradouro.value = data.logradouro
    cidade.value = data.localidade
    estado.value = data.uf

}








//Matemática do CPF
//cpf = 123456789 - 09
//let soma = (10 * 1) + (9 * 2) + (8 * 3) ... (2 * 9)
//let digitoVerificador = 11 - (soma % 11)
// segundo digito é igual, porém começa com 11