import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Card, Input, Button, Typography, Space, List, Avatar, message, Spin } from 'antd';
import { UserOutlined, SendOutlined, SearchOutlined, CheckOutlined, ArrowLeftOutlined } from '@ant-design/icons';
const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Chats = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { token: stateToken, username, uniqueId: userId } = location.state || {
        token: localStorage.getItem('token'),
        username: localStorage.getItem('username'),
        uniqueId: localStorage.getItem('uniqueId'),
    };

    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [searchedUser, setSearchedUser] = useState(null);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${stateToken}`,
        },
    });

    console.log('Chats - Token:', stateToken);
    console.log('Chats - UserId:', userId);
    console.log('Chats - Username:', username);

    useEffect(() => {
        if (!stateToken || !userId) {
            setError('Authentication required. Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }
        fetchFriends();
        fetchFriendRequests();
    }, [stateToken, userId, navigate]);

    const fetchFriends = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get(`/api/auth/friends/${userId}`);
            if (response.data.success) {
                setFriends(response.data.friends || []);
            } else {
                setError('Failed to fetch friends: ' + response.data.message);
            }
        } catch (error) {
            setError('Error fetching friends: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const fetchFriendRequests = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get(`/api/auth/friend-requests/${userId}`);
            if (response.data.success) {
                setFriendRequests(response.data.requests || []);
            } else {
                setError('Failed to fetch friend requests: ' + response.data.message);
            }
        } catch (error) {
            setError('Error fetching friend requests: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (friendId) => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get(`/api/auth/messages/${friendId}`);
            if (response.data.success) {
                setMessages(response.data.messages || []);
            } else {
                setError('Failed to fetch messages: ' + response.data.message);
            }
        } catch (error) {
            setError('Error fetching messages: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleSearchUser = async () => {
        if (!searchId.trim()) {
            setError('Please enter a Unique ID to search.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await api.get(`/api/auth/user/${searchId}`);
            if (response.data.success) {
                setSearchedUser(response.data);
            } else {
                setSearchedUser(null);
                setError('User not found: ' + response.data.message);
            }
        } catch (error) {
            setSearchedUser(null);
            setError('Error searching user: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleSendFriendRequest = async () => {
        if (!searchedUser) {
            setError('Please search for a user first.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/api/auth/friends/add', {
                userId,
                friendId: searchedUser.uniqueId,
            });
            if (response.data.success) {
                setSearchId('');
                setSearchedUser(null);
                message.success('Friend request sent!');
                setError(''); // Clear error on success
            } else {
                setError('Failed to send friend request: ' + response.data.message);
            }
        } catch (error) {
            setError('Error sending friend request: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptFriendRequest = async (friendId) => {
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/api/auth/friends/accept', {
                userId,
                friendId,
            });
            if (response.data.success) {
                setFriendRequests(friendRequests.filter((req) => req.senderId !== friendId));
                fetchFriends(); // Refresh friends list
                message.success('Friend request accepted!');
                setError(''); // Clear error on success
            } else {
                setError('Failed to accept friend request: ' + response.data.message);
            }
        } catch (error) {
            setError('Error accepting friend request: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedFriend) {
            setError('Please select a friend and type a message.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/api/auth/messages/send', {
                senderId: userId,
                receiverId: selectedFriend.uniqueId,
                content: newMessage,
            });
            if (response.data.success) {
                setNewMessage('');
                fetchMessages(selectedFriend.uniqueId); // Refresh messages
                message.success('Message sent!');
                setError(''); // Clear error on success
            } else {
                setError('Failed to send message: ' + response.data.message);
            }
        } catch (error) {
            setError('Error sending message: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleSelectFriend = (friend) => {
        setSelectedFriend(friend);
        fetchMessages(friend.uniqueId);
    };

    const handleBackToHome = () => {
        navigate('/userhome', { state: { token: stateToken, username, uniqueId: userId } });
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ background: '#001529', padding: '0 16px' }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Title level={3} style={{ color: '#fff', margin: 0 }}>
                        Chat Room - Welcome, {username || 'User'}
                    </Title>
                    <Button
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                        onClick={handleBackToHome}
                    >
                        Back to Home
                    </Button>
                </Space>
            </Header>
            <Content style={{ padding: '24px', background: '#f0f2f5' }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Card title="Add Friend" style={{ width: '100%' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Input
                                placeholder="Search by Unique ID"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                prefix={<SearchOutlined />}
                                onPressEnter={handleSearchUser}
                            />
                            <Button
                                type="primary"
                                onClick={handleSearchUser}
                                loading={loading}
                                block
                            >
                                Search
                            </Button>
                            {searchedUser && (
                                <Card>
                                    <Space>
                                        <Avatar icon={<UserOutlined />} />
                                        <Text strong>{searchedUser.username}</Text>
                                        <Text type="secondary">(ID: {searchedUser.uniqueId})</Text>
                                        <Button
                                            type="primary"
                                            onClick={handleSendFriendRequest}
                                            loading={loading}
                                        >
                                            Send Friend Request
                                        </Button>
                                    </Space>
                                </Card>
                            )}
                        </Space>
                    </Card>

                    <Card title="Friend Requests" style={{ width: '100%' }}>
                        {friendRequests.length > 0 ? (
                            <List
                                dataSource={friendRequests}
                                renderItem={(request) => (
                                    <List.Item
                                        actions={[
                                            <Button
                                                type="primary"
                                                icon={<CheckOutlined />}
                                                onClick={() => handleAcceptFriendRequest(request.senderId)}
                                                loading={loading}
                                            >
                                                Accept
                                            </Button>,
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar icon={<UserOutlined />} />}
                                            title={request.senderUsername}
                                            description={`ID: ${request.senderId}`}
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Text>No pending friend requests.</Text>
                        )}
                    </Card>

                    <Card title="Your Friends" style={{ width: '100%' }}>
                        {friends.length > 0 ? (
                            <List
                                dataSource={friends}
                                renderItem={(friend) => (
                                    <List.Item
                                        actions={[
                                            <Button
                                                type="primary"
                                                onClick={() => handleSelectFriend(friend)}
                                                loading={loading}
                                            >
                                                Chat
                                            </Button>,
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar icon={<UserOutlined />} />}
                                            title={friend.username}
                                            description={`ID: ${friend.uniqueId}`}
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Text>No friends yet. Add some!</Text>
                        )}
                    </Card>

                    {selectedFriend && (
                        <Card title={`Chat with ${selectedFriend.username}`} style={{ width: '100%' }}>
                            {loading ? (
                                <Spin tip="Loading messages..." />
                            ) : (
                                <>
                                    <div
                                        style={{
                                            maxHeight: '300px',
                                            overflowY: 'auto',
                                            padding: '10px',
                                            background: '#fafafa',
                                            border: '1px solid #d9d9d9',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        {messages.map((msg, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    textAlign: msg.senderId === userId ? 'right' : 'left',
                                                    margin: '5px 0',
                                                }}
                                            >
                                                <Text strong>
                                                    {msg.senderId === userId ? 'You' : selectedFriend.username}:
                                                </Text>{' '}
                                                <Text>{msg.content}</Text>
                                                <Text
                                                    type="secondary"
                                                    style={{ fontSize: '10px', marginLeft: '5px' }}
                                                >
                                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                                </Text>
                                            </div>
                                        ))}
                                    </div>
                                    <Space style={{ width: '100%' }}>
                                        <Input
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your message..."
                                            onPressEnter={handleSendMessage}
                                        />
                                        <Button
                                            type="primary"
                                            icon={<SendOutlined />}
                                            onClick={handleSendMessage}
                                            loading={loading}
                                        >
                                            Send
                                        </Button>
                                    </Space>
                                </>
                            )}
                        </Card>
                    )}

                    {error && <Text type="danger">{error}</Text>}
                </Space>
            </Content>
        </Layout>
    );
};

export default Chats;