"use client";

import { useState, useEffect } from "react";
import { Accordion, Card, ListGroup, ListGroupItem, Button, Dropdown } from 'react-bootstrap';
import { fetchUserDataByCookie, fetchTasksByUserIds } from '@/lib/client-utils';
import { Task } from "@/lib/model/task";
import { CURRENCIES } from "@/lib/data/currency";

export default function TaskMain() {
    const [userData, setUserData] = useState(Object);
    const [tasks, setTasks] = useState<Task[]>([]);

    async function handleDelete(id: string) {
        await fetch(`/api/task/${id}`, {
            method: "DELETE",
            credentials: "include",
        })

        location.href = "/task";
    };

    useEffect(() => {
        (async () => {
            const userData = await fetchUserDataByCookie();
            setUserData(userData);
            const tasksData = await fetchTasksByUserIds(userData._id, userData.partnerId);
            setTasks(tasksData);
        })();
    }, []);

    return (
        <Card className="p-4 shadow form card">
            <Card.Header className="text-center bg-white border-0">
                <h2 className="fw-bold">Task Board</h2>
            </Card.Header>
            <Card.Title className="mb-3 text-center">Tasks</Card.Title>
            <Card.Body>
                <Accordion>
                    {tasks.map((task, index) => {
                        const currency = CURRENCIES.find(c => c.category === task?.category);
                        return (<Accordion.Item eventKey={String(index)} key={task.name}>
                            <Accordion.Header>
                                <span className="d-flex align-items-center gap-1">
                                    <img src={currency?.iconPath} width={24} height={24} alt={String(index)} />{task.name}
                                </span>
                            </Accordion.Header>
                            <Accordion.Body>
                                <ListGroup variant="flush">
                                    <ListGroupItem key="price" className="d-flex gap-2 mb-2">
                                        Prize: <img src={currency?.iconPath} width={24} height={24} alt={String(index)} />{task.price}
                                    </ListGroupItem>
                                    <ListGroupItem key="description" className="d-flex gap-2 mb-2">
                                        Description: {task.description}
                                    </ListGroupItem>
                                    <ListGroupItem key="category" className="d-flex gap-2 mb-2">
                                        Category: {currency?.category}
                                    </ListGroupItem>
                                    <Dropdown className="mx-auto mb-3">
                                        <Dropdown.Toggle id="dropdown-basic" className="bg-danger">
                                            Modify
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item href={`/task/update/${task._id}`}>Update</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleDelete(task._id)}>Delete</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </ListGroup>
                            </Accordion.Body>
                        </Accordion.Item>
                        )
                    })}
                    <Button href={`/task/create`} className="mt-3 mx-auto w-100 theme-color button">
                        Create Task
                    </Button>
                </Accordion>
            </Card.Body>
        </Card>
    );
}
