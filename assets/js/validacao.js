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
    }

}

const validadores = {
    dataNascimento:input => validaDataNascimento(input)
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