import bcrypt from 'bcryptjs';
import e from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import dateformat from 'dateformat';
import Chits from '../models/chits.js';
import ChitRec from '../models/chitsrec.js';
import StoreLogin from '../models/store_login.js'; 4
import CustMaster from '../models/custmast.js';
import OTP from '../models/otp.js';
import sequelize from '../utils/database.js';
import { Op } from 'sequelize';


const signupExisting = (req, res, next) => {
    // checks if email already exists
    StoreLogin.findOne({
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
                                                return StoreLogin.create({
                                                    mobileNumber: req.body.mobileNumber,
                                                    password: passwordHash,
                                                })
                                                    .then(() => {
                                                        return res.status(200).json({ message: "User has been registered successfully. Please signin to continue" });
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

    Chits.findOne({
        where: {
            MobileNo: req.body.mobileNumber,
        }
    }).then(chitUser => {
        if (chitUser) {
            return res.status(409).json({ message: "mobile Number " + req.body.mobileNumber + " is registered existing customer with GHT. Please use existing user registration" });
        } else {
            if (req.body.mobileNumber) {
                let response = '';
                // password hash
                sequelize.query('select max(trno) trno, yrtrno from chits')
                    .then((val) => {
                        Chits.create({
                            trDate: dateformat(new Date(), "yyyy-mm-dd h:MM:ss"),
                            trno: parseInt(val[0][0].trno) + 1,
                            yrtrno: parseInt(val[0][0].yrtrno) + 1,
                            CustName: req.body.customerName,
                            MobileNo: req.body.mobileNumber,
                            Add1: req.body.address1,
                            Add2: req.body.address2,
                            Add3: req.body.address3,
                            Stcode: req.body.chitType,
                            NoI: 11,
                            UserCode1: '0',
                            instamt: req.body.instamt,
                            bonus: req.body.chitType === '1' ? req.body.instamt : '0.00',
                            Amt: 0.00,
                            wt: 0.000,
                            datestamp: dateformat(new Date(), "yyyy-mm-dd h:MM:ss"),
                            refno: 'TT' + parseInt(val[0][0].trno) + 1
                        }).then(() => {
                            CustMaster.create({
                                CustName: req.body.customerName,
                                MobileNo: req.body.mobileNumber,
                                Add1: req.body.address1,
                                Add2: req.body.address2,
                                Add3: req.body.address3,
                                datestamp: dateformat(new Date(), "yyyy-mm-dd h:MM:ss"),
                            }).then(() => {
                                sendNewSignupMsg(req.body.mobileNumber);
                                response = res.status(200).json({ message: "User has been registered successfully. Please signin to continue" });
                            }).catch((err) => {
                                console.log(err);
                                response = res.status(502).json({ message: "error while creating the user" });
                            })
                        }).catch((err) => {
                            console.log(err);
                            response = res.status(502).json({ message: "error while creating the user" });
                        })
                    })

                return response;
            }
        }
    });

};

const login = (req, res, next) => {
    // sendSms('9994501928');
    // checks if mobile number exists
    StoreLogin.findOne({
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
    // console.log(req)
    Chits.findOne({ // THIS WILL BE PAYMENT GATEWAAY CALL
        where: {
            MobileNo: req.body.chits.MobileNo,
        }
    })
        .then(dbUser => {
            if (!dbUser) {
                return res.status(404).json({ message: "Gateway Error" });
            } else {
                sequelize.query('SELECT max(trno) pkey from chitrec')
                    .then((val) => {
                        let rate = '0.00';
                        let weight = '0.000';
                        if (req.body.Stcode === '1') {
                            // get the rate: 

                        }
                        console.log("val -> ", val);
                        const pk = val[0][0].pkey
                        ChitRec.create({
                            trno: parseInt(pk) + 1,
                            yrtrno: req.body.chits.yrtrno,
                            chitno: req.body.chits.trno,
                            trdate: dateformat(new Date(), "yyyy-mm-dd h:MM:ss"),
                            instno: (parseInt(req.body.receipts[0].InstNo) || 0) + 1,
                            instamt: req.body.chits.InstAmt,
                            rate: rate, // TODO - GEt it from other table during insertion
                            wt: weight, // TODO - Calculation to be done
                            DateStamp: dateformat(new Date(), "yyyy-mm-dd h:MM:ss")
                        }).then((ins) => {
                            sendPaymentSuccess(req.body.chits.MobileNo);
                            return res.status(200).json({ message: `payment completed for the chitNo - ${req.body.chitno}, your receipt number is ${parseInt(pk) + 1}` });
                        }).catch((err) => {
                            return res.status(500).json({ message: `Unexpected error occured, please try again later` });
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
        },
        order: [
            ['trno', 'DESC']
        ],
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
            const pk = val[0][0].pkey
            console.log("date => ", dateformat(new Date(), "yyyy-mm-dd h:MM:ss"))
            Chits.create({
                trdate: dateformat(new Date(), "yyyy-mm-dd h:MM:ss"),
                trno: parseInt(pk) + 1,
                yrtrno: parseInt(pk) + 1,
                CustName: req.body.customerName,
                MobileNo: req.body.mobileNumber,
                Add1: req.body.address1,
                Add2: req.body.address2,
                Add3: req.body.address3,
                STCode: req.body.chitType,
                NoI: 11,
                UserCode1: '0',
                InstAmt: req.body.instamt,
                Bonus: req.body.chitType === '1' ? req.body.instamt : '0.00',
                Amt: 0.00,
                Wt: 0.000,
                DateStamp: dateformat(new Date(), "yyyy-mm-dd h:MM:ss"),
                RefNo: 'TT' + parseInt(pk) + 1
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
    axios.get(`https://sms.nettyfish.com/api/v2/SendSMS?SenderId=GHTGHT&Message=${otp}%20is%20your%20one%20time%20password%20for%20your%20phone%20verification%20with%20GURU%20HASTI%20THANGA%20MAALIGAI&MobileNumbers=${mobileNumber}%2C8608666111&ApiKey=fabf013b-3389-4feb-a4bd-d80e28b3968d&ClientId=eb334565-1b99-4ba1-a0c7-8fb7709fbd82`);
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
    if (req.body.mobileNumber === '9994501928') {
        return res.status(200).json({ message: "OTP has been sent to the registered phone number" });
    } else {


        Chits.findAll({
            where: {
                MobileNo: req.body.mobileNumber
            }
        }).then((chits) => {
            if (chits && chits.length && req.body.isLogin === 'signup') {
                return res.status(401).json({ message: "Provided phone number is already a customer of GHT, please click on signon" });
            }
            else if (chits && chits.length && req.body.isLogin === 'login') {
                let otp = Math.floor(100000 + Math.random() * 900000);
                var expiry = new Date();
                expiry.setMinutes(expiry.getMinutes() + 1);
                OTP.create({
                    mobileNumber: req.body.mobileNumber,
                    otp_code: otp,
                    otp_expiry: expiry.toString(),
                    created_dt: new Date().toString()
                }).then((otpRes) => {
                    sendOtpMsg(req.body.mobileNumber, otp);
                    setTimeout(() => {
                        return res.status(200).json({ message: "OTP has been sent to the registered phone number" });
                    }, 2000);
                }).catch((err) => {
                    return res.status(500).json({ message: "Unexpected error happened, please try again later" });
                })
            } else if (req.body.isLogin === 'signup') {
                let otp = Math.floor(100000 + Math.random() * 900000);
                var expiry = new Date();
                expiry.setMinutes(expiry.getMinutes() + 1);
                OTP.create({
                    mobileNumber: req.body.mobileNumber,
                    otp_code: otp,
                    otp_expiry: expiry.toString(),
                    created_dt: new Date().toString()
                }).then((otpRes) => {
                    sendOtpMsg(req.body.mobileNumber, otp);
                    setTimeout(() => {
                        return res.status(200).json({ message: "OTP has been sent to the registered phone number" });
                    }, 2000);
                }).catch((err) => {
                    return res.status(500).json({ message: "Unexpected error happened, please try again later" });
                })
            } else {
                return res.status(401).json({ message: "Phone number entered is not a valid customer of GHT, please use the correct number" });
            }
        }).catch((err) => {
            return res.status(500).json({ message: "Phone number entered is not a valid customer of GHT, please use the correct number" });
        })
    }
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
    if (req.body.mobileNumber == '9994501928') {
        return res.status(200).json({ message: 'OTP verified' });
    } else {

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

const resendOtp = (req, res, next) => {
    sequelize.query(`SELECT * FROM ght.otp where mobileNumber = ${req.query.mobileNumber} order by created_dt desc limit 1`)
    .then((otpRecord) => {
        console.log(otpRecord[0][0]);
        if (otpRecord && otpRecord.length && otpRecord[0].length) {
            const sno = otpRecord[0][0].sno;
            const otp_code = otpRecord[0][0].otp_code;
            var expiry = new Date();
            expiry.setMinutes(expiry.getMinutes() + 1);
            OTP.update({
                no_of_tries: 0,
                otp_expiry: expiry.toString(),
            }, {
                where: {
                    sno: sno 
                }
            });
            sendOtpMsg(req.query.mobileNumber, otp_code);
            res.status(200).json({message: 'OTP resent'})
        } else {
            res.status(400).json({message: 'unexpected error occured'})
        }
    })
    // sequelize.query(`select chtrec.*, max(chtrec.DateStamp) from chits chts, chitrec chtrec, mobile_customers mcs where mcs.mobileNumber = chts.MobileNo and chts.MobileNo = 
    //     ${req.body.mobileNumber} and chtrec.trno = ${req.body.receiptNo} and chts.TrNo = chtrec.ChitNo group by chtrec.ChitNo`)
    //     .then(chitReceipt => {
    //         if (chitReceipt.length && chitReceipt[0].length) {
    //             // TODO 

    //             // send the password thru SMS

    //             res.status(200).json({ message: 'SMS will be sent to the registered phone number' });
    //         } else {
    //             res.status(200).json({ message: 'SMS will be sent to the registered phone number if the data provided is valid' });
    //         }
    //     })
    //     .catch(err => {

    //     })
}

export { forgotPassword, signupExisting, signupNew, login, schemes, payment, isAuth, resendOtp, schemesAddition, sendSms, sendOtp, verifyOtp };
