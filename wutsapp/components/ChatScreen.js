import { useState, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { useCollection } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app';
import TimeAgo from 'timeago-react';

import { Avatar } from '@mui/material';
import styled from 'styled-components';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import  MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';

import { auth, db } from '../firebase';
import getRecipientEmail from '../utils/getRecipientEmail';
import Message from './Message';

const ChatScreen = ({ chat, messages }) => {
  
  const [user] = useAuthState(auth);
  const endOfMessagesRef = useRef(null);
  
  const [input, setInput] = useState('');
  const recipientEmail = getRecipientEmail(chat.users, user);
  const router = useRouter();
  const [messagesSnapshot] = useCollection(db.collection('chats')
                                             .doc(router.query.id)
                                             .collection('messages')
                                             .orderBy('timestamp', 'asc')
  );

  console.log(recipientEmail);
  const [recipientSnapshot] = useCollection(db.collection('users').where('email', '==', recipientEmail));
  console.log(recipientSnapshot);
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map(message => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime()
          }}
        />
      ))
    } else {
      return JSON.parse(messages).map(message => (
        <Message
          key={message.id}
          user={message.user}
          message={message}
        />
      ))
    }
  }
  
  const sendMessage = (e) => {
    e.preventDefault();

    // Update Last Seen
    db.collection('users').doc(user.uid).set({
      lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    db.collection('chats').doc(router.query.id).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL
    });

    setInput('');
  }

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}

        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>Last active: {' '}
            { recipient?.lastSeen?.toDate() ?  (
              <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
            ) : "Unavailable"}
            </p>
          ) : (
            <p>Loading last active...</p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>

      <InputContainer>
        <InsertEmoticonIcon />
        <Input value={input} onChange={(e) => setInput(e.target.value)}/>
        <MicIcon style={{ marginRight: 10 }}/>
        <IconButton style={{ marginRight: 5 }} disabled={!input} type="submit" onClick={sendMessage}>
          <SendIcon />
        </IconButton>
      </InputContainer>
    </Container>
  )
}

export default ChatScreen

const Container = styled.div`
    width: 100%;
`;

const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 5;
  top: 0;
  height: 80px;
  display: flex;
  padding: 11px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 5;

`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
  background-color: whitesmoke;

`;