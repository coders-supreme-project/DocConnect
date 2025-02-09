import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Badge, Typography, Paper, Box } from "@mui/material";
import { ChatBubbleOutline } from "@mui/icons-material";

interface Chatroom {
    ChatroomID: number;
    lastMessage?: string;
    unreadCount?: number;
    ChatroomDoctor?: { firstName: string, profilePicture?: string };
    Patient?: { firstName: string, profilePicture?: string };
}

const ChatroomList: React.FC = () => {
    const [chatrooms, setChatrooms] = useState<Chatroom[] | null>(null);
    const navigate = useNavigate();
    const userId = Number(localStorage.getItem("userId"));
    const role = localStorage.getItem("role") || "";

    useEffect(() => {
        const fetchChatrooms = async () => {
            try {
                const response = await axios.get<{ chatrooms: Chatroom[] }>(
                    `http://localhost:5000/api/chats?userId=${userId}&role=${role}`
                );
                setChatrooms(response.data.chatrooms);
            } catch (error) {
                console.error("Error fetching chatrooms:", error);
            }
        };

        if (userId && role) {
            fetchChatrooms();
        }
    }, [userId, role]);

    return (
        <Box sx={{ maxWidth: 500, margin: "auto", mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}>
                Your Chats
            </Typography>
            <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
                <List>
                    {chatrooms?.length ? (
                        chatrooms.map((chatroom) => (
                            <ListItem
                                key={chatroom.ChatroomID}
                                button
                                onClick={() => navigate(`/chatroom/${chatroom.ChatroomID}`)}
                                sx={{
                                    "&:hover": { backgroundColor: "#f5f5f5" },
                                    transition: "0.3s",
                                    padding: "12px 16px"
                                }}
                            >
                                {/* ✅ Profile Picture */}
                                <ListItemAvatar>
                                    <Avatar
                                        src={
                                            role === "Patient"
                                                ? chatroom.ChatroomDoctor?.profilePicture || "/default-doctor.png"
                                                : chatroom.Patient?.profilePicture || "/default-patient.png"
                                        }
                                    />
                                </ListItemAvatar>

                                {/* ✅ Chat Details */}
                                <ListItemText
                                    primary={
                                        <Typography sx={{ fontWeight: "bold" }}>
                                            {role === "Patient"
                                                ? chatroom.ChatroomDoctor?.firstName
                                                : chatroom.Patient?.firstName}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography
                                            sx={{
                                                fontSize: "14px",
                                                color: "gray",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                maxWidth: "250px"
                                            }}
                                        >
                                            {chatroom.lastMessage ? chatroom.lastMessage : "No messages yet..."}
                                        </Typography>
                                    }
                                />

                                {/* ✅ Unread Messages */}
                                {chatroom.unreadCount && chatroom.unreadCount > 0 ? (
                                    <Badge badgeContent={chatroom.unreadCount} color="error">
                                        <ChatBubbleOutline sx={{ color: "#1976D2" }} />
                                    </Badge>
                                ) : (
                                    <ChatBubbleOutline sx={{ color: "gray" }} />
                                )}
                            </ListItem>
                        ))
                    ) : (
                        <Typography sx={{ textAlign: "center", py: 2, color: "gray" }}>
                            No active chats
                        </Typography>
                    )}
                </List>
            </Paper>
        </Box>
    );
};

export default ChatroomList;
