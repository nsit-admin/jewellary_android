import bcrypt from 'bcryptjs';
import e from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import Chits from '../models/chits.js';
import ChitRec from '../models/chitsrec.js';
import CustomerCreds from '../models/customer_creds.js'; 4
import CustMaster from '../models/custmast.js';
import OTP from '../models/otp.js';
import sequelize from '../utils/database.js';


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
                                    console.log(chitReceipt)
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
                                                        res.status(200).json({ message: "user created for mobile use" });
                                                    })
                                                    .catch(err => {
                                                        console.log(err);
                                                        res.status(502).json({ message: "error while creating the user" });
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
            console.log('error', err);
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
                                            console.log(req.body)
                                            Chits.create({
                                                trDate: new Date(),
                                                yrtrno: 555555,
                                                CustName: req.body.customerName,
                                                MobileNo: req.body.mobileNumber,
                                                Add1: req.body.address1,
                                                Add2: req.body.address2,
                                                Add3: req.body.address3,
                                                Stcode: 1,
                                                NoI: 12,
                                                Amt: 0.00,
                                                wt: 0.000,
                                            }).then(() => {
                                                console.log('creating custmast')
                                                CustMaster.create({
                                                    CustName: req.body.customerName,
                                                    MobileNo: req.body.mobileNumber,
                                                    Add1: req.body.address1,
                                                    Add2: req.body.address2,
                                                    Add3: req.body.address3,
                                                    datestamp: '',
                                                }).then(() => {
                                                    response = res.status(200).json({ message: "user created for mobile use" });
                                                }).catch((err) => {
                                                    console.log(err)
                                                })
                                            }).catch((err) => {
                                                console.log(err)
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
            console.log('error', err);
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
                        res.status(401).json({ message: "invalid credentials" });
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
            MobileNo: req.body.mobileNumber,
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
                            chitno: req.body.chitno,
                            trdate: '',
                            instno: req.body.instno,
                            rate: '', // TODO - GEt it from other table during insertion
                            wt: '', // TODO - Calculation to be done
                            datestamp: new Date()

                        }).then((ins) => {
                            console.log(ins)
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
    Chits.findAll({
        where: {
            MobileNo: req.query.mobileNumber
        }
    }).then((chits) => {
        res.status(200).json({ chits: chits });
    })
};

const schemesAddition = (req, res, next) => {
    sequelize.query('SELECT max(trno) pkey from chits')
        .then((val) => {
            console.log()
            const pk = val[0][0].pkey
            Chits.create({
                trDate: new Date(),
                trno: parseInt(pk) + 1,
                yrtrno: parseInt(pk) + 1,
                CustName: req.body.customerName,
                MobileNo: req.body.mobileNumber,
                Add1: req.body.address1,
                Add2: req.body.address2,
                Add3: req.body.address3,
                Stcode: 1,
                NoI: 11,
                instamt: req.body.instamt,
                Amt: 0.00,
                wt: 0.000,
            }).then((chits) => {
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
    axios.get(`https://sms.nettyfish.com/api/v2/SendSMS?SenderId=GHTGHT&
    Message=Thank%20you%20for%20shopping%20%40%20GURU%20HASTI%20THANGA%20MAALIGAI%2C%20POONAMALLEE.%20
    Please%20Visit%20again%20and%20again%21%20Have%20a%20great%20day%21&MobileNumbers=${mobileNumber}
    %2C8608666111&ApiKey=fabf013b-3389-4feb-a4bd-d80e28b3968d&ClientId=eb334565-1b99-4ba1-a0c7-8fb7709fbd82`);
    console.log("sent the smsg");
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
            return res.status(200).json({ message: 'Entered OTP is not valid. Please enter the right one' });
        }
    })
}

export { signupExisting, signupNew, login, schemes, payment, isAuth, schemesAddition, sendSms, sendOtp, verifyOtp };
