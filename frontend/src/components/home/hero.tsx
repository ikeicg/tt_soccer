import { FC, useEffect, useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import io, {Socket} from 'socket.io-client';

import styles from './hero.module.css';

const HomeHero: FC = () => {
    const [storedName, setStoredName] = useState<string|null>(localStorage.getItem('client_name'))
    const [matching, setMatching] = useState<boolean>(false)
    const [socket, setSocket]  = useState<Socket | null>(null)
    const navigate = useNavigate();

    const clientName: string = storedName ? 
        storedName.concat(Date.now().toString().slice(-4)) : 
        "anon".concat(Date.now().toString().slice(-4))


    useEffect(() => {

        //connect to lobby namespace
        const lobbySocket = io("http://localhost:5050/lobby");
        setSocket(lobbySocket);

        //lobby events
        lobbySocket.on('start_game', ({gameId}) => {
            setMatching(false);
            navigate(`/game/${gameId}`)
        })


        return () => {
            lobbySocket.disconnect();
        }


    }, [navigate])

    function handleInputChange (event :ChangeEvent<HTMLInputElement> ): void {
        const name:string = event.target.value;
        setStoredName(name)
        localStorage.setItem('stored_name', name)
    }

    function handleJoinGame ():void {
        setMatching(true);
        socket?.emit('join_game', { name: clientName });
    };

    return (
        <section className={styles.container}>
            <h1 className={styles.title}>TTBALL</h1>

            <input
                className={styles.input}
                type="text"
                placeholder="Your Player Name"
                value={storedName ? storedName : ""}
                onChange={handleInputChange}
            />

            <button onClick={handleJoinGame}>
                Join A Game
            </button>
            <button>
                Play A Friend
            </button>

            {matching && <p className={styles.status}>
                Looking for a match... 
            </p>}
        </section>
    );
};

export default HomeHero;
