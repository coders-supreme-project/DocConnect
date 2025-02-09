import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket/socket";
import Message from "./Message";
import "./ChatRoom.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";     

interface MessageType {
    MessageID: number;
    ChatroomID: number;
    SenderID: number;
    SenderRole: string;
    MessageText: string;
    SentAt: string;
    SenderName?: string;
}

const Chatroom: React.FC = () => {
    const navigate = useNavigate()
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");

    const userId = Number(localStorage.getItem("userId"));
    const userRole = localStorage.getItem("role") || "";
    const userName = localStorage.getItem("firstName") || "You";
    const { chatroomId } = useParams<{ chatroomId: string }>();

    if (!chatroomId || isNaN(Number(chatroomId))) {
        return <div>Error: Invalid Chatroom ID</div>;
    }

    const parsedChatroomId = Number(chatroomId);

    // ✅ Fetch messages on component mount
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get<{ messages: MessageType[] }>(
                    `http://localhost:5000/api/messages/${parsedChatroomId}`
                );
                setMessages(response.data.messages || []);
            } catch (error) {
                console.error("❌ Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, [parsedChatroomId]);

    // ✅ WebSocket: Listen for new messages and refresh the page
    useEffect(() => {
        socket.emit("join_room", `chatroom-${parsedChatroomId}`);

        socket.on("receive_message", (newMessage: MessageType) => {
            console.log("📩 New message received:", newMessage);
            window.location.reload(); // ✅ Refresh page when a new message arrives
        });

        return () => {
            socket.off("receive_message");
        };
    }, [parsedChatroomId]);

    // ✅ Send Message
    const sendMessage = async () => {
        if (newMessage.trim() === "") return;
    
        const messagePayload = {
            chatroomId: parsedChatroomId,
            messageText: newMessage,
            PatientID: userRole === "Patient" ? userId : null,
            DoctorID: userRole === "Doctor" ? userId : null
        };
    
        console.log("📤 Sending message:", messagePayload);
    
        try {
            const response = await axios.post<{ message: MessageType }>(
                "http://localhost:5000/api/messages",
                messagePayload
            );
    
            const newMsg = response.data.message;
    
            socket.emit("send_message", newMsg);
    
            setMessages((prevMessages) => [...prevMessages, newMsg]);
            window.location.reload(); // ✅ Refresh after sending a message
    
        } catch (error) {
            console.error("❌ Error sending message:", error);
        }
    
        setNewMessage(""); 
    };

    return (
        <div className="chatroom-container">
             <button className="chatroom-close-btn" onClick={() => navigate("/")}>
                ❌
            </button>
            <h1 className="chatroom-title">Chatroom {parsedChatroomId}</h1>
            <div className="chatroom-messages">
                {messages.map((msg) => (
                    <Message key={`${msg.MessageID}-${msg.SentAt}`} message={msg} />
                ))}
            </div>
            <div className="chatroom-input-container">
                <input
                    type="text"
                    className="chatroom-input"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage} className="chatroom-send-btn">Send</button>
            </div>
        </div>
    );
};

export default Chatroom;
