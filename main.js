checkInput()

function checkInput() {
  const input = document.querySelector('input')
  input.addEventListener('blur', () => {
    if (input.value) getPokemon(input.value)
    else console.log('Insira o nome do Pokemon')
  })
}

function getPokemon(input) {
  axios
    .get(`https://pokeapi.co/api/v2/pokemon/${input}`)
    .then((response) => {
      const { data } = response

      const pokemon = {
        id: data.id,
        name: data.name,
        img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
        type: data.types[0].type.name,
        hp: data.stats[0].base_stat,
        abilities: {
          ability1: {
            name: data.abilities[0].ability.name,
            url: data.abilities[0].ability.url
          },
          ability2: {
            name: data.abilities[1].ability.name,
            url: data.abilities[1].ability.url
          }
        }
      }

      const promises = []

      for (const key of Object.keys(pokemon.abilities)) {
        const promise = axios
          .get(pokemon.abilities[key].url)
          .then((response) => {
            const { data } = response

            pokemon.abilities[key].description = data.effect_entries[1].short_effect

          })
          .catch((error) => console.log(error))

        promises.push(promise)
      }

      Promise.all(promises).then(() => {
        updateCard(pokemon)
      })

    })
    .catch((error) => console.log(error))
}

function updateCard(pokemon) {
  const card = document.querySelector('.card')
  const pokeInfos = document.querySelectorAll('.pokemon')
  const [
    pokemonName,
    pokemonImg,
    pokemonHp,
    pokemonType,
    pokemonAbilities
  ] = pokeInfos

  // switch (pokemon.type) {
  //   case 'eletric':
  //     card.style.backgroundColor = '#fedc57'
  //     break
  //   case 'fire':
  //     card.style.backgroundColor = '#c71d38'
  //     break
  //   case 'water':
  //     card.style.backgroundColor = '#3353a1'
  //     break
  //   case 'grass':
  //     card.style.backgroundColor = '#93c341'
  //     break
  //   case 'stell':
  //     card.style.backgroundColor = '#a8b3af'
  //     break
  //   case 'dark':
  //     card.style.backgroundColor = '#3b4849'
  //     break
  //   case 'psychic':
  //     card.style.backgroundColor = '#b876b1'
  //     break
  //   case 'fighting':
  //     card.style.backgroundColor = '#b66831'
  //     break
  //   case 'fairy':
  //     card.style.backgroundColor = '#c0447b'
  //     break
  // }

  pokemonName.textContent = pokemon.name
  pokemonImg.setAttribute('src', pokemon.img)
  pokemonType.setAttribute('src', `./assets/types/${pokemon.type}.png`)

  pokemonHp.textContent = 'HP'
  const pokemonHpValue = document.createElement('strong')
  pokemonHpValue.textContent = pokemon.hp
  pokemonHp.appendChild(pokemonHpValue)

  pokemonAbilities.innerHTML = ''
  for (const key of Object.keys(pokemon.abilities)) {
    const abilityWrapper = document.createElement('div')
    abilityWrapper.setAttribute('class', 'ability')

    const abilityName = document.createElement('p')
    abilityName.setAttribute('class', 'ability-name')
    const nameRevised = pokemon.abilities[key].name.replace('-', ' ')
    abilityName.textContent = nameRevised
    
    const abilityDesc = document.createElement('p')
    abilityDesc.setAttribute('class', 'ability-desc')
    abilityDesc.textContent = pokemon.abilities[key].description

    abilityWrapper.appendChild(abilityName)
    abilityWrapper.appendChild(abilityDesc)

    pokemonAbilities.appendChild(abilityWrapper)
  }
}
