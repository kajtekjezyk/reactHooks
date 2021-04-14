import {useReducer, useCallback} from 'react';

const initState = {
    loading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null
};

const httpReducer = (httpState, action) => {
    switch (action.type) {
      case "REQ_STARTED":
        return {...httpState, loading: true, error: null, data: null, extra: null, identifier: action.identifier}
      case "REQ_SUCCESS":
        return {...httpState, loading: false, error: null, data: action.responseData, extra: action.extra}
      case "REQ_FAIED":
        return {...httpState, loading: false, error: "Something went wrong"}
      case "REM_ERR":
        return initState
      default :
        throw new Error("Should not get here");
    }
}
  
const useHttp = () => {
  const [httpState, httpDispatch] = useReducer(httpReducer, initState)

  const clear = useCallback(() => {
    httpDispatch({type: "REM_ERR"});
  }, []);

  const sendRequest = useCallback((url, method, body, reqExtra, identifier) => {
        httpDispatch({type: "REQ_STARTED", identifier: identifier});
        fetch(url, {
          method: method,
          body: body,
          headers: {'Content-Type': 'application/json'}
        }).then(response => {
            return response.json();
        }).then(responseData =>{

            httpDispatch({type: "REQ_SUCCESS", responseData: responseData, extra: reqExtra});
        }).catch(error => {
          httpDispatch({type: "REQ_FAIED"});
        });
      }, []);
  
  return {
      isLoading: httpState.loading,
      data: httpState.data,
      error: httpState.error,
      sendRequest: sendRequest,
      extra: httpState.extra,
      identifier: httpState.identifier,
      clear: clear
  };
};

export default useHttp;