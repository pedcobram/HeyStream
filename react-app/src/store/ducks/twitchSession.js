// actions
const CLEAR = "twitchSession/CLEAR";
const SET = "twitchSession/SET";

const DEFAULT_STATE = false;

// reducer
const twitchSessionReducer = (state = DEFAULT_STATE, action = {}) => {
    switch (action.type) {
        case SET:
            return true;
        case CLEAR:
            return false;
    }
    return state;
};

export default twitchSessionReducer;

// action creators

export const setTwitchSession = () => {
    return { type: SET };
}

export const clearTwitchSession = () => {
    return { type: CLEAR };
}