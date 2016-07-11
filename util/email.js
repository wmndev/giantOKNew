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
    subject: 'GiantOK - Order Confirmation ✔ ',

    // plaintext body
    text: 'We got you covered!',

    // HTML body
    html: '<p><b>Dear customer,</b></p>' +
        '<p>Thank you for your recent order at <a href="">GiantOK</a>.<br/></p>' +
        '<p>Our cooking squad is getting ready to deliever another hearty meal. Your giantok will wait for you in the pantry '+
        'by -DATE- at noon</p>' +
        '<p>We appriciate your business, <br/> Yuval and the team</p><br/>' +
        '<a href="">GiantOK</a>, Make Lunch Great Again!'
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