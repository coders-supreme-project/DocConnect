const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const { Op } = require("sequelize");
require("dotenv").config();
const axios = require('axios');
const nodemailer = require('nodemailer');
const qs = require('qs'); 


const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

const sendEmail=async(doctorEmail, patientEmail, meetingLink)=>{
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: GMAIL_USER, pass: GMAIL_PASS },
    });

    const mailOptions = {
        from: GMAIL_USER,
        to: [doctorEmail, patientEmail],
        subject: 'Zoom Consultation Meeting',
        text: `Your Zoom meeting is scheduled. Join here: ${meetingLink}`,
    };

    await transporter.sendMail(mailOptions);
}
async function getZoomToken() {
    try {
        const response = await axios.post(
            `https://zoom.us/oauth/token`,
            qs.stringify({ grant_type: "account_credentials", account_id: process.env.ZOOM_ACCOUNT_ID }),
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
                    ).toString("base64")}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        console.log("Zoom Token Response:", response.data);
        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching Zoom token:", error.response?.data || error.message);
    }
}
module.exports = {
 
createMeeting: async (req, res) => {
    // sendEmail("sadokdronga@gmail.com","saadbennanihoussem@gmail.com","salemo alaykom")
    // console.log(getZoomToken(),"token")
try {

    console.log("hello")
    const { doctorEmail, patientEmail, topic, startTime } = req.body;
    console.log("hello",req.body)

    const token = await getZoomToken();
    console.log(token,"tokeeen")
    
    const response = await axios.post(
        'https://api.zoom.us/v2/users/me/meetings',
        {
            topic,
            type: 2,
            start_time: startTime,
            duration: 30,
            timezone: 'UTC',
            agenda: 'Consultation Meeting',
            settings: {
                host_video: true,
                participant_video: true,
                join_before_host: false,
                mute_upon_entry: true,
                approval_type: 0,
            },
        },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );
      
    const meetingLink = response.data.join_url;
      console.log(meetingLink,"meetinglink")
    // Send email notifications
    await sendEmail(doctorEmail, patientEmail, meetingLink);

    res.json({ meetingLink });
} catch (error) {
    console.error(
        "Error creating Zoom meeting:",
        error.response?.data || error.message
    );}
},
}