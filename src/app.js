import { get } from './utils/http'

const url =
  'https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300'

const getData = async () => {
  const result = await get(url)

  if (result.error) {
    console.log(error)
    return
  }

  document.querySelector('[data-js="app"]').innerHTML = `
  <h1>Studio Sol!</h1>
  <p>O número sorteado foi ${result.value}</p>
  `
}

getData()
