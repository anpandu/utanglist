module.exports = {

  getToken: function (ecashId, ecashPin, deviceId) {
    var url = "https://api.apim.ibmcloud.com/ex-icha-fmeirisidibmcom-ecash-be/sb/emoney/v1/loginMember?msisdn=" + ecashId + "&credentials=" + ecashPin + "&uid=" + deviceId
    return axios
      .get(url)
      .then(function (result) {
        return result.data
      })
      .catch(function (err) {
        return err
      })
  },

  balanceInquiry: function(ecashId, ecashPin, token) {
    var url = "https://api.apim.ibmcloud.com/ex-icha-fmeirisidibmcom-ecash-be/sb/emoney/v1/balanceInquiry?msisdn=" + ecashId + "&credentials=" + ecashPin + "&token=" + token
    return axios
      .get(url)
      .then(function (result) {
        return result.data
      })
      .catch(function (err) {
        return err
      })
  },

  transfer: function(source, destination, amount, ecashPin, description, token) {
    var url = "https://api.apim.ibmcloud.com/ex-icha-fmeirisidibmcom-ecash-be/sb/emoney/v1/transferMember?from=" + source + "&to=" + destination + "&amount=" + amount + "&credentials=" + ecashPin + "&description=" + description + "&token=" + token
    console.log(url)
    return axios
      .get(url)
      .then(function (result) {
        return result.data
      })
      .catch(function (err) {
        return err
      })
  },

  transferInquiry: function(ecashId, destination, amount, token) {
    var url = "https://api.apim.ibmcloud.com/ex-icha-fmeirisidibmcom-ecash-be/sb/emoney/v1/inquiryTransferMember?msisdn=" + ecashId + "&to=" + destination + "&amount=" + amount + "&token=" + token
    return axios
      .get(url)
      .then(function (result) {
        return result.data
      })
      .catch(function (err) {
        return err
      })
  }

}
