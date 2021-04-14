import React, {useReducer, useEffect, useCallback, useMemo} from 'react';
import ErrorModal from "../UI/ErrorModal";
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD' :
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(elem => elem.id != action.id);
    default :
      throw new Error("Should not get here");
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {isLoading, data, error, sendRequest, extra, identifier, clear} = useHttp();

  useEffect(() => {
    if(!isLoading && identifier === "DELETE") {
      dispatch({type: "DELETE", id: extra});
    } else if (!isLoading && !error &&  identifier === "ADD") {
      dispatch({type: "ADD", ingredient: {id: data.name, ...extra}});
    }
  }, [data, extra, identifier, isLoading])


  const AddIngredientHandler = useCallback(ingredient => {
    sendRequest('https://react-hooks-update-f9798-default-rtdb.firebaseio.com/ingredients.json',
                'POST',
                JSON.stringify(ingredient),
                ingredient,
                "ADD");
  }, [sendRequest]);

  const ingredientSearchHandle = useCallback((ingredientArray) => {
    dispatch({type: "SET", ingredients: ingredientArray});
  }, []);

  const RemoveIngredientHanlder = useCallback((id) => {
    sendRequest(`https://react-hooks-update-f9798-default-rtdb.firebaseio.com/ingredients/${id}.json`,
                'DELETE',
                null,
                id,
                "DELETE");
  }, [sendRequest]);

  const clearError = useCallback(() => {
    clear();
  }, [error]);

  const ingrentList = useMemo(()=>{
    return <IngredientList ingredients={userIngredients} onRemoveItem={RemoveIngredientHanlder}/>;  
  }, [userIngredients, RemoveIngredientHanlder])

  return (
    
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm clicked={AddIngredientHandler} loading={isLoading}/>
      <section>
        <Search onLoadIngredient={ingredientSearchHandle} switchLoading={(type) => {}}/>
        {ingrentList}
      </section>
    </div>
  );
}

export default Ingredients;
