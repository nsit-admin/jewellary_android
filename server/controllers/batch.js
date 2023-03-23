import bcrypt from "bcryptjs";
import e from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import dateformat from "dateformat";
import Chits from "../models/chits.js";
import ChitRec from "../models/chitsrec.js";
import StoreLogin from "../models/store_login.js";
import CustMaster from "../models/custmast.js";
import OTP from "../models/otp.js";
import sequelize from "../utils/database.js";
import pkg from "sequelize";
const { Op } = pkg;
import payment_details from "../models/payment_details.js";
import rates from "../models/rate.js";

sequelize.query("SELECT pdt.* FROM payment_details pdt where pdt.order_status in ('pending') and DATE(pdt.created_date) BETWEEN CURDATE() - INTERVAL 100 DAY AND CURDATE()")
    .then((res) => {
        res[0].forEach((paym, index) => {
                axios({
                    method: 'get',
                    url: `https://guruhastithangamaaligai.com/status/status.php?order_no=${paym.order_id}`
                }).then((phpRes) => {
                    const orderRes = phpRes?.data?.Order_Status_Result;
                    if (orderRes?.status == 0) {
                        console.log(phpRes.data);
                        var paymentMode = {
                            "OPTCASHC": "Cash card",
                            "OPTCRDC": "Credit Card",
                            "OPTDBCRD": "Debit Card",
                            "OPTEMI": "EMI",
                            "OPTIVRS": "IVRS",
                            "OPTMOBP": "MobilePayments",
                            "OPTNBK": "Net Banking",
                            "OPTNBK": "Net Banking",
                            "OPTUPI": "Unified Payments"
                        }

                        payment_details
                            .update(
                                {
                                    tracking_id: orderRes.reference_no ? orderRes.reference_no : '',
                                    bank_ref_no: orderRes.order_bank_ref_no ? orderRes.order_bank_ref_no : '',
                                    order_status: orderRes.order_status == 'Shipped' ? 'Success' : orderRes.order_status,
                                    payment_mode: paymentMode[orderRes.order_option_type],
                                    status_message: orderRes.order_bank_response ? orderRes.order_bank_response : '',
                                    amount: orderRes.order_amt,
                                    trans_date: orderRes.order_status_date_time ? orderRes.order_status_date_time : '',
                                    updated_date: dateformat(new Date(), "yyyy-mm-dd h:MM:ss"),
                                },
                                {
                                    where: {
                                        order_id: orderRes.order_no,
                                    },
                                    returning: true,
                                    plain: true,
                                }
                            )
                            .then((up) => {
                                if (orderRes.order_status == "Success") {
                                    payment_details
                                        .findOne({
                                            order_id: orderRes.order_no,
                                        })
                                        .then((e) => {
                                            const chtPy = e.toJSON();
                                            sequelize
                                                .query(
                                                    `SELECT * FROM payment_details pay, chits cts where pay.order_id = '${orderRes.order_no}' and cts.TrNo = pay.customer_chit_no`
                                                )
                                                .then((rec) => {
                                                    const vl = rec[0][0];
                                                    Chits.update(
                                                        {
                                                            InstPaid: parseInt(vl.InstPaid) + 1,
                                                        },
                                                        {
                                                            where: {
                                                                MobileNo: vl.MobileNo,
                                                                TrNo: vl.TrNo,
                                                            },
                                                        }
                                                    ).then((d) => {
                                                        sequelize
                                                            .query(
                                                                `SELECT * FROM chits c, payment_details p where c.YrTrNo = p.customer_chit_no and p.order_id = '${orderRes.order_no}'`
                                                            )
                                                            .then((dd) => {
                                                                const chitt = dd[0][0];
                                                                sequelize
                                                                    .query("SELECT max(trno) pkey from chitrec")
                                                                    .then((val) => {
                                                                        let weight = "0.000";
                                                                        rates.findAll({
                                                                            limit: 1,
                                                                            order: [[sequelize.col('DateTime'), 'DESC']],
                                                                        })
                                                                            .then((va) => {
                                                                                const rate = va[0];
                                                                                if (chitt.STCode == 1) {
                                                                                    weight =
                                                                                        Number(chitt.InstAmt) / Number(rate.GoldRate22);
                                                                                }
                                                                                const pk = val[0][0].pkey;
                                                                                ChitRec.create({
                                                                                    trno: parseInt(pk) + 1,
                                                                                    yrtrno: chitt.YrTrNo,
                                                                                    chitno: chitt.TrNo,
                                                                                    trdate: dateformat(
                                                                                        new Date(),
                                                                                        "yyyy-mm-dd h:MM:ss"
                                                                                    ),
                                                                                    instno: parseInt(vl.InstPaid) + 1,
                                                                                    instamt: chitt.InstAmt,
                                                                                    remarks: 'ONLINE PAYMENT',
                                                                                    rate: rate.GoldRate22, // TODO - GEt it from other table during insertion
                                                                                    wt: weight, // TODO - Calculation to be done
                                                                                    DateStamp: dateformat(
                                                                                        new Date(),
                                                                                        "yyyy-mm-dd h:MM:ss"
                                                                                    ),
                                                                                })
                                                                                    .then((ins) => {
                                                                                        sendPaymentSuccess(chitt.MobileNo);
                                                                                        console.log({
                                                                                            message: `payment completed for the chitNo - ${chitt.yrtrno
                                                                                                }, your receipt number is ${parseInt(pk) + 1
                                                                                                }`,
                                                                                        });
                                                                                    })
                                                                                    .catch((err) => {
                                                                                        console.log(err);
                                                                                        console.log({
                                                                                            message: `Unexpected error occured, please try again later`,
                                                                                        });
                                                                                    });
                                                                            });

                                                                        // }
                                                                    });
                                                            });
                                                    });
                                                });
                                        })
                                        .catch((err) => {
                                            console.log("error", err);
                                        });
                                }
                            })
                            .catch((err) => {
                                console.log("error", err);
                            });
                    } else {
                        console.log(phpRes.data);
                    }
                })
        })
    })


