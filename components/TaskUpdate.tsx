"use client";

import { useState, useEffect } from "react";
import { Form, Card, Button } from 'react-bootstrap';
import FormWarningBanner from '@/components/FormWarningBanner';
import { fetchTaskById } from '@/lib/client-utils';
import { CURRENCIES } from "@/lib/data/currency";

export default function TaskUpdate({ id }: { id: string }) {
    const [error, setError] = useState("");
    const [task, setTask] = useState(Object);

    useEffect(() => {
        (async () => {
            const taskData = await fetchTaskById(id);
            setTask(taskData);
        })();
    }, []);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const res = await fetch(`/api/task/${task._id}`, {
            method: "PUT",
            body: JSON.stringify({
                name: task.name,
                price: task.price,
                category: task.category,
                description: task.description
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
                <h2 className="fw-bold">Update Task</h2>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" placeholder={task.name} onChange={(e) => setTask({ ...task, name: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Select value={task.category} onChange={(e) => setTask({ ...task, category: e.target.value })}>
                            {CURRENCIES.map((currency, index) => (
                                <option value={currency.category}>{currency.category.toUpperCase()}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="price">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" name="price" placeholder={task.price} onChange={(e) => setTask({ ...task, price: e.target.value })} />
                    </Form.Group>
                    <div className="mb-3">
                        <span>Currency</span>
                        <br/>
                        <img src={CURRENCIES.find(c => c.category === task.category)?.iconPath} width={24} height={24} alt={String(task.category)} />
                    </div>
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="string" name="description" placeholder={task.description} onChange={(e) => setTask({ ...task, description: e.target.value })} />
                    </Form.Group>

                    <Button type="submit" className="w-100 theme-color">
                        Update
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}
