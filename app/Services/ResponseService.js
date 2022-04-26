class ResponseService {


    buildSuccess(_message, _data) {
        return {
            'status': 'success',
            'data': _data,
            'message': _message
        }
    }

    buildFailure(_message, _data) {
        return {
            'status': 'failure',
            'data': _data,
            'message': _message
        }
    }

    sendResponse(_response, _responseData) {
        // console.log(_response);
        // console.log(_responseData);
        let _overrideHttpCode = _responseData['overrideHttpCode'] || false;

        if (_overrideHttpCode == false) {
            if (_responseData.status == 'success') {
                _overrideHttpCode = 200;
            } else {
                _overrideHttpCode = 500;
            }
        }

        return _response.status(_overrideHttpCode).json(_responseData)
    }

    buildValidationMessage(_arrMessage) {
        let _msg = 'Something went wrong please try again.';

        if (_arrMessage[0] != undefined) {
            _msg = _arrMessage[0].message;
        } else if (typeof _arrMessage == 'string') {
            return _arrMessage;
        }

        return _msg;
    }
}


module.exports = ResponseService;