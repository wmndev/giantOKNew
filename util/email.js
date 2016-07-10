var nodemailer = require('nodemailer');

var transport = nodemailer.createTransport("SMTP", {
    service: 'Gmail',
    auth: {
        user: 'gokchef@gmail.com',
        pass: 'zoobie11'
    }
});

console.log('SMTP Configured');


// Message object
var message = {

    // sender info
    from: 'The Giant Chef <gokchef@gmail.com>',

    // Comma separated list of recipients
    //    to: '"Yuval" <yuvalby@gmail.com>',

    // Subject of the message
    subject: '✔ Your Order Is Being Prepared',

    // plaintext body
    text: 'We got you covered!',

    // HTML body
    html: '<p><b>Hello</b></p>' +
        '<p>Relax, Enjoy and wait for Shmulik to $%%$% your ass<br/></p>'
};

var sendOrderMail = function (toEmail) {
    message.to = '\"Costumer\" ' + '<' + toEmail + '>';
    transport.sendMail(message, function (error) {
        if (error) {
            console.error('Error in sendig email to:' + toEmail + '. The error is:' + error);
            return;
        }
        console.info('Email sent to: ' + toEmail);
    });
}

var exports = module.exports = {};

exports.sendOrderEmail = sendOrderMail;
