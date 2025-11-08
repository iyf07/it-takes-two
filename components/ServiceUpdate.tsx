"use client";

import { useState, useEffect } from "react";
import { Form, Card, Button } from 'react-bootstrap';
import FormWarningBanner from '@/components/FormWarningBanner';
import { fetchServiceById } from '@/lib/client-utils';
import { CURRENCIES } from "@/lib/data/currency";

export default function ServiceUpdate({ id }: { id: string }) {
    const [error, setError] = useState("");
    const [service, setService] = useState(Object);

    useEffect(() => {
        (async () => {
            const serviceData = await fetchServiceById(id);
            if (serviceData) {
                setService(serviceData);
            }
        })();
    }, []);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const res = await fetch(`/api/service/${service._id}`, {
            method: "PUT",
            body: JSON.stringify({
                name: service.name,
                price: service.price,
                category: service.category,
                description: service.description
            }),
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            setError(body.error);
            return;
        }
        location.href = "/service";
    }

    return (
        <Card className="p-4 shadow form">
            <FormWarningBanner error={error} />
            <Card.Header className="text-center bg-white border-0">
                <h2 className="fw-bold">Update Service</h2>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" placeholder={service.name} onChange={(e) => setService({ ...service, name: e.target.value })} />
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Select value={service.category} onChange={(e) => setService({ ...service, category: e.target.value })}>
                            {CURRENCIES.map((currency, index) => (
                                <option value={currency.category}>{currency.category.toUpperCase()}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="price">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" name="price" placeholder={service.price} onChange={(e) => setService({ ...service, price: e.target.value })} />
                    </Form.Group>
                    <div className="mb-3">
                        <span>Currency</span>
                        <br/>
                        <img src={CURRENCIES.find(c => c.category === service.category)?.iconPath} width={24} height={24} alt={String(service.category)} />
                    </div>
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="string" name="description" placeholder={service.description} onChange={(e) => setService({ ...service, description: e.target.value })} />
                    </Form.Group>

                    <Button type="submit" className="w-100 theme-color">
                        Update
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}
