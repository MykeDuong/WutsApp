import styled from "styled-components";
import Head from "next/head";
import { useAuthState } from 'react-firebase-hooks/auth';

import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import { auth, db } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";

const Chat = ({ messages, chat }) => {

    const [user] = useAuthState(auth);



    return (
        <Container>
            <Head>
                <title>Chat with {getRecipientEmail(chat.users, user)}</title>
            </Head>
            <Sidebar />
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages}/>
            </ChatContainer>
        </Container>
    )
}

export default Chat;

export async function getServerSideProps(context) {
    const ref = db.collection("chats").doc(context.query.id);

    // Prepare messages on the server
    const messagesRes = await ref.collection('messages').orderBy('timestamp', 'asc').get();

    const messages = messagesRes.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })).map(message => ({
        ...message,
        timestamp: message.timestamp.toDate().getTime()
    }));

    // Prepare the chats
    const chatRes = await ref.get();
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }
    
    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat,

        }
    }
}

const Container = styled.div`
    display: flex;
`;

const ChatContainer = styled.div`
    width: 100%;

`;