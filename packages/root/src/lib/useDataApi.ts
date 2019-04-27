import {
  useState,
  useEffect,
  useReducer,
  Reducer,
  Dispatch,
  SetStateAction
} from "react";
import { getWithJwtAsync } from "lib/http";

const enum DataFetchActionTypes {
  FETCH_INIT = "FETCH_INIT",
  FETCH_SUCCESS = "FETCH_SUCCESS",
  FETCH_FAILURE = "FETCH_FAILURE"
}

interface IState<T> {
  isLoading: boolean;
  data: T;
  error: any;
}

interface IFetchRequest {
  type: DataFetchActionTypes.FETCH_INIT;
}

interface IFetchSuccess<T> {
  type: DataFetchActionTypes.FETCH_SUCCESS;
  payload: T;
}

interface IFetchError {
  type: DataFetchActionTypes.FETCH_FAILURE;
  error: any;
}

type FetchActions<T> = IFetchRequest | IFetchSuccess<T> | IFetchError;

const dataFetchReducer = <T>(
  state: IState<T>,
  action: FetchActions<T>
): IState<T> => {
  switch (action.type) {
    case DataFetchActionTypes.FETCH_INIT:
      return {
        ...state,
        isLoading: true
      };
    case DataFetchActionTypes.FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.payload
      };
    case DataFetchActionTypes.FETCH_FAILURE:
      return {
        ...state,
        isLoading: false
      };
    default:
      throw new Error();
  }
};
/**
 *
 *
 * @template T
 * @param {string} initialUrl
 * @param {T} initialData
 * @returns {[IState<T>, Dispatch<SetStateAction<string>>]}
 */
export const useDataApi = <T>(
  initialUrl: string,
  initialData: T
): [IState<T>, Dispatch<SetStateAction<string>>] => {
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer<Reducer<IState<T>, FetchActions<T>>>(
    dataFetchReducer,
    {
      isLoading: false,
      error: undefined,
      data: initialData
    }
  );

  useEffect(() => {
    let didCancel = false;

    async function fetchData() {
      dispatch({ type: DataFetchActionTypes.FETCH_INIT });

      try {
        const result = await getWithJwtAsync<T>(url);

        if (!didCancel) {
          dispatch({
            type: DataFetchActionTypes.FETCH_SUCCESS,
            payload: result
          });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: DataFetchActionTypes.FETCH_FAILURE, error });
        }
      }
    }

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [url]);

  return [state, setUrl];
};

/**
 * Use a promise and receive [data, error, loading] values.
 * It is strongly recommended to use in conjunction with useMemo.
 *
 * @template T
 * @param {Promise<T>} promise
 * @param {T} initialData
 * @returns
 */
export const usePromise = <T>(promise: Promise<T>, initialData: T) => {
  const [state, dispatch] = useReducer<Reducer<IState<T>, FetchActions<T>>>(
    dataFetchReducer,
    {
      isLoading: false,
      error: undefined,
      data: initialData
    }
  );

  useEffect(() => {
    let didCancel = false;

    async function resolvePromise() {
      dispatch({ type: DataFetchActionTypes.FETCH_INIT });

      try {
        const result = await promise;

        if (!didCancel) {
          dispatch({
            type: DataFetchActionTypes.FETCH_SUCCESS,
            payload: result
          });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: DataFetchActionTypes.FETCH_FAILURE, error });
        }
      }
    }

    resolvePromise();

    return () => {
      didCancel = true;
    };
  }, [promise]);

  return state;
};
