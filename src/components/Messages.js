import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  IconButton,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const MessageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 100px)',
  margin: theme.spacing(2),
}));

const ChatArea = styled(Paper)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: '#f5f5f5',
}));

const MessageBubble = styled(Box)(({ theme, isOwn }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(1),
  backgroundColor: isOwn ? theme.palette.primary.main : '#fff',
  color: isOwn ? '#fff' : 'inherit',
  alignSelf: isOwn ? 'flex-end' : 'flex-start',
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
}));

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      // This endpoint needs to be implemented in the backend
      const response = await axios.get('/api/social/conversations');
      setConversations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/social/messages/${userInfo.id}/${userInfo.role === 'teacher' ? 'faculty' : 'student'}/${selectedUser.id}/${selectedUser.role}`
      );
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await axios.post('/api/social/messages', {
        sender_id: userInfo.id,
        sender_type: userInfo.role === 'teacher' ? 'faculty' : 'student',
        receiver_id: selectedUser.id,
        receiver_type: selectedUser.role,
        content: newMessage,
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <MessageContainer>
      <Box sx={{ display: 'flex', height: '100%' }}>
        {/* Conversations List */}
        <Paper sx={{ width: 300, overflow: 'auto', borderRadius: 0 }}>
          <List>
            {conversations.map((conversation) => (
              <ListItem
                key={conversation.id}
                button
                selected={selectedUser?.id === conversation.id}
                onClick={() => setSelectedUser(conversation)}
              >
                <ListItemAvatar>
                  <Avatar>{conversation.name[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={conversation.name}
                  secondary={conversation.role === 'faculty' ? 'Faculty' : 'Student'}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Chat Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <Paper sx={{ p: 2, borderRadius: 0 }}>
                <Typography variant="h6">{selectedUser.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {selectedUser.role === 'faculty' ? 'Faculty' : 'Student'}
                </Typography>
              </Paper>

              {/* Messages */}
              <ChatArea>
                {messages.map((message) => (
                  <MessageBubble
                    key={message.message_id}
                    isOwn={message.sender_id === userInfo.id}
                  >
                    <Typography variant="body1">{message.content}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </Typography>
                  </MessageBubble>
                ))}
                <div ref={messagesEndRef} />
              </ChatArea>

              {/* Message Input */}
              <Paper sx={{ p: 2, borderRadius: 0 }}>
                <form onSubmit={handleSendMessage}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <IconButton color="primary" type="submit">
                      <Send />
                    </IconButton>
                  </Box>
                </form>
              </Paper>
            </>
          ) : (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" color="textSecondary">
                Select a conversation to start messaging
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </MessageContainer>
  );
};

export default Messages; 