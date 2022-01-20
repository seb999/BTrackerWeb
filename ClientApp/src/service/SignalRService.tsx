import React, { useState, useEffect, useRef } from 'react';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

const SignalRService = (props: any) => {
  
    const [connection, setConnection] = useState<null | HubConnection>(null);

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl('http://localhost:5222/signalRHub')
            .withAutomaticReconnect()
            .build();

        setConnection(connection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then(() => {
                    connection.on("transferExecuted", (msg) => {
                        console.log(msg);
                        props.onChange();
                    });
                })
                .catch((error) => console.log(error));
        }
    }, [connection]);

    return (
        <div></div>
    );
};

export default SignalRService;