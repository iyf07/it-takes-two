"use client";

import { Container } from 'react-bootstrap';
import ServiceCreate from "@/components/ServiceCreate";

export default async function ServiceCreatePage({ params }: { params: { id: string } }) {
    const { id } = await params;

    return (
        <main className="d-flex justify-content-center align-items-center vh-100">
            <Container className="d-flex justify-content-center">
                <ServiceCreate id={id} />
            </Container>
        </main>
    );
}