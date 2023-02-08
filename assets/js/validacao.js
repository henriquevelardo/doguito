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
        valueMissing: "O campo não pode estar vazio",
        customError: "O CPF digitado não é válido"
    }

}

const validadores = {
    dataNascimento:input => validaDataNascimento(input),
    cpf:input => validaCpf(input)
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

    if(!checaCpfRepetido(cpfFormatado)){
        mensagem = "O CPF digitado não é válido."
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