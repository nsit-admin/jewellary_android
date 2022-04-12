import bcrypt from 'bcryptjs';
import e from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import dateformat from 'dateformat';
import Chits from '../models/chits.js';
import ChitRec from '../models/chitsrec.js';
import CustomerCreds from '../models/customer_creds.js'; 4
import CustMaster from '../models/custmast.js';
import OTP from '../models/otp.js';
import sequelize from '../utils/database.js';
import { Op } from 'sequelize';


const signupExisting = (req, res, next) => {
    // checks if email already exists
    CustomerCreds.findOne({
        where: {
            mobileNumber: req.body.mobileNumber,
        }
    })
        .then(dbUser => {
            if (dbUser) {
                return res.status(409).json({ message: "mobile Number " + req.body.mobileNumber + " is already signed up. please login" });
            } else {
                Chits.findOne({
                    where: {
                        MobileNo: req.body.mobileNumber,
                    }
                })
                    .then(chitUser => {
                        if (!chitUser) {
                            return res.status(409).json({ message: "mobile Number " + req.body.mobileNumber + " is not registered with GHT. Please use the right phone number or use new user registration" });
                        } else {
                            sequelize.query(`select chtrec.*, max(chtrec.DateStamp) from chits chts, chitrec chtrec where chts.MobileNo = ${req.body.mobileNumber} and chtrec.trno = ${req.body.receiptNo} and chts.TrNo = chtrec.ChitNo group by chtrec.ChitNo`)
                                .then(chitReceipt => {
                                    if (!chitReceipt) {
                                        return res.status(409).json({ message: "Receipt Number isn't right, you have three more attempts remaingin" });
                                    } else if (req.body.mobileNumber && req.body.password) {
                                        // password hash
                                        bcrypt.hash(req.body.password, 12, (err, passwordHash) => {
                                            if (err) {
                                                return res.status(500).json({ message: "couldnt hash the password" });
                                            } else if (passwordHash) {
                                                return CustomerCreds.create({
                                                    mobileNumber: req.body.mobileNumber,
                                                    password: passwordHash,
                                                })
                                                    .then(() => {
                                                        return res.status(200).json({ message: "user created for mobile use" });
                                                    })
                                                    .catch(err => {
                                                        return res.status(502).json({ message: "error while creating the user" });
                                                    });
                                            };
                                        });
                                    }
                                });
                        }
                    });
            }
        })
        .catch(err => {
            return res.status(503).json({ message: "error while creating the user" });
        });
};

const signupNew = (req, res, next) => {
    // checks if email already exists
    CustomerCreds.findOne({
        where: {
            mobileNumber: req.body.mobileNumber,
        }
    })
        .then(dbUser => {
            if (dbUser) {
                return res.status(409).json({ message: "mobile Number " + req.body.mobileNumber + " is already signed up. please login" });
            } else {
                Chits.findOne({
                    where: {
                        MobileNo: req.body.mobileNumber,
                    }
                })
                    .then(chitUser => {
                        if (chitUser) {
                            return res.status(409).json({ message: "mobile Number " + req.body.mobileNumber + " is registered existing customer with GHT. Please use existing user registration" });
                        } else {
                            if (req.body.mobileNumber && req.body.password) {
                                let response = '';
                                // password hash
                                bcrypt.hash(req.body.password, 12, (err, passwordHash) => {
                                    if (err) {
                                        return res.status(500).json({ message: "couldnt hash the password" });
                                    } else if (passwordHash) {
                                        CustomerCreds.create({
                                            mobileNumber: req.body.mobileNumber,
                                            password: passwordHash,
                                        }).then(() => {
                                            sequelize.query('select max(trno) trno, yrtrno from chits')
                                            Chits.create({
                                                trDate: dateFormat(new Date(), "yyyy-mm-dd h:MM:ss"),
                                                trno: parseInt(trno) + 1,
                                                yrtrno: parseInt(yrtrno) + 1,
                                                CustName: req.body.customerName,
                                                MobileNo: req.body.mobileNumber,
                                                Add1: req.body.address1,
                                                Add2: req.body.address2,
                                                Add3: req.body.address3,
                                                Stcode: 1,
                                                NoI: 11,
                                                Amt: 0.00,
                                                wt: 0.000,
                                            }).then(() => {
                                                CustMaster.create({
                                                    CustName: req.body.customerName,
                                                    MobileNo: req.body.mobileNumber,
                                                    Add1: req.body.address1,
                                                    Add2: req.body.address2,
                                                    Add3: req.body.address3,
                                                    datestamp: dateFormat(new Date(), "yyyy-mm-dd h:MM:ss"),
                                                }).then(() => {
                                                    sendNewSignupMsg(req.body.mobileNumber);
                                                    response = res.status(200).json({ message: "user created for mobile use" });
                                                }).catch((err) => {
                                                    response = res.status(502).json({ message: "error while creating the user" });
                                                })
                                            }).catch((err) => {
                                                response = res.status(502).json({ message: "error while creating the user" });
                                            })

                                        })
                                            .catch(err => {
                                                console.log(err);
                                                response = res.status(502).json({ message: "error while creating the user" });
                                            });

                                        return response;
                                    };
                                });
                            }
                        }
                    });
            }
        })
        .catch(err => {
            return res.status(503).json({ message: "error while creating the user" });
        });
};

const login = (req, res, next) => {
    // sendSms('9994501928');
    // checks if mobile number exists
    CustomerCreds.findOne({
        where: {
            mobileNumber: req.body.mobileNumber,
        }
    })
        .then(dbUser => {
            if (!dbUser) {
                return res.status(404).json({ message: "user not found" });
            } else {
                // password hash
                bcrypt.compare(req.body.password, dbUser.password, (err, compareRes) => {
                    if (err) { // error while comparing
                        res.status(502).json({ message: "error while checking user password", err });
                    } else if (compareRes) { // password match
                        const token = jwt.sign({ email: req.body.mobileNumber }, 'secret', { expiresIn: '1h' });
                        Chits.findAll({
                            where: {
                                MobileNo: req.body.mobileNumber
                            }
                        }).then((chits) => {
                            res.status(200).json({ message: "user logged in", chits: chits, "token": token });
                        })
                    } else { // password doesnt match
                        res.status(401).json({ message: "mobile number or password is not correct" });
                    };
                });
            };
        })
        .catch(err => {
            console.log('error', err);
        });
};

const payment = (req, res, next) => {
    // sendSms('9994501928');
    // checks if mobile number exists
    Chits.findOne({ // THIS WILL BE PAYMENT GATEWAAY CALL
        where: {
            MobileNo: req.body.MobileNo,
        }
    })
        .then(dbUser => {
            if (!dbUser) {
                return res.status(404).json({ message: "Gateway Error" });
            } else {
                sequelize.query('SELECT max(trno) pkey from chitrec')
                    .then((val) => {
                        const pk = val[0][0].pkey
                        ChitRec.create({
                            trno: parseInt(pk) + 1,
                            yrtrno: req.body.yrtrno,
                            chitno: req.body.trno,
                            trdate: dateFormat(new Date(), "yyyy-mm-dd h:MM:ss"),
                            instno: req.body.instno,
                            rate: '', // TODO - GEt it from other table during insertion
                            wt: '', // TODO - Calculation to be done
                            datestamp: dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")

                        }).then((ins) => {
                            console.log(ins)
                            sendPaymentSuccess(req.body.mobileNumber);
                            return res.status(200).json({ message: `payment completed for the chitNo - ${req.body.chitno}, your receipt number is ` });
                        }).catch((err) => {
                            console.log(err)
                        })
                    });
            };
        })
        .catch(err => {
            console.log('error', err);
        });
};

const schemes = (req, res, next) => {
    let records = [];
    Chits.findAll({
        where: {
            MobileNo: req.query.mobileNumber,
            [Op.or]: [{ setno: null }, { setno: 0 }]
        }
    })
        .then((chits) => {
            if (chits && chits.length) {
                chits.forEach((cr, index) => {
                    let chit = {};
                    sequelize.query(`SELECT cr.*, max(trdate) FROM ght.chitrec cr where chitno = ${cr.trno}`)
                        .then((rec) => {
                            chit['chits'] = cr;
                            if (rec.length > 0) {
                                chit['receipts'] = rec[0];
                            } else {
                                chit['receipts'] = [];
                            }
                            records.push(chit);
                            if (chits.length === index + 1) {
                                res.status(200).json({ 'records': records });
                            }
                        })
                })
            } else {
                res.status(200).json({ chits: records });
            }
        })
};

const schemesAddition = (req, res, next) => {
    sequelize.query('SELECT max(trno) pkey from chits')
        .then((val) => {
            console.log()
            const pk = val[0][0].pkey
            Chits.create({
                trDate: dateFormat(new Date(), "yyyy-mm-dd h:MM:ss"),
                trno: parseInt(pk) + 1,
                yrtrno: parseInt(pk) + 1,
                CustName: req.body.customerName,
                MobileNo: req.body.mobileNumber,
                Add1: req.body.address1,
                Add2: req.body.address2,
                Add3: req.body.address3,
                Stcode: req.body.chitType,
                NoI: 11,
                instamt: req.body.instamt,
                bonus: req.body.instamt,
                Amt: 0.00,
                wt: 0.000,
            }).then((chits) => {
                sendNewSignupMsg(req.body.mobileNumber);
                res.status(200).json({ chits: chits });
            }).catch((err) => {
                res.status(500).json({ message: "unexpected error occurred while adding new scheme", err });
            })
        }).catch((err) => {
            res.status(500).json({ message: "unexpected error occurred while adding new scheme", err });
        })

};

const isAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: 'not authenticated' });
    };
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'secret');
    } catch (err) {
        return res.status(500).json({ message: err.message || 'could not decode the token' });
    };
    if (!decodedToken) {
        res.status(401).json({ message: 'unauthorized' });
    } else {
        res.status(200).json({ message: 'here is your resource' });
    };
};

const sendSms = (mobileNumber) => {
    axios.get(`https://sms.nettyfish.com/api/v2/SendSMS?SenderId=GHTGHT&Message=Thank%20you%20for%20shopping%20%40%20GURU%20HASTI%20THANGA%20MAALIGAI%2C%20POONAMALLEE.%20Please%20Visit%20again%20and%20again%21%20Have%20a%20great%20day%21&MobileNumbers=${mobileNumber}%2C8608666111&ApiKey=fabf013b-3389-4feb-a4bd-d80e28b3968d&ClientId=eb334565-1b99-4ba1-a0c7-8fb7709fbd82`)
}


const sendOtpMsg = (mobileNumber, otp) => {
    console.log(`https://sms.nettyfish.com/api/v2/SendSMS?SenderId=GHTGHT&Message=${otp}%20is%20your%20one%20time%20password%20for%20your%20phone%20verification%20with%20GURU%20HASTI%20THANGA%20MAALIGAI&MobileNumbers=${mobileNumber}%2C8608666111&ApiKey=fabf013b-3389-4feb-a4bd-d80e28b3968d&ClientId=eb334565-1b99-4ba1-a0c7-8fb7709fbd82`)
    axios.get(`https://sms.nettyfish.com/api/v2/SendSMS?SenderId=GHTGHT&Message=${otp}%20is%20your%20one%20time%20password%20for%20your%20phone%20verification%20with%20GURU%20HASTI%20THANGA%20MAALIGAI&MobileNumbers=${mobileNumber}%2C8608666111&ApiKey=fabf013b-3389-4feb-a4bd-d80e28b3968d&ClientId=eb334565-1b99-4ba1-a0c7-8fb7709fbd82`);
    console.log("sent the smsg");
}

const sendPaymentSuccess = (mobileNumber) => {
    axios.get(`https://sms.nettyfish.com/api/v2/SendSMS?SenderId=GHTGHT&
    Message=Dear%20Customer,%20Thank%20you%20for%20the%20payment%20of%20your%20monthly%20saving%20scheme%20
    with%20GURU%20HASTI%20THANGA%20MAALIGAI.%20Please%20pay%20on%20time%20regularly%20to%20avail%20exciting%20offers!&
    MobileNumbers=${mobileNumber}
    %2C8608666111&ApiKey=fabf013b-3389-4feb-a4bd-d80e28b3968d&ClientId=eb334565-1b99-4ba1-a0c7-8fb7709fbd82`);
}

const sendNewSignupMsg = (mobileNumber) => {
    axios.get(`https://sms.nettyfish.com/api/v2/SendSMS?SenderId=GHTGHT&
    Message=We%20value%20your%20relationship%20with%20GURU%20HASTI%20THANGA%20MAALIGAI%20by%20joining%20our%20monthly%20saving%20scheme%20today.%20Please%20pay%20regularly%20to%20avail%20exciting%20offers!&
    MobileNumbers=${mobileNumber}
    %2C8608666111&ApiKey=fabf013b-3389-4feb-a4bd-d80e28b3968d&ClientId=eb334565-1b99-4ba1-a0c7-8fb7709fbd82`);
}


const sendOtp = (req, res, next) => {
    let otp = Math.floor(100000 + Math.random() * 900000);
    var expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 1);
    console.log(otp)
    bcrypt.hash(otp.toString(), 6, (err, otpHash) => {
        if (err) {
            return res.status(500).json({ message: "couldnt hash the password", err });
        } else {
            OTP.create({
                mobileNumber: req.body.mobileNumber,
                otp_code: otp,
                otp_expiry: expiry.toString(),
                created_dt: new Date().toString()
            }).then((otpRes) => {
                sendOtpMsg(req.body.mobileNumber, otp);
                return res.status(200).json({ message: "OTP sent" });
            }).catch((err) => {
                return res.status(200).json({ message: "OTP sent", err });
            })
        }
    });

}

const checkOtpExists = (mobileNumber, otp) => {
    OTP.findAll({
        where: {
            mobileNumber: mobileNumber,
            otp_code: otp
        }
    }).then((otp) => {
        if (otp) {
            return true;
        }
    });
}

const verifyOtp = (req, res, next) => {
    OTP.findOne({
        where: {
            mobileNumber: req.body.mobileNumber,
            otp_code: req.body.otp
        }
    }).then((otpp) => {
        console.log(otpp)
        if (otpp) {

            OTP.update({
                no_of_tries: parseInt(otpp.no_of_tries) + 1
            }, {
                where: {
                    mobileNumber: req.body.mobileNumber,
                    otp_code: req.body.otp
                }
            })

            if (otpp.no_of_tries > 3) {
                return res.status(200).json({ message: 'You have tried more than allowed limit of entries. Please try a new one' });
            } else {
                if (Date.parse(otpp.otp_expiry) > Date.parse(new Date().toString())) {
                    return res.status(200).json({ message: 'OTP verified' });
                } else {
                    return res.status(200).json({ message: 'OTP expired, please try a new one' });
                }
            }
        } else {
            return res.status(401).json({ message: 'Entered OTP is not valid. Please enter the right one' });
        }
    })
}

const forgotPassword = (req, res, next) => {
    sequelize.query(`select chtrec.*, max(chtrec.DateStamp) from chits chts, chitrec chtrec, mobile_customers mcs where mcs.mobileNumber = chts.MobileNo and chts.MobileNo = 
    ${req.body.mobileNumber} and chtrec.trno = ${req.body.receiptNo} and chts.TrNo = chtrec.ChitNo group by chtrec.ChitNo`)
        .then(chitReceipt => {
            if (chitReceipt.length && chitReceipt[0].length) {
                // TODO 

                // send the password thru SMS

                res.status(200).json({ message: 'SMS will be sent to the registered phone number' });
            } else {
                res.status(200).json({ message: 'SMS will be sent to the registered phone number if the data provided is valid' });
            }
        })
        .catch(err => {

        })
}

export { forgotPassword, signupExisting, signupNew, login, schemes, payment, isAuth, schemesAddition, sendSms, sendOtp, verifyOtp };
