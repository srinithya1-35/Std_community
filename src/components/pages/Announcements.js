import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaHeart, FaRegHeart, FaPaperPlane } from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
`;

const Sidebar = styled.div`
  width: 20%;
  border-right: 1px solid #ccc;
  padding: 1rem;
  overflow-y: auto;
`;

const Main = styled.div`
  width: 60%;
  padding: 1rem;
  overflow-y: auto;
`;

const ChatBox = styled.div`
  width: 20%;
  border-left: 1px solid #ccc;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const TabButtons = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? "#333" : "#eee"};
  color: ${props => props.active ? "#fff" : "#333"};
  border: none;
  cursor: pointer;
`;

const Post = styled.div`
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 5px;
`;

const FilePreview = styled.div`
  margin-top: 10px;
`;

const MessageInput = styled.input`
  margin-top: auto;
  padding: 0.5rem;
  width: 100%;
  border: 1px solid #ccc;
`;

const Announcement = () => {
  const [posts, setPosts] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const userId = localStorage.getItem('userId') || '123'; // Example fallback

  useEffect(() => {
    axios.get('http://localhost:3001/posts').then(res => setPosts(res.data));
    axios.get('http://localhost:3001/notes').then(res => setNotes(res.data));
    axios.get('http://localhost:3001/users').then(res => setUsers(res.data));
  }, []);

  const handleLike = postId => {
    setLikes(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleComment = (postId, text) => {
    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), text]
    }));
  };

  const handleFollow = (id) => {
    alert(`You followed user ${id}`);
  };

  const handleMessage = () => {
    if (selectedUser && messageText) {
      alert(`Sent message to ${selectedUser.name}: ${messageText}`);
      setMessageText('');
    }
  };

  const renderMedia = (mediaUrl) => {
    if (!mediaUrl) return null;
    const extension = mediaUrl.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return <img src={mediaUrl} alt="media" style={{ maxWidth: '100%' }} />;
    }
    if (['mp4', 'webm'].includes(extension)) {
      return <video controls width="100%"><source src={mediaUrl} /></video>;
    }
    return <a href={mediaUrl} download target="_blank" rel="noreferrer">Download File</a>;
  };

  return (
    <Container>
      <Sidebar>
        <h3>Users</h3>
        {users.map(user => (
          <div key={user.id} style={{ marginBottom: '1rem' }}>
            <strong>{user.name}</strong>
            <br />
            <button onClick={() => handleFollow(user.id)}>Follow</button>
            <button onClick={() => setSelectedUser(user)}>Message</button>
          </div>
        ))}
      </Sidebar>

      <Main>
        <TabButtons>
          <Button active={activeTab === 'posts'} onClick={() => setActiveTab('posts')}>Posts</Button>
          <Button active={activeTab === 'notes'} onClick={() => setActiveTab('notes')}>Notes</Button>
        </TabButtons>

        {(activeTab === 'posts' ? posts : notes).map(item => (
          <Post key={item.id}>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            <FilePreview>{renderMedia(item.media)}</FilePreview>
            <div style={{ marginTop: '10px' }}>
              <span onClick={() => handleLike(item.id)} style={{ cursor: 'pointer', marginRight: '10px' }}>
                {likes[item.id] ? <FaHeart color="red" /> : <FaRegHeart />}
              </span>
              <input
                type="text"
                placeholder="Add comment"
                onKeyDown={e => {
                  if (e.key === 'Enter') handleComment(item.id, e.target.value);
                }}
              />
              <div>
                {(comments[item.id] || []).map((cmt, idx) => (
                  <p key={idx} style={{ marginLeft: '1rem', fontStyle: 'italic' }}>💬 {cmt}</p>
                ))}
              </div>
            </div>
          </Post>
        ))}
      </Main>

      <ChatBox>
        <h3>Messages</h3>
        {selectedUser ? (
          <>
            <p>To: {selectedUser.name}</p>
            <MessageInput
              placeholder="Type message"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleMessage();
              }}
            />
            <button onClick={handleMessage}><FaPaperPlane /> Send</button>
          </>
        ) : (
          <p>Select a user to chat</p>
        )}
      </ChatBox>
    </Container>
  );
};

export default Announcement;
