"use client";

import { useState, useEffect } from "react";
import { Accordion, Card, ListGroup, ListGroupItem, Button, Dropdown } from 'react-bootstrap';
import { fetchUserDataByCookie, fetchTasksByUserIds } from '@/lib/client-utils';
import { Task } from "@/lib/model/task";
import { CURRENCIES } from "@/lib/data/currency";

export default function WishMain() {
    const [userData, setUserData] = useState(Object);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        (async () => {
            const userData = await fetchUserDataByCookie();
            setUserData(userData);
            const tasksData = await fetchTasksByUserIds(userData._id, userData.partnerId);
            setTasks(tasksData);
        })();
    }, []);

    return (
        <Card className="p-4 shadow form card-scroll">
            <Card.Header className="text-center bg-white border-0">
                <h2 className="fw-bold">Wishing Well</h2>
            </Card.Header>
            <Card.Title className="mb-3 text-center">Partner Wishes</Card.Title>
            <Card.Body className="card-scroll-body">
                <Accordion>
                </Accordion>
            </Card.Body>
            <Card.Title className="mb-3 text-center">Your Wishes</Card.Title>
            <Card.Body className="card-scroll-body">
                <Accordion>
                </Accordion>
            </Card.Body>
        </Card>
    );
}
