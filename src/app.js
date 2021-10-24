import { digits } from './digits'

const form = document.querySelector('[data-js="form"]')
const formButton = document.querySelector('[data-js="form-button"]')
const gameContainer = document.querySelector('[data-js="game-container"]')
const input = document.querySelector('[data-js="input"]')
const numberContainer = document.querySelector('[data-js="number-container"]')
const resetButton = document.querySelector('[data-js="reset-button"]')

const url =
  'https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300'

/* Iniciar a aplicação com os dados do número em um objeto vazio. */
let number = {}

/* Função para gravar a informação obtida dentro do objeto "number". */
const setUserNumber = (data) => {
  return (number = {
    ...number,
    user: data
  })
}

/*
  Objeto com as funções para converter a resposta obtida da chamada à API
  em um elemento com o digito passando a mensagem de erro ou adicionando o
  número obtido para a variável "number".
*/
const status = {
  error: (response) => {
    const errorDigitsAsString = '' + response.status

    clearGameContainer()
    createMessage('Erro', 'error')
    resetButton.classList.toggle('visible')
    createDigits(errorDigitsAsString)

    addDisabledAttribute(formButton, input)
    removeDisabledAttribute(resetButton)

    numberContainer.classList.toggle('error')
    return
  },

  success: async (response) => {
    const result = await response.json()
    const sortedNumber = result.value

    return (number = {
      sort: sortedNumber
    })
  }
}

/*
  Função que faz a chamada à API utilizando o método Async/Await retornando
  o número sorteado pela chamada ou o erro caso não tenha conexão.
*/
const getSortedNumber = async () => {
  const response = await fetch(url)

  return !response.ok ? status.error(response) : status.success(response)
}

/*
  Função para remover o atributo "disabled" a um ou mais elemento.
*/
const removeDisabledAttribute = (...elements) => {
  return elements.forEach((element) => element.removeAttribute('disabled'))
}

/*
  Função para adicionar o atributo "disabled" a um ou mais elemento.
*/
const addDisabledAttribute = (...elements) => {
  return elements.forEach((element) =>
    element.setAttribute('disabled', 'disabled')
  )
}

/*
  Função para que recebe um número em formato de "string" e separa, através de
  de um "destructing", cada caracter da "string" em um item de um "array".
  Como o resultado obtido é um "array" de "string", é feito uma iteração no
  "array" retornando um novo "array" com os dados convertidos em um "number".
*/
const numberToDigit = (numbers) => [...numbers].map(Number)

/*
  Função para a criação de uma "div" adicionando a ela o atributo
  'data-js="digit"' e a 'class="digit-container" para fazer a inserção de um SVG
  através do método "innerHTML" passando para a "div" o SVG obtido pelo método
  "import" para cada específico dígito.
*/
const createSVG = (number) => {
  const div = document.createElement('div')

  numberContainer.appendChild(div)

  div.setAttribute('data-js', 'digit')
  div.setAttribute('class', 'digit-container')
  div.innerHTML = digits[number]
  return div
}

/*
  Função para a criação dos dígitos. Os dígitos são obtidos através da função
  "numberToDigit" e após receber o "array". É feito uma verificação se há algum
  número 0 no começo da a string através da função "replace" passando para ela
  um "GREP". Após, é feito a iteração no "array" de dígitos criando um elemento
  no DOM para cada item neste "array".
*/
const createDigits = (numbers) => {
  const numbersWithoutLeading = numbers.replace(/\b0+/g, '')
  const digits = numberToDigit(numbersWithoutLeading)
  digits.forEach((digit) => {
    createSVG(digit)
  })
}

/*
  Função para a criação das mensagens com a verificação se a mensagem foi um
  erro ou um acerto adicionando a classe "error" ou "success" conforme o
  parâmetro foi passado..
*/
const createMessage = (message, status) => {
  const div = document.createElement('div')

  div.textContent = message
  div.setAttribute('data-js', 'message')
  div.setAttribute('class', 'message')
  gameContainer.prepend(div)

  if (status === 'success') {
    div.classList.add('success')
  }

  if (status === 'error') {
    div.classList.add('error')
  }
  return div
}

/* Função para limpar os dígitos que já foram renderizados no DOM. */
const clearGameContainer = () => {
  const digitsOnContainer = document.querySelectorAll('[data-js="digit"]')
  const messagesOnContainer = document.querySelectorAll('[data-js="message"]')

  digitsOnContainer.forEach((digit) => digit.remove())
  messagesOnContainer.forEach((message) => message.remove())
  numberContainer.classList.remove('success')
  numberContainer.classList.remove('error')
}

/* Função para fazer o reset do jogo */
const resetGame = () => {
  resetButton.classList.toggle('visible')
  addDisabledAttribute(resetButton)
  removeDisabledAttribute(formButton, input)
  clearGameContainer()

  createSVG('empty')
  getSortedNumber()
}

/*
  Função para fazer a comparação entre o número obtido pelo usuário e o número
  sorteado na chamada feita.
*/
const compareNumbers = (user, sort) => {
  if (user) {
    clearGameContainer()
  }

  if (user === sort) {
    numberContainer.classList.add('success')
    resetButton.classList.toggle('visible')
    createMessage('Você acertou!!!', 'success')
    addDisabledAttribute(formButton, input)
    removeDisabledAttribute(resetButton)
  }

  if (user > sort) {
    createMessage('É menor')
  }

  if (user < sort) {
    createMessage('É maior')
  }
}

/*
  Função de início do jogo que será utilizada para obter todos os dados que o
  usuário passar para a aplicação
*/
const playGame = (event) => {
  event.preventDefault()

  /*
    Variável que irá observar o valor digitado pelo usuário, após obtido
    o número, que é recebido como "string" é convertido em um "number"
    para ser gravado na variável "number" dentro da propriedade "user",
    que referencia o número obtido pelo usuário.
  */
  const userNumber = input.value
  setUserNumber(Number(userNumber))

  /* Desestruturação da variável number */
  const { sort, user } = number

  if (user === 0) {
    return
  }

  compareNumbers(sort, user)
  createDigits(userNumber)

  /* Limpeza do formulário */
  event.target.reset()
}

/*
  "Event Listener" que irá ficar observando quando houver uma interação
  com o botão de recomeçar um novo jogo.
*/
resetButton.addEventListener('click', () => resetGame())

/*
  "Event Listener" que irá ficar observando quando for feito um "submit" no
  formulário capturando as informações digitadas pelo usuário.
*/
form.addEventListener('submit', (event) => playGame(event))

/*
  Função para iniciar a aplicação passando o dígito zerado e removendo o
  atributo "disabled" do botão do formulário.
*/
const init = () => {
  createSVG('empty')
  removeDisabledAttribute(formButton)
  getSortedNumber()
}

init()
