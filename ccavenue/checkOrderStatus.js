var http = require('http'),
    fs = require('fs'),
    ccav = require('./ccavutil.js'),
    crypto = require('crypto'),
    axios = require('axios'),
    qs = require('querystring');

    // console.log(request);
    var body = '',
    workingKey = '1FE7DE0F4A952B12713FE5D7B97BE1C4',		//Put in the 32-Bit key shared by CCAvenues.
    accessCode = 'AVEC67JK76BU04CEUB',		//Put in the access code shared by CCAvenues.	//Put in the access code shared by CCAvenues.
	encRequest = '',
	formbody = '';

    // //Generate Md5 hash for the key and then convert in base64 string
    // var md5 = crypto.createHash('md5').update(workingKey).digest();
    // var keyBase64 = Buffer.from(md5).toString('base64');

    // //Initializing Vector and then convert in base64 string
    // var ivBase64 = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d,0x0e, 0x0f]).toString('base64');

    

    request.on('data', function (data) {
        body += data;
        console.log(body);
	encRequest = ccav.encrypt(body, keyBase64, ivBase64); 
	POST =  qs.parse(body);
	formbody = '<html><head><title>Sub-merchant checkout page</title><script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script></head><body><center><!-- width required mininmum 482px --><iframe  width="482" height="500" scrolling="No" frameborder="0"  id="paymentFrame" src="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&merchant_id='+POST.merchant_id+'&encRequest='+encRequest+'&access_code='+accessCode+'"></iframe></center><script type="text/javascript">$(document).ready(function(){$("iframe#paymentFrame").load(function() {window.addEventListener("message", function(e) {$("#paymentFrame").css("height",e.data["newHeight"]+"px"); }, false);}); });</script></body></html>';
    });

    request.on('end', function () {
        response.writeHeader(200, {"Content-Type": "text/html"});
	response.write(formbody);
	response.end();
    });


   axios({
    method: 'post',
    url: 'https://api.ccavenue.com/apis/servlet/DoWebTrans',
    data: ccavResponse
  });