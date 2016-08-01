var nodemailer = require('nodemailer');
var inlineCss = require('nodemailer-juice');

var transport = nodemailer.createTransport("SMTP", {
    service: 'Gmail',
    auth: {
        user: 'gokchef@gmail.com',
        pass: 'zoobie11'
    }
});
//transport.use('compile', inlineCss());

console.log('SMTP Configured');


// Message object

var messages = {
    confirmEmail: {
        // sender info
        from: 'The Giant Chef <gokchef@gmail.com>',
        subject: 'GiantOK - Order Confirmation ✔ ',
        // plaintext body
        text: 'We got you covered!',
        // HTML body
        html: '<h3><b>Dear customer,</b></h3>' +
            '<p>Thank you for your recent order at <a href="https://giantok.herokuapp.com">GiantOK</a>.</p><br>' +
            '<p>Our cooking squad is getting ready to deliever another hearty meal.<br>' +
            '<p>We appriciate your business, <br> Yuval and the team</p><br>' +
            '<a href="https://giantok.herokuapp.com">GiantOK</a>, Make Lunch Great Again!'
    },
    orderPrepared: {
        from: 'The Giant Chef <gokchef@gmail.com>',
        subject: 'GiantOK - Order is being prepared',
    }


};



var sendConfirmOrderMail = function (toEmail) {
    messages.confirmEmail.to = '\"Costumer\" ' + '<' + toEmail + '>';;
    sendMail(messages.confirmEmail);
}

var sendOrderPreparedMail = function (data) {
    console.log('in sendOrderPreparedMail');
    var to = [];
        data.to.forEach(function (email) {
            to += '\"Costumer\" ' + '<' + email + '>;'
        });

    console.log('to: '+ to );
    messages.orderPrepared.to = to;
    messages.orderPrepared.html = data.content;
    sendMail(messages.orderPrepared);
}

function sendMail(message) {
    transport.sendMail(message, function (error) {
        if (error) {
            console.error('Error in sendig email to:' + message.to + '. The error is:' + error);
            return;
        }
        console.info('Email sent to: ' + message.to);
    });
}



var exports = module.exports = {};

exports.sendConfirmOrderMail = sendConfirmOrderMail;
exports.sendOrderPreparedMail = sendOrderPreparedMail;
