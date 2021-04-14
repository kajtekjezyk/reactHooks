import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';
import useHttp from '../../hooks/http';
import ErrorModal from '../UI/ErrorModal';
import LoadingIndicator from '../UI/LoadingIndicator';

const Search = React.memo(props => {
  const {onLoadIngredient} = props;
  const inputRef = useRef();
  const [searchValue, modifySearch] = useState('');
  const {isLoading, data, error, sendRequest, clear} = useHttp();

  useEffect(() => {
    const loadIngredients = [];
    if (!isLoading && !error) {
      for (const key in data){
        loadIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }
      props.onLoadIngredient(loadIngredients);
      }          
  }, [data, isLoading, error, sendRequest, onLoadIngredient])

  useEffect(()=>{
    const timer = setTimeout(() => {
      if (searchValue === inputRef.current.value) {

        const query = searchValue.length === 0
          ? '' :
          `?orderBy="title"&equalTo="${searchValue}"`;
        sendRequest('https://react-hooks-update-f9798-default-rtdb.firebaseio.com/ingredients.json' + query, "GET");     
      }   
    }, 500);
    return () => {
      clearTimeout(timer);
    }
  }, [searchValue, inputRef, sendRequest]);



  return (
    <section className="search">
      {error && <ErrorModal onClose={clear} >{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <LoadingIndicator/>}
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={(event) => modifySearch(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
