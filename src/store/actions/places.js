import { SET_PLACES, REMOVE_PLACE } from './actionTypes';
import { uiStartLoading, uiStopLoading } from './index';


export const addPlace = (placeName, location, image) => {
    return dispatch => {
      dispatch(uiStartLoading());
      fetch("https://us-central1-reactnative-aa845.cloudfunctions.net/storeImage", {
        method: "POST",
        body: JSON.stringify({
          image: image.base64
        })
      })
      .catch(err  => {
        console.log(err);
        dispatch(uiStopLoading());
      })
      .then(res => res.json())
      .then(parsedRes => {
        const placeData = {
          name: placeName,
          location: location,
          image: parsedRes.imageUrl
        };
        return fetch('https://reactnative-aa845.firebaseio.com/places.json', {
          method: "POST",
          body: JSON.stringify(placeData)
        })
      })
      .catch(err => {
        console.log(err);
        alert('Something went wrong, please try again!');
        dispatch(uiStopLoading());
      })
      .then(res => res.json())
      .then(parsedRes => {
        console.log(parsedRes);
        dispatch(uiStopLoading());
      });
    };
};

export const getPlaces = () => {
  return dispatch => {
    return fetch('https://reactnative-aa845.firebaseio.com/places.json')
        .catch(err => {
          alert("something went wrong!");
          console.log(err);
        })
        .then(res => res.json())
        .then(parsedRes => {
          const places = [];
          for (let key in parseRes) {
            places.push({
              ...parsedRes[key],
              image: {
                uri: parsedRes[key].image
              },
              key: key
            });
          } 
          dispatch(setPlace(places));
        });
    };
  }

  export const setPlaces = places => {
    return {
      type: SET_PLACES,
      places: places
    }
  }

export const deletePlace = (key) => {
    return dispatch => {
      dispatch(removePlace(key))
      fetch('https://reactnative-aa845.firebaseio.com/places' + key + '.json', {
          method: "DELETE"
      })
      .catch(err => {
        alert("something went wrong!");
        console.log(err);
      })
      .then(res => res.json())
      .then(parsedRes => {
        console.log('Done!');
      })
    }
};

export const removePlace = key => {
  return {
    type: REMOVE_PLACE,
    key: key
  };
};
