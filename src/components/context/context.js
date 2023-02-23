import React from 'react';

const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            return {
                ...state, // take old state and apply new state
                cart: [...state.cart, action.payload] // add new item to cart variable in the same state
            }
        case 'UPDATE_CART':
            // iterate and update the cart item
            state.cart.name = "desilva";
            return {
                ...state, // take old state and apply new state
                cart: [...state.cart, action.payload] // add new item to cart variable in the same state
            }
        default:
            return state;
    }
}

const addToCart = (dispatch) => {
    return (payload) => {
        dispatch({ type: 'ADD_TO_CART', payload });
    };
}

const updateCartItem = (dispatch) => {
    return (payload) => {
        dispatch({ type: 'UPDATE_CART', payload });
    };
}

export const Context = React.createContext({});

export const Provider = (props) => {
    const [state, dispatch] = React.useReducer(reducer, { cart: []});
    const actions = { addToCart: addToCart(dispatch) };
    return (
        <Context.Provider value={{ ...state, ...actions }}>
            {props.children}
        </Context.Provider>
    )
}

export const useCartContext = () => React.useContext(Context);
