import axios from 'axios';
import {
  POKEMON_REQUEST,
  POKEMON_FAILURE,
  ADD_ALL_POKEMONS,
  UPDATE_SELECTED_POKEMON,
  UPDATE_SPECIES_SELECTED_POKEMON,
  UPDATE_EVOLUTION_SELECTED_POKEMON,
} from './pokemonTypes';

export const pokemonRequest = () => ({
  type: POKEMON_REQUEST,
});

export const pokemonFailure = error => ({
  type: POKEMON_FAILURE,
  payload: error,
});

export const addAllPokemons = res => ({
  type: ADD_ALL_POKEMONS,
  payload: res,
});

export const updateSelectedPokemon = pokemon => ({
  type: UPDATE_SELECTED_POKEMON,
  payload: pokemon,
});

export const updateSpeciesSelectedPokemon = species => ({
  type: UPDATE_SPECIES_SELECTED_POKEMON,
  payload: species,
});

export const updateEvolutionSelectedPokemon = evolution => {
  const evolutionChain = JSON.stringify(evolution).split(/pokemon-species\//).slice(1);
  const evolutionPokemon = evolutionChain.map(pokemon => pokemon.split(/\//)[0]).reverse();
  return ({
    type: UPDATE_EVOLUTION_SELECTED_POKEMON,
    payload: evolutionPokemon,
  });
};

export const axiosBlock = (urlAPI, usedDispatch, dispatch) => {
  dispatch(pokemonRequest());
  axios(urlAPI)
    .then(response => {
      if (response.status.toString()[0] !== '2') {
        throw response.status;
      }
      dispatch(usedDispatch(response.data));
    })
    .catch(error => {
      dispatch(pokemonFailure(error));
    });
};

const REACT_APP_SERVER_URL = 'https://pokeapi.co/api/v2/pokemon/';

export const fetchPokemonsList = () => dispatch => {
  const urlAPI = `${REACT_APP_SERVER_URL}`;
  axiosBlock(urlAPI, addAllPokemons, dispatch);
};

export const openPokemonPage = pagePath => dispatch => {
  const urlAPI = pagePath;
  axiosBlock(urlAPI, addAllPokemons, dispatch);
};

export const fetchEvolutionPokemon = species => dispatch => {
  dispatch(updateSpeciesSelectedPokemon(species));
  const urlAPI = species.evolution_chain.url;
  axiosBlock(urlAPI, updateEvolutionSelectedPokemon, dispatch);
};

export const fetchSpeciesPokemon = pokemon => dispatch => {
  dispatch(updateSelectedPokemon(pokemon));
  const urlAPI = `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`;
  axiosBlock(urlAPI, fetchEvolutionPokemon, dispatch);
};

export const fetchSelectedPokemon = pokemonId => dispatch => {
  const urlAPI = `${REACT_APP_SERVER_URL}${pokemonId}`;
  axiosBlock(urlAPI, fetchSpeciesPokemon, dispatch);
};
