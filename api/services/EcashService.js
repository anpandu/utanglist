module.exports = {

  getToken: function (ecashId, ecashPin, deviceId) {
    axios.get("https://api.apim.ibmcloud.com/ex-icha-fmeirisidibmcom-ecash-be/sb/emoney/v1/loginMember?msisdn=" + ecashId + "&credentials=" + ecashPin + "&uid=" + deviceId)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (response) {
        console.log(response);
      });

  },

}

