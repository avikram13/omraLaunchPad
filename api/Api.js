import ApiUtils from './ApiUtils'
var Api = {
  getItems: function(someUrl) {
    return fetch(someUrl)
      .then(ApiUtils.checkStatus)
      .then(response => response.json())
      .catch(e => e)
  }
};
export { Api as default };
