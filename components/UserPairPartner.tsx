"use client";

import { useState, useEffect } from "react";
import { Form, Card, Button } from 'react-bootstrap';
import FormWarningBanner from '@/components/FormWarningBanner';
import { fetchUserDataByCookie } from '@/lib/client-utils';

export default function UserPairPartner() {
    const [error, setError] = useState("");
    const [userData, setUserData] = useState(Object);
    const [message, setMessage] = useState("");
    const [validatedId, setValidatedId] = useState<File | string | null>(null);

    useEffect(() => {
        (async () => {
            const userData = await fetchUserDataByCookie();
            if (userData) {
                setUserData(userData);
            }
        })();
    }, []);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const partnerId = form.get("partner-id");
        if (validatedId == partnerId) {
            await fetch(`/api/user/${userData._id}`, {
                body: JSON.stringify({
                    partnerId: form.get("partner-id"),
                }),
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            await fetch(`/api/user/${form.get("partner-id")}`, {
                body: JSON.stringify({
                    partnerId: userData._id,
                }),
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            location.href = "/user/account";
            return;
        }
        const res = await fetch(`/api/user/${partnerId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
            setError(body.error);
            setValidatedId(null);
            return;
        }
        setMessage(`User found: ${body.username}`)
        setValidatedId(partnerId);
    }

    return (
        <Card className="p-4 shadow form">
            <FormWarningBanner error={error} message={message} />
            <Card.Header className="text-center bg-white border-0">
                <h2 className="fw-bold">Partner Pair</h2>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3" controlId="partner-id">
                        <Form.Label>Partner id</Form.Label>
                        {userData.partnerId ? (<Form.Control type="text" name="partner-id" placeholder={userData.partnerId} disabled />) :
                            (<Form.Control type="text" name="partner-id" placeholder="Enter partner UID" />)}
                    </Form.Group>
                    <Button type="submit" className="w-100 theme-color">
                        {validatedId ? "Pair" : "Validate"}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}
