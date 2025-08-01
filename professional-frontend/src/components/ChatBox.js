import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  Divider,
  CircularProgress
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

const ChatBox = ({ analysisResult, isLoading, error }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hello! I\'m your AI Financial Coach. Use the Financial Analysis form to get detailed insights, and feel free to ask me any questions about your finances!'
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const sendChat = async (message) => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://ai-financial-coach-backend.onrender.com';
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage('');
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);

    setChatLoading(true);
    try {
      const response = await sendChat(userMessage);
      setMessages(prev => [...prev, { type: 'bot', text: response.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: 'Sorry, I encountered an error. Please make sure the backend is running and try again.' 
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Add analysis result to chat when it's available
  React.useEffect(() => {
    if (analysisResult) {
      const analysisMessage = `Great! I've analyzed your financial data. Your monthly income is $${analysisResult.monthly_income?.toLocaleString()} and your total expenses are $${analysisResult.total_expenses?.toLocaleString()}. You have $${(analysisResult.monthly_income - analysisResult.total_expenses)?.toLocaleString()} available for budgeting. Feel free to ask me about specific recommendations!`;
      setMessages(prev => [...prev, { type: 'bot', text: analysisMessage }]);
    }
  }, [analysisResult]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 2 }}>
        💬 AI Financial Assistant
      </Typography>
      
      <Paper 
        sx={{ 
          flexGrow: 1,
          height: 400, 
          overflow: 'auto', 
          mb: 2, 
          p: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <List>
          {messages.map((msg, index) => (
            <React.Fragment key={index}>
              <ListItem
                sx={{
                  flexDirection: 'column',
                  alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  px: 1
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: msg.type === 'user' ? 'primary.main' : 'background.paper',
                    color: msg.type === 'user' ? 'white' : 'text.primary',
                    maxWidth: '85%',
                    borderRadius: 3,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </Typography>
                </Paper>
              </ListItem>
              {index < messages.length - 1 && <Divider sx={{ my: 1 }} />}
            </React.Fragment>
          ))}
          {chatLoading && (
            <ListItem sx={{ alignItems: 'flex-start' }}>
              <Paper sx={{ 
                p: 2, 
                backgroundColor: 'background.paper', 
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <CircularProgress size={16} />
                <Typography variant="body2">AI is thinking...</Typography>
              </Paper>
            </ListItem>
          )}
        </List>
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask about your finances..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={chatLoading}
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)'
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={!message.trim() || chatLoading}
          endIcon={chatLoading ? <CircularProgress size={16} /> : <SendIcon />}
          sx={{ minWidth: 'auto', px: 3 }}
        >
          Send
        </Button>
      </Box>

      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          Error: {error}
        </Typography>
      )}
      
      {isLoading && (
        <Typography variant="body2" color="info.main" sx={{ mt: 1 }}>
          📊 Analyzing your financial data...
        </Typography>
      )}
    </Box>
  );
};

export default ChatBox;
