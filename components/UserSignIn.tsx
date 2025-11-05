"use client";

import { useState } from "react";
import { Form, Card, Button } from 'react-bootstrap';
import FormWarningBanner from '@/components/FormWarningBanner';

export default function UserSignIn() {
    const [error, setError] = useState("");

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const res = await fetch("/api/user/sign-in", {
            method: "POST",
            body: JSON.stringify({
                username: form.get("username"),
                password: form.get("password"),
            }),
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            setError(body.error);
            return;
        }
        location.href = "/user/account";
    }

    return (
        <Card className="p-4 shadow form">
            <FormWarningBanner error={error} />
            <Card.Header className="text-center bg-white border-0">
                <h2 className="fw-bold">User Sign In</h2>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" name="username" placeholder="Enter username" />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" placeholder="Enter password" />
                    </Form.Group>

                    <Button type="submit" className="w-100 theme-color">
                        Sign In
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}
