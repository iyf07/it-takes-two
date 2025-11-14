"use client";

import { useState, useEffect } from "react";
import { Form, Card, Button, Image } from 'react-bootstrap';
import FormWarningBanner from '@/components/FormWarningBanner';
import { fetchUserDataByCookie } from '@/lib/client-utils';
import { CURRENCIES } from "@/lib/data/currency";

export default function TaskCreate() {
    const [error, setError] = useState("");
    const [userData, setUserData] = useState(Object);
    const [task, setTask] = useState(Object);

    useEffect(() => {
        (async () => {
            const userData = await fetchUserDataByCookie();
            setUserData(userData);
        })();
    }, []);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const res = await fetch(`/api/task`, {
            method: "POST",
            body: JSON.stringify({
                name: task.name,
                price: task.price,
                category: task.category ?? CURRENCIES[0]?.category,
                description: task.description,
                userIds: [userData._id, userData.partnerId]
            }),
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            setError(body.error);
            return;
        }
        location.href = "/task";
    }

    return (
        <Card className="p-4 shadow form">
            <FormWarningBanner error={error} />
            <Card.Header className="text-center bg-white border-0">
                <h2 className="fw-bold"><Image src="/icons/Task.png" width={24} height={24} />Create Task</h2>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control required type="text" name="name" placeholder="Enter task name" onChange={(e) => setTask({ ...task, name: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Select defaultValue={CURRENCIES[0]?.category} onChange={(e) => setTask({ ...task, category: e.target.value })}>
                            {CURRENCIES.map((currency, index) => (
                                <option value={currency.category}>{currency.category.toUpperCase()}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="price">
                        <Form.Label>Price</Form.Label>
                        <Form.Control required type="number" name="price" placeholder="Enter price" onChange={(e) => setTask({ ...task, price: e.target.value })} />
                    </Form.Group>
                    <div className="mb-3">
                        <span>Currency</span>
                        <br />
                        <img src={task.category ? CURRENCIES.find(c => c.category === task.category)?.iconPath : CURRENCIES[0]?.iconPath} width={24} height={24} alt={String(task.category)} />
                    </div>
                    <Form.Group className="mb-4" controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control required type="string" name="description" placeholder="Enter description" onChange={(e) => setTask({ ...task, description: e.target.value })} />
                    </Form.Group>

                    <Button type="submit" className="w-100 theme-color">
                        Create
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}
