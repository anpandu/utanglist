module.exports = {

  getToken: function (ecashId, ecashPin, deviceId) {
    var url = "https://api.apim.ibmcloud.com/ex-icha-fmeirisidibmcom-ecash-be/sb/emoney/v1/loginMember?msisdn=" + ecashId + "&credentials=" + ecashPin + "&uid=" + deviceId
    return axios
      .get(url)
      .catch(function (err) {
        return err
      })

  },

}

