import React from "react";
import "./Message.css";

interface MessageType {
    MessageID: number;
    SenderID: number;
    SenderRole: string;
    MessageText: string;
    SentAt: string;
    SenderName?: string;
    PatientID?: number | null;
    DoctorID?: number | null;
}

interface MessageProps {
    message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
    const currentUserId = Number(localStorage.getItem("userId")) || 0;
    
    // ✅ If the sender is a doctor, align left. If it's a patient, align right.
    const isDoctor = message.SenderRole === "Doctor";
    const isPatient = message.SenderRole === "Patient";
    const isSender = message.SenderID === currentUserId;

    // ✅ Apply different styles for doctors (left) and patients (right)
    const messageClass = isDoctor ? "message-left" : "message-right";

    const messageTime = message.SentAt 
        ? new Date(message.SentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) 
        : "Time not available";

    return (
        <div className={`message-container ${messageClass}`}>
            <p className="message-sender"><strong>{message.SenderName}</strong> ({message.SenderRole})</p>
            <p className="message-text">{message.MessageText}</p>
            <p className="message-time">{messageTime}</p>
        </div>
    );
};

export default Message;
